/* Single source of truth for timing. Scene lengths follow the real narration
   durations (DG.NARR_META, generated from the audio files) or the estimates
   below, and are rounded up to whole beats of the 96 BPM score. */
(function () {
  const DG = window.DG;
  const BPM = 96;
  const BEAT = 60 / BPM; // 0.625 s

  DG.NARR = {
    N01: { est: 5.2, text: 'Você já parou para pensar no que existe centenas de metros abaixo dos seus pés?' },
    N02: { est: 3.6, text: 'Como podemos descobrir o que está escondido lá embaixo?' },
    N03: { est: 9.6, text: 'É aqui que entra a sondagem. Com equipamentos especializados, a DrillGeo investiga o subsolo e recupera informações essenciais sobre as rochas.' },
    N04: { est: 8.64, text: 'Na sondagem rotativa diamantada, a máquina transmite rotação e força de avanço através das hastes… permitindo que a coroa corte a rocha.' },
    N05: { est: 10.2, text: 'Durante a perfuração, um fluido circula pelo sistema. Ele ajuda a resfriar a coroa, remover os fragmentos de rocha e manter condições adequadas para o avanço.' },
    N06: { est: 13.6, text: 'Mas o objetivo não é apenas abrir um furo. É recuperar uma amostra da rocha, chamada testemunho de sondagem. Esse cilindro preserva informações valiosas sobre as características do material atravessado.' },
    N07: { est: 7.8, text: 'No sistema wireline, um cabo de aço traz o tubo interno com o testemunho até a superfície, sem retirar as hastes do furo.' },
    N08: { est: 10.1, text: 'Cada profundidade pode revelar uma formação diferente. Mudanças de cor, composição, textura e fraturamento ajudam a contar a história geológica daquele local.' },
    N09: { est: 9.2, text: 'Na superfície, os testemunhos são organizados em caixas, identificados por furo e profundidade, preservando a sequência das rochas recuperadas.' },
    N10: { est: 10.6, text: 'Com essas amostras, os geólogos estudam as formações, identificam estruturas e investigam possíveis mineralizações e outras características importantes do terreno.' },
    N11: { est: 10.5, text: 'Em projetos de mineração e de investigação geológica, entender o que existe abaixo da superfície é essencial para tomar decisões com mais conhecimento e precisão.' },
    N12: { est: 4.6, text: 'DrillGeo. Geologia e sondagem revelando o que a superfície não mostra.' },
  };

  // lines: at = seconds from scene start, or after = previous line id + gap
  DG.SCENE_DEFS = [
    { id: 's01', name: 'O mundo escondido', min: 12.5, tail: 1.1, lines: [{ id: 'N01', at: 0.8 }, { id: 'N02', after: 'N01', gap: 2.0 }] },
    { id: 's02', name: 'Conheça a sonda', min: 11.25, tail: 0.9, lines: [{ id: 'N03', at: 0.7 }] },
    { id: 's03', name: 'A perfuração', min: 10.0, tail: 0.7, lines: [{ id: 'N04', at: 1.6 }] },
    { id: 's04', name: 'Para que serve o líquido?', min: 11.25, tail: 0.7, lines: [{ id: 'N05', at: 0.6 }] },
    { id: 's05', name: 'O testemunho', min: 23.75, tail: 1.6, lines: [{ id: 'N06', at: 0.7 }, { id: 'N07', after: 'N06', gap: 1.9 }] },
    { id: 's06', name: 'As camadas e a profundidade', min: 11.25, tail: 0.9, lines: [{ id: 'N08', at: 0.9 }] },
    { id: 's07', name: 'A caixa de testemunhos', min: 11.25, tail: 0.9, lines: [{ id: 'N09', at: 1.4 }] },
    { id: 's08', name: 'O que estão procurando?', min: 12.5, tail: 1.5, lines: [{ id: 'N10', at: 0.7 }] },
    { id: 's09', name: 'A DrillGeo', min: 18.75, tail: 2.6, lines: [{ id: 'N11', at: 0.9 }, { id: 'N12', after: 'N11', gap: 1.6 }] },
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
      const sc = { id: def.id, name: def.name, start: T, dur, end: T + dur, lines };
      for (const k in lines) lines[k].gstart = T + lines[k].start;
      T += dur;
      return sc;
    });
    DG.TL = { scenes, total: T, bpm: BPM, beat: BEAT, fps: DG.FPS };
    return DG.TL;
  };
  DG.BEAT = BEAT;
})();
