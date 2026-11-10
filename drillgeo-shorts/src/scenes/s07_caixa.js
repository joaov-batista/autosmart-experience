/* S07 — A caixa de testemunhos. The inner tube lies on a trestle and the core
   slides gently into a half-round tray, guided by gloved hands. Top-down: the
   wooden core box opens, pieces are laid in order in the channels, the depth
   block and the label are added; pull back to boxes from several depths. */
(function () {
  const DG = window.DG;
  const { clamp, lerp, ep, seg, smooth, E, hash, glow, rgba, C, GEO, COREBOX } = DG;
  const N = 24;
  const BOXES = [3, 13, 24, 33];
  DG.BOXES = BOXES;

  function times(S) {
    const L = S.L('N09');
    return { L, tray: [0, 2.7], open: [2.75, 3.5], place: [3.6, 6.3], block: 6.45, label: [L.start + L.dur * 0.48, L.start + L.dur * 0.62], title: 3.0, pull: [Math.max(8.0, S.dur - 3.2), S.dur - 0.4] };
  }

  let bokeh = null;
  function bokehBg() {
    if (bokeh) return bokeh;
    const c = DG.canvas(DG.W, DG.H),
      g = c.getContext('2d');
    DG.LAND.landscape(g, 90, { yh: 1180, z: 1.0, strip: 160, rays: 0.4 });
    g.fillStyle = '#4B3A2A';
    g.fillRect(0, 1340, DG.W, 600);
    g.save();
    g.translate(220, 1340);
    g.scale(140, 140);
    DG.RIG.rig(g, { t: 90, rot: 0, feed: 0.1, run: 0.3, aside: 1 });
    g.restore();
    bokeh = DG.canvas(DG.W, DG.H);
    const b = bokeh.getContext('2d');
    b.filter = 'blur(14px)';
    b.drawImage(c, 0, 0);
    b.filter = 'none';
    b.fillStyle = 'rgba(10,14,24,0.25)';
    b.fillRect(0, 0, DG.W, DG.H);
    return bokeh;
  }

  function glove(ctx, x, y, s = 1, ang = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ang);
    ctx.scale(s, s);
    ctx.fillStyle = '#E3B23C';
    ctx.strokeStyle = '#0B0E14';
    ctx.lineWidth = 3;
    ctx.beginPath();
    DG.rr(ctx, -46, -30, 92, 60, 26);
    ctx.fill();
    ctx.stroke();
    for (let k = 0; k < 4; k++) {
      ctx.beginPath();
      DG.rr(ctx, 30 + (k === 3 ? -8 : 0), -26 + k * 14, 44 - k * 4, 13, 6);
      ctx.fill();
      ctx.stroke();
    }
    ctx.fillStyle = '#1E2C4F';
    ctx.fillRect(-90, -24, 46, 48);
    ctx.fillStyle = '#D9DEE6';
    ctx.fillRect(-80, -24, 10, 48);
    ctx.restore();
  }

  function trayShot(ctx, t, S, T) {
    ctx.drawImage(bokehBg(), 0, 0);
    const K = 1.05,
      yc = 900;
    const out = 620 * E.inOutSine(seg(t, 0.25, T.tray[1] - 0.2)); // mm of core out of the tube
    const tubeEnd = 470;
    const st = COREBOX.strip(N);
    // trestle + tray
    ctx.fillStyle = '#2B3038';
    for (const lx of [260, 820]) {
      ctx.beginPath();
      ctx.moveTo(lx - 70, 1500);
      ctx.lineTo(lx, yc + 60);
      ctx.lineTo(lx + 70, 1500);
      ctx.lineWidth = 14;
      ctx.strokeStyle = '#3A414C';
      ctx.stroke();
    }
    ctx.fillStyle = DG.metalGradV(ctx, yc - 10, yc + 52, '#7C8693', '#D7DEE6', '#2A3039');
    DG.rr(ctx, tubeEnd - 20, yc - 6, 620, 58, 26);
    ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(tubeEnd - 20, yc + 8, 620, 12);
    // core pieces sliding out (row 3 interval of box 24: 118.20 → 119.20)
    const pcs = COREBOX.pieces(N).filter((p) => p.row === 2);
    const d0 = COREBOX.boxStart(N);
    for (const p of pcs) {
      const a = (p.d0 - (d0 + 2)) * 1000,
        len = (p.d1 - p.d0) * 1000;
      // the front of the run leaves the tube first; gaps open slightly at natural breaks
      const x = tubeEnd + (out - (1000 - a - len) - len) * K + (pcs.length - pcs.indexOf(p)) * 6 * E.outCubic(seg(t, 0.4, T.tray[1]));
      if (x + len * K < tubeEnd - 30 || x > DG.W + 40) continue;
      ctx.save();
      ctx.translate(x + (len * K) / 2, yc - 2);
      ctx.scale(K, K);
      COREBOX.piece(ctx, st, (p.d0 - d0) * 1000, len, len - 4);
      ctx.restore();
    }
    // inner tube (cut away on the right end) in front
    ctx.fillStyle = DG.metalGradV(ctx, yc - 40, yc + 38, '#6A7584', '#EEF3F8', '#2A303A');
    ctx.fillRect(-20, yc - 40, tubeEnd + 20, 76);
    ctx.fillStyle = '#20252C';
    ctx.fillRect(tubeEnd - 6, yc - 40, 10, 76);
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(-20, yc - 30, tubeEnd + 20, 6);
    // gloved hands guiding (one on the tube, one cradling the core)
    const hx = tubeEnd + 90 + out * K * 0.6;
    glove(ctx, Math.min(hx, 900), yc - 56 + Math.sin(t * 3) * 3, 0.85, 0.05);
    glove(ctx, tubeEnd - 170, yc - 58, 0.85, -0.04);
    DG.text(ctx, 'TUBO INTERNO', 120, 760, { size: 32, alpha: ep(t, 0.4, 1.0, 'linear') * (1 - ep(t, 2.0, 2.5, 'linear')) });
  }

  function table(ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, DG.H);
    g.addColorStop(0, '#2E3542');
    g.addColorStop(1, '#1A1F28');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, DG.W, DG.H);
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.015 + 0.02 * hash(i)})`;
      ctx.fillRect(0, hash(i * 3) * DG.H, DG.W, 2);
    }
    // dappled light under the canopy
    for (let i = 0; i < 9; i++) glow(ctx, hash(i * 5) * DG.W, hash(i * 7) * DG.H, 260, '#FFE2B0', 0.06, 'source-over');
  }

  function tools(ctx, x, y, s) {
    // hand lens, marker, tape on the table
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.fillStyle = '#1B1E24';
    DG.rr(ctx, 0, 0, 170, 22, 10);
    ctx.fill();
    ctx.fillStyle = '#F2A93B';
    DG.rr(ctx, 150, 2, 30, 18, 6);
    ctx.fill();
    ctx.fillStyle = '#E8C547';
    ctx.beginPath();
    ctx.arc(320, 10, 46, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2B2F36';
    ctx.beginPath();
    ctx.arc(320, 10, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3B4350';
    ctx.beginPath();
    ctx.arc(470, 10, 38, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(190,220,255,0.55)';
    ctx.beginPath();
    ctx.arc(470, 10, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function boxShot(ctx, t, S, T) {
    table(ctx);
    const pk = E.inOutCubic(seg(t, T.pull[0], T.pull[1]));
    const s0 = 0.92;
    const B = COREBOX.BOX;
    const drift = 30 * E.inOutSine(seg(t, T.open[0], T.pull[0]));
    // big box position → slot 3 of the 4-box rack
    const big = { x: 540 - (B.W * s0) / 2 + drift, y: 760 - (B.H * s0) / 2, s: s0 };
    const slot = (i) => ({ x: 110, y: 330 + i * 250, s: 0.4 });
    const p = (a, b) => ({ x: lerp(a.x, b.x, pk), y: lerp(a.y, b.y, pk), s: lerp(a.s, b.s, pk) });
    const d0 = COREBOX.boxStart(N);
    const pcs = COREBOX.pieces(N).filter((q) => q.row === 2);
    const pt = seg(t, T.place[0], T.place[1]) * pcs.length;
    const cur = Math.floor(pt);
    const place = cur < pcs.length ? { d0: pcs[cur].d0, k: E.outCubic(pt - cur) } : null;
    const fillTo = cur < pcs.length ? pcs[cur].d0 - 1e-4 : d0 + 3;
    // other boxes appear during the pull-back
    BOXES.forEach((n, i) => {
      if (n === N) return;
      const a = pk;
      if (a <= 0) return;
      ctx.save();
      ctx.globalAlpha = a;
      const sl = slot(i);
      COREBOX.drawBox(ctx, { x: sl.x - (1 - a) * 80, y: sl.y, s: sl.s, n, blocks: [COREBOX.boxStart(n) + 2, COREBOX.boxStart(n) + 5] });
      ctx.restore();
    });
    const pos = p(big, slot(2));
    COREBOX.drawBox(ctx, {
      x: pos.x, y: pos.y, s: pos.s, n: N,
      fillTo: pk > 0 ? d0 + 3 : fillTo,
      place: pk > 0 ? null : place,
      lid: E.inOutCubic(seg(t, T.open[0], T.open[1])),
      blocks: t > T.block ? [d0 + 3] : [],
      label: ep(t, T.label[0], T.label[1], 'linear'),
    });
    // hand placing the current piece
    if (place && pk === 0) {
      const p0 = pcs[cur];
      const xa = big.x + (B.endW + 6 + (p0.d0 - (d0 + 2)) * 985 + ((p0.d1 - p0.d0) * 985) / 2) * s0;
      const ya = big.y + (B.wall + 2 * (B.rowW + B.div) + B.rowW / 2) * s0 - (1 - E.outCubic(place.k)) * 110 - 54;
      glove(ctx, xa + 30, ya, 0.9, Math.PI / 2 + 0.1);
    }
    if (pk === 0) tools(ctx, 150, big.y + B.H * s0 + 70, 1);
    // texts
    DG.title(ctx, 'CAIXA DE TESTEMUNHOS', 540, 236, ep(t, T.title, T.title + 0.8, 'linear'), 0, { size: 48 });
    DG.text(ctx, 'identificação e profundidades: valores ilustrativos', 540, big.y + B.H * s0 + 30, { size: 22, font: DG.FONT.body, weight: 600, tracking: 0, align: 'center', color: C.paperDim, alpha: (1 - pk) * ep(t, T.label[0], T.label[1], 'linear') });
    if (pk > 0) {
      BOXES.forEach((n, i) => {
        const sl = slot(i);
        const b0 = COREBOX.boxStart(n);
        ctx.save();
        ctx.globalAlpha = pk;
        DG.text(ctx, `CX ${String(n).padStart(2, '0')}`, 600, sl.y + 70, { size: 34, color: C.paper });
        DG.text(ctx, `${COREBOX.fmt(b0)} – ${COREBOX.fmt(b0 + 5)} m`, 600, sl.y + 116, { size: 28, font: DG.FONT.mono, weight: 400, tracking: 0, color: C.paperDim });
        ctx.restore();
      });
    }
  }

  DG.SCENES.s07 = {
    init() {
      bokehBg();
      for (const n of BOXES) COREBOX.strip(n);
    },
    draw(ctx, t, S) {
      const T = times(S);
      if (t < T.tray[1]) {
        trayShot(ctx, t, S, T);
        const fi = 1 - smooth(0, 0.35, t);
        if (fi > 0) {
          ctx.fillStyle = `rgba(11,14,20,${fi * 0.85})`;
          ctx.fillRect(0, 0, DG.W, DG.H);
        }
        return;
      }
      boxShot(ctx, t, S, T);
      const x = 1 - smooth(T.tray[1], T.tray[1] + 0.35, t);
      if (x > 0) {
        ctx.save();
        ctx.globalAlpha = x;
        trayShot(ctx, T.tray[1], S, T);
        ctx.restore();
      }
    },
    cues(S) {
      const T = times(S);
      const out = [
        { type: 'amb_site', t: 0, dur: S.dur, soft: 1 },
        { type: 'core_slide_metal', t: 0.3, dur: T.tray[1] - 0.5 },
        { type: 'box_open', t: T.open[0] },
        { type: 'ui_tick', t: T.title + 0.3 },
        { type: 'block_place', t: T.block },
        { type: 'marker_write', t: T.label[0], dur: T.label[1] - T.label[0] },
        { type: 'pull_back_whoosh', t: T.pull[0], dur: T.pull[1] - T.pull[0] },
      ];
      const n = COREBOX.pieces(N).filter((q) => q.row === 2).length;
      for (let i = 0; i < n; i++) out.push({ type: 'core_place', t: T.place[0] + ((i + 0.85) * (T.place[1] - T.place[0])) / n, idx: i });
      return out;
    },
  };
})();
