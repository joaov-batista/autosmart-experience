/* Core box (caixa de testemunhos), top-down view. Wooden box, 5 channels,
   1.0 m of core per channel, read like a book (top-left → right, row by row).
   Pieces break at the natural fractures of the column; depth blocks mark the
   end of each run. All identifiers and depths are ILLUSTRATIVE. */
(function () {
  const DG = window.DG;
  const { clamp, lerp, hash, rgba, mix, C, GEO, rng } = DG;

  const BOX = { rows: 5, rowLen: 1000, rowW: 78, div: 12, wall: 26, endW: 70, coreD: 63.5 };
  BOX.W = BOX.endW + BOX.rowLen + BOX.wall + 24;
  BOX.H = BOX.wall * 2 + BOX.rows * BOX.rowW + (BOX.rows - 1) * BOX.div;
  const RUN = 3.0,
    RUN0 = 1.2; // runs end at 1.2 + 3k (illustrative)

  const boxStart = (n) => RUN0 + 5 * (n - 1);
  const fmt = (d) => d.toFixed(2).replace('.', ',');

  function strip(n, res = 1) {
    const d0 = boxStart(n);
    return GEO.cached('boxstrip' + n + '_' + res, () => GEO.coreStrip(d0, d0 + 5.02, 1000 * res, Math.round(64 * res), { df: 30, radius: 0.032 }));
  }

  // pieces for a box: [{d0, d1, row}] split at natural breaks and row ends
  function pieces(n) {
    const d0 = boxStart(n);
    const cuts = GEO.CORE_BREAKS.filter((d) => d > d0 && d < d0 + 5);
    const r = rng(n * 77);
    // extra mechanical/natural breaks where the column has none
    for (let k = 0; k < 6; k++) cuts.push(d0 + 0.3 + r() * 4.4);
    for (let k = 1; k < 5; k++) cuts.push(d0 + k);
    cuts.sort((a, b) => a - b);
    const out = [];
    let a = d0;
    for (const c of cuts.concat([d0 + 5])) {
      if (c - a < 0.05) continue;
      out.push({ d0: a, d1: c, row: Math.min(4, Math.floor((a - d0 + 1e-6) / 1.0)) });
      a = c;
    }
    return out;
  }

  function woodGrain(ctx, x, y, w, h, seed, base = '#C9A36A') {
    ctx.fillStyle = base;
    ctx.fillRect(x, y, w, h);
    const r = rng(seed);
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    for (let i = 0; i < Math.max(3, h / 4); i++) {
      const yy = y + r() * h;
      ctx.strokeStyle = `rgba(110,72,30,${0.08 + 0.12 * r()})`;
      ctx.lineWidth = 0.8 + r() * 1.6;
      ctx.beginPath();
      ctx.moveTo(x, yy);
      for (let xx = x; xx <= x + w; xx += 40) ctx.lineTo(xx, yy + Math.sin(xx * 0.01 + i) * 2.5);
      ctx.stroke();
    }
    ctx.restore();
  }

  /* o: { x, y, s (px/mm), n (box number), fillTo (depth m: cores placed up to),
          place: {d0, d1, k} piece being placed (k 0..1), lid (0 closed..1 open),
          blocks: [depth...] shown, label (0..1 written), hole 'DG-01' } */
  function drawBox(ctx, o) {
    const s = o.s;
    ctx.save();
    ctx.translate(o.x, o.y);
    ctx.scale(s, s);
    // drop shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    DG.rr(ctx, 14, 18, BOX.W, BOX.H, 8);
    ctx.fill();
    // box floor + walls
    woodGrain(ctx, 0, 0, BOX.W, BOX.H, o.n * 3 + 1, '#B98E55');
    ctx.strokeStyle = 'rgba(60,36,12,0.7)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, BOX.W, BOX.H);
    const x0 = BOX.endW;
    for (let r = 0; r < BOX.rows; r++) {
      const y = BOX.wall + r * (BOX.rowW + BOX.div);
      // channel (shadowed groove)
      ctx.fillStyle = '#8E6A3C';
      ctx.fillRect(x0, y, BOX.rowLen + 14, BOX.rowW);
      const g = ctx.createLinearGradient(0, y, 0, y + BOX.rowW);
      g.addColorStop(0, 'rgba(0,0,0,0.42)');
      g.addColorStop(0.3, 'rgba(0,0,0,0.08)');
      g.addColorStop(1, 'rgba(0,0,0,0.25)');
      ctx.fillStyle = g;
      ctx.fillRect(x0, y, BOX.rowLen + 14, BOX.rowW);
      if (r < BOX.rows - 1) woodGrain(ctx, x0 - 6, y + BOX.rowW, BOX.rowLen + 26, BOX.div, o.n * 17 + r, '#D1AB72');
    }
    // core pieces
    const res = o.res || 1;
    const st = strip(o.n, res);
    const d0 = boxStart(o.n);
    const fill = o.fillTo == null ? d0 + 5 : o.fillTo;
    for (const p of pieces(o.n)) {
      let k = 1;
      if (o.place && Math.abs(p.d0 - o.place.d0) < 1e-6) k = o.place.k;
      else if (p.d1 > fill + 1e-6) continue;
      if (k <= 0) continue;
      const y = BOX.wall + p.row * (BOX.rowW + BOX.div) + (BOX.rowW - BOX.coreD) / 2;
      const xa = x0 + 6 + (p.d0 - (d0 + p.row)) * 1000 * 0.985,
        len = (p.d1 - p.d0) * 1000 * 0.985 - 3;
      const lift = (1 - DG.E.outCubic(k)) * 120;
      const jit = (hash(Math.round(p.d0 * 1000)) - 0.5) * 0.02;
      ctx.save();
      ctx.translate(xa + len / 2, y + BOX.coreD / 2 - lift);
      ctx.rotate(jit);
      ctx.globalAlpha = clamp(k * 3);
      if (lift > 1) {
        ctx.fillStyle = `rgba(0,0,0,${0.3 * (1 - k)})`;
        ctx.fillRect(-len / 2 + lift * 0.2, -BOX.coreD / 2 + lift * 0.6, len, BOX.coreD);
      }
      piece(ctx, st, (p.d0 - d0) * 1000, (p.d1 - p.d0) * 1000, len, res);
      ctx.restore();
    }
    // depth blocks (end of runs)
    for (const bd of o.blocks || []) {
      if (bd <= d0 || bd > d0 + 5.001) continue;
      const row = Math.min(4, Math.floor((bd - d0 - 1e-6) / 1.0));
      const y = BOX.wall + row * (BOX.rowW + BOX.div);
      const x = x0 + 6 + (bd - (d0 + row)) * 1000 * 0.985;
      ctx.fillStyle = '#F4F1EA';
      DG.rr(ctx, x - 2, y + 4, 34, BOX.rowW - 8, 3);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.save();
      ctx.translate(x + 15, y + BOX.rowW / 2);
      ctx.rotate(-Math.PI / 2);
      DG.text(ctx, fmt(bd), 0, 1, { size: 15, font: DG.FONT.mono, weight: 600, tracking: 0, align: 'center', color: '#1B2A4A', shadow: false });
      ctx.restore();
    }
    // end board label: hole, box, interval
    const lp = o.label == null ? 1 : o.label;
    if (lp > 0) {
      ctx.save();
      ctx.translate(BOX.endW / 2, BOX.H / 2);
      ctx.rotate(-Math.PI / 2);
      const lines = [`${o.hole || 'DG-01'} · CX ${String(o.n).padStart(2, '0')}`, `${fmt(d0)} – ${fmt(d0 + 5)} m`];
      ctx.beginPath();
      ctx.rect(-BOX.H / 2 + 20, -40, (BOX.H - 40) * clamp(lp * 1.2), 80);
      ctx.clip();
      DG.text(ctx, lines[0], 0, -14, { size: 22, font: DG.FONT.mono, weight: 600, tracking: 0, align: 'center', color: '#13203D', shadow: false });
      DG.text(ctx, lines[1], 0, 14, { size: 20, font: DG.FONT.mono, weight: 400, tracking: 0, align: 'center', color: '#13203D', shadow: false });
      ctx.restore();
    }
    // reading-order marker
    DG.text(ctx, 'TOPO ›', BOX.endW + 8, BOX.wall - 11, { size: 13, font: DG.FONT.mono, weight: 600, tracking: 0, color: '#3A2410', shadow: false, alpha: 0.8 });
    // lid (hinged on the top edge; foreshortens as it opens)
    const lid = o.lid == null ? 1 : o.lid;
    if (lid < 1) {
      const h = BOX.H * Math.cos((lid * Math.PI) / 2);
      woodGrain(ctx, -4, -4 + (BOX.H - h) * 0, BOX.W + 8, h + 8, o.n * 5 + 9, mix('#D2AD73', '#A57B45', lid));
      ctx.strokeStyle = 'rgba(60,36,12,0.7)';
      ctx.strokeRect(-4, -4, BOX.W + 8, h + 8);
    }
    ctx.restore();
  }

  // one cylindrical piece, centred, horizontal; depth increases to the right
  function piece(ctx, st, mm0, mmLen, len, res = 1) {
    const h = BOX.coreD;
    ctx.save();
    DG.rr(ctx, -len / 2, -h / 2, len, h, 7);
    ctx.clip();
    ctx.save();
    ctx.translate(-len / 2, h / 2);
    ctx.rotate(-Math.PI / 2);
    // strip: x = across core (0..64), y = depth (mm, 1 px per mm)
    ctx.drawImage(st, 0, mm0 * res, st.width, Math.max(1, mmLen * res), 0, 0, h, len);
    ctx.restore();
    const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
    g.addColorStop(0, 'rgba(255,255,255,0.32)');
    g.addColorStop(0.25, 'rgba(255,255,255,0.08)');
    g.addColorStop(0.6, 'rgba(0,0,0,0.05)');
    g.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = g;
    ctx.fillRect(-len / 2, -h / 2, len, h);
    // broken ends
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.fillRect(-len / 2, -h / 2, 3, h);
    ctx.fillRect(len / 2 - 3, -h / 2, 3, h);
    ctx.restore();
  }

  DG.COREBOX = { BOX, drawBox, pieces, boxStart, strip, piece, fmt };
})();
