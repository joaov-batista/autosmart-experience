/* Single source of truth for timing. Scene lengths follow the real narration
   durations (DG.NARR_META, generated from the audio files) or the estimates
   below, and are rounded up to whole beats of the 96 BPM score. */
(function () {
  const DG = window.DG;
  const BPM = 96;
  const BEAT = 60 / BPM; // 0.625 s

  DG.NARR = {
    N01: { est: 8.1, text: 'Oi! Eu sou o Geo, da equipe da DrillGeo. Você já pensou no que existe debaixo dos seus pés? Vem comigo, que eu te mostro!' },
    N02: { est: 7.7, text: 'Lá embaixo tem camadas e mais camadas de rocha. Mas como a gente descobre o que tem lá… sem cavar um buraco gigante?' },
    B01: { est: 9.7, text: 'Pensa num bolo de camadas. Se você enfia um canudo e puxa… sai uma amostrinha com todas as camadas dentro. A sondagem faz isso, só que na rocha!' },
    N03: { est: 8.7, text: 'Essa é a sonda, a máquina que faz o furo. Ela gira uma coluna de tubos de aço, que a gente chama de hastes, e empurra tudo pra baixo.' },
    N04: { est: 9.4, text: 'Na ponta fica a coroa: um anel cheio de diamantes. Ela gira e corta a rocha em forma de anel… igual a um cortador de biscoito.' },
    N05: { est: 9.5, text: 'Enquanto ela corta, a gente manda água pelo meio dos tubos. A água esfria a coroa e leva o pó de rocha pra fora, igual à água na broca do dentista.' },
    N06: { est: 9.5, text: 'E o miolo? O miolo fica inteirinho! Esse cilindro de rocha é o testemunho. Ele vai entrando num tubo, igual ao bolo dentro do canudo.' },
    N07: { est: 9.7, text: 'Quando o tubo enche, a gente desce um cabo com uma peça que engata, o pescador, e puxa o tubo cheio lá do fundo. As hastes continuam no furo.' },
    N08: { est: 10.2, text: 'Conforme o furo desce, ele atravessa camadas diferentes: terra, rocha mais mole, rocha dura, rachaduras… e às vezes um veio com minerais.' },
    N09: { est: 8.5, text: 'Aqui em cima, as amostras vão pra uma caixa, na ordem certinha, com a profundidade anotada. É como um álbum de fotos do subsolo.' },
    N10: { est: 10.5, text: 'Depois, o geólogo estuda cada pedaço com lupa. Às vezes aparece sinal de minério, às vezes não… e as duas respostas são informação valiosa.' },
    N11: { est: 10.9, text: 'Resumindo: a coroa corta, o cilindro sobe, vai pra caixa, e o geólogo estuda. Assim dá pra decidir com mais segurança, antes de uma obra ou de uma mina.' },
    N12: { est: 5.1, text: 'DrillGeo. Geologia e sondagem revelando o que a superfície não mostra.' },
  };

  // lines: at = seconds from scene start, or after = previous line id + gap
  DG.SCENE_DEFS = [
    { id: 's01', name: 'Oi, eu sou o Geo', min: 12.5, tail: 1.0, lines: [{ id: 'N01', at: 0.6 }, { id: 'N02', after: 'N01', gap: 2.2 }] },
    { id: 'sb', name: 'A ideia: o bolo e o canudo', min: 11.25, tail: 1.6, lines: [{ id: 'B01', at: 0.8 }], step: [0, 'A IDEIA'] },
    { id: 's02', name: 'A sonda', min: 10.0, tail: 1.0, lines: [{ id: 'N03', at: 0.7 }], step: [1, 'A SONDA'] },
    { id: 's03', name: 'A coroa', min: 10.0, tail: 1.4, lines: [{ id: 'N04', at: 1.6 }], step: [2, 'A COROA'], stepAt: 1.6 },
    { id: 's04', name: 'A água', min: 10.0, tail: 0.9, lines: [{ id: 'N05', at: 0.6 }], step: [3, 'A ÁGUA'] },
    { id: 's05', name: 'O testemunho e o pescador', min: 22.0, tail: 1.6, lines: [{ id: 'N06', at: 0.7 }, { id: 'N07', after: 'N06', gap: 1.9 }], step: [4, 'O TESTEMUNHO'] },
    { id: 's06', name: 'As camadas', min: 11.25, tail: 1.0, lines: [{ id: 'N08', at: 0.8 }], step: [6, 'AS CAMADAS'] },
    { id: 's07', name: 'A caixa', min: 11.25, tail: 1.2, lines: [{ id: 'N09', at: 1.4 }], step: [7, 'A CAIXA'] },
    { id: 's08', name: 'O geólogo', min: 12.5, tail: 1.5, lines: [{ id: 'N10', at: 0.7 }], step: [8, 'O GEÓLOGO'] },
    { id: 's09', name: 'Resumo e DrillGeo', min: 18.0, tail: 2.8, lines: [{ id: 'N11', at: 0.8 }, { id: 'N12', after: 'N11', gap: 1.6 }], step: [9, 'RESUMINDO'] },
  ];

  function lineDur(id) {
    const m = DG.NARR_META && DG.NARR_META[id];
    return m && m.dur ? m.dur : DG.NARR[id].est;
  }

  DG.buildTimeline = function () {
    let T = 0;
    const scenes = DG.SCENE_DEFS.map((def) => {
      const lines = {};
      let end = 0;
      for (const l of def.lines) {
        const st = l.after ? lines[l.after].end + l.gap : l.at;
        const d = lineDur(l.id);
        lines[l.id] = { id: l.id, start: st, end: st + d, dur: d, gstart: 0 };
        end = Math.max(end, st + d);
      }
      let dur = Math.max(def.min, end + def.tail);
      dur = Math.ceil(dur / BEAT - 1e-6) * BEAT;
      const sc = { id: def.id, name: def.name, start: T, dur, end: T + dur, lines, step: def.step, stepAt: def.stepAt || 0 };
      for (const k in lines) lines[k].gstart = T + lines[k].start;
      T += dur;
      return sc;
    });
    DG.TL = { scenes, total: T, bpm: BPM, beat: BEAT, fps: DG.FPS };
    return DG.TL;
  };
  DG.BEAT = BEAT;
})();
