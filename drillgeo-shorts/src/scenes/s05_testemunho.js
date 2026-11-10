/* S05 — O testemunho + recuperação wireline.
   A: half-section of crown + barrel; as the bit advances the core slides into
      the (non-rotating) inner tube and the camera follows the core top.
   B: rotation stops; the overshot runs down the wire inside the rods, latches
      the inner-tube head, the core lifter grips and breaks the core, the inner
      tube is hoisted up INSIDE the rods (rods stay in the hole) to the rig. */
(function () {
  const DG = window.DG;
  const { clamp, lerp, ep, seg, smooth, E, hash, glow, rgba, C, GEO, BIT, RIG, PEOPLE } = DG;

  const K5 = 3.4;
  const RUN0 = 116.2, RUN1 = 119.2; // illustrative run (3.0 m barrel)
  const ROCK_S = 1700;

  function rock5() {
    return GEO.cached('rock5', () => {
      const w = 1080 / K5 / 1000;
      return { cv: GEO.rockPatch(-w / 2, w / 2, RUN0 - 0.55, RUN1 + 0.45, ROCK_S, 30), y0: RUN0 - 0.55, s: ROCK_S };
    });
  }
  function core5() {
    return GEO.cached('core5', () => ({ cv: GEO.coreStrip(RUN0, RUN1 + 0.05, K5 * 1000, Math.round(2 * BIT.G.Ri * K5), { df: 30, radius: BIT.G.Ri / 1000 }), d0: RUN0 }));
  }

  function times(S) {
    const A = S.L('N06'), B = S.L('N07');
    const full = A.end - 0.2; // barrel full
    return {
      A, B,
      full,
      lblCore: A.start + A.dur * 0.5,
      lblIT: A.start + A.dur * 0.22,
      xray: [A.start + A.dur * 0.62, A.start + A.dur * 0.95],
      stop: [full - 0.2, full + 1.1],
      down: [B.start - 0.75, B.start + 2.0],
      latch: [B.start + 2.0, B.start + 3.15],
      brk: [B.start + 3.15, B.start + 4.2],
      up: [B.start + 4.2, B.start + 7.2],
      surf: [B.start + 7.2, S.dur],
    };
  }

  // ---------------- A: core entering the inner tube ----------------
  function coreShot(ctx, t, S, T) {
    const adv = (RUN1 - RUN0 - 0.05) * 1000 * E.inOutCubic(seg(t, 0.3, T.full));
    const faceDepth = RUN0 + 0.05 + adv / 1000; // metres
    const yTop = (RUN0 - faceDepth) * 1000; // core top in tool mm (≤ 0)
    const ycam = clamp(yTop + 360, -1500, 0);
    const SY = (y) => 1560 + (y - ycam) * K5;
    const rot = DG.rampAngle(t + 60, -3, 1, 7.5, T.stop[0] + 60, T.stop[1] - T.stop[0]);
    // rock
    const R = rock5();
    const ry = SY(0) - (faceDepth - R.y0) * 1000 * K5;
    ctx.drawImage(R.cv, 0, ry, R.cv.width * (K5 * 1000 / R.s), R.cv.height * (K5 * 1000 / R.s));
    const hw = BIT.G.Rh * K5;
    ctx.fillStyle = '#05070A';
    ctx.fillRect(540 - hw, -10, hw * 2, SY(0) + 10);
    const lg = ctx.createRadialGradient(320, 600, 100, 540, 1000, 1300);
    lg.addColorStop(0, 'rgba(255,240,220,0.08)');
    lg.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = lg;
    ctx.fillRect(0, 0, DG.W, DG.H);
    // tools in half section
    const CT = core5();
    ctx.save();
    ctx.translate(540, SY(0));
    ctx.scale(K5, K5);
    const top = ycam - 960 / K5 - 40;
    BIT.section(ctx, { top, rot, coreTop: yTop, tex: CT.cv, texS: K5, texD0: CT.d0 * 1000, faceDepth: faceDepth * 1000, itTop: -3000 });
    // fluid between tubes while drilling
    const fl = 1 - smooth(T.stop[0], T.stop[1], t);
    if (fl > 0) {
      ctx.fillStyle = rgba(C.blue, 0.28 * fl);
      for (const sgn of [-1, 1]) ctx.fillRect(sgn < 0 ? -BIT.G.otRi : BIT.G.itR, top, BIT.G.otRi - BIT.G.itR, -top - 20);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 90; i++) {
        const sgn = i % 2 ? 1 : -1;
        const y = top + (((hash(i * 3) + t * 0.5) % 1) * (-top - 20));
        ctx.fillStyle = rgba(C.blue, 0.8 * fl);
        ctx.fillRect(sgn * (BIT.G.itR + 0.6), y, sgn * 1.4, 3);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    // x-ray scan along the core: features preserved in the cylinder
    const xs = seg(t, T.xray[0], T.xray[1]);
    if (xs > 0 && xs < 1) {
      const yScan = lerp(0, Math.max(yTop, ycam - 960 / K5), E.inOutSine(xs));
      ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createLinearGradient(0, yScan - 40, 0, yScan + 40);
      g.addColorStop(0, 'rgba(120,200,255,0)');
      g.addColorStop(0.5, 'rgba(160,220,255,0.55)');
      g.addColorStop(1, 'rgba(120,200,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(-BIT.G.Ri, yScan - 40, 2 * BIT.G.Ri, 80);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.restore();
    // rotation arrow on the outer tube (it turns); the inner tube does not
    const ra = (1 - smooth(T.stop[0], T.stop[1], t)) * ep(t, 0.6, 1.4, 'outCubic');
    DG.rotArrow(ctx, 540, 300, BIT.G.otR * K5 + 34, 30, ra, rot * 0.15, { width: 7, alpha: ra });
    // labels
    DG.label(ctx, { x: 540 + BIT.G.itR * K5 - 4, y: 720, lx: 600, ly: 560, side: 'right', text: 'TUBO INTERNO', p: ep(t, T.lblIT, T.lblIT + 0.7, 'linear'), q: ep(t, T.lblIT + 3.2, T.lblIT + 3.7, 'linear'), size: 34 });
    const cy = clamp(SY(Math.max(yTop + 120, ycam - 200)), 380, 1250);
    DG.label(ctx, { x: 540 - BIT.G.Ri * K5 + 10, y: cy, lx: 80, ly: cy - 120, side: 'right', text: 'TESTEMUNHO', p: ep(t, T.lblCore, T.lblCore + 0.8, 'linear'), q: ep(t, T.stop[1] - 0.3, T.stop[1] + 0.2, 'linear'), size: 40 });
    return { faceDepth };
  }

  // ---------------- B: wireline (mid-scale view inside the rods) ----------------
  const SM = 58; // px per metre in the long view
  function longView(ctx, t, ycam, o, layer = 'all') {
    const Ys = (d) => 960 + (d - ycam) * SM;
    const yS = Ys(0);
    if (layer !== 'fg') {
    const R = DG.CLOSE.column();
    const oy = 960 + (R.y0 - ycam) * SM;
    ctx.drawImage(R.cv, 540 + R.x0 * SM, oy, R.cv.width * (SM / R.s), R.cv.height * (SM / R.s));
    // x-ray grade: cool, darker, so the steel inside reads clearly
    ctx.fillStyle = 'rgba(8,16,36,0.62)';
    ctx.fillRect(0, 0, DG.W, DG.H);
    if (yS > 0) {
      DG.LAND.landscape(ctx, t + 30, { yh: yS - 60, z: 0.9, strip: 60, rays: 0.5 });
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, DG.W, yS);
      ctx.clip();
      ctx.translate(540, yS);
      ctx.scale(SM, SM);
      RIG.rig(ctx, { t: t + 30, rot: 0, feed: 0.05, run: 0.4, aside: 1, cable: 1, cableY: 0, winch: t * 8 });
      ctx.restore();
    }
    // hole
    ctx.fillStyle = 'rgba(2,4,8,0.9)';
    ctx.fillRect(540 - 40, Math.max(yS, -10), 80, Ys(RUN1 + 0.2) - Math.max(yS, -10));
    // rods in transparency (they stay in the hole)
    const hl = o.rodGlow || 0;
    ctx.fillStyle = rgba('#B8C6D6', 0.28 + 0.3 * hl);
    ctx.fillRect(540 - 34, Math.max(yS, -10), 8, Ys(RUN1) - Math.max(yS, -10));
    ctx.fillRect(540 + 26, Math.max(yS, -10), 8, Ys(RUN1) - Math.max(yS, -10));
    ctx.strokeStyle = rgba('#DCE6F0', 0.55 + 0.35 * hl);
    ctx.lineWidth = 2;
    for (const x of [540 - 34, 540 + 34]) {
      ctx.beginPath();
      ctx.moveTo(x, Math.max(yS, -10));
      ctx.lineTo(x, Ys(RUN1));
      ctx.stroke();
    }
    for (let d = 3; d < RUN1; d += 3) {
      ctx.fillStyle = rgba('#DCE6F0', 0.5 + 0.3 * hl);
      ctx.fillRect(540 - 37, Ys(d) - 3, 12, 6);
      ctx.fillRect(540 + 25, Ys(d) - 3, 12, 6);
    }
    if (hl > 0) glow(ctx, 540, 960, 420, '#9FB7D0', 0.12 * hl);
    }
    if (layer === 'bg') return;
    // wireline cable
    if (o.cableTo != null) {
      ctx.strokeStyle = '#F0F4F8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(540, Math.max(yS, -20));
      ctx.lineTo(540, Ys(o.cableTo));
      ctx.stroke();
    }
    // overshot
    if (o.overshot != null) {
      const y = Ys(o.overshot);
      ctx.fillStyle = C.amber;
      DG.rr(ctx, 540 - 12, y - 44, 24, 44, 5);
      ctx.fill();
      glow(ctx, 540, y - 20, 60, '#FFB040', 0.55);
    }
    // inner tube with the core
    const itBot = o.itBottom == null ? RUN1 : o.itBottom;
    const y0 = Ys(itBot - 3.05),
      y1 = Ys(itBot);
    ctx.fillStyle = DG.metalGrad(ctx, 540 - 22, 540 + 22, '#6A7584', '#E8EEF4', '#2A303A');
    ctx.fillRect(540 - 22, y0, 44, y1 - y0);
    ctx.fillStyle = '#4A6A5E';
    ctx.fillRect(540 - 15, y0 + 10, 30, y1 - y0 - 14);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(540 - 15, y0 + 10, 8, y1 - y0 - 14);
    ctx.fillStyle = '#E8EEF0';
    ctx.fillRect(540 - 15, y1 - 14 - 0.6 * SM, 30, 0.3 * SM);
    if (o.itGlow) glow(ctx, 540, (y0 + y1) / 2, 200, '#4C9BEA', 0.4 * o.itGlow);
  }

  function wireline(ctx, t, S, T) {
    // B1: overshot runs down; B4: inner tube rides up
    if (t < T.latch[0]) {
      const k = E.inOutCubic(seg(t, T.down[0], T.down[1]));
      const d = lerp(-2, RUN1 - 3.3, k);
      const ycam = d + 2.5;
      const k2 = E.inOutCubic(seg(t + 1 / 24, T.down[0], T.down[1]));
      const v = (lerp(-2, RUN1 - 3.3, k2) - d) * SM;
      const oo = { cableTo: d - 0.75, overshot: d };
      DG.motionBlur(ctx, 0, -v, (g) => longView(g, t, ycam, oo, 'bg'), 10);
      longView(ctx, t, ycam, oo, 'fg');
      DG.label(ctx, { x: 552, y: 960 - 2.5 * SM - 20, lx: 620, ly: 760, side: 'right', text: 'WIRELINE', p: ep(t, T.B.start + 0.1, T.B.start + 0.8, 'linear'), q: ep(t, T.latch[0] - 0.3, T.latch[0], 'linear'), size: 40 });
      DG.text(ctx, 'cabo de aço', 640, 836, { size: 28, weight: 500, color: C.paperDim, alpha: ep(t, T.B.start + 0.5, T.B.start + 1.1, 'linear') * (1 - ep(t, T.latch[0] - 0.3, T.latch[0], 'linear')) });
      return;
    }
    const k = E.inOutCubic(seg(t, T.up[0], T.up[1]));
    const bot = lerp(RUN1, 1.2, k);
    const ycam = bot - 1.5;
    const k2 = E.inOutCubic(seg(t + 1 / 24, T.up[0], T.up[1]));
    const v = (lerp(RUN1, 1.2, k2) - bot) * SM;
    const oo = { cableTo: bot - 3.3, overshot: bot - 3.05, itBottom: bot, rodGlow: smooth(T.up[0] + 0.6, T.up[0] + 1.2, t), itGlow: 1 };
    DG.motionBlur(ctx, 0, -v, (g) => longView(g, t, ycam, oo, 'bg'), 10);
    longView(ctx, t, ycam, oo, 'fg');
    const pl = ep(t, T.up[0] + 0.3, T.up[0] + 1.0, 'linear'),
      ql = ep(t, T.up[1] - 0.4, T.up[1], 'linear');
    DG.label(ctx, { x: 556, y: 960 + 1.5 * SM - 60, lx: 620, ly: 700, side: 'right', text: 'TUBO INTERNO', p: pl, q: ql, size: 38 });
    DG.label(ctx, { x: 512, y: 960 + 2.2 * SM, lx: 470, ly: 1150, side: 'left', text: 'HASTES FICAM NO FURO', p: ep(t, T.up[0] + 0.9, T.up[0] + 1.6, 'linear'), q: ql, size: 32 });
  }

  // B2/B3: latch and core break close-ups (mm scale)
  function latchShot(ctx, t, S, T) {
    const k = seg(t, T.latch[0], T.latch[1]);
    const KL = 2.6;
    ctx.fillStyle = '#080B10';
    ctx.fillRect(0, 0, DG.W, DG.H);
    ctx.save();
    ctx.translate(540, 1150);
    ctx.scale(KL, KL);
    // rods/outer tube walls (static)
    for (const sgn of [-1, 1]) BIT.hatch(ctx, sgn < 0 ? -BIT.G.otR : BIT.G.otRi, -520, BIT.G.otR - BIT.G.otRi, 900, '#6F7A88', 0.25);
    ctx.fillStyle = metalBack(ctx);
    ctx.fillRect(-BIT.G.otRi, -520, 2 * BIT.G.otRi, 900);
    // latch coupling recess
    for (const sgn of [-1, 1]) {
      ctx.fillStyle = '#05070A';
      ctx.fillRect(sgn < 0 ? -BIT.G.otRi - 2 : BIT.G.otRi - 6, -100, 8, 36);
    }
    const grip = E.outBack(seg(k, 0.25, 0.5));
    const pull = E.inCubic(seg(k, 0.62, 1)) * 60;
    const latched = 1 - smooth(0.45, 0.62, k);
    // inner tube top + head assembly
    ctx.save();
    ctx.translate(0, -pull);
    ctx.fillStyle = DG.metalGrad(ctx, -BIT.G.itR, BIT.G.itR, '#566070', '#B3BDC8', '#232832');
    ctx.fillRect(-BIT.G.itR, 0, 2 * BIT.G.itR, 400);
    BIT.headAssembly(ctx, 0, latched);
    ctx.restore();
    // overshot comes down onto the spearhead, jaws close
    const yo = lerp(-520, -226, E.outCubic(seg(k, 0, 0.3))) - pull;
    BIT.overshot(ctx, yo, -900, grip);
    ctx.restore();
    if (k > 0.25 && k < 0.45) glow(ctx, 540, 1150 - 226 * KL, 80, '#FFD27A', (1 - seg(k, 0.25, 0.45)) * 0.9);
    DG.text(ctx, 'PESCADOR', 540 + 70, 1150 - 380 * KL + 0, { size: 34, color: C.amber, alpha: smooth(0.05, 0.25, k) * (1 - smooth(0.85, 1, k)) });
  }
  function metalBack(ctx) {
    return DG.metalGrad(ctx, -BIT.G.otRi, BIT.G.otRi, '#2E343D', '#59616C', '#0E1116', 0.35);
  }
  function breakShot(ctx, t, S, T) {
    const k = seg(t, T.brk[0], T.brk[1]);
    const R = rock5();
    const K = 3.0;
    const faceDepth = RUN1;
    const SY = (y) => 1250 + y * K;
    const lift = E.inCubic(seg(k, 0.5, 1)) * 90;
    ctx.drawImage(R.cv, 0, SY(0) - (faceDepth - R.y0) * 1000 * K, R.cv.width * (K * 1000 / R.s), R.cv.height * (K * 1000 / R.s));
    ctx.fillStyle = 'rgba(6,10,18,0.45)';
    ctx.fillRect(0, 0, DG.W, DG.H);
    ctx.fillStyle = '#05070A';
    ctx.fillRect(540 - BIT.G.Rh * K, 0, BIT.G.Rh * 2 * K, SY(0));
    const CT = core5();
    ctx.save();
    ctx.translate(540, SY(0));
    ctx.scale(K, K);
    BIT.section(ctx, { top: -440, rot: 0, coreTop: -1400, coreBot: lift > 0 ? -2 : 0, tex: CT.cv, texS: K5, texD0: CT.d0 * 1000, faceDepth: faceDepth * 1000, itTop: -3000, itLift: lift, lifterGrip: smooth(0.1, 0.45, k) });
    // the fresh break surface left at the bottom of the hole
    if (k > 0.45) {
      ctx.strokeStyle = 'rgba(255,240,210,0.9)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let x = -BIT.G.Ri; x <= BIT.G.Ri; x += 4) ctx.lineTo(x, -1 + Math.sin(x * 0.7) * 1.5 - lift * 0);
      ctx.stroke();
    }
    ctx.restore();
    if (k > 0.42 && k < 0.6) glow(ctx, 540, SY(-2), 120, '#FFE2B0', (1 - seg(k, 0.42, 0.6)) * 0.8);
    const lp = smooth(0.05, 0.3, k) * (1 - smooth(0.85, 1, k));
    DG.label(ctx, { x: 540 + (BIT.G.Ri + 2) * K, y: SY(-30), lx: 640, ly: SY(-240), side: 'right', text: 'MOLA EXTRATORA', p: lp, q: 0, size: 32 });
  }

  // B5: the inner tube emerges at the rig
  function surfaceShot(ctx, t, S, T) {
    const k = seg(t, T.surf[0], T.surf[1]);
    const s = 150;
    const cx = 0.7, cy = -2.3;
    const W2S = (x, y) => [(x - cx) * s + 540, (y - cy) * s + 960];
    const [, yG] = W2S(0, 0);
    DG.LAND.landscape(ctx, t + 40, { yh: yG - 70, z: 0.95, strip: 70, rays: 0.6 });
    ctx.save();
    ctx.translate(...W2S(0, 0));
    ctx.scale(s, s);
    ctx.fillStyle = '#5A3A26';
    ctx.fillRect(-12, 0, 24, 10);
    ctx.fillStyle = '#6F6656';
    ctx.fillRect(-12, -0.06, 24, 0.12);
    const emerge = E.outCubic(clamp(k * 1.6));
    const yb = -2.0 - emerge * 3.1; // bottom of the inner tube, rising out of the rod string top
    RIG.rig(ctx, { t: t + 40, rot: 0, feed: 0.05, run: 0.4, aside: 1, cable: 1, cableY: yb - 3.3, winch: t * 6 * (1 - k) });
    const itTop = Math.min(-2.0, yb) - 3.05;
    const vis = Math.max(0, -2.0 - itTop);
    ctx.fillStyle = DG.metalGrad(ctx, -0.05, 0.1, '#6A7584', '#EEF3F8', '#2A303A');
    ctx.fillRect(-0.05, itTop, 0.15, vis);
    ctx.strokeStyle = '#0B0E14';
    ctx.lineWidth = 0.012;
    ctx.strokeRect(-0.05, itTop, 0.15, vis);
    ctx.fillStyle = '#D6A13B';
    ctx.fillRect(-0.025, itTop - 0.42, 0.1, 0.42);
    // helper guides the tube from a safe side position, operator at the console
    PEOPLE.person(ctx, { x: 0.95, y: 0, s: 1, face: -1, t, seed: 4, pose: { armF: [1.25, 0.2], armB: [0.9, 0.35], legF: [0.1, 0.05], legB: [-0.15, 0.05], lean: 0.08 } });
    PEOPLE.person(ctx, { x: 2.35, y: 0, s: 1, face: -1, t, seed: 1, pose: { armF: [1.1, 0.2], armB: [0.75, 0.6] } });
    ctx.restore();
    glow(ctx, W2S(0.02, yb - 1.5)[0], W2S(0.02, yb - 1.5)[1], 160, '#4C9BEA', 0.22);
  }

  DG.SCENES.s05 = {
    init() {
      rock5();
      core5();
    },
    draw(ctx, t, S) {
      const T = times(S);
      if (t < T.down[0]) {
        coreShot(ctx, t, S, T);
        // fade in from the S04 push-in
        const fi = 1 - smooth(0, 0.45, t);
        if (fi > 0) {
          ctx.fillStyle = `rgba(11,14,20,${fi})`;
          ctx.fillRect(0, 0, DG.W, DG.H);
        }
        return;
      }
      if (t < T.latch[0]) return wireline(ctx, t, S, T);
      if (t < T.brk[0]) return latchShot(ctx, t, S, T);
      if (t < T.up[0]) return breakShot(ctx, t, S, T);
      if (t < T.surf[0]) return wireline(ctx, t, S, T);
      surfaceShot(ctx, t, S, T);
    },
    cues(S) {
      const T = times(S);
      return [
        { type: 'rotation_loop', t: 0, dur: T.stop[1], fadeOut: T.stop[1] - T.stop[0] },
        { type: 'cutting', t: 0, dur: T.stop[0] + 0.3 },
        { type: 'core_slide', t: 0.4, dur: T.full - 0.4 },
        { type: 'ui_tick', t: T.lblIT + 0.3 },
        { type: 'ui_tick', t: T.lblCore + 0.3 },
        { type: 'scan_shimmer', t: T.xray[0], dur: T.xray[1] - T.xray[0] },
        { type: 'motor_down', t: T.stop[0], dur: T.stop[1] - T.stop[0] + 0.4 },
        { type: 'winch_run', t: T.down[0], dur: T.down[1] - T.down[0] },
        { type: 'dive_whoosh', t: T.down[0], dur: T.down[1] - T.down[0] },
        { type: 'latch_click', t: T.latch[0] + (T.latch[1] - T.latch[0]) * 0.27 },
        { type: 'metal_clank', t: T.latch[0] + (T.latch[1] - T.latch[0]) * 0.6 },
        { type: 'core_break', t: T.brk[0] + (T.brk[1] - T.brk[0]) * 0.45 },
        { type: 'winch_run', t: T.up[0], dur: T.up[1] - T.up[0], up: 1 },
        { type: 'rise_whoosh', t: T.up[0], dur: T.up[1] - T.up[0] },
        { type: 'amb_site', t: T.surf[0], dur: S.dur - T.surf[0] },
        { type: 'metal_clank', t: T.surf[0] + 0.5 },
        { type: 'winch_stop', t: T.surf[0] + (T.surf[1] - T.surf[0]) * 0.62 },
      ];
    },
  };
})();
