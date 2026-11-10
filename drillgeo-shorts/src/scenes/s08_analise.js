/* S08 — O que estão procurando? A geologist (PPE) examines the core with a
   hand lens; the lens travels over texture, a fracture, the vein, sulphide
   grains and the alteration halo. Then the boxes are linked by glowing lines to
   the intervals they came from, and the samples return to the subsurface. */
(function () {
  const DG = window.DG;
  const { clamp, lerp, ep, seg, smooth, E, hash, glow, rgba, C, GEO, COREBOX, PEOPLE, LAND } = DG;
  const N = 24;
  const B = () => COREBOX.BOX;

  function times(S) {
    const L = S.L('N10');
    const c0 = 2.8;
    const links = Math.max(c0 + 5.6, L.start + L.dur * 0.78);
    return { L, c0, links, feat: [c0 + 0.5, c0 + 1.5, c0 + 2.5, c0 + 3.4, c0 + 4.3], fly: [S.dur - 1.6, S.dur - 0.1] };
  }
  // feature points in box mm coordinates
  const pos = (depth, row) => [B().endW + 6 + (depth - (COREBOX.boxStart(N) + row)) * 985, B().wall + row * (B().rowW + B().div) + B().rowW / 2];
  const FEAT = [
    ['TEXTURA', 120.62, 4],
    ['FRATURA', 117.8, 1],
    ['VEIO', 118.85, 2],
    ['MINERAIS', 119.05, 2],
    ['ALTERAÇÃO', 119.9, 3],
  ];

  let bg = null;
  function shadeBg() {
    if (bg) return bg;
    const c = DG.canvas(DG.W, DG.H),
      g = c.getContext('2d');
    LAND.landscape(g, 120, { yh: 1050, z: 0.85, strip: 220, rays: 0.5 });
    g.save();
    g.translate(860, 1270);
    g.scale(70, 70);
    DG.RIG.rig(g, { t: 120, rot: 0, feed: 0.3, run: 0.4 });
    g.restore();
    bg = DG.canvas(DG.W, DG.H);
    const b = bg.getContext('2d');
    b.filter = 'blur(10px)';
    b.drawImage(c, 0, 0);
    b.filter = 'none';
    return bg;
  }

  function midShot(ctx, t, S, T) {
    ctx.drawImage(shadeBg(), 0, 0);
    // canopy (shade) with a scalloped edge
    ctx.fillStyle = '#18233F';
    ctx.fillRect(0, 0, DG.W, 250);
    ctx.beginPath();
    for (let x = 0; x <= DG.W; x += 90) ctx.arc(x + 45, 250, 45, 0, Math.PI);
    ctx.fill();
    ctx.fillStyle = 'rgba(15,28,61,0.25)';
    ctx.fillRect(0, 0, DG.W, DG.H);
    const s = 690;
    const push = 1 + 0.04 * E.inOutSine(seg(t, 0, T.c0));
    ctx.save();
    ctx.translate(540, 1000);
    ctx.scale(push, push);
    ctx.translate(-540, -1000);
    // the geologist behind the table
    const lean = 0.32 + 0.03 * Math.sin(t * 1.2);
    const hand = PEOPLE.person(ctx, { x: 760, y: 1120 + 0.92 * s, s, face: -1, t, seed: 7, helmet: '#F4F6F8', detail: true, muffs: false, skin: '#A9765A', pose: { armF: [1.05, 0.55 + 0.05 * Math.sin(t * 2)], armB: [0.55, 1.05], legF: [0.05, 0], legB: [-0.05, 0], lean, head: 0.42 } });
    // hand lens in the front hand
    ctx.save();
    ctx.translate(760, 1120 + 0.92 * s);
    ctx.scale(-s, s);
    ctx.translate(hand[0], hand[1]);
    ctx.fillStyle = '#E8C547';
    ctx.strokeStyle = '#0B0E14';
    ctx.lineWidth = 0.01;
    ctx.beginPath();
    ctx.arc(0.04, 0.05, 0.035, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(190,225,255,0.7)';
    ctx.beginPath();
    ctx.arc(0.04, 0.05, 0.024, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // table + core box (side) in front
    ctx.fillStyle = '#C9A36A';
    ctx.fillRect(20, 1076, 1040, 44);
    ctx.fillStyle = '#4A6A5E';
    ctx.fillRect(50, 1064, 900, 14);
    ctx.fillStyle = '#E9EEF0';
    ctx.fillRect(380, 1064, 150, 14);
    ctx.fillStyle = '#2A3140';
    ctx.fillRect(0, 1120, DG.W, 40);
    const tg = ctx.createLinearGradient(0, 1160, 0, DG.H);
    tg.addColorStop(0, '#1E2430');
    tg.addColorStop(1, '#0E1218');
    ctx.fillStyle = tg;
    ctx.fillRect(0, 1160, DG.W, DG.H - 1160);
    ctx.restore();
  }

  function closeShot(ctx, t, S, T) {
    // background: table
    ctx.fillStyle = '#222934';
    ctx.fillRect(0, 0, DG.W, DG.H);
    const s = 2.0;
    // lens target path
    const k = (t - T.feat[0] + 0.5) / 1.0;
    const i0 = clamp(Math.floor(k), 0, 4),
      i1 = clamp(i0 + 1, 0, 4);
    const f = E.inOutCubic(clamp(k - Math.floor(k) - 0.35, 0, 0.65) / 0.65);
    const p0 = pos(FEAT[i0][1], FEAT[i0][2]),
      p1 = pos(FEAT[i1][1], FEAT[i1][2]);
    const lx = lerp(p0[0], p1[0], k < 0 ? 0 : f),
      ly = lerp(p0[1], p1[1], k < 0 ? 0 : f);
    const cam = [lerp(560, lx, 0.55), lerp(250, ly, 0.5)];
    const toS = (x, y) => [(x - cam[0]) * s + 540, (y - cam[1]) * s + 860];
    const [bx, by] = toS(0, 0);
    COREBOX.drawBox(ctx, { x: bx, y: by, s, n: N, blocks: [119.2], label: 1, lid: 1, res: 4 });
    // lens
    const [sx, sy] = toS(lx, ly);
    const R = 190,
      M = 2.4;
    ctx.save();
    ctx.beginPath();
    ctx.arc(sx, sy, R, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = '#222934';
    ctx.fillRect(sx - R, sy - R, 2 * R, 2 * R);
    const [mx, my] = [sx - lx * s * M, sy - ly * s * M];
    COREBOX.drawBox(ctx, { x: mx, y: my, s: s * M, n: N, blocks: [119.2], label: 1, lid: 1, res: 4 });
    // sulphide sparkle inside the lens
    if (i0 >= 2 && i0 <= 3) for (let j = 0; j < 10; j++) glow(ctx, sx + (hash(j * 3) - 0.5) * R * 1.4, sy + (hash(j * 5) - 0.5) * R * 0.5, 14 + 12 * Math.max(0, Math.sin(t * 5 + j)), '#FFE08A', 0.7);
    const lg = ctx.createRadialGradient(sx - R * 0.4, sy - R * 0.4, 10, sx, sy, R);
    lg.addColorStop(0, 'rgba(255,255,255,0.22)');
    lg.addColorStop(0.6, 'rgba(255,255,255,0.02)');
    lg.addColorStop(1, 'rgba(0,0,0,0.35)');
    ctx.fillStyle = lg;
    ctx.fillRect(sx - R, sy - R, 2 * R, 2 * R);
    ctx.restore();
    // lens rim + handle + glove
    ctx.save();
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1B1E24';
    ctx.lineWidth = 34;
    ctx.beginPath();
    ctx.moveTo(sx + R * 0.72, sy + R * 0.72);
    ctx.lineTo(sx + R * 1.5, sy + R * 1.5);
    ctx.stroke();
    ctx.strokeStyle = '#E8C547';
    ctx.lineWidth = 22;
    ctx.beginPath();
    ctx.arc(sx, sy, R + 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    glove(ctx, sx + R * 1.55, sy + R * 1.6, 1.25, -Math.PI * 0.75);
    // feature tags
    FEAT.forEach(([txt], i) => {
      const p = ep(t, T.feat[i] - 0.15, T.feat[i] + 0.45, 'linear'),
        q = ep(t, T.feat[i] + 0.8, T.feat[i] + 1.1, 'linear');
      if (p <= 0 || q >= 1) return;
      DG.label(ctx, { x: sx - R * 0.15, y: sy, lx: 110, ly: clamp(sy - R - 70, 260, 1200), side: 'right', text: txt, p, q, size: 40 });
    });
  }

  function glove(ctx, x, y, s, ang) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ang);
    ctx.scale(s, s);
    ctx.fillStyle = '#E3B23C';
    ctx.strokeStyle = '#0B0E14';
    ctx.lineWidth = 3;
    ctx.beginPath();
    DG.rr(ctx, -50, -34, 100, 68, 28);
    ctx.fill();
    ctx.stroke();
    for (let k = 0; k < 3; k++) {
      ctx.beginPath();
      DG.rr(ctx, 34, -30 + k * 20, 34, 18, 8);
      ctx.fill();
      ctx.stroke();
    }
    ctx.fillStyle = '#1E2C4F';
    ctx.fillRect(-120, -30, 72, 60);
    ctx.fillStyle = '#D9DEE6';
    ctx.fillRect(-108, -30, 12, 60);
    ctx.restore();
  }

  // boxes linked to their intervals: each box sits at the height of the depth it came from
  const Y0 = 290, SS = 6.6; // surface y, px per metre
  DG.S08_END = { Y0, SS };
  function linksShot(ctx, t, S, T) {
    const k = seg(t, T.links, T.links + 1.0);
    const R = GEO.cached('wide', () => GEO.renderRegion(-72, 72, -1, 216, 7.6, { veinX: 2.4 }));
    LAND.landscape(ctx, t + 130, { yh: Y0, z: 0.45, strip: 0, rays: 0.5, birds: 0 });
    ctx.drawImage(R.cv, -4, Y0 + R.y0 * SS, DG.W + 8, R.cv.height * (SS / R.s));
    ctx.fillStyle = 'rgba(8,12,22,0.35)';
    ctx.fillRect(0, Y0, DG.W, DG.H);
    ctx.fillStyle = '#04060A';
    ctx.fillRect(536, Y0, 8, 196 * SS);
    glow(ctx, 540, Y0 + 196 * SS, 50, '#FFC27A', 0.6);
    ctx.save();
    ctx.translate(540, Y0);
    ctx.scale(SS, SS);
    DG.RIG.rig(ctx, { t, rot: t * 7, feed: 0.3, run: 1, start: -9 });
    ctx.restore();
    const fly = E.inOutCubic(seg(t, T.fly[0], T.fly[1]));
    DG.BOXES.forEach((n, i) => {
      const d0 = COREBOX.boxStart(n),
        d1 = d0 + 5;
      const ya = Y0 + d0 * SS,
        yb = Y0 + d1 * SS,
        ym = (ya + yb) / 2;
      const bs = 0.24;
      const bw = COREBOX.BOX.W * bs,
        bh = COREBOX.BOX.H * bs;
      const x = 70,
        y = ym - bh / 2;
      const lp = E.outCubic(seg(t, T.links + 0.3 + i * 0.3, T.links + 1.0 + i * 0.3));
      const ap = E.outCubic(seg(t, T.links + i * 0.25, T.links + 0.6 + i * 0.25));
      ctx.save();
      ctx.globalAlpha = ap * (1 - fly * 0.9);
      ctx.translate((1 - ap) * -60, 0);
      DG.rr(ctx, x - 10, y - 10, bw + 20, bh + 54, 10);
      ctx.fillStyle = 'rgba(11,14,20,0.72)';
      ctx.fill();
      COREBOX.drawBox(ctx, { x, y, s: bs, n, blocks: [], label: 1 });
      DG.text(ctx, `${COREBOX.fmt(d0)}–${COREBOX.fmt(d1)} m`, x + 4, y + bh + 24, { size: 22, font: DG.FONT.mono, weight: 400, tracking: 0, color: C.paper });
      ctx.restore();
      // interval on the hole
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = rgba(C.amber, 0.95 * lp);
      ctx.fillRect(531, ya, 18, yb - ya);
      glow(ctx, 540, ym, 70, '#F2A93B', 0.7 * lp);
      ctx.restore();
      if (lp > 0) {
        const ax = x + bw + 12;
        DG.dashed(ctx, [[ax, ym], [lerp(ax, 528, lp), ym]], { color: C.amber, width: 4, alpha: 0.95 * (1 - fly), offset: -t * 40, dash: [12, 9] });
      }
      // samples returning to where they came from
      if (fly > 0 && fly < 1) {
        for (let j = 0; j < 5; j++) {
          const px = lerp(x + 30 + j * 46, 540, E.inOutSine(fly)),
            py = lerp(y + 12 + j * (bh / 5), ya + ((yb - ya) * (j + 0.5)) / 5, fly);
          ctx.fillStyle = '#C8C2B4';
          DG.rr(ctx, px - 12, py - 5, 24, 10, 5);
          ctx.fill();
          glow(ctx, px, py, 20, '#FFD58A', 0.5);
        }
      }
    });
    DG.text(ctx, 'valores ilustrativos', 540, 1450, { size: 22, font: DG.FONT.body, weight: 600, tracking: 0, align: 'center', color: C.paperDim, alpha: k });
    if (k < 1) {
      ctx.fillStyle = `rgba(11,14,20,${(1 - k) * 0.9})`;
      ctx.fillRect(0, 0, DG.W, DG.H);
    }
  }

  DG.SCENES.s08 = {
    init() {
      shadeBg();
      COREBOX.strip(N, 4);
      for (const n of DG.BOXES) COREBOX.strip(n);
    },
    draw(ctx, t, S) {
      const T = times(S);
      if (t < T.c0) {
        midShot(ctx, t, S, T);
        const fi = 1 - smooth(0, 0.4, t);
        if (fi > 0) {
          ctx.fillStyle = `rgba(11,14,20,${fi * 0.8})`;
          ctx.fillRect(0, 0, DG.W, DG.H);
        }
        return;
      }
      if (t < T.links) {
        closeShot(ctx, t, S, T);
        const x = 1 - smooth(T.c0, T.c0 + 0.35, t);
        if (x > 0) {
          ctx.save();
          ctx.globalAlpha = x;
          midShot(ctx, T.c0, S, T);
          ctx.restore();
        }
        return;
      }
      linksShot(ctx, t, S, T);
      const x = 1 - smooth(T.links, T.links + 0.4, t);
      if (x > 0) {
        ctx.save();
        ctx.globalAlpha = x;
        closeShot(ctx, T.links, S, T);
        ctx.restore();
      }
    },
    cues(S) {
      const T = times(S);
      const out = [
        { type: 'amb_site', t: 0, dur: S.dur, soft: 1 },
        { type: 'cloth_move', t: 0.4 },
        { type: 'lens_swish', t: T.c0 - 0.1 },
        { type: 'links_arp', t: T.links + 0.4, dur: 1.6 },
        { type: 'return_whoosh', t: T.fly[0], dur: T.fly[1] - T.fly[0] + 0.3 },
      ];
      T.feat.forEach((x, i) => out.push({ type: i === 2 || i === 3 ? 'interest_chime' : 'feature_bell', t: x, idx: i }));
      return out;
    },
  };
})();
