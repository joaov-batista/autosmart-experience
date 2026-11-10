/* SB — A ideia: o bolo e o canudo. A layered cake (cut in half, layers in the
   colours of the rock column) — a straw goes in, comes out with a sample that
   keeps every layer in order — then the cake becomes the rock cut-away and the
   straw becomes the borehole: "a sondagem faz isso, só que na rocha". */
(function () {
  const DG = window.DG;
  const { clamp, lerp, ep, seg, smooth, E, hash, glow, rgba, mix, C, GEO, LAND } = DG;

  const CX = 600, TOP = 660, RX = 300, RY = 58;
  const LAYERS = [ // [name, colour, highlight, thickness px]
    ['cobertura', '#F6EFE4', '#FFFFFF', 34],
    ['chocolate', '#5A3322', '#7B4A33', 52],
    ['caramelo', '#C97148', '#DFA06A', 86],
    ['mirtilo', '#5D6880', '#9AA3B5', 96],
    ['creme', '#EEF1EC', '#FFFFFF', 16],
    ['menta', '#4A6A5E', '#7A978A', 78],
    ['morango', '#C79A96', '#E6C6C0', 64],
  ];
  const H = LAYERS.reduce((a, l) => a + l[3], 0);

  function times(S) {
    const L = S.L('B01');
    const a = L.start, d = L.dur;
    return { L, cake: [a - 0.5, a + 0.6], strawIn: [a + d * 0.2, a + d * 0.36], strawOut: [a + d * 0.4, a + d * 0.52], show: [a + d * 0.5, a + d * 0.62], morph: [a + d * 0.72, a + d * 0.86], w0: S.dur - 0.6 };
  }

  function bandPath(ctx, y0, y1) {
    // front (cut) face between two depths, curved like the cake's ellipse
    ctx.beginPath();
    ctx.moveTo(CX - RX, y0);
    ctx.lineTo(CX + RX, y0);
    ctx.lineTo(CX + RX, y1);
    ctx.ellipse(CX, y1, RX, RY * 0.35, 0, 0, Math.PI, false);
    ctx.lineTo(CX - RX, y0);
    ctx.closePath();
  }

  function cake(ctx, t, T, hole) {
    // plate
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(CX + 12, TOP + H + 40, RX + 110, 46, 0, 0, Math.PI * 2);
    ctx.fill();
    const pg = ctx.createLinearGradient(0, TOP + H, 0, TOP + H + 60);
    pg.addColorStop(0, '#F4F6F8');
    pg.addColorStop(1, '#B9C0CA');
    ctx.fillStyle = pg;
    ctx.beginPath();
    ctx.ellipse(CX, TOP + H + 22, RX + 90, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(11,14,20,0.6)';
    ctx.lineWidth = 3;
    ctx.stroke();
    // layers (front cut face)
    let y = TOP;
    LAYERS.forEach(([n, c, hi, th], i) => {
      bandPath(ctx, y, y + th);
      const g = ctx.createLinearGradient(CX - RX, 0, CX + RX, 0);
      g.addColorStop(0, mix(c, '#000000', 0.25));
      g.addColorStop(0.35, c);
      g.addColorStop(0.8, mix(c, hi, 0.4));
      g.addColorStop(1, mix(c, '#000000', 0.2));
      ctx.fillStyle = g;
      ctx.fill();
      // crumb texture / stripes
      ctx.save();
      bandPath(ctx, y, y + th);
      ctx.clip();
      for (let k = 0; k < 40; k++) {
        ctx.fillStyle = rgba(hash(i * 50 + k) > 0.5 ? hi : '#000000', 0.12);
        ctx.beginPath();
        ctx.arc(CX - RX + hash(i * 77 + k) * RX * 2, y + hash(i * 91 + k) * th, 3 + 5 * hash(k + i), 0, Math.PI * 2);
        ctx.fill();
      }
      if (n === 'morango') for (let k = 0; k < 60; k++) {
        ctx.fillStyle = hash(k * 3) > 0.6 ? '#3A3335' : '#F2E6E0';
        ctx.fillRect(CX - RX + hash(k * 7) * RX * 2, y + hash(k * 11) * th, 5, 4);
      }
      ctx.restore();
      y += th;
    });
    // outline of the cut face
    bandPath(ctx, TOP, TOP + H);
    ctx.strokeStyle = 'rgba(11,14,20,0.7)';
    ctx.lineWidth = 4;
    ctx.stroke();
    // top (frosting) with drips
    ctx.fillStyle = '#FBF6EE';
    ctx.beginPath();
    ctx.ellipse(CX, TOP, RX, RY, 0, Math.PI, Math.PI * 2);
    ctx.lineTo(CX + RX, TOP);
    ctx.ellipse(CX, TOP, RX, RY * 0.35, 0, 0, Math.PI, false);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    for (let k = 0; k < 9; k++) {
      const dx = CX - RX + 30 + k * 66;
      ctx.fillStyle = '#FBF6EE';
      ctx.beginPath();
      ctx.ellipse(dx, TOP + 18 + 6 * Math.sin(k * 2), 13, 22 + 12 * hash(k), 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // hole left by the straw
    if (hole > 0) {
      ctx.fillStyle = `rgba(30,18,10,${0.85 * hole})`;
      ctx.fillRect(CX - 26, TOP - 8, 52, H + 6);
      ctx.fillStyle = `rgba(0,0,0,${0.35 * hole})`;
      ctx.fillRect(CX - 26, TOP - 8, 12, H + 6);
    }
  }

  // the sample inside the straw: same layers, compressed to the straw length
  function sample(ctx, x, yTop, len, w, a = 1) {
    ctx.save();
    ctx.globalAlpha *= a;
    let y = yTop;
    LAYERS.forEach(([n, c, hi, th]) => {
      const h = (th / H) * len;
      const g = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
      g.addColorStop(0, mix(c, '#000', 0.3));
      g.addColorStop(0.4, mix(c, hi, 0.3));
      g.addColorStop(1, mix(c, '#000', 0.25));
      ctx.fillStyle = g;
      ctx.fillRect(x - w / 2, y, w, h + 0.5);
      y += h;
    });
    ctx.restore();
  }
  function straw(ctx, x, yTip, len, fill, a = 1) {
    const w = 56;
    ctx.save();
    ctx.globalAlpha *= a;
    if (fill > 0) sample(ctx, x, yTip - fill, fill, w - 12);
    ctx.fillStyle = 'rgba(200,235,255,0.22)';
    ctx.fillRect(x - w / 2, yTip - len, w, len);
    ctx.save();
    ctx.beginPath();
    ctx.rect(x - w / 2, yTip - len, w, len);
    ctx.clip();
    ctx.strokeStyle = 'rgba(232,72,72,0.75)';
    ctx.lineWidth = 9;
    for (let k = -8; k < len / 40 + 8; k++) {
      const yy = yTip - len + k * 46;
      ctx.beginPath();
      ctx.moveTo(x - w / 2, yy);
      ctx.lineTo(x + w / 2, yy - 34);
      ctx.stroke();
    }
    ctx.restore();
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 3;
    ctx.strokeRect(x - w / 2, yTip - len, w, len);
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.fillRect(x - w / 2 + 8, yTip - len, 6, len);
    ctx.restore();
  }

  function kitchen(ctx, t) {
    const g = ctx.createLinearGradient(0, 0, 0, DG.H);
    g.addColorStop(0, '#2B3B6E');
    g.addColorStop(0.55, '#E0A27A');
    g.addColorStop(1, '#7A4F38');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, DG.W, DG.H);
    for (let i = 0; i < 7; i++) glow(ctx, hash(i * 9) * DG.W, 300 + hash(i * 4) * 700, 240, '#FFE1B8', 0.08, 'source-over');
    // table
    const tg = ctx.createLinearGradient(0, TOP + H + 10, 0, DG.H);
    tg.addColorStop(0, '#8B5A3C');
    tg.addColorStop(1, '#4C2F20');
    ctx.fillStyle = tg;
    ctx.fillRect(0, TOP + H + 10, DG.W, DG.H);
    for (let i = 0; i < 14; i++) {
      ctx.fillStyle = 'rgba(40,20,10,0.15)';
      ctx.fillRect(0, TOP + H + 30 + i * 46 + hash(i) * 10, DG.W, 3);
    }
  }

  function frame(ctx, t, S, T) {
    kitchen(ctx, t);
    const ap = E.outBack(seg(t, T.cake[0], T.cake[1]));
    ctx.save();
    ctx.translate(CX, TOP + H);
    ctx.scale(ap, ap);
    ctx.translate(-CX, -(TOP + H));
    const pin = E.inOutCubic(seg(t, T.strawIn[0], T.strawIn[1]));
    const pout = E.inOutCubic(seg(t, T.strawOut[0], T.strawOut[1]));
    const hole = smooth(T.strawOut[0], T.strawOut[0] + 0.2, t);
    cake(ctx, t, T, hole);
    ctx.restore();
    // straw: in → out with the sample
    const len = H + 260;
    let tip = lerp(TOP - 300, TOP + H - 4, pin);
    tip = lerp(tip, TOP - 40, pout);
    const show = E.inOutCubic(seg(t, T.show[0], T.show[1]));
    const sx = lerp(CX, 170, show);
    const fill = pout > 0 ? H - 4 : pin * (H - 4) * 0;
    if (pin > 0 || pout > 0) straw(ctx, sx, lerp(tip, TOP + H - 30, show), len, pout > 0 ? H - 4 : Math.max(0, tip - TOP), 1);
    if (pin > 0 && pin < 1 && pout === 0) {
      // crumbs as it goes in
      for (let k = 0; k < 10; k++) glow(ctx, CX + (hash(k) - 0.5) * 90, tip - hash(k * 3) * 30, 10, '#F6E2C8', 0.5, 'source-over');
    }
    // matching lines: sample layers ↔ cake layers
    if (show > 0.5) {
      const a = smooth(0.5, 1, show);
      let y = TOP, ys = TOP + H - 30 - (H - 4);
      LAYERS.forEach(([n, c, hi, th]) => {
        const yc = y + th / 2,
          yss = ys + ((th / H) * (H - 4)) / 2;
        DG.dashed(ctx, [[sx + 34, yss], [CX - RX - 8, yc]], { color: rgba(C.paper, 0.85), alpha: a, width: 2.5, dash: [10, 8], offset: -t * 30 });
        y += th;
        ys += (th / H) * (H - 4);
      });
      DG.label(ctx, { x: sx, y: TOP - 70, lx: 110, ly: 470, side: 'right', text: 'AMOSTRA', p: ep(t, T.show[1] - 0.3, T.show[1] + 0.4, 'linear'), q: 0, size: 44 });
      DG.text(ctx, 'as camadas na mesma ordem', 110, 545, { size: 30, weight: 500, color: C.paper, alpha: ep(t, T.show[1], T.show[1] + 0.6, 'linear') });
    }
  }

  function rockFrame(ctx, t, S, T, k) {
    // the same idea on rock: the cut-away with a borehole and the rig on top
    const R = GEO.cached('wide', () => GEO.renderRegion(-72, 72, -1, 216, 7.6, { veinX: 2.4 }));
    const Y0 = 520, SS = 7.0;
    LAND.landscape(ctx, t + 200, { yh: Y0, z: 0.55, strip: 0, rays: 0.6 });
    ctx.fillStyle = '#0B0E14';
    ctx.fillRect(0, Y0, DG.W, DG.H);
    ctx.drawImage(R.cv, -4, Y0 + R.y0 * SS, DG.W + 8, R.cv.height * (SS / R.s));
    const d = 196 * E.inOutCubic(seg(t, T.morph[0] + 0.3, T.morph[1] + 1.2));
    ctx.fillStyle = '#04060A';
    ctx.fillRect(531, Y0, 18, d * SS);
    glow(ctx, 540, Y0 + d * SS, 70, '#FFC27A', 0.8);
    ctx.save();
    ctx.translate(540, Y0);
    ctx.scale(SS * 1.3, SS * 1.3);
    DG.RIG.rig(ctx, { t, rot: t * 7.5, feed: 0.35, run: 1, start: -9 });
    ctx.restore();
    DG.title(ctx, 'O CANUDO NA ROCHA', 540, 380, ep(t, T.morph[0] + 0.4, T.morph[0] + 1.1, 'linear'), 0, { size: 52 });
  }

  function draw(ctx, t, S) {
    const T = times(S);
    const k = E.inOutSine(seg(t, T.morph[0], T.morph[1]));
    if (k < 1) frame(ctx, t, S, T);
    if (k > 0) {
      ctx.save();
      ctx.globalAlpha = k;
      rockFrame(ctx, t, S, T, k);
      ctx.restore();
    }
  }

  DG.SCENES.sb = {
    draw(ctx, t, S) {
      const T = times(S);
      const ka = seg(t, 0, 0.6);
      if (ka < 1) {
        // arrive from the whip-pan of S01
        const off = (1 - E.outQuint(ka)) * 1600;
        const v = 1600 * (E.outQuint(Math.min(1, ka + 1 / 14)) - E.outQuint(ka));
        DG.motionBlur(ctx, 0, v, (g) => {
          g.translate(0, off);
          draw(g, t, S);
        }, 10);
        return;
      }
      if (t > T.w0) {
        const kw = seg(t, T.w0, S.dur);
        const off = E.inQuint(kw) * 2200;
        DG.motionBlur(ctx, 0, 200 + 2000 * kw, (g) => {
          g.fillStyle = '#14204A';
          g.fillRect(0, 0, DG.W, DG.H);
          g.translate(0, off);
          draw(g, T.w0, S);
        }, 10);
        return;
      }
      draw(ctx, t, S);
    },
    mascot(S) {
      const T = times(S);
      return [[0, 'idle'], [T.L.start, 'explain'], [T.strawIn[0], 'point_right'], [T.show[0], 'explain_r'], [T.morph[0] + 0.3, 'thumbs'], [T.L.end + 0.3, 'idle']];
    },
    cues(S) {
      const T = times(S);
      return [
        { type: 'impact_arrive', t: 0.0 },
        { type: 'ui_pop', t: T.cake[0] + 0.3 },
        { type: 'straw_in', t: T.strawIn[0], dur: T.strawIn[1] - T.strawIn[0] },
        { type: 'straw_out', t: T.strawOut[0], dur: T.strawOut[1] - T.strawOut[0] },
        { type: 'reveal_soft', t: T.show[1] - 0.2 },
        { type: 'xray_sweep', t: T.morph[0] },
        { type: 'drill_distant', t: T.morph[0] + 0.3, dur: S.dur - T.morph[0] - 0.3 },
        { type: 'whip_up', t: T.w0 - 0.1, dur: S.dur - T.w0 + 0.1 },
      ];
    },
  };
})();
