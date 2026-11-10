/* S09 — A DrillGeo. The whole technical illustration: rig on the surface, the
   continuous hole through every layer, the sampled intervals glowing, a faint
   technical grid and ruler. The camera rises into the sky, which deepens to
   navy, and the official helix mark spins in (as on the website) with the
   wordmark "Drill" + "Geo". */
(function () {
  const DG = window.DG;
  const { clamp, lerp, ep, seg, smooth, E, hash, glow, rgba, C, GEO, LAND, RIG, COREBOX } = DG;

  function times(S) {
    const A = S.L('N11'), B = S.L('N12');
    return { A, B, rise: [A.end - 0.2, B.start + 0.6], logo: B.start - 0.7, word: B.start + 0.15, sub: B.start + 1.2 };
  }

  function section(ctx, t, Y0, SS, a) {
    const R = GEO.cached('wide', () => GEO.renderRegion(-72, 72, -1, 216, 7.6, { veinX: 2.4 }));
    const sx = SS * (DG.W / (144 * SS)) * 1.0;
    LAND.landscape(ctx, t + 150, { yh: Y0, z: 0.5 * (SS / 7.6), strip: 0, rays: 0.7 });
    const w = Math.max(DG.W + 8, 144 * SS),
      x0 = 540 - w / 2;
    ctx.fillStyle = '#0B0E14';
    ctx.fillRect(0, Y0, DG.W, DG.H + 2400);
    ctx.drawImage(R.cv, x0, Y0 + R.y0 * SS, w, R.cv.height * (SS / R.s));
    // technical grid + ruler
    ctx.save();
    ctx.globalAlpha = 0.5 * a;
    ctx.strokeStyle = 'rgba(160,200,255,0.14)';
    ctx.lineWidth = 1;
    for (let d = 0; d <= 210; d += 10) {
      const y = Y0 + d * SS;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(DG.W, y);
      ctx.stroke();
    }
    for (let x = -70; x <= 70; x += 10) {
      const xx = 540 + x * (w / 144);
      ctx.beginPath();
      ctx.moveTo(xx, Y0);
      ctx.lineTo(xx, Y0 + 210 * SS);
      ctx.stroke();
    }
    ctx.restore();
    for (let d = 0; d <= 200; d += 50) {
      const y = Y0 + d * SS;
      DG.text(ctx, `${d} m`, 40, y, { size: 24, font: DG.FONT.mono, weight: 400, tracking: 0, color: C.paperDim, alpha: a });
    }
    // hole + rods + sampled intervals
    ctx.fillStyle = '#04060A';
    ctx.fillRect(536, Y0, 8, 196 * SS);
    ctx.fillStyle = 'rgba(200,210,220,0.6)';
    ctx.fillRect(538.5, Y0, 3, 196 * SS);
    glow(ctx, 540, Y0 + 196 * SS, 46, '#FFC27A', 0.7);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const n of DG.BOXES) {
      const d0 = COREBOX.boxStart(n);
      const ya = Y0 + d0 * SS,
        yb = Y0 + (d0 + 5) * SS;
      const pu = 0.75 + 0.25 * Math.sin(t * 3 + n);
      ctx.fillStyle = rgba(C.amber, 0.9 * pu);
      ctx.fillRect(531, ya, 18, yb - ya);
      glow(ctx, 540, (ya + yb) / 2, 60, '#F2A93B', 0.55 * pu);
    }
    ctx.restore();
    ctx.save();
    ctx.translate(540, Y0);
    ctx.scale(SS, SS);
    RIG.rig(ctx, { t: t + 150, rot: t * 7.5, feed: 0.35, run: 1, start: -9 });
    ctx.restore();
    // faint unit names on the right
    const names = [['SOLO', 2.5], ['ROCHA ALTERADA', 16], ['ROCHA SÃ', 45], ['OUTRA LITOLOGIA', 135], ['GRANITO', 185]];
    names.forEach(([n, d]) => DG.text(ctx, n, 900, Y0 + d * SS, { size: 22, align: 'right', color: C.paper, alpha: 0.55 * a }));
  }

  function logo(ctx, t, T) {
    const im = DG.IMG.logo;
    const p = E.outCubic(seg(t, T.logo, T.logo + 1.6));
    if (p <= 0) return;
    const spin = (1 - E.outQuint(seg(t, T.logo, T.logo + 2.2))) * Math.PI * 3.2 + 0.06 * Math.sin(t * 0.8) * 0;
    const size = 300 * lerp(0.55, 1, E.outBack(seg(t, T.logo, T.logo + 1.3)));
    const cx = 540,
      cy = 780;
    glow(ctx, cx, cy, 420 * p, '#4C9BEA', 0.35 * p);
    ctx.save();
    ctx.globalAlpha = clamp(p * 1.4);
    ctx.translate(cx, cy);
    ctx.rotate(spin);
    ctx.drawImage(im, -size / 2, -size / 2, size, size);
    ctx.restore();
    // wordmark: "Drill" (paper) + "Geo" (blue), Space Grotesk 700, as on the site
    const wp = E.outCubic(seg(t, T.word, T.word + 0.9));
    if (wp > 0) {
      const sz = 132;
      const w1 = DG.measure(ctx, 'Drill', { size: sz, tracking: 0.01 }),
        w2 = DG.measure(ctx, 'Geo', { size: sz, tracking: 0.01 });
      const x = 540 - (w1 + w2) / 2,
        y = 1040 + (1 - wp) * 30;
      ctx.save();
      ctx.globalAlpha = wp;
      DG.text(ctx, 'Drill', x, y, { size: sz, tracking: 0.01, color: C.paper, shadowBlur: 24 });
      DG.text(ctx, 'Geo', x + w1, y, { size: sz, tracking: 0.01, color: C.blue, shadowBlur: 24 });
      ctx.restore();
    }
    const sp = E.outCubic(seg(t, T.sub, T.sub + 0.9));
    if (sp > 0) {
      ctx.save();
      ctx.globalAlpha = sp;
      ctx.fillStyle = C.amber;
      const rw = 360 * sp;
      ctx.fillRect(540 - rw / 2, 1128, rw, 4);
      DG.text(ctx, 'GEOLOGIA E SONDAGENS', 540, 1180, { size: 40, align: 'center', color: C.paper, tracking: 0.14 });
      ctx.restore();
    }
  }

  DG.SCENES.s09 = {
    draw(ctx, t, S) {
      const T = times(S);
      const st = DG.S08_END || { Y0: 290, SS: 6.6 };
      const pull = E.inOutSine(seg(t, 0, T.rise[0]));
      let Y0 = lerp(st.Y0, 360, pull),
        SS = lerp(st.SS, 7.0, pull);
      const r = E.inOutCubic(seg(t, T.rise[0], T.rise[1]));
      Y0 += r * 2100; // the camera rises: the world moves down
      const a = 1 - smooth(T.rise[0], T.rise[0] + 0.6, t);
      if (r < 1) {
        // dark sky above the world while rising
        const g = ctx.createLinearGradient(0, 0, 0, Math.max(10, Y0));
        g.addColorStop(0, '#0B1430');
        g.addColorStop(1, '#2A3E86');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, DG.W, DG.H);
        section(ctx, t, Y0, SS, a);
      }
      if (r > 0) {
        const g = ctx.createLinearGradient(0, 0, 0, DG.H);
        g.addColorStop(0, '#070B18');
        g.addColorStop(0.55, '#0F1C3D');
        g.addColorStop(1, '#16285A');
        ctx.save();
        ctx.globalAlpha = r;
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, DG.W, Math.min(DG.H, Y0 - 400 + 40));
        ctx.restore();
        for (let i = 0; i < 60; i++) {
          const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.3 + i));
          ctx.fillStyle = `rgba(230,236,255,${0.5 * r * tw})`;
          ctx.fillRect(hash(i * 3) * DG.W, hash(i * 7) * 1500 - (1 - r) * 300, 2, 2);
        }
      }
      logo(ctx, t, T);
    },
    cues(S) {
      const T = times(S);
      return [
        { type: 'amb_site', t: 0, dur: T.rise[0] + 1, soft: 1 },
        { type: 'drill_distant', t: 0, dur: T.rise[0] + 0.5 },
        { type: 'rise_whoosh', t: T.rise[0] - 0.1, dur: T.rise[1] - T.rise[0] + 0.3 },
        { type: 'logo_spin', t: T.logo, dur: 2.2 },
        { type: 'logo_hit', t: T.logo + 1.25 },
      ];
    },
  };
})();
