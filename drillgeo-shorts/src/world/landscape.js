/* Surface world: golden-hour sky, lit clouds, atmospheric mountain ridges,
   cerrado trees, wind-blown grass, birds and pollen. Pure functions of t. */
(function () {
  const DG = window.DG;
  const { clamp, lerp, smooth, fbm1, noise1, hash, rng, rgba, mix, hexRgb, canvas, glow, C } = DG;

  const SKY = ['#14204A', '#2A3E86', '#5E73B5', '#C98A86', '#F0A066', '#F9CC8C'];
  const SKY_STOPS = [0, 0.28, 0.52, 0.74, 0.88, 1];

  // sky gradient anchored so that `yh` (horizon) gets the warmest colour
  function sky(ctx, yh, top = 0, mood = 0) {
    const span = Math.max(900, yh - top + 200);
    const g = ctx.createLinearGradient(0, yh - span, 0, yh + 40);
    SKY.forEach((c, i) => g.addColorStop(SKY_STOPS[i], mood ? mix(c, '#0F1C3D', mood) : c));
    ctx.fillStyle = g;
    ctx.fillRect(0, -10, DG.W, yh + 60);
  }

  function sun(ctx, x, y, r, a = 1) {
    glow(ctx, x, y, r * 9, '#FFB36B', 0.55 * a);
    glow(ctx, x, y, r * 4, '#FFD9A0', 0.7 * a);
    glow(ctx, x, y, r * 1.6, '#FFF4DC', 0.9 * a);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = '#FFF8EA';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function rays(ctx, x, y, t, a = 1) {
    if (a <= 0) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 7; i++) {
      const ang = -Math.PI * 0.92 + (i / 6) * Math.PI * 0.84 + 0.03 * Math.sin(t * 0.3 + i);
      const w = 0.035 + 0.03 * hash(i + 3);
      const len = 1500;
      const g = ctx.createRadialGradient(x, y, 0, x, y, len);
      g.addColorStop(0, `rgba(255,214,150,${0.075 * a})`);
      g.addColorStop(0.35, `rgba(255,214,150,${0.03 * a})`);
      g.addColorStop(1, 'rgba(255,214,150,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(ang - w) * len, y + Math.sin(ang - w) * len);
      ctx.lineTo(x + Math.cos(ang + w) * len, y + Math.sin(ang + w) * len);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  // ---------- clouds ----------
  function makeCloud(seed, w, h) {
    const r = rng(seed);
    const cv = canvas(w + 80, h + 80),
      g = cv.getContext('2d');
    const blobs = [];
    const n = 16 + ((r() * 10) | 0);
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const bx = 40 + w * (0.08 + 0.84 * t) + (r() - 0.5) * w * 0.08;
      const arch = Math.sin(t * Math.PI);
      const br = h * (0.18 + 0.32 * arch * (0.6 + 0.5 * r()));
      const by = 40 + h - br * 0.75 - arch * h * 0.25 * r();
      blobs.push([bx, by, br]);
    }
    for (let i = 0; i < 7; i++) blobs.push([40 + w * (0.1 + 0.8 * r()), 40 + h * 0.9, h * (0.12 + 0.08 * r())]);
    const shape = (dx, dy, s = 1) => {
      g.beginPath();
      for (const [x, y, rr] of blobs) {
        g.moveTo(x + dx + rr * s, y + dy);
        g.arc(x + dx, y + dy, rr * s, 0, Math.PI * 2);
      }
    };
    const gr = g.createLinearGradient(0, 40, 0, h + 40);
    gr.addColorStop(0, '#9AA0D6');
    gr.addColorStop(0.55, '#E9B3A6');
    gr.addColorStop(1, '#FFD7A1');
    g.fillStyle = gr;
    shape(0, 0);
    g.fill();
    g.globalCompositeOperation = 'source-atop';
    g.fillStyle = 'rgba(92,96,160,0.38)';
    shape(-16, -20, 0.98);
    g.fill();
    g.fillStyle = 'rgba(70,72,140,0.25)';
    shape(-34, -40, 0.9);
    g.fill();
    // bright under-rim from the low sun
    g.globalCompositeOperation = 'source-over';
    g.save();
    shape(0, 0);
    g.clip();
    const rim = g.createLinearGradient(0, h * 0.6, 0, h + 40);
    rim.addColorStop(0, 'rgba(255,240,210,0)');
    rim.addColorStop(1, 'rgba(255,240,210,0.55)');
    g.fillStyle = rim;
    g.fillRect(0, 0, cv.width, cv.height);
    g.restore();
    const out = canvas(cv.width, cv.height),
      o = out.getContext('2d');
    o.filter = 'blur(1.2px)';
    o.drawImage(cv, 0, 0);
    return out;
  }
  let CLOUDS = null;
  function clouds() {
    if (CLOUDS) return CLOUDS;
    CLOUDS = [
      { sp: makeCloud(11, 620, 190), x: 40, y: -560, k: 0.55, v: 4 },
      { sp: makeCloud(23, 460, 150), x: 600, y: -700, k: 0.5, v: 6 },
      { sp: makeCloud(37, 760, 230), x: -260, y: -860, k: 0.45, v: 3 },
      { sp: makeCloud(41, 380, 120), x: 760, y: -430, k: 0.6, v: 7 },
      { sp: makeCloud(53, 520, 160), x: 300, y: -1080, k: 0.4, v: 5 },
      { sp: makeCloud(67, 300, 90), x: 120, y: -330, k: 0.65, v: 8 },
    ];
    return CLOUDS;
  }
  function drawClouds(ctx, yh, z, t, a = 1) {
    ctx.save();
    ctx.globalAlpha = a;
    for (const c of clouds()) {
      const s = lerp(1, z, 0.6);
      const x = ((c.x - t * c.v + 1400) % 1800) - 400;
      const y = yh + c.y * s * 0.9;
      ctx.drawImage(c.sp, x, y, c.sp.width * s, c.sp.height * s);
    }
    ctx.restore();
  }

  // ---------- mountain ridges ----------
  const RIDGES = [
    { seed: 3, base: '#AEB7D4', top: '#8F9BC6', peak: 430, freq: 0.0024, lit: 0.42 },
    { seed: 5, base: '#7E8CBA', top: '#5F6DA0', peak: 330, freq: 0.0036, lit: 0.4 },
    { seed: 8, base: '#4B5880', top: '#37436A', peak: 230, freq: 0.005, lit: 0.36 },
    { seed: 13, base: '#2B3849', top: '#222E40', peak: 140, freq: 0.0068, lit: 0.3 },
  ];
  function ridged(x, oct, seed) {
    let v = 0, a = 0.55, f = 1, n = 0;
    for (let i = 0; i < oct; i++) {
      const r = 1 - Math.abs(noise1(x * f, seed + i * 13));
      v += a * r * r;
      n += a;
      a *= 0.5;
      f *= 2.1;
    }
    return v / n;
  }
  function ridgeH(rd, x) {
    const big = 0.5 + 0.5 * fbm1(x * rd.freq * 0.35 + rd.seed, 3, rd.seed + 3);
    const r = ridged(x * rd.freq + rd.seed * 3.7, 5, rd.seed);
    return rd.peak * (0.18 + 0.5 * big + 0.55 * r * (0.5 + big));
  }
  function makeRidge(rd) {
    const W = 1500,
      Hh = Math.round(rd.peak * 1.35 + 140);
    const cv = canvas(W, Hh),
      g = cv.getContext('2d');
    const hs = [];
    for (let x = 0; x <= W; x++) hs.push(ridgeH(rd, x));
    const prof = (dx, dy) => {
      g.beginPath();
      g.moveTo(-40, Hh + 10);
      for (let x = 0; x <= W; x++) g.lineTo(x + dx, Hh - hs[x] + dy);
      g.lineTo(W + 40, Hh + 10);
      g.closePath();
    };
    // lit pass (faces towards the low sun on the right)
    const lit = g.createLinearGradient(0, Hh - rd.peak * 1.3, 0, Hh);
    lit.addColorStop(0, mix(rd.top, '#FFB880', rd.lit));
    lit.addColorStop(1, mix(rd.base, '#F3B58A', rd.lit * 0.6));
    g.fillStyle = lit;
    prof(0, 0);
    g.fill();
    // shadow pass: same profile shifted left/down covers everything but the lit faces
    g.save();
    prof(0, 0);
    g.clip();
    const sh = g.createLinearGradient(0, Hh - rd.peak * 1.3, 0, Hh);
    sh.addColorStop(0, rd.top);
    sh.addColorStop(1, rd.base);
    g.fillStyle = sh;
    prof(-rd.peak * 0.09 - 6, rd.peak * 0.035 + 2);
    g.fill();
    // subtle second, softer shading band
    g.fillStyle = 'rgba(20,24,56,0.12)';
    prof(-rd.peak * 0.22 - 10, rd.peak * 0.09 + 4);
    g.fill();
    // base haze
    const hz = g.createLinearGradient(0, Hh - 170, 0, Hh);
    hz.addColorStop(0, 'rgba(242,186,150,0)');
    hz.addColorStop(1, 'rgba(242,186,150,0.42)');
    g.fillStyle = hz;
    g.fillRect(0, Hh - 170, W, 170);
    g.restore();
    return { cv, Hh, W };
  }
  let RS = null;
  const ridges = () => RS || (RS = RIDGES.map(makeRidge));
  // draw ridge i with its base at y, scaled by z, horizontally offset by ox
  function drawRidge(ctx, i, y, z, ox = 0) {
    const r = ridges()[i];
    const w = r.W * z,
      h = r.Hh * z;
    ctx.drawImage(r.cv, -210 * z + ox + (1 - z) * 540, y - h, w, h);
  }

  // ---------- trees (cerrado umbrella canopies) ----------
  function tree(ctx, x, y, s, t, seed = 0, col = '#1E2A2C', lit = '#B27A4C') {
    const r = rng(seed * 31 + 7);
    const sway = Math.sin(t * 1.3 + seed) * 0.025 + 0.015 * Math.sin(t * 3.1 + seed * 2);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    // trunk
    ctx.strokeStyle = col;
    ctx.lineCap = 'round';
    ctx.lineWidth = 5;
    const th = 70 + r() * 30;
    const lean = (r() - 0.5) * 18;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(lean * 0.3, -th * 0.5, lean + sway * 60, -th);
    ctx.stroke();
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(lean * 0.5, -th * 0.6);
    ctx.lineTo(lean * 0.5 - 22, -th * 0.95);
    ctx.moveTo(lean * 0.6, -th * 0.7);
    ctx.lineTo(lean * 0.6 + 26, -th * 0.98);
    ctx.stroke();
    // canopy clumps
    const cx = lean + sway * 80,
      cy = -th - 12;
    const clumps = 6 + ((r() * 4) | 0);
    const pts = [];
    for (let i = 0; i < clumps; i++) {
      const a = (i / clumps) * Math.PI;
      pts.push([cx + Math.cos(a + Math.PI) * (40 + r() * 18), cy - Math.sin(a) * (12 + r() * 10) + r() * 6, 20 + r() * 12]);
    }
    ctx.fillStyle = col;
    ctx.beginPath();
    for (const [px, py, pr] of pts) {
      ctx.moveTo(px + pr, py);
      ctx.ellipse(px, py, pr, pr * 0.72, 0, 0, Math.PI * 2);
    }
    ctx.ellipse(cx, cy + 4, 58, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    // warm rim on the sun side (right)
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = rgba(lit, 0.32);
    ctx.beginPath();
    for (const [px, py, pr] of pts) {
      ctx.moveTo(px + pr + 6, py - 3);
      ctx.ellipse(px + 7, py - 4, pr * 0.55, pr * 0.4, 0, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.restore();
  }

  // ---------- grass fringe ----------
  function grass(ctx, y, t, o = {}) {
    const n = o.n || 260,
      hmax = o.h || 80,
      seed = o.seed || 1;
    const wind = o.wind == null ? 1 : o.wind;
    ctx.save();
    ctx.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const hx = hash(i * 13 + seed);
      const x = (o.x0 || -20) + ((o.x1 || DG.W + 20) - (o.x0 || -20)) * ((i + hx * 0.8) / n);
      const h = hmax * (0.45 + 0.55 * hash(i * 7 + seed + 1));
      const gust = 0.5 + 0.5 * Math.sin(t * 0.9 - x * 0.004);
      const bend = (0.18 + 0.32 * gust) * wind * (0.8 + 0.4 * Math.sin(t * 2.3 + i * 1.7)) + (hash(i + seed * 3) - 0.5) * 0.3;
      const tx = x + Math.sin(bend) * h * 0.9,
        ty = y - Math.cos(bend) * h;
      const shade = hash(i * 3 + seed + 2);
      ctx.strokeStyle = shade > 0.8 ? o.lit || '#C9A15A' : shade > 0.35 ? o.c1 || '#3E4A2A' : o.c2 || '#2A3320';
      ctx.lineWidth = (o.w || 4) * (0.6 + 0.6 * hash(i * 5 + seed));
      ctx.beginPath();
      ctx.moveTo(x, y + 4);
      ctx.quadraticCurveTo(x + Math.sin(bend * 0.4) * h * 0.4, y - h * 0.55, tx, ty);
      ctx.stroke();
    }
    ctx.restore();
  }

  // pollen / dust motes in sunlight
  function motes(ctx, t, n = 60, a = 1, area = [0, 300, DG.W, 1500]) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < n; i++) {
      const sx = hash(i * 17 + 1),
        sy = hash(i * 23 + 2),
        sp = 8 + 20 * hash(i + 5);
      const x = area[0] + ((sx * area[2] + t * sp * 2.2 + Math.sin(t * 0.7 + i) * 18) % area[2]);
      const y = area[1] + ((sy * area[3] - t * sp * 0.4 + 9999 * area[3]) % area[3]);
      const tw = 0.5 + 0.5 * Math.sin(t * 2.5 + i * 3.3);
      ctx.fillStyle = `rgba(255,226,170,${0.5 * tw * a})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.4 + 2.2 * hash(i * 9), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function birds(ctx, t, yh, z, a = 1) {
    ctx.save();
    ctx.strokeStyle = `rgba(30,30,50,${0.7 * a})`;
    ctx.lineWidth = 2.2;
    for (let i = 0; i < 5; i++) {
      const x = ((180 + i * 60 + t * (38 + i * 3)) % 1300) - 100;
      const y = yh - 560 * z - i * 22 + Math.sin(t * 0.8 + i) * 10;
      const f = Math.sin(t * 9 + i * 1.7) * 7;
      ctx.beginPath();
      ctx.moveTo(x - 11, y - f);
      ctx.quadraticCurveTo(x - 4, y - 3, x, y);
      ctx.quadraticCurveTo(x + 4, y - 3, x + 11, y - f);
      ctx.stroke();
    }
    ctx.restore();
  }

  /* Composite landscape. yh = horizon (screen y), z = scale, strip = height of
     the visible ground strip below the horizon (0 = eye at ground level). */
  function landscape(ctx, t, o) {
    const yh = o.yh,
      z = o.z,
      strip = o.strip || 0;
    sky(ctx, yh, 0, o.mood || 0);
    sun(ctx, 790, yh - 150 * z, 44 * z, o.sunA == null ? 1 : o.sunA);
    rays(ctx, 790, yh - 150 * z, t, (o.rays == null ? 1 : o.rays) * 0.9);
    drawClouds(ctx, yh, z, t, 0.95);
    birds(ctx, t, yh, z, o.birds == null ? 1 : o.birds);
    for (let i = 0; i < 4; i++) drawRidge(ctx, i, yh + 4 * z + i * 2, z * (1 + i * 0.08), -t * (1.2 + i * 1.6));
    // distant tree line on the horizon
    for (let i = 0; i < 16; i++) {
      const x = ((i * 97 + 40) % 1180) - 50;
      tree(ctx, x, yh + 2, z * (0.28 + 0.12 * hash(i)), t, i + 50, '#1F2B33', '#9C6E52');
    }
    // ground strip (receding terrain)
    if (strip > 1) {
      const gg = ctx.createLinearGradient(0, yh, 0, yh + strip);
      gg.addColorStop(0, '#5B5A4A');
      gg.addColorStop(0.08, '#4A5233');
      gg.addColorStop(0.5, '#3A4626');
      gg.addColorStop(1, '#2C361C');
      ctx.fillStyle = gg;
      ctx.fillRect(0, yh, DG.W, strip + 2);
      // soft field patches + warm light from the sun side
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, yh, DG.W, strip + 2);
      ctx.clip();
      for (let b = 0; b < 14; b++) {
        const d = hash(b * 7 + 1);
        const yy = yh + strip * Math.pow(d, 1.5);
        const rx = 160 + 420 * d, ry = 8 + 70 * d * d;
        ctx.fillStyle = b % 3 ? 'rgba(18,28,14,0.16)' : 'rgba(205,170,96,0.11)';
        ctx.beginPath();
        ctx.ellipse(hash(b * 3 + 2) * DG.W, yy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      const wl = ctx.createRadialGradient(820, yh, 10, 820, yh, Math.max(500, strip * 1.2));
      wl.addColorStop(0, 'rgba(255,190,120,0.32)');
      wl.addColorStop(1, 'rgba(255,190,120,0)');
      ctx.fillStyle = wl;
      ctx.fillRect(0, yh, DG.W, strip + 2);
      // bushes
      for (let i = 0; i < 26; i++) {
        const d = 0.08 + 0.92 * hash(i * 11 + 4);
        const yy = yh + strip * Math.pow(d, 1.5);
        const bx = hash(i * 13 + 5) * DG.W, br = (6 + 26 * d) * z;
        ctx.fillStyle = 'rgba(22,32,20,0.85)';
        ctx.beginPath();
        ctx.ellipse(bx, yy, br * 1.6, br * 0.8, 0, Math.PI, 0);
        ctx.ellipse(bx + br, yy, br * 1.1, br * 0.6, 0, Math.PI, 0);
        ctx.fill();
      }
      ctx.restore();
      // mid trees on the strip
      for (let i = 0; i < 7; i++) {
        const d = 0.18 + 0.5 * hash(i * 5 + 3);
        const yy = yh + strip * Math.pow(d, 1.4);
        tree(ctx, ((i * 173 + 90) % 1150) - 40, yy, z * (0.5 + 1.3 * d), t, i + 10);
      }
      grass(ctx, yh + strip * 0.55, t, { n: 140, h: 26 * z, w: 2.5, seed: 9 });
    }
  }

  DG.LAND = { sky, sun, rays, drawClouds, drawRidge, tree, grass, motes, birds, landscape, ridges, clouds };
})();
