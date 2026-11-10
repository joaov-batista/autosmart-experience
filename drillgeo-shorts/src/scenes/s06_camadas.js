/* S06 — As camadas e a profundidade. Time-lapse of the hole advancing through
   the whole column; a depth ruler and counter (illustrative values), layer
   tags as the bit crosses each unit, and four magnifier badges for colour,
   composition, texture and fracturing. */
(function () {
  const DG = window.DG;
  const { clamp, lerp, ep, seg, smooth, E, hash, glow, rgba, C, GEO, RIG } = DG;
  const S6 = 24; // px per metre (matches the column cache 1:1)
  const BIT_Y = 1180; // screen y of the bit tip
  const END_DEPTH = 196;

  const TAGS = [
    ['TERRA', 2.5],
    ['ROCHA MAIS MOLE', 14],
    ['ROCHA DURA', 40],
    ['RACHADURAS', 71],
    ['OUTRA ROCHA', 104],
    ['VEIO COM MINERAIS', 119.1],
    ['GRANITO', 172],
  ];

  function times(S) {
    const L = S.L('N08');
    return { L, d: [0.2, S.dur - 0.7], title: [0.3, 3.4], lens: [L.start + L.dur * 0.5, L.start + L.dur * 0.62, L.start + L.dur * 0.74, L.start + L.dur * 0.86] };
  }
  const depthAt = (t, T) => lerp(-3, END_DEPTH, E.inOutSine(seg(t, T.d[0], T.d[1])));

  function lensTex(i) {
    const P = [
      [-0.04, 0.04, 14.0, 14.08], // colour: saprolite
      [-0.04, 0.04, 175.0, 175.08], // composition: granite crystals
      [-0.04, 0.04, 42.0, 42.08], // texture: gneiss banding
      [-0.04, 0.04, 70.5, 70.58], // fracturing
    ][i];
    return GEO.cached('lens' + i, () => {
      const cv = GEO.rockPatch(P[0], P[1], P[2], P[3], 2400, 30);
      if (i === 3) {
        const g = cv.getContext('2d');
        g.strokeStyle = 'rgba(10,11,15,0.95)';
        g.lineWidth = 5;
        g.beginPath();
        g.moveTo(0, 60);
        g.lineTo(80, 92);
        g.lineTo(140, 88);
        g.lineTo(200, 128);
        g.moveTo(40, 190);
        g.lineTo(120, 140);
        g.lineTo(192, 120);
        g.stroke();
        g.strokeStyle = 'rgba(150,82,44,0.5)';
        g.lineWidth = 12;
        g.stroke();
      }
      return cv;
    });
  }

  function frame(ctx, t, S, T, noUI) {
    const R = DG.CLOSE.column();
    const bit = depthAt(t, T);
    const cy = bit - (BIT_Y - 960) / S6;
    const Ys = (d) => 960 + (d - cy) * S6;
    ctx.drawImage(R.cv, 540 + R.x0 * S6, Ys(R.y0));
    const yS = Ys(0);
    if (yS > 0) {
      DG.LAND.landscape(ctx, t + 70, { yh: yS - 26, z: 0.62, strip: 26, rays: 0.5 });
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, DG.W, yS + 1);
      ctx.clip();
      ctx.translate(540, yS);
      ctx.scale(S6, S6);
      RIG.rig(ctx, { t: t + 70, rot: t * 7.5, feed: 0.4, run: 1, start: -9 });
      ctx.restore();
      DG.LAND.grass(ctx, yS + 3, t, { n: 260, h: 14, w: 2, seed: 5 });
    }
    // depth light falloff around the bit
    const lg = ctx.createRadialGradient(540, BIT_Y, 60, 540, BIT_Y, 1100);
    lg.addColorStop(0, 'rgba(0,0,0,0)');
    lg.addColorStop(1, 'rgba(4,6,12,0.55)');
    ctx.fillStyle = lg;
    ctx.fillRect(0, 0, DG.W, DG.H);
    // the hole drilled so far, rods inside, glowing bit
    if (bit > 0) {
      const y0 = Math.max(-10, yS);
      ctx.fillStyle = '#04060A';
      ctx.fillRect(540 - 9, y0, 18, BIT_Y - y0);
      ctx.fillStyle = DG.metalGrad(ctx, 535, 545, '#7E8794', '#E6ECF2', '#2A3039');
      ctx.fillRect(535, y0, 10, BIT_Y - y0 - 6);
      glow(ctx, 540, BIT_Y, 120, '#FFC27A', 0.7);
      glow(ctx, 540, BIT_Y, 34, '#FFF1D0', 0.9);
    }
    // layer tags (right side) as the bit crosses each unit
    TAGS.forEach(([txt, d], i) => {
      const y = Ys(d);
      const p = smooth(d - 3, d + 6, bit);
      const q = smooth(BIT_Y - 200, BIT_Y - 700, y) * 0 + (y < 230 ? smooth(230, 120, y) : 0);
      if (p <= 0 || y < 380 || y > 1150) return;
      DG.label(ctx, { x: 556, y, lx: 640, ly: y, side: 'right', text: txt, p, q, size: 32, alpha: i === 5 ? 1 : 0.95 });
      if (i === 5) glow(ctx, 540, y, 70, '#F2A93B', 0.35 * p);
    });
    if (!noUI) ruler(ctx, t, cy, bit, T);
  }

  function ruler(ctx, t, cy, bit, T) {
    const x = 118;
    const Ys = (d) => 960 + (d - cy) * S6;
    ctx.save();
    ctx.fillStyle = 'rgba(11,14,20,0.5)';
    ctx.fillRect(x - 16, 0, 32, DG.H);
    ctx.strokeStyle = rgba(C.paper, 0.8);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, DG.H);
    ctx.stroke();
    const d0 = Math.floor((cy - 42) / 5) * 5;
    for (let d = Math.max(0, d0); d < cy + 42; d += 5) {
      const y = Ys(d);
      const big = d % 25 === 0;
      ctx.beginPath();
      ctx.moveTo(x - (big ? 14 : 7), y);
      ctx.lineTo(x + (big ? 14 : 7), y);
      ctx.stroke();
      if (big) DG.text(ctx, `${d} m`, x + 24, y, { size: 26, font: DG.FONT.mono, weight: 400, tracking: 0, color: C.paperDim });
    }
    // marker at the bit
    ctx.fillStyle = C.amber;
    ctx.beginPath();
    ctx.moveTo(x + 18, BIT_Y);
    ctx.lineTo(x + 34, BIT_Y - 9);
    ctx.lineTo(x + 34, BIT_Y + 9);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    // readout
    const p = ep(t, 0.4, 1.0, 'outCubic');
    ctx.save();
    ctx.globalAlpha = p;
    DG.rr(ctx, 560, 190, 370, 150, 12);
    ctx.fillStyle = 'rgba(11,14,20,0.72)';
    ctx.fill();
    ctx.strokeStyle = rgba(C.paper, 0.15);
    ctx.stroke();
    DG.text(ctx, 'PROFUNDIDADE', 586, 222, { size: 26, color: C.amber, shadow: false });
    DG.text(ctx, `${Math.max(0, bit).toFixed(0)} m`, 586, 276, { size: 56, font: DG.FONT.mono, weight: 600, tracking: 0, shadow: false });
    DG.text(ctx, 'valores ilustrativos', 586, 320, { size: 22, font: DG.FONT.body, weight: 600, tracking: 0, color: C.paperDim, shadow: false });
    ctx.restore();
  }

  function lenses(ctx, t, T) {
    const words = ['COR', 'COMPOSIÇÃO', 'TEXTURA', 'FRATURAMENTO'];
    const out = ep(t, T.lens[3] + 1.6, T.lens[3] + 2.1, 'linear');
    words.forEach((w, i) => {
      const p = ep(t, T.lens[i], T.lens[i] + 0.45, 'outBack');
      if (p <= 0 || out >= 1) return;
      const cx = 205 + i * 222,
        cy = 380,
        r = 86 * p;
      ctx.save();
      ctx.globalAlpha = 1 - out;
      ctx.beginPath();
      ctx.arc(cx, cy, r + 6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(11,14,20,0.85)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.save();
      ctx.clip();
      const tx = lensTex(i);
      ctx.drawImage(tx, cx - r, cy - r, r * 2, r * 2);
      const g = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.4, 4, cx, cy, r);
      g.addColorStop(0, 'rgba(255,255,255,0.22)');
      g.addColorStop(0.7, 'rgba(255,255,255,0)');
      g.addColorStop(1, 'rgba(0,0,0,0.35)');
      ctx.fillStyle = g;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      ctx.restore();
      ctx.strokeStyle = C.amber;
      ctx.lineWidth = 4;
      ctx.stroke();
      DG.text(ctx, w, cx, cy + r + 34, { size: 24, align: 'center', alpha: clamp(p) });
      ctx.restore();
    });
  }

  DG.SCENES.s06 = {
    init(S) {
      DG.CLOSE.column();
      for (let i = 0; i < 4; i++) lensTex(i);
    },
    draw(ctx, t, S) {
      const T = times(S);
      const w0 = S.dur - 0.55;
      if (t > w0) {
        // whip up towards the surface (cut to the core box at the rig)
        const k = seg(t, w0, S.dur);
        const v = 260 * (1 + 8 * k);
        DG.motionBlur(ctx, 0, v, (g) => {
          g.translate(0, E.inCubic(k) * 1400);
          frame(g, w0, S, T, true);
        }, 10);
        ctx.fillStyle = `rgba(11,14,20,${E.inQuad(k) * 0.85})`;
        ctx.fillRect(0, 0, DG.W, DG.H);
        return;
      }
      frame(ctx, t, S, T);

    },
    cues(S) {
      const T = times(S);
      const out = [
        { type: 'under_drone', t: 0, dur: S.dur },
        { type: 'drill_distant', t: 0, dur: S.dur - 0.5 },
        { type: 'ui_tick', t: T.title[0] + 0.3 },
        { type: 'whip_up', t: S.dur - 0.6, dur: 0.6 },
      ];
      // a layer chime each time the bit crosses a tag depth
      const inv = (d) => {
        for (let x = 0; x < S.dur; x += 0.02) if (depthAt(x, T) >= d - 3 + 4.5) return x;
        return S.dur;
      };
      TAGS.forEach(([, d], i) => out.push({ type: i === 5 ? 'interest_chime' : 'layer_tick', t: inv(d), idx: i }));
      return out;
    },
  };
})();
