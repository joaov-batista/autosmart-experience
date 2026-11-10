/* S03 — A perfuração. Dive down the rod string to the bottom of the hole, then
   a close-up of the diamond crown cutting the rock: segments and waterways
   turn, the kerf is cut, the core stays in the centre (seen through a cut-away
   window), arrows show rotation and thrust, an inset shows the crown face. */
(function () {
  const DG = window.DG;
  const { clamp, lerp, ep, seg, smooth, E, hash, glow, C, GEO, BIT } = DG;

  const BIT_DEPTH = 117.0; // illustrative depth of the bit face at the start of the close-up (m)
  const K = 4.0; // px per mm in the close-up
  const FACE_Y = 1160;
  const ADV = 60; // mm advanced during the close-up (exaggerated time-lapse)

  DG.CLOSE = { BIT_DEPTH, K, FACE_Y, ADV };

  function column() {
    return GEO.cached('column', () => GEO.renderRegion(-22.5, 22.5, -2, 225, 24, { veinX: 1.5, df: 2.5 }));
  }
  // detail rock around the bit (metres), shared by S03/S04/S05
  function rockClose() {
    return GEO.cached('rockClose', () => {
      const w = 1080 / K / 1000,
        y0 = BIT_DEPTH - (FACE_Y / K) / 1000 - 0.02,
        y1 = BIT_DEPTH + ((DG.H - FACE_Y) / K) / 1000 + ADV / 1000 + 0.6;
      const s = K * 1000;
      return { cv: GEO.rockPatch(-w / 2, w / 2, y0, y1, s, 30), y0, s };
    });
  }
  function coreTex() {
    // core strip for the run 116.20 → 118.0 m, 3.2 px/mm
    return GEO.cached('coreTexClose', () => ({ cv: GEO.coreStrip(116.2, 118.0, K * 1000, Math.round(2 * BIT.G.Ri * K), { df: 30, radius: BIT.G.Ri / 1000 }), d0: 116.2 }));
  }
  DG.CLOSE.rockClose = rockClose;
  DG.CLOSE.coreTex = coreTex;
  DG.CLOSE.column = column;

  /* close-up base layer used by S03/S04: rock + hole, returns face depth (m) */
  function drawRock(ctx, faceDepth, o = {}) {
    const R = rockClose();
    const yTop = FACE_Y - (faceDepth - R.y0) * 1000 * K;
    ctx.drawImage(R.cv, 0, yTop);
    // hole above the face: dark annulus/far wall
    const hw = BIT.G.Rh * K;
    const g = ctx.createLinearGradient(540 - hw, 0, 540 + hw, 0);
    g.addColorStop(0, '#05070A');
    g.addColorStop(0.5, '#151A21');
    g.addColorStop(1, '#05070A');
    ctx.fillStyle = g;
    ctx.fillRect(540 - hw, -10, hw * 2, FACE_Y + 10);
    // cut-face lighting: soft key light from the upper left + depth falloff
    const lg = ctx.createRadialGradient(300, 500, 100, 540, 1000, 1300);
    lg.addColorStop(0, 'rgba(255,240,220,0.10)');
    lg.addColorStop(1, 'rgba(0,0,0,0.42)');
    ctx.fillStyle = lg;
    ctx.fillRect(0, 0, DG.W, DG.H);
    // edge of the cut (hole wall) highlight
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.fillRect(540 - hw - 3, 0, 3, FACE_Y);
    ctx.fillRect(540 + hw, 0, 3, FACE_Y);
  }
  DG.CLOSE.drawRock = drawRock;

  // analytic cuttings leaving the face
  function chips(ctx, t, a, fluid = 0) {
    if (a <= 0) return;
    const rate = 70;
    for (let i = Math.floor((t - 1.6) * rate); i <= Math.floor(t * rate); i++) {
      const te = i / rate,
        age = t - te;
      if (age < 0 || age > 1.6) continue;
      const side = hash(i) < 0.5 ? -1 : 1;
      const x0 = 540 + side * (BIT.G.Ri + hash(i * 3) * (BIT.G.Ro - BIT.G.Ri)) * K;
      const vx = side * (40 + 120 * hash(i * 5));
      const vy = -(60 + 160 * hash(i * 7)) * (1 + fluid * 1.5);
      let x = x0 + vx * age * (1 - age * 0.4),
        y = FACE_Y - 4 + vy * age + 90 * age * age * (1 - fluid);
      // confine to the annulus/hole when fluid carries them
      const wall = BIT.G.Rh * K;
      if (Math.abs(x - 540) > wall) x = 540 + Math.sign(x - 540) * (wall - 3 - hash(i * 9) * 6);
      const sz = 1.5 + 3.5 * hash(i * 11);
      ctx.fillStyle = `rgba(${150 + 60 * hash(i * 13)},${150 + 50 * hash(i * 13)},${140 + 40 * hash(i * 13)},${a * (1 - age / 1.6)})`;
      ctx.fillRect(x, y, sz, sz);
    }
    // dust puff at the cutting edge
    for (const sgn of [-1, 1]) glow(ctx, 540 + sgn * BIT.G.Ro * K, FACE_Y - 6, 70, '#B9B2A6', 0.18 * a, 'source-over');
  }
  DG.CLOSE.chips = chips;

  function times(S) {
    const L = S.L('N04');
    return {
      L,
      dive1: Math.min(1.7, L.start + 0.1),
      rotA: L.start + L.dur * 0.42,
      feedA: L.start + L.dur * 0.53,
      faceIn: L.start + L.dur * 0.74,
      label: L.start + L.dur * 0.84,
    };
  }

  function dive(ctx, t, S, T) {
    const R = column();
    const k = E.inOutQuint(seg(t, 0, T.dive1));
    const cy = lerp(-1.0, BIT_DEPTH - 6, k);
    const s = 48;
    const k2 = E.inOutQuint(seg(t + 1 / 24, 0, T.dive1));
    const v = (lerp(-1.0, BIT_DEPTH - 6, k2) - cy) * s;
    DG.motionBlur(ctx, 0, -v, (g) => {
      g.fillStyle = '#0B0E14';
      g.fillRect(0, 0, DG.W, DG.H);
      const ox = 540 + R.x0 * s,
        oy = 960 + (R.y0 - cy) * s;
      g.drawImage(R.cv, ox, oy, R.cv.width * (s / R.s), R.cv.height * (s / R.s));
      // hole + rotating rod string to the bit
      const yb = 960 + (BIT_DEPTH - cy) * s;
      g.fillStyle = '#05070A';
      g.fillRect(540 - 12, 960 + (0 - cy) * s, 24, yb - (960 + (0 - cy) * s));
      g.fillStyle = DG.metalGrad(g, 534, 546, '#7E8794', '#E6ECF2', '#2A3039');
      g.fillRect(534, 960 + (0 - cy) * s, 12, yb - (960 + (0 - cy) * s));
      glow(g, 540, yb, 90, '#FFC27A', 0.55);
      // sky band if near the surface
      if (cy < 14) {
        const ys = 960 + (0 - cy) * s;
        DG.LAND.landscape(g, t + 25, { yh: ys - 70 * (s / 98), z: 0.95, strip: 70 * (s / 98), rays: 0.6 });
        g.save();
        g.beginPath();
        g.rect(0, 0, DG.W, ys);
        g.clip();
        g.translate(540, ys);
        g.scale(s, s);
        DG.RIG.rig(g, { t: t + 24, rot: t * 7.5, feed: 0.36, run: 1, start: -9 });
        DG.PEOPLE.person(g, { x: 2.35, y: 0, s: 1, face: -1, t, seed: 1, pose: { armF: [1.2, 0.15], armB: [0.75, 0.6] } });
        DG.PEOPLE.person(g, { x: 4.6, y: 0, s: 1, face: -1, t, seed: 4, pose: { armF: [0.15, 0.35], armB: [-0.12, 0.25] } });
        g.restore();
      }
      const dk = g.createLinearGradient(0, 0, 0, DG.H);
      dk.addColorStop(0, 'rgba(0,0,0,0.1)');
      dk.addColorStop(1, 'rgba(0,0,0,0.5)');
      g.fillStyle = dk;
      g.fillRect(0, 0, DG.W, DG.H);
    }, 12);
  }

  function close(ctx, t, S, T, o = {}) {
    const t0 = T.dive1 - 0.25;
    const adv = ADV * E.inOutSine(seg(t, t0, S.dur + 4)); // continues slowly into S04
    const faceDepth = BIT_DEPTH + adv / 1000;
    const rot = DG.rampAngle(t, -3, 1, 7.5);
    // micro camera drift + vibration
    const zoom = 1 + 0.04 * E.inOutSine(seg(t, t0, S.dur));
    ctx.save();
    ctx.translate(540, FACE_Y);
    ctx.scale(zoom, zoom);
    ctx.translate(-540 + Math.sin(t * 53) * 1.2, -FACE_Y + Math.cos(t * 41) * 1.2);
    drawRock(ctx, faceDepth);
    // the tool string (exterior) with a cut-away window
    ctx.save();
    ctx.translate(540, FACE_Y);
    ctx.scale(K, K);
    BIT.exterior(ctx, { rot, top: -(FACE_Y / K) - 20, lw: 0.7 });
    const CT = coreTex();
    BIT.cutWindow(ctx, { y0: -150, y1: -16, coreTop: -800, tex: CT.cv, texS: K, texD0: CT.d0 * 1000, faceDepth: faceDepth * 1000 });
    ctx.restore();
    chips(ctx, t, 1);
    // arrows: rotation (around the outer tube) and thrust (down)
    const pa = ep(t, T.rotA, T.rotA + 0.8, 'outCubic');
    DG.rotArrow(ctx, 540, 330, BIT.G.otR * K + 44, 36, pa, rot * 0.2, { width: 8 });
    if (pa > 0) DG.text(ctx, 'ROTAÇÃO', 540, 255, { size: 34, color: C.amber, align: 'center', alpha: clamp(pa * 2) });
    const pf = ep(t, T.feedA, T.feedA + 0.7, 'outCubic');
    const bob = Math.sin(t * 5) * 6;
    const ax = 540 + BIT.G.otR * K + 78;
    DG.arrow(ctx, ax, 420 + bob, ax, 660 + bob, pf, { width: 9, head: 28 });
    if (pf > 0) DG.text(ctx, 'AVANÇO', ax, 712, { size: 34, color: C.amber, align: 'center', alpha: clamp(pf * 2) });
    ctx.restore();
    // face-view inset: the crown cuts a RING, the core stays
    const pi = ep(t, T.faceIn, T.faceIn + 0.6, 'outBack');
    if (pi > 0) {
      const cx = 215, cy = 520, r = 150 * pi;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r + 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(8,12,20,0.9)';
      ctx.fill();
      BIT.faceView(ctx, cx, cy, r, rot, faceCore(), {});
      ctx.restore();
      DG.dashed(ctx, [[cx + r * 0.7, cy + r * 0.75], [540 - BIT.G.Ro * K, FACE_Y - 6]], { alpha: 0.55 * pi, color: C.paper, offset: -t * 25 });
    }
    const pl = ep(t, T.label, T.label + 0.8, 'linear');
    DG.label(ctx, { x: 540 - BIT.G.Ro * K + 4, y: FACE_Y - 6, lx: 90, ly: 1330, text: 'COROA DIAMANTADA', p: pl, q: 0, side: 'right', size: 36 });
  }
  function faceCore() {
    return GEO.cached('faceCore', () => GEO.rockPatch(-0.032, 0.032, BIT_DEPTH - 0.032, BIT_DEPTH + 0.032, 3000, 30));
  }
  DG.CLOSE.closeFrame = close;

  DG.SCENES.s03 = {
    init(S) {
      column();
      rockClose();
      coreTex();
      faceCore();
    },
    draw(ctx, t, S) {
      const T = times(S);
      if (t < T.dive1 - 0.3) return dive(ctx, t, S, T);
      if (t < T.dive1 + 0.25) {
        // zoom-through transition from the dive to the close-up
        const k = seg(t, T.dive1 - 0.3, T.dive1 + 0.25);
        close(ctx, t, S, T);
        ctx.save();
        ctx.globalAlpha = 1 - E.inOutSine(k);
        ctx.translate(540, 960 + 6 * 48);
        ctx.scale(1 + 6 * E.inQuad(k), 1 + 6 * E.inQuad(k));
        ctx.translate(-540, -(960 + 6 * 48));
        dive(ctx, T.dive1 - 0.3, S, T);
        ctx.restore();
        return;
      }
      close(ctx, t, S, T);
    },
    cues(S) {
      const T = times(S);
      return [
        { type: 'dive_whoosh', t: 0, dur: T.dive1 + 0.2 },
        { type: 'rotation_loop', t: 0, dur: S.dur },
        { type: 'arrive_thud', t: T.dive1 - 0.05 },
        { type: 'cutting', t: T.dive1 - 0.2, dur: S.dur - T.dive1 + 0.2 },
        { type: 'ui_tick', t: T.rotA + 0.1 },
        { type: 'ui_tick', t: T.feedA + 0.1 },
        { type: 'reveal_soft', t: T.faceIn },
        { type: 'diamond_glint', t: T.faceIn + 0.3 },
        { type: 'ui_tick', t: T.label + 0.3 },
      ];
    },
  };
})();
