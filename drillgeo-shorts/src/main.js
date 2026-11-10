/* Frame dispatcher: DG.renderFrame(t) draws the whole film at global time t.
   Scenes register in DG.SCENES[id] = { init?, draw(ctx, t, S), cues?(S) }. */
(function () {
  const DG = window.DG;
  DG.SCENES = DG.SCENES || {};
  DG.IMG = {};

  const FONTS = [
    ['Space Grotesk', '../assets/fonts/space-grotesk-latin-700-normal.woff2', '700'],
    ['Space Grotesk', '../assets/fonts/space-grotesk-latin-500-normal.woff2', '500'],
    ['IBM Plex Mono', '../assets/fonts/ibm-plex-mono-latin-400-normal.woff2', '400'],
    ['IBM Plex Mono', '../assets/fonts/ibm-plex-mono-latin-600-normal.woff2', '600'],
    ['Inter', '../assets/fonts/Inter-SemiBold.otf', '600'],
    ['Inter', '../assets/fonts/Inter-Bold.otf', '700'],
  ];
  const IMAGES = { logo: '../assets/brand/drillgeo-helice.png' };

  function loadImage(src) {
    return new Promise((res, rej) => {
      const im = new Image();
      im.onload = () => res(im);
      im.onerror = () => rej(new Error('img ' + src));
      im.src = src;
    });
  }

  DG.init = async function (opts = {}) {
    for (const [fam, url, weight] of FONTS) {
      const f = new FontFace(fam, `url(${url})`, { weight });
      await f.load();
      document.fonts.add(f);
    }
    for (const k in IMAGES) DG.IMG[k] = await loadImage(IMAGES[k]);
    DG.buildTimeline();
    DG.canvasEl = document.getElementById('c');
    DG.ctx = DG.canvasEl.getContext('2d');
    const only = opts.scenes; // optional subset to init (faster stills)
    for (const sc of DG.TL.scenes) {
      const m = DG.SCENES[sc.id];
      if (m && m.init && (!only || only.includes(sc.id))) await m.init(sceneInfo(sc));
    }
    DG.ready = true;
    return { total: DG.TL.total, scenes: DG.TL.scenes.map((s) => [s.id, s.start, s.dur]) };
  };

  // scene helper object passed to draw()
  function sceneInfo(sc) {
    return {
      id: sc.id,
      dur: sc.dur,
      start: sc.start,
      lines: sc.lines,
      L: (id) => sc.lines[id],
      prev: DG.TL.scenes[DG.TL.scenes.indexOf(sc) - 1],
      next: DG.TL.scenes[DG.TL.scenes.indexOf(sc) + 1],
    };
  }
  DG.sceneInfo = sceneInfo;
  DG.sceneById = (id) => DG.TL.scenes.find((s) => s.id === id);

  DG.renderFrame = function (T, frameIndex) {
    const ctx = DG.ctx;
    const fi = frameIndex == null ? Math.round(T * DG.FPS) : frameIndex;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = DG.C.bg;
    ctx.fillRect(0, 0, DG.W, DG.H);
    const scs = DG.TL.scenes;
    let sc = scs.find((s) => T >= s.start && T < s.end) || scs[scs.length - 1];
    const m = DG.SCENES[sc.id];
    const S = sceneInfo(sc);
    S.frame = fi;
    if (m) {
      ctx.save();
      m.draw(ctx, T - sc.start, S);
      ctx.restore();
    } else {
      DG.text(ctx, sc.id + ' — ' + sc.name, DG.W / 2, DG.H / 2, { align: 'center', size: 44 });
    }
    // global finishing
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    DG.vignette(ctx, S.vignette == null ? 0.55 : S.vignette);
    DG.grain(ctx, fi, 0.025);
    if (DG.SHOW_SAFE) drawSafe(ctx);
  };

  function drawSafe(ctx) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,0,80,0.8)';
    ctx.lineWidth = 3;
    ctx.strokeRect(70, 220, 830, 1020);
    ctx.fillStyle = 'rgba(255,0,80,0.12)';
    ctx.fillRect(0, 1480, DG.W, DG.H - 1480);
    ctx.fillRect(930, 900, 150, 800);
    ctx.fillRect(0, 0, DG.W, 160);
    ctx.strokeStyle = 'rgba(0,200,255,0.8)';
    ctx.strokeRect(90, 1260, 900, 180);
    ctx.restore();
  }

  DG.exportTimeline = function () {
    const out = { fps: DG.FPS, bpm: DG.TL.bpm, beat: DG.TL.beat, total: DG.TL.total, scenes: [], lines: [], cues: [] };
    for (const sc of DG.TL.scenes) {
      out.scenes.push({ id: sc.id, name: sc.name, start: sc.start, dur: sc.dur });
      for (const k in sc.lines) {
        const l = sc.lines[k];
        out.lines.push({ id: k, scene: sc.id, start: l.gstart, dur: l.dur, text: DG.NARR[k].text });
      }
      const m = DG.SCENES[sc.id];
      if (m && m.cues) for (const c of m.cues(sceneInfo(sc))) out.cues.push(Object.assign({}, c, { t: c.t + sc.start, scene: sc.id }));
    }
    out.cues.sort((a, b) => a.t - b.t);
    return out;
  };
})();
