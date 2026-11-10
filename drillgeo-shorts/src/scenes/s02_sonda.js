/* S02 — Conheça a sonda. The camera settles from the whip-pan onto the rig on
   its prepared pad, dollies in while callouts name the main systems, the
   operator (outside the rotation zone) engages rotation and the engine revs. */
(function () {
  const DG = window.DG;
  const { clamp, lerp, ep, seg, smooth, E, hash, glow, C, GEO, LAND, RIG, PEOPLE } = DG;

  function times(S) {
    const L = S.L('N03');
    const a = L.start;
    const span = L.dur;
    return {
      L,
      lab: [
        ['UNIDADE DE PERFURAÇÃO', a + span * 0.08],
        ['TORRE / MASTRO', a + span * 0.2],
        ['CABEÇOTE ROTATIVO', a + span * 0.38],
        ['HASTES', a + span * 0.5],
        ['SISTEMA DE CIRCULAÇÃO', a + span * 0.64],
        ['CONJUNTO DE AMOSTRAGEM', a + span * 0.76],
      ],
      start: Math.min(S.dur - 2.6, a + span * 0.72), // operator engages rotation
    };
  }

  function cam(t, S) {
    const k = E.inOutSine(seg(t, 0.4, S.dur));
    const k2 = E.inOutCubic(seg(t, S.dur - 1.5, S.dur));
    // the last beat drops to the collar and matches the S03 dive framing (s = 48, cy = -1)
    const s = lerp(lerp(80, 98, k), 48, k2);
    const cx = lerp(lerp(-1.9, -0.9, k), 0, k2);
    const cy = lerp(lerp(-2.4, -3.0, k), -1.0, k2);
    return { s, cx, cy };
  }

  const W2S = (c, x, y) => [(x - c.cx) * c.s + 540, (y - c.cy) * c.s + 960];

  function ground(S) {
    return GEO.cached('s02ground', () => GEO.renderRegion(-15, 10, -0.6, 9, 98, { df: 3, deep: 0 }));
  }

  function frame(ctx, t, S, T) {
    const c = cam(t, S);
    const [, yG] = W2S(c, 0, 0);
    // sky + distant landscape, horizon just above the pad
    LAND.landscape(ctx, t + 14, { yh: yG - 70, z: 0.95, strip: 70, rays: 0.6 });
    // ground section below the surface
    const R = ground(S);
    const [gx, gy] = W2S(c, R.x0, R.y0);
    ctx.drawImage(R.cv, gx, gy, R.cv.width * (c.s / R.s), R.cv.height * (c.s / R.s));
    const dg = ctx.createLinearGradient(0, yG, 0, DG.H);
    dg.addColorStop(0, 'rgba(10,12,18,0)');
    dg.addColorStop(1, 'rgba(10,12,18,0.55)');
    ctx.fillStyle = dg;
    ctx.fillRect(0, yG, DG.W, DG.H - yG);
    // borehole with casing and (x-ray) rods
    const run = lerp(0.35, 1, smooth(T.start, T.start + 1.2, t));
    const rot = DG.rampAngle(t, T.start + 0.2, 2.0, 7.5);
    const feed = 0.3 + 0.06 * E.inOutSine(seg(t, T.start + 1.5, S.dur));
    ctx.save();
    ctx.translate(...W2S(c, 0, 0));
    ctx.scale(c.s, c.s);
    ctx.fillStyle = '#07090C';
    ctx.fillRect(-0.13, 0, 0.26, 12);
    ctx.fillStyle = DG.metalGrad(ctx, -0.13, 0.13, '#6E7783', '#BFC7D0', '#2A3039');
    ctx.fillRect(-0.13, 0, 0.035, 3);
    ctx.fillRect(0.095, 0, 0.035, 3);
    ctx.globalAlpha = 0.85;
    RIG.rod(ctx, 0.02, 0, 12, 0.11, rot, { pitch: 0.45 });
    ctx.globalAlpha = 1;
    // pad: compacted gravel
    ctx.fillStyle = '#6F6656';
    ctx.fillRect(-13, -0.06, 22, 0.12);
    for (let i = 0; i < 260; i++) {
      ctx.fillStyle = hash(i) > 0.5 ? '#8C8270' : '#4E473C';
      ctx.fillRect(-13 + hash(i * 3) * 22, -0.07 + hash(i * 7) * 0.12, 0.05 + 0.05 * hash(i * 5), 0.03);
    }
    // the rig
    const info = RIG.rig(ctx, { t, rot, feed, run, start: T.start, lever: smooth(T.start - 0.3, T.start, t) });
    // crew: operator at the console, helper by the rod rack (both clear of the rotation zone)
    const lev = smooth(T.start - 0.35, T.start, t);
    PEOPLE.person(ctx, { x: 2.35, y: 0, s: 1, face: -1, t, seed: 1, helmet: '#F2A93B', pose: { armF: [1.05 + lev * 0.18, 0.35 - lev * 0.2], armB: [0.75, 0.6], legF: [0.05, 0.02], legB: [-0.1, 0.03], head: 0.05 } });
    PEOPLE.person(ctx, { x: 4.6, y: 0, s: 1, face: -1, t, seed: 4, helmet: '#F2A93B', pose: { armF: [0.15, 0.35], armB: [-0.12, 0.25], legF: [0.12, 0.05], legB: [-0.12, 0.02], head: -0.08 + 0.1 * Math.sin(t * 0.5) } });
    ctx.restore();
    // beacon glow
    if (info.beacon > 0) {
      const [bx, by] = W2S(c, -2.65, -2.9);
      glow(ctx, bx, by, 60, '#FFB020', 0.8 * info.beacon);
    }
    // sun rim glow on the rig edge (golden hour)
    const [mx, my] = W2S(c, -0.2, -6);
    glow(ctx, mx + 30, my, 420, '#FFB070', 0.08);
    // x-ray inset: sampling assembly at the bottom of the hole
    const insetP = smooth(T.lab[5][1] - 0.4, T.lab[5][1] + 0.3, t);
    if (insetP > 0) inset(ctx, c, t, insetP, rot, T);
    labels(ctx, c, t, S, T, info);
  }

  function inset(ctx, c, t, p, rot, T) {
    const [hx, hy] = W2S(c, 0, 4.2);
    const cx = 330, cy = Math.min(1340, hy + 40), r = 130 * E.outBack(p);
    ctx.save();
    ctx.globalAlpha = clamp(p * 1.5);
    DG.dashed(ctx, [[W2S(c, 0, 0.5)[0], W2S(c, 0, 0.5)[1]], [hx, cy - 160], [cx + r * 0.7, cy - r * 0.7]], { color: DG.rgba(C.paper, 0.6), offset: -t * 30 });
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(8,14,28,0.88)';
    ctx.fill();
    ctx.clip();
    if (DG.BIT && DG.BIT.mini) DG.BIT.mini(ctx, cx, cy, r, t, rot);
    ctx.restore();
    ctx.save();
    ctx.globalAlpha = clamp(p * 1.5);
    ctx.strokeStyle = DG.rgba(C.paper, 0.7);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function labels(ctx, c, t, S, T, info) {
    const on = (i) => [ep(t, T.lab[i][1], T.lab[i][1] + 0.7, 'linear'), ep(t, T.lab[i][1] + 2.6, T.lab[i][1] + 3.1, 'linear')];
    const P = (x, y) => W2S(c, x, y);
    const defs = [
      [P(-3.6, -2.0), [130, 0, 'right'], -200],
      [P(-0.42, -9.2), [130, 0, 'right'], -40],
      [P(0.05, info.hTop + 0.45), [600, 0, 'right'], -110],
      [P(0.02, -1.5), [600, 0, 'right'], -40],
      [P(-7.2, -0.7), [120, 0, 'right'], -180],
      [[330, 1210], [520, 0, 'right'], -150],
    ];
    defs.forEach(([tgt, [lx, , side], dy], i) => {
      const [p, q] = on(i);
      if (p <= 0 || q >= 1) return;
      let ly = tgt[1] + dy;
      ly = clamp(ly, 250, 1230);
      DG.label(ctx, { x: tgt[0], y: tgt[1], lx, ly, text: T.lab[i][0], p, q, side, size: 34 });
    });
  }

  DG.SCENES.s02 = {
    init(S) {
      ground(S);
    },
    draw(ctx, t, S) {
      const T = times(S);
      const k = seg(t, 0, 0.75);
      if (k < 1) {
        // settle from the whip-pan: camera arriving from above with motion blur
        const off = -E.outQuint(k) * 1800 + 1800;
        const v = 1800 * (E.outQuint(Math.min(1, k + 1 / 18)) - E.outQuint(k));
        DG.motionBlur(ctx, 0, v, (g) => {
          g.translate(0, off);
          frame(g, t, S, T);
          g.translate(0, -DG.H);
          LAND.sky(g, DG.H + 300, 0, 0.2);
        }, 10);
        return;
      }
      frame(ctx, t, S, T);
    },
    cues(S) {
      const T = times(S);
      const out = [
        { type: 'impact_arrive', t: 0.0 },
        { type: 'amb_site', t: 0, dur: S.dur },
        { type: 'engine', t: 0, dur: S.dur, idleUntil: T.start, rev: T.start },
        { type: 'lever_clunk', t: T.start - 0.15 },
        { type: 'hydraulic_hiss', t: T.start + 0.05 },
        { type: 'rotation_start', t: T.start + 0.2, dur: S.dur - T.start - 0.2 },
      ];
      T.lab.forEach(([, at]) => out.push({ type: 'ui_tick', t: at + 0.3 }));
      return out;
    },
  };
})();
