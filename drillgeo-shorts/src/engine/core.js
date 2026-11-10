/* DrillGeo Shorts — core math, easing, deterministic noise, color utilities.
   Everything here is pure: the same inputs always give the same output, which
   is what lets any frame be rendered in isolation (parallel workers, stills). */
(function () {
  const DG = (window.DG = window.DG || {});
  DG.W = 1080;
  DG.H = 1920;
  DG.FPS = 24;
  DG.SCENES = DG.SCENES || {};

  // ---------- math ----------
  const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const inv = (a, b, v) => (b === a ? 0 : (v - a) / (b - a));
  const remap = (v, a, b, c, d) => lerp(c, d, clamp(inv(a, b, v)));
  const smooth = (e0, e1, x) => {
    const t = clamp((x - e0) / (e1 - e0));
    return t * t * (3 - 2 * t);
  };
  const seg = (t, a, b) => clamp((t - a) / (b - a)); // progress of t through [a,b]
  const fract = (x) => x - Math.floor(x);
  const TAU = Math.PI * 2;

  const E = {
    linear: (t) => t,
    inQuad: (t) => t * t,
    outQuad: (t) => 1 - (1 - t) * (1 - t),
    inOutQuad: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
    inCubic: (t) => t * t * t,
    outCubic: (t) => 1 - Math.pow(1 - t, 3),
    inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    inOutQuint: (t) => (t < 0.5 ? 16 * t ** 5 : 1 - Math.pow(-2 * t + 2, 5) / 2),
    outQuint: (t) => 1 - Math.pow(1 - t, 5),
    inQuint: (t) => t ** 5,
    inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
    outSine: (t) => Math.sin((t * Math.PI) / 2),
    inSine: (t) => 1 - Math.cos((t * Math.PI) / 2),
    outExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    inExpo: (t) => (t === 0 ? 0 : Math.pow(2, 10 * t - 10)),
    inOutExpo: (t) =>
      t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2,
    outBack: (t, s = 1.70158) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2),
    outElastic: (t) =>
      t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1,
  };

  // eased progress helper: ep(t, a, b, 'inOutCubic')
  const ep = (t, a, b, ease = 'inOutCubic') => E[ease](seg(t, a, b));
  // pulse that rises over [a,a+r], holds, falls over [b-r,b]
  const pulse = (t, a, b, r = 0.3) => Math.min(smooth(a, a + r, t), 1 - smooth(b - r, b, t));

  /* angle of something accelerating from 0 to `speed` (units/s) over `ramp`
     seconds starting at t0 (smoothstep), then constant; optional stop ramp */
  function rampAngle(t, t0, ramp, speed, t1 = Infinity, ramp1 = 1) {
    const I = (x) => (x <= 0 ? 0 : x >= 1 ? 0.5 + (x - 1) : x * x * x - (x * x * x * x) / 2);
    let a = speed * ramp * I((t - t0) / ramp);
    if (t > t1) {
      // decelerate: subtract the integral of (1 - smoothstep) beyond t1
      const x = Math.min(1, (t - t1) / ramp1);
      const full = speed * ramp * I((t1 - t0) / ramp) + speed * ramp1 * (x - (x * x * x - (x * x * x * x) / 2));
      a = full;
    }
    return a;
  }

  // ---------- deterministic random ----------
  function hash(n) {
    // integer hash → [0,1)
    n = (n | 0) ^ 0x9e3779b9;
    n = Math.imul(n ^ (n >>> 16), 0x85ebca6b);
    n = Math.imul(n ^ (n >>> 13), 0xc2b2ae35);
    n ^= n >>> 16;
    return (n >>> 0) / 4294967296;
  }
  const hash2 = (x, y) => hash(Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263));
  const hash3 = (x, y, z) => hash(Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(z | 0, 2147483647));
  function rng(seed) {
    // mulberry32
    let a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ---------- value noise (smooth, fast, deterministic) ----------
  function noise1(x, seed = 0) {
    const i = Math.floor(x);
    const f = x - i;
    const u = f * f * (3 - 2 * f);
    return lerp(hash(i + seed * 7919), hash(i + 1 + seed * 7919), u) * 2 - 1;
  }
  function noise2(x, y, seed = 0) {
    const ix = Math.floor(x),
      iy = Math.floor(y);
    const fx = x - ix,
      fy = y - iy;
    const ux = fx * fx * (3 - 2 * fx),
      uy = fy * fy * (3 - 2 * fy);
    const s = seed * 1013;
    const a = hash2(ix + s, iy),
      b = hash2(ix + 1 + s, iy),
      c = hash2(ix + s, iy + 1),
      d = hash2(ix + 1 + s, iy + 1);
    return (a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy) * 2 - 1;
  }
  function fbm1(x, oct = 4, seed = 0) {
    let v = 0,
      amp = 0.5,
      f = 1,
      norm = 0;
    for (let i = 0; i < oct; i++) {
      v += amp * noise1(x * f, seed + i * 31);
      norm += amp;
      amp *= 0.5;
      f *= 2.03;
    }
    return v / norm;
  }
  function fbm2(x, y, oct = 4, seed = 0) {
    let v = 0,
      amp = 0.5,
      f = 1,
      norm = 0;
    for (let i = 0; i < oct; i++) {
      v += amp * noise2(x * f, y * f, seed + i * 17);
      norm += amp;
      amp *= 0.5;
      f *= 2.01;
    }
    return v / norm;
  }
  // cellular-ish: distance to nearest jittered point in grid (for crystals/pebbles)
  function cell2(x, y, seed = 0) {
    const ix = Math.floor(x),
      iy = Math.floor(y);
    let d1 = 9,
      d2 = 9,
      id = 0;
    for (let j = -1; j <= 1; j++)
      for (let i = -1; i <= 1; i++) {
        const cx = ix + i,
          cy = iy + j;
        const px = cx + hash3(cx, cy, seed),
          py = cy + hash3(cx, cy, seed + 1);
        const dx = px - x,
          dy = py - y;
        const d = dx * dx + dy * dy;
        if (d < d1) {
          d2 = d1;
          d1 = d;
          id = hash3(cx, cy, seed + 2);
        } else if (d < d2) d2 = d;
      }
    return { d1: Math.sqrt(d1), d2: Math.sqrt(d2), id };
  }

  // ---------- color ----------
  const _hexCache = {};
  function hexRgb(h) {
    if (_hexCache[h]) return _hexCache[h];
    let s = h.replace('#', '');
    if (s.length === 3) s = s.split('').map((c) => c + c).join('');
    const v = [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
    _hexCache[h] = v;
    return v;
  }
  const rgba = (h, a = 1) => {
    const [r, g, b] = hexRgb(h);
    return `rgba(${r},${g},${b},${a})`;
  };
  const mixRgb = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
  const mix = (h1, h2, t, a = 1) => {
    const c = mixRgb(hexRgb(h1), hexRgb(h2), clamp(t));
    return `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
  };
  const rgbStr = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

  // brand + film palette
  const C = {
    bg: '#0B0E14',
    panel: '#0F1626',
    navy: '#0F1C3D',
    blueDeep: '#1B4F9C',
    blue: '#4C9BEA',
    rock: '#A34A28',
    rockSoft: '#C97148',
    amber: '#F2A93B',
    paper: '#EDEFF3',
    paperDim: '#97A0B3',
    ink: '#0B0E14',
    steel: '#8E99A8',
    steelDark: '#3B4452',
    steelLight: '#D7DEE6',
    fluid: '#4C9BEA',
  };

  // ---------- canvas helpers ----------
  function canvas(w, h) {
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.ceil(w));
    c.height = Math.max(1, Math.ceil(h));
    return c;
  }

  Object.assign(DG, {
    clamp, lerp, inv, remap, smooth, seg, fract, TAU, E, ep, pulse, rampAngle,
    hash, hash2, hash3, rng, noise1, noise2, fbm1, fbm2, cell2,
    hexRgb, rgba, mix, mixRgb, rgbStr, C, canvas,
  });
})();
