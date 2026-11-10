/* Illustrative geological column shared by every scene.
   World coords: x in metres (0 = borehole), y = depth in metres (down = +).
   The same colour functions paint the big cross-section, the close-ups around
   the bit and the drill-core cylinders, so a core always looks like the layer
   it came from. All depths are ILLUSTRATIVE. */
(function () {
  const DG = window.DG;
  const { clamp, lerp, smooth, fbm1, fbm2, noise2, cell2, hash, hexRgb, mixRgb, canvas, rng } = DG;

  const surface = (x) => 0.35 * fbm1(x * 0.05 + 3.1, 3, 2);
  const TOPS = [
    (x) => surface(x),
    (x) => 6 + 0.04 * x + 1.6 * fbm1(x * 0.06, 3, 11),
    (x) => 28 + 0.08 * x + 4.0 * fbm1(x * 0.045, 5, 21),
    (x) => 95 - 0.32 * x + 2.0 * fbm1(x * 0.05, 4, 31),
    (x) => 160 + 0.12 * x + 6.0 * fbm1(x * 0.03, 5, 41),
  ];
  const UNITS = [
    { id: 'solo', label: 'SOLO', color: '#7b3f22' },
    { id: 'saprolito', label: 'ROCHA ALTERADA', color: '#C97148' },
    { id: 'gnaisse', label: 'ROCHA SÃ', color: '#5d6880' },
    { id: 'anfibolito', label: 'OUTRA LITOLOGIA', color: '#3f5f54' },
    { id: 'granito', label: 'GRANITO', color: '#b89590' },
  ];
  function topsAt(x) {
    const t = TOPS.map((f) => f(x));
    for (let i = 1; i < t.length; i++) t[i] = Math.max(t[i], t[i - 1] + 0.6);
    return t;
  }
  function unitAt(x, y) {
    const t = topsAt(x);
    let u = 0;
    for (let i = 0; i < t.length; i++) if (y >= t[i]) u = i;
    return u;
  }

  // ---- features ----
  const VEIN = { depth: 119.1, slope: 0.25, half: 0.5, halo: 0.75 };
  const veinCenter = (x) => VEIN.depth + VEIN.slope * x + 0.9 * fbm1(x * 0.08, 3, 51);
  const veinHalf = (x) => VEIN.half * (0.75 + 0.6 * (0.5 + 0.5 * fbm1(x * 0.11, 2, 57)));
  const FZONE = { top: 64, bottom: 80 };
  // fracture traces (world metres): deterministic list
  const FRACTURES = [];
  (function () {
    const r = rng(777);
    for (let i = 0; i < 40; i++) {
      const setA = r() < 0.75;
      const cx = (r() * 2 - 1) * 50;
      const cy = lerp(FZONE.top, FZONE.bottom, r()) + 0.1 * cx;
      const ang = (setA ? 0.5 : -1.05) + (r() - 0.5) * 0.18;
      const len = 5 + r() * 14;
      FRACTURES.push({ cx, cy, ang, len, seed: i, w: 0.16 + r() * 0.2 });
    }
    [[-6, 117.3, 0.5, 7], [8, 121.2, -0.4, 8], [-14, 47, 0.45, 10], [26, 52, 0.5, 9], [12, 135, 0.3, 10], [-20, 150, -0.7, 9], [18, 185, 0.5, 11], [-30, 196, 0.45, 12], [-38, 40, -0.9, 8]].forEach(
      ([cx, cy, ang, len], k) => FRACTURES.push({ cx, cy, ang, len, seed: 100 + k, w: 0.2 })
    );
  })();
  // fracture depths along the hole (for core breaks), illustrative
  const CORE_BREAKS = [
    64.6, 65.3, 66.1, 66.4, 67.2, 68.0, 68.3, 69.1, 70.2, 70.5, 71.4, 72.6, 73.0, 74.1, 75.3, 76.0, 77.2, 78.5, 79.4,
    116.55, 116.95, 117.35, 117.8, 118.15, 118.42, 118.6, 119.05, 119.6, 119.85, 120.05, 120.4, 120.8, 121.1, 121.4,
  ];

  // ---- colour functions (u,v = pattern coords; x,y = metres) ----
  const RGB = (h) => hexRgb(h);
  const P = {
    soilTop: RGB('#3a2516'),
    soil: RGB('#7b3f22'),
    soil2: RGB('#A34A28'),
    pebble: RGB('#8d7a66'),
    sap: RGB('#C97148'),
    sapL: RGB('#DFA36B'),
    sapD: RGB('#A9532F'),
    kaolin: RGB('#E6CFAF'),
    gnL: RGB('#9AA3B5'),
    gnM: RGB('#5D6880'),
    gnD: RGB('#353C4D'),
    anM: RGB('#4A6A5E'),
    anD: RGB('#263A34'),
    anL: RGB('#7A978A'),
    hbl: RGB('#1B2925'),
    grBase: RGB('#B89590'),
    kfs: RGB('#CF9B8C'),
    qtz: RGB('#CED3D6'),
    plg: RGB('#E7E2DB'),
    bio: RGB('#2E2A2C'),
    vein: RGB('#E9EEF0'),
    vein2: RGB('#BFCBD2'),
    sulf: RGB('#E2B441'),
    sulfHi: RGB('#FFF1B5'),
    alt: RGB('#B8B47A'),
    deep: RGB('#14213F'),
    frac: RGB('#12151B'),
    rust: RGB('#8A4B2A'),
  };

  function colSoil(x, y, u, v) {
    const m = fbm2(u * 0.9, v * 0.9, 3, 3);
    let c = mixRgb(P.soil, P.soil2, 0.5 + 0.5 * m);
    c = mixRgb(P.soilTop, c, smooth(0.0, 1.1, y - surface(x)));
    const cl = cell2(u * 1.7, v * 1.7, 5);
    if (cl.d1 < 0.16 + 0.08 * cl.id) c = mixRgb(P.pebble, P.soilTop, cl.id * 0.6);
    return c;
  }
  function colSap(x, y, u, v) {
    const m = fbm2(u * 0.35, v * 0.35, 4, 7);
    let c = m > 0 ? mixRgb(P.sap, P.sapL, m * 1.2) : mixRgb(P.sap, P.sapD, -m * 1.3);
    const ph = (v + 0.25 * u) * 1.5 + 2.4 * fbm2(u * 0.08, v * 0.08, 3, 8);
    const s1 = Math.sin(ph) + 0.4 * Math.sin(ph * 2.6);
    c = mixRgb(c, s1 > 0.7 ? P.sapL : P.sapD, 0.18 * smooth(0.4, 1.1, Math.abs(s1)));
    const ir = fbm2(u * 0.6, v * 0.6, 3, 10);
    if (ir > 0.42) c = mixRgb(c, [128, 44, 22], 0.5 * smooth(0.42, 0.6, ir));
    const vl = Math.abs(Math.sin((v - 0.6 * u) * 0.7 + 1.5 * fbm2(u * 0.1, v * 0.1, 2, 6)));
    if (vl < 0.035) c = mixRgb(c, P.kaolin, 0.6);
    const cl = cell2(u * 1.2, v * 1.2, 9);
    if (cl.d1 < 0.08 + 0.05 * cl.id) c = mixRgb(c, P.kaolin, 0.6);
    return c;
  }
  function colGneiss(x, y, u, v) {
    // phase grows monotonically with depth (no folds): bands undulate, pinch and swell
    const warp = 2.2 * fbm1(u * 0.022, 3, 13) + 0.18 * fbm2(u * 0.12, v * 0.12, 2, 15);
    const ph = (v + 0.18 * u) * 1.45 + warp;
    const b = Math.sin(ph) + 0.45 * Math.sin(ph * 2.7 + 1.3) + 0.12 * fbm2(u * 0.8, v * 1.6, 2, 12);
    const thrL = 0.8 + 0.18 * fbm2(u * 0.06, v * 0.2, 2, 11);
    let c;
    if (b > thrL) c = mixRgb(P.gnM, P.gnL, smooth(thrL, thrL + 0.3, b));
    else if (b < -0.55) c = mixRgb(P.gnM, P.gnD, smooth(-0.55, -0.95, b));
    else c = mixRgb(P.gnM, P.gnD, 0.15 * smooth(0.2, -0.55, b));
    const tone = 1 + 0.1 * fbm2(u * 0.04, v * 0.04, 2, 19);
    const f = (1 + fbm2(u * 4, v * 4, 2, 14) * 0.07) * tone;
    return [c[0] * f, c[1] * f, c[2] * f];
  }
  function colAmph(x, y, u, v) {
    const ph = (v - 0.35 * u) * 2.4 + 1.3 * fbm2(u * 0.2, v * 0.2, 3, 17);
    const b = Math.sin(ph);
    let c = b > 0.55 ? mixRgb(P.anM, P.anL, smooth(0.55, 1, b) * 0.6) : b < -0.6 ? mixRgb(P.anM, P.anD, 0.6) : P.anM;
    const cf = DET >= 8 ? 13 : 1.5;
    const cl = cell2(u * cf, (v - 0.35 * u) * cf * 1.6, 19);
    const kk = DET >= 8 ? 0.38 : 0.75;
    if (cl.id < 0.22) c = mixRgb(c, P.hbl, kk);
    else if (cl.id > 0.9) c = mixRgb(c, P.anL, kk * 0.7);
    const f = fbm2(u * 3, v * 3, 2, 18) * 0.08;
    return [c[0] * (1 + f), c[1] * (1 + f), c[2] * (1 + f)];
  }
  function colGranite(x, y, u, v) {
    const cf = DET >= 8 ? 3 : 0.9;
    const cl = cell2(u * cf, v * cf, 23);
    let c;
    if (cl.id < 0.36) c = P.kfs;
    else if (cl.id < 0.62) c = P.qtz;
    else if (cl.id < 0.86) c = P.plg;
    else c = P.bio;
    const edge = smooth(0.0, 0.12, cl.d2 - cl.d1);
    c = mixRgb(mixRgb(c, P.bio, 0.35), c, edge);
    const f = fbm2(u * 0.12, v * 0.12, 3, 24) * 0.12;
    return mixRgb([c[0] * (1 + f), c[1] * (1 + f), c[2] * (1 + f)], P.grBase, 0.25);
  }
  const UNIT_COL = [colSoil, colSap, colGneiss, colAmph, colGranite];

  function veinCol(u, v, d, half) {
    const cl = cell2(u * 6, v * 6, 61);
    let c = mixRgb(P.vein, P.vein2, 0.5 + 0.5 * fbm2(u * 1.5, v * 1.5, 2, 62));
    c = mixRgb(c, P.vein2, smooth(half * 0.7, half, Math.abs(d)) * 0.6); // comb edge
    if (cl.id > 0.86 && cl.d1 < 0.28) c = mixRgb(P.sulf, P.sulfHi, smooth(0.28, 0.05, cl.d1) * 0.7);
    return c;
  }

  /* Colour at world (x,y). df = detail factor (pattern scale), ex = x exaggeration
     for geometric features (used by core strips so veins look oblique). */
  let DET = 1;
  function colorAt(x, y, df = 1, ex = 1, tops = null, vx = 1) {
    DET = df;
    const xf = x * ex;
    const t = tops || topsAt(xf);
    let ui = 0;
    for (let i = 0; i < t.length; i++) if (y >= t[i]) ui = i;
    const u = x * df,
      v = y * df;
    let c = UNIT_COL[ui](x, y, u, v);
    // gradational weathering front (saprolite → gneiss)
    if (ui === 2) c = mixRgb(colSap(x, y, u, v), c, smooth(0, 2.5, y - t[2]));
    // alteration halo + vein
    const vc = veinCenter(xf),
      vh = veinHalf(xf) * vx;
    const d = y - vc;
    const ad = Math.abs(d);
    const halo = VEIN.halo * vx;
    if (ad < vh + halo) c = mixRgb(c, P.alt, 0.55 * smooth(vh + halo, vh, ad));
    if (ad < vh) c = veinCol(u, v, d, vh);
    // contacts: dark line with lit upper edge
    for (let i = 1; i < t.length; i++) {
      const dd = y - t[i];
      if (Math.abs(dd) < 0.35 / Math.max(1, df * 0.25)) {
        const k = 1 - Math.abs(dd) / (0.35 / Math.max(1, df * 0.25));
        c = dd > 0 ? mixRgb(c, P.frac, 0.45 * k) : mixRgb(c, [255, 240, 220], 0.12 * k);
      }
    }
    return c;
  }

  /* Paint a world region into a canvas. Returns {cv, x0, y0, s}. */
  function renderRegion(x0, x1, y0, y1, s, o = {}) {
    const w = Math.round((x1 - x0) * s),
      h = Math.round((y1 - y0) * s);
    const cv = canvas(w, h),
      g = cv.getContext('2d');
    const img = g.createImageData(w, h);
    const D = img.data;
    const df = o.df || 1;
    const deepK = o.deep == null ? 0.42 : o.deep;
    for (let px = 0; px < w; px++) {
      const x = x0 + (px + 0.5) / s;
      const tops = topsAt(x);
      const surf = tops[0];
      for (let py = 0; py < h; py++) {
        const y = y0 + (py + 0.5) / s;
        const k = (py * w + px) * 4;
        if (y < surf) {
          D[k + 3] = 0;
          continue;
        }
        let c = colorAt(x, y, df, 1, tops, o.veinX || 1);
        const dk = deepK * smooth(15, 230, y);
        c = mixRgb(c, P.deep, dk);
        const n = 1 + 0.04 * noise2(px * 0.7, py * 0.7, 99);
        D[k] = c[0] * n;
        D[k + 1] = c[1] * n;
        D[k + 2] = c[2] * n;
        D[k + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
    // vector overlays in world units
    g.save();
    g.scale(s, s);
    g.translate(-x0, -y0);
    drawFractures(g, s, x0, x1, y0, y1);
    drawSoilDetails(g, s, x0, x1, y0, y1);
    g.restore();
    return { cv, x0, y0, x1, y1, s };
  }

  function fracturePath(g, f) {
    const r = rng(f.seed * 13 + 5);
    const n = 9;
    const dx = Math.cos(f.ang),
      dy = Math.sin(f.ang);
    g.beginPath();
    for (let i = 0; i <= n; i++) {
      const t = i / n - 0.5;
      const j = (r() - 0.5) * f.len * 0.08;
      const x = f.cx + dx * t * f.len - dy * j,
        y = f.cy + dy * t * f.len + dx * j;
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    }
  }
  function drawFractures(g, s, x0, x1, y0, y1) {
    g.lineCap = 'round';
    g.lineJoin = 'round';
    for (const f of FRACTURES) {
      if (f.cx + f.len < x0 || f.cx - f.len > x1 || f.cy + f.len < y0 || f.cy - f.len > y1) continue;
      fracturePath(g, f);
      g.strokeStyle = 'rgba(120,62,34,0.30)';
      g.lineWidth = Math.max(f.w * 4, 4 / s);
      g.stroke();
      fracturePath(g, f);
      g.strokeStyle = 'rgba(10,11,15,0.95)';
      g.lineWidth = Math.max(f.w, 2.2 / s);
      g.stroke();
    }
  }
  function drawSoilDetails(g, s, x0, x1, y0, y1) {
    if (y0 > 7) return;
    const r = rng(4242);
    // roots
    g.strokeStyle = 'rgba(40,26,16,0.75)';
    g.lineCap = 'round';
    for (let i = 0; i < 90; i++) {
      const x = lerp(-80, 80, r());
      if (x < x0 - 2 || x > x1 + 2) {
        r(); r(); r();
        continue;
      }
      let px = x,
        py = surface(x) + 0.05;
      const len = 0.4 + r() * 1.2;
      g.lineWidth = Math.max(0.025, 1.2 / s) * (0.5 + r());
      g.beginPath();
      g.moveTo(px, py);
      for (let k = 0; k < 5; k++) {
        px += (r() - 0.5) * 0.35;
        py += len / 5;
        g.lineTo(px, py);
      }
      g.stroke();
    }
  }

  /* Drill-core strip: vertical = depth (top→bottom), horizontal = across the core.
     Painted with the detail-scale texture of the unit at the borehole. */
  function coreStrip(d0, d1, s, wPx, o = {}) {
    const h = Math.round((d1 - d0) * s);
    const cv = canvas(wPx, h),
      g = cv.getContext('2d');
    const img = g.createImageData(wPx, h);
    const D = img.data;
    const df = o.df || 30;
    const rad = o.radius || 0.032; // metres
    const ex = o.ex || 14;
    for (let px = 0; px < wPx; px++) {
      const xc = ((px + 0.5) / wPx - 0.5) * 2 * rad;
      const tops = topsAt(xc * ex);
      for (let py = 0; py < h; py++) {
        const y = d0 + (py + 0.5) / s;
        const c = colorAt(xc, y, df, ex, tops);
        const k = (py * wPx + px) * 4;
        D[k] = c[0];
        D[k + 1] = c[1];
        D[k + 2] = c[2];
        D[k + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
    return cv;
  }

  // detail-scale rock patch around the hole at depth (for close-ups)
  function rockPatch(xm0, xm1, ym0, ym1, s, df = 30, o = {}) {
    const w = Math.round((xm1 - xm0) * s),
      h = Math.round((ym1 - ym0) * s);
    const cv = canvas(w, h),
      g = cv.getContext('2d');
    const img = g.createImageData(w, h);
    const D = img.data;
    const ex = o.ex || 14;
    for (let px = 0; px < w; px++) {
      const x = xm0 + (px + 0.5) / s;
      const tops = topsAt(x * ex);
      for (let py = 0; py < h; py++) {
        const y = ym0 + (py + 0.5) / s;
        const c = colorAt(x, y, df, ex, tops);
        const k = (py * w + px) * 4;
        const n = 1 + 0.035 * noise2(px * 0.5, py * 0.5, 7);
        D[k] = c[0] * n;
        D[k + 1] = c[1] * n;
        D[k + 2] = c[2] * n;
        D[k + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
    return cv;
  }

  // simple named cache
  const cache = {};
  function cached(key, fn) {
    if (!cache[key]) cache[key] = fn();
    return cache[key];
  }

  // unit index along the hole (x = 0) for a depth
  const unitAtHole = (y) => unitAt(0, y);
  // depth of unit tops at the hole
  const holeTops = () => topsAt(0);

  DG.GEO = {
    UNITS, TOPS, topsAt, unitAt, unitAtHole, holeTops, surface, colorAt, renderRegion, coreStrip, rockPatch,
    VEIN, veinCenter, veinHalf, FZONE, FRACTURES, CORE_BREAKS, cached, P,
  };
})();
