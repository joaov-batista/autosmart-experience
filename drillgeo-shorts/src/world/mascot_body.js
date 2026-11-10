/* "Geo" v2 — DrillGeo field technician, semi-realistic adult proportions.
   Three-quarter front view (turned slightly towards the content on the right),
   clear safety glasses, white hard hat with the helix, navy uniform with
   reflective bands, work gloves. Restrained lip-sync, blinking, breathing and
   natural gestures. Units: u = half head height; origin = head centre; y down. */
(function () {
  const DG = window.DG;
  const { clamp, lerp, fract, rgba, mix, C } = DG;
  const INK = '#1A1D24';
  const SKIN = '#B07A5A', SKIN_SH = '#8C5B43', SKIN_HI = '#C89272', HAIR = '#1F1713';
  const NAVY = '#1F2D52', NAVY_SH = '#152039', NAVY_HI = '#2C3E6B', BAND = '#D5DAE2', GLOVE = '#D9A43A', GLOVE_SH = '#A87A22';

  // [upper-arm angle from straight down (outward +), forearm bend (inward −), hand]
  const G = {
    idle: { L: [0.1, -0.08, 'relax'], R: [0.1, -0.08, 'relax'] },
    wave: { L: [0.1, -0.08, 'relax'], R: [2.15, 0.55, 'open'], wave: 1 },
    point_up: { L: [0.1, -0.08, 'relax'], R: [2.35, 0.12, 'point'] },
    point_right: { L: [0.1, -0.08, 'relax'], R: [1.5, 0.1, 'point'] },
    point_down: { L: [0.1, -0.08, 'relax'], R: [0.62, 0.15, 'point'] },
    explain: { L: [0.38, -1.45, 'open'], R: [0.38, -1.45, 'open'], talk: 1 },
    explain_r: { L: [0.1, -0.08, 'relax'], R: [0.38, -1.85, 'open'], talk: 1 },
    thumbs: { L: [0.1, -0.08, 'relax'], R: [0.42, -2.0, 'thumb'] },
    hold: { L: [0.3, -1.6, 'open'], R: [0.3, -1.6, 'open'] },
    count1: { L: [0.1, -0.08, 'relax'], R: [0.42, -2.1, 'one'] },
    count2: { L: [0.1, -0.08, 'relax'], R: [0.42, -2.1, 'two'] },
    count3: { L: [0.1, -0.08, 'relax'], R: [0.42, -2.1, 'three'] },
    count4: { L: [0.1, -0.08, 'relax'], R: [0.42, -2.1, 'four'] },
  };

  const SH = { x: 1.5, y: 2.15 }; // shoulder joints
  const UA = 2.15, FA = 1.95;

  function sleeve(ctx, x0, y0, x1, y1, w0, w1) {
    const dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy) || 1;
    const nx = -dy / l, ny = dx / l;
    ctx.beginPath();
    ctx.moveTo(x0 + nx * w0, y0 + ny * w0);
    ctx.lineTo(x1 + nx * w1, y1 + ny * w1);
    ctx.arc(x1, y1, w1, Math.atan2(ny, nx), Math.atan2(-ny, -nx), false);
    ctx.lineTo(x0 - nx * w0, y0 - ny * w0);
    ctx.arc(x0, y0, w0, Math.atan2(-ny, -nx), Math.atan2(ny, nx), false);
    ctx.closePath();
    ctx.fillStyle = NAVY;
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 0.05;
    ctx.stroke();
    // shading along one side
    ctx.save();
    ctx.clip();
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = w0 * 0.7;
    ctx.beginPath();
    ctx.moveTo(x0 - nx * w0 * 0.8, y0 - ny * w0 * 0.8);
    ctx.lineTo(x1 - nx * w1 * 0.8, y1 - ny * w1 * 0.8);
    ctx.stroke();
    ctx.restore();
  }

  function glove(ctx, x, y, ang, kind, side) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ang);
    if (side < 0) ctx.scale(-1, 1);
    const fill = (path) => {
      ctx.fillStyle = GLOVE;
      ctx.fill();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 0.045;
      ctx.stroke();
    };
    const finger = (fx, fy, len, a, w = 0.13) => {
      ctx.save();
      ctx.translate(fx, fy);
      ctx.rotate(a);
      ctx.beginPath();
      DG.rr(ctx, -w / 2, -0.02, w, len, w / 2);
      fill();
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.fillRect(-w / 2, len * 0.45, w, 0.03);
      ctx.restore();
    };
    // cuff
    ctx.fillStyle = GLOVE_SH;
    ctx.beginPath();
    DG.rr(ctx, -0.27, -0.28, 0.54, 0.32, 0.08);
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 0.045;
    ctx.stroke();
    const n = { one: 1, two: 2, three: 3, four: 4 }[kind];
    const fingersOpen = kind === 'open' ? 4 : kind === 'relax' ? 4 : n || 0;
    const lens = [0.4, 0.46, 0.44, 0.36];
    // fingers (behind the palm edge)
    for (let k = 0; k < 4; k++) {
      const fx = -0.17 + k * 0.115;
      if (kind === 'point' && k === 0) finger(fx, 0.38, 0.5, 0.0);
      else if (k < fingersOpen && kind !== 'point' && kind !== 'thumb') {
        const curl = kind === 'relax' ? 0.25 : 0;
        finger(fx, 0.38, lens[k] * (1 - curl), (k - 1.5) * (kind === 'open' ? 0.09 : 0.03));
      }
    }
    // palm
    ctx.beginPath();
    ctx.moveTo(-0.24, -0.02);
    ctx.lineTo(0.24, -0.02);
    ctx.quadraticCurveTo(0.28, 0.25, 0.22, 0.46);
    ctx.lineTo(-0.22, 0.46);
    ctx.quadraticCurveTo(-0.28, 0.25, -0.24, -0.02);
    ctx.closePath();
    fill();
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(0.06, 0.0, 0.16, 0.44);
    // curled knuckles for fist-like shapes
    if (kind === 'point' || kind === 'thumb' || (n && n < 4)) {
      ctx.beginPath();
      DG.rr(ctx, -0.22 + (kind === 'point' ? 0.12 : (n || 0) * 0.115), 0.36, 0.44 - (kind === 'point' ? 0.12 : (n || 0) * 0.115), 0.16, 0.07);
      fill();
    }
    // thumb
    if (kind === 'thumb') finger(0.2, 0.05, 0.42, Math.PI + 0.25, 0.15);
    else finger(0.24, 0.14, 0.3, -0.75, 0.14);
    ctx.restore();
  }

  function arm(ctx, side, pose, br) {
    const sx = side * SH.x, sy = SH.y + br;
    const [a1, a2, hk] = pose;
    const ex = sx + Math.sin(a1) * side * UA, ey = sy + Math.cos(a1) * UA;
    const a = a1 + a2;
    const fx = Math.sin(a) * side, fy = Math.cos(a);
    const hx = ex + fx * FA, hy = ey + fy * FA;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const path = () => {
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.lineTo(hx, hy);
    };
    path();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 0.7;
    ctx.stroke();
    path();
    ctx.strokeStyle = NAVY;
    ctx.lineWidth = 0.6;
    ctx.stroke();
    // sleeve shading on the far side
    ctx.save();
    ctx.translate(side * 0.1, 0.04);
    path();
    ctx.strokeStyle = 'rgba(0,0,0,0.18)';
    ctx.lineWidth = 0.28;
    ctx.stroke();
    ctx.restore();
    // reflective band on the forearm
    ctx.save();
    ctx.strokeStyle = BAND;
    ctx.lineWidth = 0.14;
    ctx.lineCap = 'butt';
    const bx = lerp(ex, hx, 0.66), by = lerp(ey, hy, 0.66);
    ctx.beginPath();
    ctx.moveTo(bx - fy * 0.29, by + fx * 0.29);
    ctx.lineTo(bx + fy * 0.29, by - fx * 0.29);
    ctx.stroke();
    ctx.restore();
    glove(ctx, hx + fx * 0.05, hy + fy * 0.05, -Math.atan2(fx, fy), hk, side);
  }

  function head(ctx, o) {
    const t = o.t, mo = clamp(o.mouth || 0), lk = o.look || [0, 0];
    // neck
    ctx.fillStyle = SKIN_SH;
    ctx.beginPath();
    ctx.moveTo(-0.34, 0.6);
    ctx.lineTo(0.42, 0.6);
    ctx.lineTo(0.5, 1.55);
    ctx.lineTo(-0.44, 1.55);
    ctx.closePath();
    ctx.fill();
    // ear (near side)
    ctx.fillStyle = SKIN;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 0.045;
    ctx.beginPath();
    ctx.ellipse(-0.73, 0.1, 0.12, 0.23, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = SKIN_SH;
    ctx.beginPath();
    ctx.arc(-0.73, 0.1, 0.07, -1.2, 1.4);
    ctx.stroke();
    // face shape (slight three-quarter turn to the right)
    ctx.beginPath();
    ctx.moveTo(-0.7, -0.55);
    ctx.bezierCurveTo(-0.76, -0.1, -0.74, 0.25, -0.62, 0.55);
    ctx.bezierCurveTo(-0.5, 0.85, -0.18, 1.02, 0.1, 1.02);
    ctx.bezierCurveTo(0.34, 1.0, 0.56, 0.78, 0.64, 0.5);
    ctx.bezierCurveTo(0.72, 0.2, 0.74, -0.15, 0.7, -0.55);
    ctx.closePath();
    ctx.fillStyle = SKIN;
    ctx.fill();
    ctx.save();
    ctx.clip();
    // far-side shadow, cheekbone light, brim shadow, stubble
    ctx.fillStyle = 'rgba(110,62,40,0.38)';
    ctx.beginPath();
    ctx.moveTo(0.38, -0.6);
    ctx.bezierCurveTo(0.5, 0.0, 0.46, 0.5, 0.2, 1.1);
    ctx.lineTo(0.9, 1.1);
    ctx.lineTo(0.9, -0.6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = rgba(SKIN_HI, 0.5);
    ctx.beginPath();
    ctx.ellipse(-0.38, 0.3, 0.2, 0.12, -0.3, 0, Math.PI * 2);
    ctx.fill();
    const bs = ctx.createLinearGradient(0, -0.62, 0, -0.25);
    bs.addColorStop(0, 'rgba(60,35,25,0.55)');
    bs.addColorStop(1, 'rgba(60,35,25,0)');
    ctx.fillStyle = bs;
    ctx.fillRect(-1, -0.65, 2, 0.45);
    ctx.fillStyle = 'rgba(30,22,18,0.2)';
    ctx.beginPath();
    ctx.moveTo(-0.64, 0.42);
    ctx.bezierCurveTo(-0.46, 0.95, 0.3, 1.1, 0.6, 0.45);
    ctx.bezierCurveTo(0.4, 0.62, -0.25, 0.68, -0.64, 0.42);
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 0.05;
    ctx.beginPath();
    ctx.moveTo(-0.7, -0.55);
    ctx.bezierCurveTo(-0.76, -0.1, -0.74, 0.25, -0.62, 0.55);
    ctx.bezierCurveTo(-0.5, 0.85, -0.18, 1.02, 0.1, 1.02);
    ctx.bezierCurveTo(0.34, 1.0, 0.56, 0.78, 0.64, 0.5);
    ctx.bezierCurveTo(0.72, 0.2, 0.74, -0.15, 0.7, -0.55);
    ctx.stroke();
    // hair: sideburn + nape below the hat
    ctx.fillStyle = HAIR;
    ctx.beginPath();
    ctx.moveTo(-0.72, -0.6);
    ctx.lineTo(-0.7, -0.08);
    ctx.lineTo(-0.6, -0.12);
    ctx.lineTo(-0.56, -0.6);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0.7, -0.6);
    ctx.lineTo(0.69, -0.2);
    ctx.lineTo(0.62, -0.25);
    ctx.lineTo(0.6, -0.6);
    ctx.closePath();
    ctx.fill();
    // eyes (almond, calm)
    const blinkPh = fract((t + 0.37) / 4.1);
    const bl = blinkPh < 0.03 ? 1 - Math.abs(blinkPh / 0.015 - 1) : 0;
    const eyes = [[-0.31, 0.03, 0.17], [0.33, 0.02, 0.145]];
    for (const [ex, ey, hw] of eyes) {
      const op = 0.09 * (1 - bl) + 0.005;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(ex - hw, ey);
      ctx.quadraticCurveTo(ex - hw * 0.2, ey - op * 1.9, ex + hw, ey - 0.01);
      ctx.quadraticCurveTo(ex + hw * 0.1, ey + op * 1.25, ex - hw, ey);
      ctx.closePath();
      ctx.fillStyle = '#F3EEE8';
      ctx.fill();
      ctx.clip();
      const ix = ex + lk[0] * 0.05 + 0.01, iy = ey + lk[1] * 0.03 - 0.005;
      ctx.fillStyle = '#4B2E1E';
      ctx.beginPath();
      ctx.arc(ix, iy, 0.075, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#140D0A';
      ctx.beginPath();
      ctx.arc(ix, iy, 0.036, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.beginPath();
      ctx.arc(ix - 0.025, iy - 0.03, 0.017, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(90,50,35,0.35)';
      ctx.fillRect(ex - hw, ey - 0.12, hw * 2, 0.06); // lid shadow
      ctx.restore();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 0.045;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(ex - hw - 0.01, ey + 0.005);
      ctx.quadraticCurveTo(ex - hw * 0.2, ey - op * 1.9 - 0.01, ex + hw + 0.03, ey - 0.025);
      ctx.stroke();
      ctx.lineWidth = 0.02;
      ctx.strokeStyle = 'rgba(60,35,25,0.6)';
      ctx.beginPath();
      ctx.moveTo(ex - hw * 0.8, ey + 0.05);
      ctx.quadraticCurveTo(ex, ey + 0.1, ex + hw * 0.8, ey + 0.04);
      ctx.stroke();
    }
    // brows
    const raise = (o.brow || 0) * 0.06 + mo * 0.025;
    ctx.strokeStyle = HAIR;
    ctx.lineCap = 'round';
    ctx.lineWidth = 0.075;
    ctx.beginPath();
    ctx.moveTo(-0.5, -0.17 - raise);
    ctx.quadraticCurveTo(-0.32, -0.27 - raise, -0.12, -0.22 - raise);
    ctx.stroke();
    ctx.lineWidth = 0.065;
    ctx.beginPath();
    ctx.moveTo(0.18, -0.23 - raise);
    ctx.quadraticCurveTo(0.36, -0.28 - raise, 0.5, -0.19 - raise);
    ctx.stroke();
    // nose
    ctx.fillStyle = 'rgba(110,62,40,0.45)';
    ctx.beginPath();
    ctx.moveTo(0.06, -0.12);
    ctx.quadraticCurveTo(0.2, 0.18, 0.19, 0.4);
    ctx.lineTo(0.12, 0.42);
    ctx.quadraticCurveTo(0.14, 0.15, 0.04, -0.1);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(70,40,28,0.85)';
    ctx.lineWidth = 0.035;
    ctx.beginPath();
    ctx.moveTo(-0.02, 0.43);
    ctx.quadraticCurveTo(0.08, 0.48, 0.2, 0.42);
    ctx.stroke();
    // mouth (restrained lip-sync)
    const mx = 0.08, my = 0.67, mw = 0.17 + 0.02 * mo, mh = 0.015 + 0.13 * mo;
    if (mo < 0.06) {
      ctx.strokeStyle = '#5C2E24';
      ctx.lineWidth = 0.04;
      ctx.beginPath();
      ctx.moveTo(mx - mw, my - 0.01);
      ctx.quadraticCurveTo(mx, my + 0.045, mx + mw, my - 0.02);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#4A1D18';
      ctx.beginPath();
      ctx.moveTo(mx - mw, my - 0.01);
      ctx.quadraticCurveTo(mx, my - 0.035, mx + mw, my - 0.015);
      ctx.quadraticCurveTo(mx + mw * 0.7, my + mh, mx, my + mh + 0.01);
      ctx.quadraticCurveTo(mx - mw * 0.75, my + mh, mx - mw, my - 0.01);
      ctx.closePath();
      ctx.fill();
      if (mo > 0.3) {
        ctx.save();
        ctx.clip();
        ctx.fillStyle = '#EDE6DC';
        ctx.fillRect(mx - mw, my - 0.04, mw * 2, 0.045);
        ctx.restore();
      }
      ctx.strokeStyle = '#5C2E24';
      ctx.lineWidth = 0.025;
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(110,62,40,0.5)';
    ctx.lineWidth = 0.03;
    ctx.beginPath();
    ctx.moveTo(mx - 0.08, my + mh + 0.08);
    ctx.quadraticCurveTo(mx, my + mh + 0.11, mx + 0.09, my + mh + 0.08);
    ctx.stroke();
    // clear safety glasses
    ctx.strokeStyle = 'rgba(40,45,55,0.9)';
    ctx.lineWidth = 0.035;
    ctx.fillStyle = 'rgba(210,235,255,0.14)';
    ctx.beginPath();
    DG.rr(ctx, -0.55, -0.12, 0.5, 0.27, 0.1);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    DG.rr(ctx, 0.12, -0.13, 0.44, 0.26, 0.1);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-0.05, -0.03);
    ctx.quadraticCurveTo(0.04, -0.07, 0.12, -0.03);
    ctx.moveTo(-0.55, -0.02);
    ctx.lineTo(-0.72, -0.04);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.45)';
    ctx.lineWidth = 0.025;
    ctx.beginPath();
    ctx.moveTo(-0.46, 0.1);
    ctx.lineTo(-0.3, -0.08);
    ctx.moveTo(0.22, 0.09);
    ctx.lineTo(0.36, -0.08);
    ctx.stroke();
    // hard hat
    ctx.save();
    ctx.rotate(-0.03);
    ctx.fillStyle = '#F2F4F7';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 0.05;
    ctx.beginPath();
    ctx.moveTo(-0.82, -0.58);
    ctx.bezierCurveTo(-0.86, -1.62, 0.94, -1.66, 0.9, -0.58);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(140,155,175,0.35)';
    ctx.beginPath();
    ctx.ellipse(0.5, -0.95, 0.3, 0.38, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.beginPath();
    ctx.ellipse(-0.36, -1.18, 0.2, 0.09, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(150,160,175,0.8)';
    ctx.lineWidth = 0.05;
    ctx.beginPath();
    ctx.moveTo(0.06, -1.5);
    ctx.quadraticCurveTo(0.1, -1.0, 0.1, -0.6);
    ctx.stroke();
    ctx.fillStyle = '#E6E9EE';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 0.05;
    ctx.beginPath();
    ctx.ellipse(0.05, -0.57, 1.0, 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    if (DG.IMG.logo) ctx.drawImage(DG.IMG.logo, -0.42, -1.18, 0.4, 0.4);
    ctx.restore();
  }

  function torso(ctx, o, br) {
    const bot = o.full ? 6.3 : 12;
    ctx.save();
    ctx.translate(0, br);
    ctx.beginPath();
    ctx.moveTo(-0.48, 1.35);
    ctx.quadraticCurveTo(-1.35, 1.45, -1.78, 2.15);
    ctx.quadraticCurveTo(-1.62, 4.0, -1.3, 5.7);
    ctx.lineTo(-1.28, bot);
    ctx.lineTo(1.28, bot);
    ctx.lineTo(1.3, 5.7);
    ctx.quadraticCurveTo(1.62, 4.0, 1.78, 2.15);
    ctx.quadraticCurveTo(1.35, 1.45, 0.48, 1.35);
    ctx.closePath();
    ctx.fillStyle = NAVY;
    ctx.fill();
    ctx.save();
    ctx.clip();
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0.75, 1.2, 1.5, 12);
    ctx.fillStyle = rgba(NAVY_HI, 0.6);
    ctx.fillRect(-1.75, 1.6, 0.45, 5);
    // folds
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 0.05;
    for (const [x0, y0, x1, y1] of [[-1.4, 4.6, -0.6, 5.3], [1.3, 4.4, 0.7, 5.2], [-0.2, 2.6, -0.5, 3.0]]) {
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.quadraticCurveTo((x0 + x1) / 2 + 0.2, (y0 + y1) / 2, x1, y1);
      ctx.stroke();
    }
    // reflective bands: shoulder straps + two chest bands
    ctx.fillStyle = BAND;
    ctx.fillRect(-0.98, 1.4, 0.26, 2.1);
    ctx.fillRect(0.72, 1.4, 0.26, 2.1);
    ctx.fillRect(-2.3, 3.4, 4.6, 0.3);
    ctx.fillRect(-2.3, 4.95, 4.6, 0.3);
    ctx.fillStyle = C.amber;
    ctx.fillRect(-2.3, 3.52, 4.6, 0.06);
    ctx.fillRect(-2.3, 5.07, 4.6, 0.06);
    // zipper
    ctx.strokeStyle = 'rgba(200,205,215,0.6)';
    ctx.lineWidth = 0.04;
    ctx.beginPath();
    ctx.moveTo(0.02, 1.8);
    ctx.lineTo(0.05, bot);
    ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 0.05;
    ctx.stroke();
    // shirt collar
    ctx.fillStyle = NAVY_SH;
    for (const sd of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(sd * 0.1, 1.45);
      ctx.lineTo(sd * 0.62, 1.25);
      ctx.lineTo(sd * 0.55, 1.95);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    // chest patch
    if (DG.IMG.logo) ctx.drawImage(DG.IMG.logo, 0.32, 2.45, 0.34, 0.34);
    ctx.save();
    ctx.translate(0.72, 2.63);
    ctx.scale(0.0085, 0.0085);
    DG.text(ctx, 'Drill', 0, 0, { size: 24, tracking: 0, shadow: false, color: C.paper });
    DG.text(ctx, 'Geo', DG.measure(ctx, 'Drill', { size: 24, tracking: 0 }), 0, { size: 24, tracking: 0, shadow: false, color: C.blue });
    ctx.restore();
    ctx.restore();
  }

  function legs(ctx) {
    for (const sd of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(sd * 0.08, 5.95);
      ctx.lineTo(sd * 1.28, 5.95);
      ctx.quadraticCurveTo(sd * 1.22, 8.3, sd * 1.05, 10.9);
      ctx.lineTo(sd * 0.25, 10.9);
      ctx.quadraticCurveTo(sd * 0.18, 8.3, sd * 0.08, 5.95);
      ctx.closePath();
      ctx.fillStyle = NAVY_SH;
      ctx.fill();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 0.05;
      ctx.stroke();
      ctx.fillStyle = BAND;
      ctx.beginPath();
      ctx.moveTo(sd * 0.21, 9.3);
      ctx.lineTo(sd * 1.13, 9.3);
      ctx.lineTo(sd * 1.11, 9.6);
      ctx.lineTo(sd * 0.22, 9.6);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#2A2420';
      ctx.beginPath();
      DG.rr(ctx, sd > 0 ? 0.15 : -1.4, 10.8, 1.25, 0.5, 0.22);
      ctx.fill();
      ctx.stroke();
    }
    ctx.fillStyle = '#2B2F38';
    ctx.fillRect(-1.32, 5.68, 2.64, 0.3);
    ctx.fillStyle = '#C9CED4';
    ctx.fillRect(-0.18, 5.65, 0.36, 0.36);
  }

  function blendPose(a, b, k) {
    return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), k < 0.5 ? a[2] : b[2]];
  }

  function draw(ctx, o) {
    const t = o.t, u = o.u;
    const g1 = G[o.gesture] || G.idle, g0 = G[o.prev] || g1;
    const k = o.gk == null ? 1 : o.gk;
    const br = Math.sin(t * 1.7) * 0.03;
    const talk = clamp(o.mouth || 0);
    ctx.save();
    ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
    ctx.translate(o.x, o.y);
    ctx.scale(u, u);
    ctx.lineJoin = 'round';
    // soft separation halo
    ctx.save();
    ctx.scale(1, 1.4);
    const halo = ctx.createRadialGradient(0, 2.2, 0.5, 0, 2.2, 5.2);
    halo.addColorStop(0, 'rgba(8,10,18,0.5)');
    halo.addColorStop(1, 'rgba(8,10,18,0)');
    ctx.fillStyle = halo;
    ctx.fillRect(-6, -3, 12, 14);
    ctx.restore();
    if (o.full) legs(ctx);
    torso(ctx, o, br);
    const tilt = (talk - 0.25) * 0.02 + Math.sin(t * 1.9) * 0.012 + (o.tilt || 0);
    ctx.save();
    ctx.translate(0, br * 0.6);
    ctx.rotate(tilt);
    head(ctx, { t, mouth: talk, look: o.look, brow: o.brow });
    ctx.restore();
    let L = blendPose(g0.L, g1.L, k), R = blendPose(g0.R, g1.R, k);
    if (g1.wave) R = [R[0], R[1] + Math.sin(t * 7) * 0.28 * k, R[2]];
    if (g1.talk) {
      const w = Math.sin(t * 2.6) * 0.09 * k * (0.4 + talk);
      L = [L[0] + w * 0.3, L[1] - w, L[2]];
      R = [R[0] - w * 0.3, R[1] + w, R[2]];
    }
    arm(ctx, -1, L, br);
    arm(ctx, 1, R, br);
    ctx.restore();
  }

  DG.MASCOT_BODY = { draw, G };
})();
