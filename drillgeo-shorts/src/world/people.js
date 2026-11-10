/* Field crew in full PPE (side view, metres, feet at origin, y up = negative).
   Hard hat, safety glasses, ear muffs, gloves, boots, navy coverall with
   reflective bands. Simple joint rig so poses can be animated. */
(function () {
  const DG = window.DG;
  const { lerp, rgba, mix } = DG;

  const INK = '#0B0E14';
  function limb(ctx, pts, w, col, outline = true) {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const path = () => {
      ctx.beginPath();
      pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    };
    if (outline) {
      path();
      ctx.strokeStyle = INK;
      ctx.lineWidth = w + 0.022;
      ctx.stroke();
    }
    path();
    ctx.strokeStyle = col;
    ctx.lineWidth = w;
    ctx.stroke();
  }
  const pt = (x, y, ang, len) => [x + Math.sin(ang) * len, y + Math.cos(ang) * len];

  /* o: { x, y, s (px per m), face: 1|-1, helmet, suit, glove, skin, pose:{...}, t } */
  function person(ctx, o) {
    const P = Object.assign({ armF: [0.15, -0.35], armB: [-0.1, -0.25], legF: [0.06, 0.02], legB: [-0.08, 0.04], lean: 0, head: 0 }, o.pose || {});
    const suit = o.suit || '#1E2C4F',
      suitD = mix(suit, '#000000', 0.35),
      band = o.band || '#D9DEE6',
      glove = o.glove || '#E3B23C',
      skin = o.skin || '#B98466',
      helmet = o.helmet || '#F2A93B';
    const br = Math.sin((o.t || 0) * 1.6 + (o.seed || 0)) * 0.006; // breathing
    ctx.save();
    ctx.translate(o.x, o.y);
    ctx.scale(o.s * (o.face || 1), o.s);
    const hipY = -0.93,
      shY = -1.44 + br,
      hx = 0,
      shx = Math.sin(P.lean) * 0.5;
    // legs: [hipAngle, kneeBend]
    const leg = (L, col) => {
      const k = pt(hx, hipY, L[0], 0.45);
      const f = pt(k[0], k[1], L[0] - L[1], 0.43);
      limb(ctx, [[hx, hipY], k, f], 0.15, col);
      // reflective band under the knee
      const b0 = [lerp(k[0], f[0], 0.25), lerp(k[1], f[1], 0.25)];
      limb(ctx, [b0, [lerp(k[0], f[0], 0.33), lerp(k[1], f[1], 0.33)]], 0.135, band, false);
      // boot
      ctx.fillStyle = '#2A2420';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 0.018;
      ctx.beginPath();
      DG.rr(ctx, f[0] - 0.08, f[1] - 0.09, 0.3, 0.11, 0.04);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#C08A2E';
      ctx.fillRect(f[0] - 0.07, f[1] - 0.005, 0.28, 0.025);
    };
    const arm = (A, col) => {
      const e = pt(shx, shY + 0.04, A[0], 0.3);
      const h = pt(e[0], e[1], A[0] + A[1], 0.27);
      limb(ctx, [[shx, shY + 0.04], e, h], 0.095, col);
      limb(ctx, [[lerp(e[0], h[0], 0.62), lerp(e[1], h[1], 0.62)], [lerp(e[0], h[0], 0.74), lerp(e[1], h[1], 0.74)]], 0.085, band, false);
      ctx.fillStyle = glove;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 0.016;
      ctx.beginPath();
      ctx.ellipse(h[0] + Math.sin(A[0] + A[1]) * 0.04, h[1] + Math.cos(A[0] + A[1]) * 0.04, 0.055, 0.065, A[0] + A[1], 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      return h;
    };
    leg(P.legB, suitD);
    arm(P.armB, suitD);
    // torso
    ctx.fillStyle = suit;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 0.02;
    ctx.beginPath();
    ctx.moveTo(shx - 0.16, shY);
    ctx.quadraticCurveTo(shx + 0.02, shY - 0.05, shx + 0.15, shY + 0.02);
    ctx.quadraticCurveTo(shx + 0.2, shY + 0.25, 0.14, hipY + 0.02);
    ctx.lineTo(-0.13, hipY + 0.02);
    ctx.quadraticCurveTo(shx - 0.2, shY + 0.3, shx - 0.16, shY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // cel shadow on the back side
    ctx.save();
    ctx.clip();
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.fillRect(shx - 0.3, shY - 0.1, 0.17, 0.7);
    // reflective bands
    ctx.fillStyle = band;
    ctx.fillRect(-0.3, hipY - 0.12, 0.6, 0.04);
    ctx.fillRect(-0.3, shY + 0.17, 0.6, 0.035);
    ctx.fillStyle = rgba('#F2A93B', 0.9);
    ctx.fillRect(-0.3, hipY - 0.08, 0.6, 0.012);
    ctx.restore();
    leg(P.legF, suit);
    // head
    const hcx = shx + 0.03 + Math.sin(P.lean) * 0.08,
      hcy = shY - 0.19;
    ctx.save();
    ctx.translate(hcx, hcy);
    ctx.rotate(P.head);
    ctx.fillStyle = skin;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 0.018;
    ctx.beginPath();
    ctx.moveTo(-0.08, -0.05);
    ctx.quadraticCurveTo(-0.1, 0.1, 0.0, 0.12);
    ctx.quadraticCurveTo(0.1, 0.12, 0.115, 0.02); // jaw → nose
    ctx.lineTo(0.125, -0.01);
    ctx.quadraticCurveTo(0.12, -0.08, 0.06, -0.1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    if (o.detail) {
      // eye, brow, ear, hair under the helmet, mouth (anime-sober)
      ctx.fillStyle = '#1A1412';
      ctx.beginPath();
      ctx.ellipse(0.07, -0.012, 0.011, 0.016, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#2A1E18';
      ctx.lineWidth = 0.008;
      ctx.beginPath();
      ctx.moveTo(0.045, -0.05);
      ctx.quadraticCurveTo(0.075, -0.06, 0.1, -0.048);
      ctx.moveTo(0.075, 0.07);
      ctx.lineTo(0.098, 0.066);
      ctx.stroke();
      ctx.fillStyle = '#2B201A';
      ctx.beginPath();
      ctx.moveTo(-0.1, -0.06);
      ctx.quadraticCurveTo(-0.11, 0.02, -0.07, 0.05);
      ctx.lineTo(-0.05, -0.06);
      ctx.closePath();
      ctx.fill();
    }
    // glasses
    ctx.fillStyle = o.detail ? 'rgba(170,210,240,0.35)' : 'rgba(40,60,80,0.85)';
    ctx.beginPath();
    DG.rr(ctx, 0.035, -0.035, 0.09, 0.045, 0.012);
    ctx.fill();
    ctx.fillStyle = 'rgba(200,230,255,0.6)';
    ctx.fillRect(0.06, -0.03, 0.03, 0.01);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 0.012;
    ctx.beginPath();
    ctx.moveTo(0.035, -0.015);
    ctx.lineTo(-0.04, -0.02);
    ctx.stroke();
    // hard hat
    ctx.fillStyle = helmet;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 0.018;
    ctx.beginPath();
    ctx.moveTo(-0.13, -0.05);
    ctx.quadraticCurveTo(-0.12, -0.2, 0.0, -0.21);
    ctx.quadraticCurveTo(0.12, -0.2, 0.13, -0.06);
    ctx.lineTo(0.19, -0.045);
    ctx.lineTo(0.18, -0.025);
    ctx.lineTo(-0.14, -0.03);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath();
    ctx.ellipse(-0.01, -0.165, 0.07, 0.025, -0.2, 0, Math.PI * 2);
    ctx.fill();
    if (o.muffs !== false) {
      ctx.fillStyle = '#C23B2E';
      ctx.strokeStyle = INK;
      ctx.beginPath();
      ctx.ellipse(-0.03, 0.0, 0.045, 0.055, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.fillStyle = mix(skin, '#000', 0.25);
      ctx.beginPath();
      ctx.ellipse(-0.02, 0.0, 0.025, 0.035, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    const hand = arm(P.armF, suit);
    ctx.restore();
    return hand;
  }

  DG.PEOPLE = { person };
})();
