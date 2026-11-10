/* Diamond core bit + wireline core barrel (illustrative HQ-like proportions).
   Local coordinates in millimetres: x = 0 on the axis, y = 0 at the bit face,
   y up = negative. Scenes translate to the face and scale to px/mm.
   Rules (see docs/TECHNICAL_REVIEW.md): the crown is an annular ring with
   waterways, it cuts a kerf and leaves the core standing in the centre; the
   outer tube rotates, the inner tube does not; fluid passes between the tubes
   and exits at the waterways; it never flows through the core. */
(function () {
  const DG = window.DG;
  const { clamp, lerp, hash, rgba, mix, glow, metalGrad, C, rng } = DG;
  const INK = '#0B0E14';

  const G = {
    Rh: 48.4, // hole wall
    Ro: 48.0, // crown OD / 2
    Ri: 31.75, // crown ID / 2 = core radius
    matrixH: 12,
    bodyTop: -48,
    shellTop: -190,
    otR: 44.5, // outer tube OD/2
    otRi: 38.5, // outer tube ID/2
    itR: 36.5, // inner tube OD/2
    itRi: 33.5, // inner tube ID/2
    rodR: 44.45,
    rodRi: 38.9,
    nWW: 8, // waterways
  };

  // ---------------- exterior (side view) ----------------
  function cylBand(ctx, R, y0, y1, base, hi, lo, spec = 0.34) {
    ctx.fillStyle = metalGrad(ctx, -R, R, base, hi, lo, spec);
    ctx.fillRect(-R, y0, 2 * R, y1 - y0);
  }
  // features that rotate around the axis: draw at angle a (0 = facing viewer)
  function around(n, rot, fn) {
    for (let i = 0; i < n; i++) {
      const a = rot + (i * Math.PI * 2) / n;
      const s = Math.sin(a),
        c = Math.cos(a);
      if (c > 0.02) fn(s, c, i);
    }
  }

  function exterior(ctx, o) {
    const rot = o.rot || 0,
      top = o.top == null ? -1400 : o.top;
    ctx.save();
    // outer tube
    cylBand(ctx, G.otR, top, G.shellTop, '#7C8693', '#E1E7EE', '#262C35');
    around(5, rot * 1.0, (s, c) => {
      ctx.fillStyle = `rgba(30,34,42,${0.18 * c})`;
      ctx.fillRect(s * G.otR * 0.95 - 1.2, top, 2.4 * c + 0.4, G.shellTop - top);
    });
    // reaming shell with pads
    cylBand(ctx, 46.5, G.shellTop, G.bodyTop, '#6D7580', '#CED6DE', '#22272F');
    around(6, rot, (s, c, i) => {
      const x = s * 46.5;
      const w = 9 * c + 1;
      ctx.fillStyle = mix('#3A3F47', '#9AA2AD', c);
      ctx.fillRect(x - w / 2, G.shellTop + 18, w, G.bodyTop - G.shellTop - 36);
      ctx.fillStyle = `rgba(255,245,220,${0.5 * c * c})`;
      for (let k = 0; k < 7; k++) ctx.fillRect(x - w * 0.3 + (hash(i * 9 + k) - 0.5) * w * 0.4, G.shellTop + 26 + k * 17, 1.6, 1.6);
    });
    // joint lines
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(-46.5, G.shellTop - 0.8, 93, 1.6);
    ctx.fillRect(-46, G.bodyTop - 0.8, 92, 1.6);
    // bit body (steel blank)
    cylBand(ctx, 46, G.bodyTop, -G.matrixH, '#5E6670', '#B8C1CB', '#1E232A');
    // crown matrix (impregnated diamonds)
    cylBand(ctx, G.Ro, -G.matrixH, 0, '#4A4038', '#9C8C7A', '#191512', 0.36);
    // waterways: notches from the face up the gauge
    around(G.nWW, rot, (s, c) => {
      const x = s * G.Ro;
      const w = 6.5 * c + 0.6;
      ctx.fillStyle = o.fluid ? rgba(C.blue, 0.85) : '#0C0B0A';
      ctx.fillRect(x - w / 2, -9.5, w, 9.5);
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(x - w / 2, -10.5, w, 1.2);
    });
    // diamond glints
    around(40, rot * 1.0 + 0.3, (s, c, i) => {
      const yy = -1.5 - hash(i * 7) * 10;
      const tw = Math.pow(c, 6) * (0.4 + 0.6 * hash(i * 3));
      if (tw > 0.15) glow(ctx, s * G.Ro, yy, 3 + 4 * tw, '#FFF3D6', tw);
    });
    ctx.strokeStyle = INK;
    ctx.lineWidth = o.lw || 0.6;
    ctx.strokeRect(-G.Ro, -G.matrixH, 2 * G.Ro, G.matrixH);
    ctx.strokeRect(-46.5, G.shellTop, 93, G.bodyTop - G.shellTop);
    ctx.strokeRect(-G.otR, top, 2 * G.otR, G.shellTop - top);
    ctx.restore();
  }

  // core cylinder drawn from a texture strip (canvas, depth top→bottom)
  function coreCyl(ctx, tex, x0, x1, y0, y1, srcY0, srcY1) {
    if (y1 - y0 < 0.5) return;
    ctx.drawImage(tex, 0, srcY0, tex.width, Math.max(1, srcY1 - srcY0), x0, y0, x1 - x0, y1 - y0);
    const g = ctx.createLinearGradient(x0, 0, x1, 0);
    g.addColorStop(0, 'rgba(0,0,0,0.6)');
    g.addColorStop(0.18, 'rgba(0,0,0,0.12)');
    g.addColorStop(0.34, 'rgba(255,255,255,0.16)');
    g.addColorStop(0.5, 'rgba(255,255,255,0.0)');
    g.addColorStop(0.85, 'rgba(0,0,0,0.3)');
    g.addColorStop(1, 'rgba(0,0,0,0.65)');
    ctx.fillStyle = g;
    ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  }

  /* cut-away window in the exterior showing inner tube + core.
     o: { y0, y1 (window, mm), coreTop (mm, ≤0), tex, texS (px per mm of tex), texD0 (depth mm at tex row 0), faceDepth (mm) } */
  function cutWindow(ctx, o) {
    const x0 = -G.otR + 2,
      x1 = G.otR - 2;
    ctx.save();
    ctx.beginPath();
    // irregular "cut" outline
    const r = rng(5);
    ctx.moveTo(x0, o.y0);
    for (let k = 1; k <= 6; k++) ctx.lineTo(lerp(x0, x1, k / 6), o.y0 + (r() - 0.5) * 6);
    ctx.lineTo(x1, o.y1);
    ctx.lineTo(x0, o.y1);
    ctx.closePath();
    ctx.save();
    ctx.clip();
    ctx.fillStyle = '#0D1117';
    ctx.fillRect(x0, o.y0 - 10, x1 - x0, o.y1 - o.y0 + 20);
    // inner tube back wall + walls
    ctx.fillStyle = metalGrad(ctx, -G.itR, G.itR, '#4B535E', '#9AA3AE', '#1A1E24', 0.3);
    ctx.fillRect(-G.itR, o.y0 - 10, 2 * G.itR, o.y1 - o.y0 + 20);
    ctx.fillStyle = '#0A0D12';
    ctx.fillRect(-G.itRi, o.y0 - 10, 2 * G.itRi, o.y1 - o.y0 + 20);
    // core
    const cTop = Math.max(o.y0 - 10, o.coreTop);
    if (o.tex && o.coreTop < o.y1) {
      const d0 = o.faceDepth + cTop; // depth (mm) at the top of the visible core
      const d1 = o.faceDepth + o.y1;
      coreCyl(ctx, o.tex, -G.Ri + 0.6, G.Ri - 0.6, cTop, o.y1, (d0 - o.texD0) * o.texS, (d1 - o.texD0) * o.texS);
      // top of the core (broken/irregular end) highlight
      if (o.coreTop > o.y0 - 5) {
        ctx.fillStyle = 'rgba(255,255,255,0.18)';
        ctx.beginPath();
        ctx.ellipse(0, cTop, G.Ri - 1, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
    // cut edges of the outer wall (bright steel faces)
    ctx.strokeStyle = '#D9E0E8';
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.restore();
  }

  // ---------------- half section (S04 / S05) ----------------
  function hatch(ctx, x0, y0, w, h, col, a = 0.35, step = 3.2) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x0, y0, w, h);
    ctx.clip();
    ctx.fillStyle = col;
    ctx.fillRect(x0, y0, w, h);
    ctx.strokeStyle = `rgba(255,255,255,${a})`;
    ctx.lineWidth = 0.45;
    for (let k = -h; k < w + h; k += step) {
      ctx.beginPath();
      ctx.moveTo(x0 + k, y0 + h);
      ctx.lineTo(x0 + k + h, y0);
      ctx.stroke();
    }
    ctx.restore();
  }
  /* o: { top (mm), rot, coreTop, tex, texS, texD0, faceDepth, itTop (inner tube top), itLift (mm the inner tube is raised),
          lifterGrip (0..1), outerAlpha } */
  function section(ctx, o) {
    const top = o.top == null ? -1600 : o.top;
    const lift = o.itLift || 0;
    const rot = o.rot || 0;
    ctx.save();
    // interior back walls (dark, curved shading)
    ctx.fillStyle = metalGrad(ctx, -G.otRi, G.otRi, '#2E343D', '#59616C', '#0E1116', 0.35);
    ctx.fillRect(-G.otRi, top, 2 * G.otRi, -top - G.matrixH);
    // inner tube (does NOT rotate), raised by `lift`
    const itBot = -16 - lift,
      itTop = (o.itTop == null ? top - 50 : o.itTop) - lift;
    ctx.fillStyle = metalGrad(ctx, -G.itR, G.itR, '#566070', '#B3BDC8', '#232832', 0.3);
    ctx.fillRect(-G.itR, itTop, 2 * G.itR, itBot - itTop);
    ctx.fillStyle = '#0B0E13';
    ctx.fillRect(-G.itRi, itTop, 2 * G.itRi, itBot - itTop);
    // core inside the inner tube
    if (o.tex) {
      const cTop = Math.max(itTop, o.coreTop - lift),
        cBot = o.coreBot == null ? 0 : o.coreBot - lift;
      const d0 = o.faceDepth + o.coreTop,
        d1 = o.faceDepth + (o.coreBot == null ? 0 : o.coreBot);
      coreCyl(ctx, o.tex, -G.Ri + 0.4, G.Ri - 0.4, cTop, cBot, (d0 - o.texD0) * o.texS, (d1 - o.texD0) * o.texS);
    }
    // inner tube walls in section (light steel, static)
    for (const sgn of [-1, 1]) {
      const x = sgn < 0 ? -G.itR : G.itRi;
      hatch(ctx, x, itTop, G.itR - G.itRi, itBot - itTop, '#9AA6B4', 0.35);
    }
    // core lifter (split ring) + lifter case at the inner tube shoe
    const grip = o.lifterGrip || 0;
    for (const sgn of [-1, 1]) {
      ctx.fillStyle = '#C9A24A';
      ctx.beginPath();
      const xo = sgn * (G.Ri + 1.6 - grip * 0.9);
      ctx.moveTo(xo, itBot - 2);
      ctx.lineTo(xo, itBot - 22);
      ctx.lineTo(xo + sgn * 2.6, itBot - 22);
      ctx.lineTo(xo + sgn * 1.2, itBot - 2);
      ctx.closePath();
      ctx.fill();
      hatch(ctx, sgn < 0 ? -G.itR - 0.5 : G.Ri + 2.4, itBot - 26, G.itR - G.Ri - 1.9, 26, '#7D8896', 0.3);
    }
    // outer tube + reaming shell + bit walls in section (rotate: animated hatch offset)
    ctx.globalAlpha = o.outerAlpha == null ? 1 : o.outerAlpha;
    for (const sgn of [-1, 1]) {
      const ph = (rot * 3) % 3.2;
      // outer tube wall
      ctx.save();
      ctx.translate(0, 0);
      const wx = sgn < 0 ? -G.otR : G.otRi;
      hatchMoving(ctx, wx, top, G.otR - G.otRi, G.shellTop - top, '#6F7A88', ph * sgn);
      // reaming shell wall
      const sx = sgn < 0 ? -46.5 : G.otRi;
      hatchMoving(ctx, sx, G.shellTop, 46.5 - G.otRi, G.bodyTop - G.shellTop, '#66707C', ph * sgn);
      // bit body + crown in section (annulus Ri..Ro)
      const bx = sgn < 0 ? -46 : G.Ri + 2;
      hatchMoving(ctx, bx, G.bodyTop, 46 - G.Ri - 2, G.bodyTop * -1 - G.matrixH, '#5B6470', ph * sgn);
      const mx = sgn < 0 ? -G.Ro : G.Ri;
      ctx.fillStyle = '#4A4038';
      ctx.fillRect(mx, -G.matrixH, G.Ro - G.Ri, G.matrixH);
      for (let k = 0; k < 10; k++) {
        const gx = mx + hash(k * 5 + (sgn > 0 ? 3 : 0)) * (G.Ro - G.Ri),
          gy = -hash(k * 11 + 1) * G.matrixH;
        ctx.fillStyle = 'rgba(255,240,210,0.8)';
        ctx.fillRect(gx, gy, 0.9, 0.9);
      }
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }
  function hatchMoving(ctx, x0, y0, w, h, col, ph) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x0, y0, w, h);
    ctx.clip();
    ctx.fillStyle = col;
    ctx.fillRect(x0, y0, w, h);
    ctx.fillStyle = metalGrad(ctx, x0, x0 + w, 'rgba(0,0,0,0)', 'rgba(255,255,255,0.25)', 'rgba(0,0,0,0.25)', 0.4);
    ctx.fillRect(x0, y0, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,0.28)';
    ctx.lineWidth = 0.45;
    for (let k = -h - 3.2 + ph; k < w + h; k += 3.2) {
      ctx.beginPath();
      ctx.moveTo(x0 + k, y0 + h);
      ctx.lineTo(x0 + k + h, y0);
      ctx.stroke();
    }
    ctx.restore();
  }

  // inner-tube head assembly with spearhead (top of the inner tube), local y = itTop
  function headAssembly(ctx, y, latched = 1) {
    ctx.save();
    ctx.fillStyle = metalGrad(ctx, -22, 22, '#5C6673', '#C6CFD8', '#20252C', 0.3);
    ctx.fillRect(-22, y - 120, 44, 120);
    ctx.fillStyle = metalGrad(ctx, -14, 14, '#5C6673', '#D7DEE6', '#20252C', 0.3);
    ctx.fillRect(-14, y - 190, 28, 70);
    // spearhead
    ctx.fillStyle = '#C9D1DA';
    ctx.beginPath();
    ctx.moveTo(0, y - 236);
    ctx.lineTo(13, y - 206);
    ctx.lineTo(7, y - 190);
    ctx.lineTo(-7, y - 190);
    ctx.lineTo(-13, y - 206);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 0.7;
    ctx.stroke();
    // latches engaging the outer tube's latch coupling
    for (const sgn of [-1, 1]) {
      ctx.fillStyle = '#E2A33A';
      ctx.beginPath();
      const ex = sgn * (22 + 14 * latched);
      ctx.moveTo(sgn * 18, y - 70);
      ctx.lineTo(ex, y - 82);
      ctx.lineTo(ex, y - 96);
      ctx.lineTo(sgn * 18, y - 100);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = INK;
      ctx.stroke();
    }
    ctx.restore();
  }

  // wireline overshot on the cable; y = bottom of the overshot
  function overshot(ctx, y, cableTop, grip = 0) {
    ctx.save();
    ctx.strokeStyle = '#1E2227';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(0, cableTop);
    ctx.lineTo(0, y - 250);
    ctx.stroke();
    ctx.fillStyle = metalGrad(ctx, -17, 17, '#6B4A1E', '#F2C36B', '#3A2508', 0.3);
    ctx.fillRect(-17, y - 250, 34, 210);
    ctx.fillStyle = '#2B3038';
    ctx.fillRect(-9, y - 262, 18, 14);
    // jaws
    for (const sgn of [-1, 1]) {
      ctx.fillStyle = '#C08A2E';
      ctx.beginPath();
      const jx = sgn * (12 - grip * 6);
      ctx.moveTo(sgn * 15, y - 44);
      ctx.lineTo(jx, y);
      ctx.lineTo(jx - sgn * 6, y - 4);
      ctx.lineTo(sgn * 8, y - 44);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }
    ctx.restore();
  }

  // ---------------- face view (from below) ----------------
  function faceView(ctx, cx, cy, R, rot, coreTex, o = {}) {
    if (R < 6) return;
    const ri = (R * G.Ri) / G.Ro;
    ctx.save();
    ctx.translate(cx, cy);
    // core (static) in the centre
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, ri - 1, 0, Math.PI * 2);
    ctx.clip();
    if (coreTex) ctx.drawImage(coreTex, -ri, -ri, ri * 2, ri * 2);
    else {
      ctx.fillStyle = '#4A6A5E';
      ctx.fill();
    }
    const cg = ctx.createRadialGradient(-ri * 0.3, -ri * 0.3, ri * 0.1, 0, 0, ri);
    cg.addColorStop(0, 'rgba(255,255,255,0.12)');
    cg.addColorStop(1, 'rgba(0,0,0,0.45)');
    ctx.fillStyle = cg;
    ctx.fillRect(-ri, -ri, ri * 2, ri * 2);
    ctx.restore();
    // rotating ring: segments with motion-blur ghosts
    const n = G.nWW;
    const gap = 0.16;
    for (let ghost = 3; ghost >= 0; ghost--) {
      const ra = rot - ghost * (o.blur == null ? 0.06 : o.blur);
      ctx.globalAlpha = ghost ? 0.18 : 1;
      for (let i = 0; i < n; i++) {
        const a0 = ra + (i * Math.PI * 2) / n + gap / 2,
          a1 = ra + ((i + 1) * Math.PI * 2) / n - gap / 2;
        ctx.beginPath();
        ctx.arc(0, 0, R, a0, a1);
        ctx.arc(0, 0, ri, a1, a0, true);
        ctx.closePath();
        const mg = ctx.createRadialGradient(-R * 0.3, -R * 0.4, 2, 0, 0, R);
        mg.addColorStop(0, '#9C8C7A');
        mg.addColorStop(1, '#3D342D');
        ctx.fillStyle = mg;
        ctx.fill();
        if (!ghost) {
          ctx.strokeStyle = INK;
          ctx.lineWidth = 1.2;
          ctx.stroke();
          // diamonds
          for (let k = 0; k < 9; k++) {
            const aa = lerp(a0, a1, hash(i * 31 + k));
            const rr = lerp(ri + 3, R - 3, hash(i * 17 + k * 3));
            const tw = 0.5 + 0.5 * Math.sin(rot * 3 + i * 2 + k);
            ctx.fillStyle = `rgba(255,248,225,${0.45 + 0.5 * tw})`;
            ctx.fillRect(Math.cos(aa) * rr - 1, Math.sin(aa) * rr - 1, 2.2, 2.2);
          }
        }
      }
    }
    ctx.globalAlpha = 1;
    // waterways may carry fluid
    if (o.fluid) {
      for (let i = 0; i < n; i++) {
        const a = rot + (i * Math.PI * 2) / n;
        ctx.strokeStyle = rgba(C.blue, 0.75 * o.fluid);
        ctx.lineWidth = R * 0.07;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * ri, Math.sin(a) * ri);
        ctx.lineTo(Math.cos(a) * R, Math.sin(a) * R);
        ctx.stroke();
      }
    }
    ctx.strokeStyle = rgba(C.paper, 0.85);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, R + 1, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // small icon for insets: barrel + bit in half section, in rock
  function mini(ctx, cx, cy, r, t, rot) {
    ctx.save();
    ctx.translate(cx, cy + r * 0.62);
    const k = (r * 1.4) / 200;
    ctx.scale(k, k);
    ctx.fillStyle = '#2E463E';
    ctx.fillRect(-200, -400, 400, 600);
    ctx.fillStyle = '#3D5A4F';
    for (let i = 0; i < 18; i++) ctx.fillRect(-200 + hash(i) * 400, -400 + hash(i * 3) * 600, 30, 4);
    ctx.fillStyle = '#05070A';
    ctx.fillRect(-G.Rh, -420, 2 * G.Rh, 420);
    section(ctx, { top: -420, rot, coreTop: -150, tex: null, itTop: -400 });
    ctx.fillStyle = '#4A6A5E';
    ctx.fillRect(-G.Ri + 1, -150, 2 * G.Ri - 2, 150);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(-G.Ri + 1, -150, 10, 150);
    ctx.restore();
  }

  DG.BIT = { G, exterior, cutWindow, section, headAssembly, overshot, faceView, mini, coreCyl, hatch };
})();
