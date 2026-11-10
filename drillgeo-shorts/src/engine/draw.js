/* Drawing helpers: shapes, glows, metal, labels, arrows, post-processing. */
(function () {
  const DG = window.DG;
  const { clamp, lerp, E, rgba, mix, C, canvas, hash } = DG;

  function rr(ctx, x, y, w, h, r) {
    r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // ---- glow sprites (pre-rendered radial gradients, drawn additively) ----
  const glowCache = {};
  function glowSprite(color) {
    if (glowCache[color]) return glowCache[color];
    const s = 256,
      c = canvas(s, s),
      g = c.getContext('2d');
    const gr = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    gr.addColorStop(0, rgba(color, 1));
    gr.addColorStop(0.18, rgba(color, 0.55));
    gr.addColorStop(0.45, rgba(color, 0.16));
    gr.addColorStop(1, rgba(color, 0));
    g.fillStyle = gr;
    g.fillRect(0, 0, s, s);
    glowCache[color] = c;
    return c;
  }
  function glow(ctx, x, y, r, color, a = 1, op = 'lighter') {
    if (a <= 0.001 || r <= 0) return;
    ctx.save();
    ctx.globalCompositeOperation = op;
    ctx.globalAlpha = clamp(a);
    ctx.drawImage(glowSprite(color), x - r, y - r, r * 2, r * 2);
    ctx.restore();
  }

  // ---- metal: horizontal gradient across a vertical cylinder ----
  function metalGrad(ctx, x0, x1, base = C.steel, hi = C.steelLight, lo = C.steelDark, spec = 0.32) {
    const g = ctx.createLinearGradient(x0, 0, x1, 0);
    g.addColorStop(0, lo);
    g.addColorStop(Math.max(0.02, spec - 0.18), base);
    g.addColorStop(spec, hi);
    g.addColorStop(Math.min(0.98, spec + 0.1), base);
    g.addColorStop(0.82, mix(base, lo, 0.5));
    g.addColorStop(1, lo);
    return g;
  }
  function metalGradV(ctx, y0, y1, base = C.steel, hi = C.steelLight, lo = C.steelDark, spec = 0.3) {
    const g = ctx.createLinearGradient(0, y0, 0, y1);
    g.addColorStop(0, lo);
    g.addColorStop(Math.max(0.02, spec - 0.18), base);
    g.addColorStop(spec, hi);
    g.addColorStop(Math.min(0.98, spec + 0.12), base);
    g.addColorStop(1, lo);
    return g;
  }

  // ---- text ----
  const FONT = {
    display: '"Space Grotesk"',
    mono: '"IBM Plex Mono"',
    body: '"Inter"',
  };
  function text(ctx, str, x, y, o = {}) {
    ctx.save();
    const size = o.size || 36;
    ctx.font = `${o.weight || 700} ${size}px ${o.font || FONT.display}`;
    ctx.textAlign = o.align || 'left';
    ctx.textBaseline = o.baseline || 'middle';
    try {
      ctx.letterSpacing = (o.tracking != null ? o.tracking : 0.06) * size + 'px';
    } catch (e) {}
    if (o.shadow !== false) {
      ctx.shadowColor = 'rgba(0,0,0,0.55)';
      ctx.shadowBlur = o.shadowBlur || 10;
      ctx.shadowOffsetY = 2;
    }
    ctx.globalAlpha *= o.alpha != null ? o.alpha : 1;
    ctx.fillStyle = o.color || C.paper;
    ctx.fillText(str, x, y);
    ctx.restore();
  }
  function measure(ctx, str, o = {}) {
    ctx.save();
    const size = o.size || 36;
    ctx.font = `${o.weight || 700} ${size}px ${o.font || FONT.display}`;
    try {
      ctx.letterSpacing = (o.tracking != null ? o.tracking : 0.06) * size + 'px';
    } catch (e) {}
    const w = ctx.measureText(str).width;
    ctx.restore();
    return w;
  }

  /* Callout label: amber dot on the target, thin leader line, text plate.
     p = entry progress 0..1, q = exit progress 0..1 */
  function label(ctx, o) {
    const p = clamp(o.p == null ? 1 : o.p),
      q = clamp(o.q || 0);
    if (p <= 0 || q >= 1) return;
    const a = (1 - E.inQuad(q)) * (o.alpha == null ? 1 : o.alpha);
    const size = o.size || 34;
    const tw = measure(ctx, o.text, { size });
    const padX = 18,
      h = size + 22;
    const side = o.side || (o.lx >= o.x ? 'right' : 'left');
    const plateW = tw + padX * 2;
    ctx.save();
    ctx.globalAlpha = a;
    // leader line
    const pl = E.outCubic(clamp(p * 1.8));
    if (o.x != null && o.leader !== false) {
      const ex = side === 'right' ? o.lx : o.lx;
      const mx = lerp(o.x, ex, pl),
        my = lerp(o.y, o.ly, pl);
      ctx.strokeStyle = rgba(C.paper, 0.8);
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(o.x, o.y);
      ctx.lineTo(mx, my);
      ctx.stroke();
      // target dot
      const dp = E.outBack(clamp(p * 3));
      ctx.fillStyle = C.amber;
      ctx.beginPath();
      ctx.arc(o.x, o.y, 7 * dp, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = rgba(C.amber, 0.45);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(o.x, o.y, 15 * dp, 0, Math.PI * 2);
      ctx.stroke();
    }
    // plate wipe
    const pw = E.outCubic(clamp((p - 0.35) / 0.65));
    if (pw > 0) {
      const px = side === 'right' ? o.lx : o.lx - plateW;
      const py = o.ly - h / 2;
      ctx.save();
      ctx.beginPath();
      if (side === 'right') ctx.rect(px - 2, py - 4, plateW * pw + 4, h + 8);
      else ctx.rect(px + plateW * (1 - pw) - 2, py - 4, plateW * pw + 4, h + 8);
      ctx.clip();
      rr(ctx, px, py, plateW, h, 6);
      ctx.fillStyle = 'rgba(11,14,20,0.62)';
      ctx.fill();
      ctx.strokeStyle = rgba(C.paper, 0.16);
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // amber tick on the leader side
      ctx.fillStyle = C.amber;
      if (side === 'right') ctx.fillRect(px, py, 4, h);
      else ctx.fillRect(px + plateW - 4, py, 4, h);
      text(ctx, o.text, px + padX, o.ly + 1, { size, shadow: false, color: o.color || C.paper });
      ctx.restore();
    }
    ctx.restore();
  }

  /* Big title tag (no leader): centered caps with amber rule. */
  function title(ctx, str, x, y, p = 1, q = 0, o = {}) {
    if (p <= 0 || q >= 1) return;
    const size = o.size || 52;
    const a = (1 - E.inQuad(q)) * E.outCubic(clamp(p * 1.5));
    const w = measure(ctx, str, { size });
    ctx.save();
    ctx.globalAlpha = a;
    const rw = (w + 40) * E.outCubic(clamp(p));
    ctx.fillStyle = C.amber;
    ctx.fillRect(x - rw / 2, y + size * 0.72, rw, 4);
    const dy = (1 - E.outCubic(clamp(p))) * 24;
    text(ctx, str, x, y + dy, { size, align: 'center', color: o.color || C.paper, shadowBlur: 18 });
    ctx.restore();
  }

  // ---- arrows ----
  function arrowHead(ctx, x, y, ang, s = 18, color = C.amber) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ang);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(s * 0.9, 0);
    ctx.lineTo(-s * 0.5, -s * 0.6);
    ctx.lineTo(-s * 0.2, 0);
    ctx.lineTo(-s * 0.5, s * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  // straight arrow drawn progressively
  function arrow(ctx, x0, y0, x1, y1, p = 1, o = {}) {
    if (p <= 0) return;
    const x = lerp(x0, x1, p),
      y = lerp(y0, y1, p);
    ctx.save();
    ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha;
    ctx.strokeStyle = o.color || C.amber;
    ctx.lineWidth = o.width || 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x, y);
    ctx.stroke();
    arrowHead(ctx, x, y, Math.atan2(y1 - y0, x1 - x0), o.head || 22, o.color || C.amber);
    ctx.restore();
  }
  // elliptical rotation arrow around a vertical axis at (cx,cy), radii rx,ry
  function rotArrow(ctx, cx, cy, rx, ry, p = 1, phase = 0, o = {}) {
    if (p <= 0) return;
    const a0 = Math.PI * 0.15 + phase,
      span = Math.PI * 1.25 * E.outCubic(p);
    ctx.save();
    ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha;
    ctx.strokeStyle = o.color || C.amber;
    ctx.lineWidth = o.width || 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    const n = 40;
    for (let i = 0; i <= n; i++) {
      const a = a0 + (span * i) / n;
      const x = cx + Math.cos(a) * rx,
        y = cy + Math.sin(a) * ry;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    const ae = a0 + span;
    const ex = cx + Math.cos(ae) * rx,
      ey = cy + Math.sin(ae) * ry;
    const tx = -Math.sin(ae) * rx,
      ty = Math.cos(ae) * ry;
    arrowHead(ctx, ex, ey, Math.atan2(ty, tx), o.head || 22, o.color || C.amber);
    ctx.restore();
  }

  // dashed polyline with animated dash offset
  function dashed(ctx, pts, o = {}) {
    ctx.save();
    ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha;
    ctx.setLineDash(o.dash || [14, 12]);
    ctx.lineDashOffset = o.offset || 0;
    ctx.strokeStyle = o.color || C.paperDim;
    ctx.lineWidth = o.width || 2;
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.stroke();
    ctx.restore();
  }

  // ---- post-processing ----
  let grainTile = null;
  function makeGrain() {
    const s = 384,
      c = canvas(s, s),
      g = c.getContext('2d');
    const img = g.createImageData(s, s);
    for (let i = 0; i < s * s; i++) {
      const v = (hash(i * 7 + 13) * 255) | 0;
      img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
      img.data[i * 4 + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    grainTile = c;
  }
  function grain(ctx, frame, amount = 0.05) {
    if (!grainTile) makeGrain();
    const ox = (hash(frame * 3 + 1) * 384) | 0,
      oy = (hash(frame * 5 + 2) * 384) | 0;
    ctx.save();
    ctx.globalAlpha = amount;
    ctx.globalCompositeOperation = 'overlay';
    for (let y = -oy; y < DG.H; y += 384) for (let x = -ox; x < DG.W; x += 384) ctx.drawImage(grainTile, x, y);
    ctx.restore();
  }
  let vigCanvas = null;
  function vignette(ctx, strength = 0.5) {
    if (!vigCanvas) {
      vigCanvas = canvas(DG.W, DG.H);
      const g = vigCanvas.getContext('2d');
      g.save();
      g.translate(DG.W / 2, DG.H / 2);
      g.scale(1, DG.H / DG.W);
      const gr = g.createRadialGradient(0, 0, DG.W * 0.32, 0, 0, DG.W * 0.78);
      gr.addColorStop(0, 'rgba(0,0,0,0)');
      gr.addColorStop(0.65, 'rgba(0,0,0,0.35)');
      gr.addColorStop(1, 'rgba(0,0,0,0.85)');
      g.fillStyle = gr;
      g.fillRect(-DG.W, -DG.W, DG.W * 2, DG.W * 2);
      g.restore();
    }
    ctx.save();
    ctx.globalAlpha = strength;
    ctx.drawImage(vigCanvas, 0, 0);
    ctx.restore();
  }

  // "not to scale" break symbol across a vertical column
  function breakSymbol(ctx, cx, y, w, o = {}) {
    ctx.save();
    ctx.strokeStyle = o.color || C.paper;
    ctx.lineWidth = o.width || 3;
    for (const dy of [-8, 8]) {
      ctx.beginPath();
      ctx.moveTo(cx - w / 2, y + dy + 6);
      ctx.bezierCurveTo(cx - w / 6, y + dy - 16, cx + w / 6, y + dy + 16, cx + w / 2, y + dy - 6);
      ctx.stroke();
    }
    ctx.restore();
  }

  /* Motion blur: fn(g) draws the frame into an offscreen buffer; the buffer is
     then averaged over n copies spread along (dx, dy) — the per-frame travel. */
  const _mb = {};
  function motionBlur(ctx, dx, dy, fn, n = 8, key = 'a') {
    if (!_mb[key]) _mb[key] = canvas(DG.W, DG.H);
    const b = _mb[key],
      g = b.getContext('2d');
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.globalAlpha = 1;
    g.globalCompositeOperation = 'source-over';
    g.clearRect(0, 0, DG.W, DG.H);
    g.save();
    fn(g);
    g.restore();
    const dist = Math.hypot(dx, dy);
    if (dist < 1.5) {
      ctx.drawImage(b, 0, 0);
      return;
    }
    n = Math.max(2, Math.min(n, Math.ceil(dist / 6)));
    ctx.save();
    for (let k = 0; k < n; k++) {
      const f = k / (n - 1) - 0.5;
      ctx.globalAlpha = 1 / (k + 1);
      ctx.drawImage(b, dx * f, dy * f);
    }
    ctx.restore();
  }

  Object.assign(DG, {
    motionBlur, rr, glow, glowSprite, metalGrad, metalGradV, FONT, text, measure, label, title,
    arrow, arrowHead, rotArrow, dashed, grain, vignette, breakSymbol,
  });
})();
