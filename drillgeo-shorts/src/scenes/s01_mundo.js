/* S01 — O mundo escondido.
   Golden-hour landscape → the camera drops to ground level and pulls back while
   a light scan "opens" the cut: soil, saprolite, banded gneiss, fractures,
   amphibolite, quartz vein, granite. The vein glows as the zone of interest.
   Ends with a whip-pan up into the sky (continues into S02). */
(function () {
  const DG = window.DG;
  const { clamp, lerp, ep, seg, smooth, E, hash, glow, C, GEO, LAND } = DG;

  const S_FINAL = 7.6; // px per metre of the section at the end of the descent
  const X0 = -72, X1 = 72, Y1 = 216;

  function times(S) {
    const L1 = S.L('N01'), L2 = S.L('N02');
    const d0 = Math.max(3.2, L1.end - 1.35); // descent starts on "abaixo dos seus pés"
    const d1 = d0 + 3.1;
    const s0 = d0 + 0.55, s1 = d1 + 0.9; // light scan opening the cut
    const g0 = Math.max(s1 - 0.4, L2.start - 0.4); // zone of interest glow
    const w0 = S.dur - 0.7; // whip up
    return { L1, L2, d0, d1, s0, s1, g0, w0 };
  }

  function wide() {
    return GEO.cached('wide', () => GEO.renderRegion(X0, X1, -1, Y1, S_FINAL));
  }

  function drawSection(ctx, Ys, s, reveal, t, glowA) {
    const R = wide();
    const sx = 540 + X0 * s, sy = Ys + R.y0 * s;
    const w = R.cv.width * (s / R.s), h = R.cv.height * (s / R.s);
    const Yr = lerp(Ys, DG.H + 60, reveal);
    // unrevealed earth (dark mass)
    const dg = ctx.createLinearGradient(0, Ys, 0, DG.H);
    dg.addColorStop(0, '#1E140E');
    dg.addColorStop(1, '#07090D');
    ctx.fillStyle = dg;
    ctx.fillRect(0, Ys, DG.W, DG.H - Ys + 10);
    if (reveal > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, Ys - 2, DG.W, Yr - Ys + 2);
      ctx.clip();
      ctx.drawImage(R.cv, sx, sy, w, h);
      // fresh-light trail just behind the scan
      const tg = ctx.createLinearGradient(0, Yr - 260, 0, Yr);
      tg.addColorStop(0, 'rgba(255,220,170,0)');
      tg.addColorStop(1, `rgba(255,220,170,${0.28 * (1 - reveal * 0.6)})`);
      ctx.fillStyle = tg;
      ctx.fillRect(0, Yr - 260, DG.W, 260);
      // zone of interest: vein glow + sulphide glints
      if (glowA > 0) veinGlow(ctx, Ys, s, t, glowA);
      ctx.restore();
      if (reveal < 1) {
        // scan line
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const lg = ctx.createLinearGradient(0, Yr - 26, 0, Yr + 26);
        lg.addColorStop(0, 'rgba(255,200,120,0)');
        lg.addColorStop(0.5, 'rgba(255,236,200,0.95)');
        lg.addColorStop(1, 'rgba(255,200,120,0)');
        ctx.fillStyle = lg;
        ctx.fillRect(0, Yr - 26, DG.W, 52);
        for (let i = 0; i < 26; i++) {
          const x = hash(i * 7 + ((t * 9) | 0)) * DG.W;
          glow(ctx, x, Yr + (hash(i * 3) - 0.5) * 20, 30 + 40 * hash(i * 11), '#FFC27A', 0.6);
        }
        ctx.restore();
      }
    }
  }

  function veinGlow(ctx, Ys, s, t, a) {
    const pulse = 0.65 + 0.35 * Math.sin(t * 3.2);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let x = X0; x <= X1; x += 2.2) {
      const y = GEO.veinCenter(x);
      const px = 540 + x * s, py = Ys + y * s;
      glow(ctx, px, py, 34 * (s / S_FINAL), '#F2A93B', 0.22 * a * pulse);
    }
    for (let i = 0; i < 34; i++) {
      const x = lerp(X0 + 4, X1 - 4, hash(i * 19 + 3));
      const y = GEO.veinCenter(x) + (hash(i * 5) - 0.5) * GEO.veinHalf(x) * 1.4;
      const tw = Math.max(0, Math.sin(t * 4 + i * 2.1));
      glow(ctx, 540 + x * s, Ys + y * s, 10 + 14 * tw, '#FFE6A0', a * tw * 0.9);
    }
    ctx.restore();
  }

  function frame(ctx, t, S, T) {
    const p = E.inOutCubic(seg(t, T.d0, T.d1));
    const yh = lerp(1090, 330, p);
    const Ys = lerp(2010, 330, E.inOutQuad(seg(t, T.d0 - 0.2, T.d1)));
    const z = lerp(1.0, 0.52, p);
    const s = (S_FINAL * z) / 0.52;
    const reveal = E.inOutSine(seg(t, T.s0, T.s1));
    const glowA = smooth(T.g0, T.g0 + 1.2, t);
    // slow push-in before the descent
    const push = 1 + 0.035 * E.inOutSine(seg(t, 0, T.d0));
    ctx.save();
    ctx.translate(540, 960);
    ctx.scale(push, push);
    ctx.translate(-540, -960);
    // camera shake on the opening impact
    const sh = Math.exp(-6 * Math.max(0, t - T.s0)) * (t > T.s0 ? 1 : 0);
    ctx.translate(Math.sin(t * 61) * 7 * sh, Math.cos(t * 47) * 6 * sh);
    LAND.landscape(ctx, t, { yh, z, strip: Math.max(0, Ys - yh) });
    drawSection(ctx, Ys, s, reveal, t, glowA);
    // grass fringe riding on the cut edge (big foreground blades at first)
    const gh = lerp(260, 34, p);
    LAND.grass(ctx, Ys + 6, t, { n: Math.round(lerp(150, 330, p)), h: gh, w: lerp(9, 3, p), seed: 3 });
    LAND.grass(ctx, Ys + 10, t + 0.7, { n: Math.round(lerp(90, 200, p)), h: gh * 0.7, w: lerp(7, 2.5, p), seed: 8, c1: '#2E3A1E', c2: '#1F2716' });
    LAND.motes(ctx, t, 46, 1 - p, [0, yh - 120, DG.W, 900]);
    ctx.restore();
  }

  DG.SCENES.s01 = {
    init() {
      wide();
      LAND.ridges();
      LAND.clouds();
    },
    draw(ctx, t, S) {
      const T = times(S);
      if (t < T.w0) return frame(ctx, t, S, T);
      // whip-pan up with motion blur
      const k = seg(t, T.w0, S.dur);
      const off = E.inQuint(k) * 2600;
      const v = (E.inQuint(Math.min(1, k + 1 / (24 * (S.dur - T.w0)))) * 2600 - off) * 1.0;
      ctx.fillStyle = '#14204A';
      ctx.fillRect(0, 0, DG.W, DG.H);
      DG.motionBlur(ctx, 0, v, (g) => {
        g.fillStyle = '#14204A';
        g.fillRect(0, 0, DG.W, DG.H);
        g.translate(0, off);
        frame(g, T.w0, S, T);
        g.translate(0, -DG.H);
        LAND.sky(g, DG.H + 400, 0, 0.2);
      }, 10);
    },
    cues(S) {
      const T = times(S);
      return [
        { type: 'amb_nature', t: 0, dur: T.d0 + 1.6 },
        { type: 'whoosh_down', t: T.d0 - 0.2, dur: 1.6 },
        { type: 'impact_sub', t: T.s0 },
        { type: 'earth_rumble', t: T.s0, dur: T.s1 - T.s0 + 0.8 },
        { type: 'scan_shimmer', t: T.s0, dur: T.s1 - T.s0 },
        { type: 'interest_chime', t: T.g0 + 0.2 },
        { type: 'whip_up', t: T.w0 - 0.1, dur: S.dur - T.w0 + 0.1 },
      ];
    },
  };
})();
