/* Generic crawler-mounted hydraulic diamond core drill rig (NOT a specific
   commercial model). Side view, metres, origin = hole collar at ground level,
   y up = negative. State drives rotation, feed, engine, wireline. */
(function () {
  const DG = window.DG;
  const { clamp, lerp, hash, rgba, mix, glow, metalGrad, C } = DG;

  const INK = '#0B0E14';
  const AMB = '#F2A93B', AMB_D = '#B8721F', AMB_L = '#FFD58A';
  const GRY = '#3A414C', GRY_L = '#6B7480';
  const LW = 0.028;

  function box(ctx, x, y, w, h, fill, o = {}) {
    ctx.beginPath();
    DG.rr(ctx, x, y, w, h, o.r == null ? 0.04 : o.r);
    ctx.fillStyle = fill;
    ctx.fill();
    if (o.shade !== false) {
      ctx.save();
      ctx.clip();
      // cel shadow (left/bottom) + rim light (right) — sun is to the right
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fillRect(x, y + h * 0.62, w, h);
      ctx.fillStyle = 'rgba(255,236,190,0.28)';
      ctx.fillRect(x + w - Math.min(0.08, w * 0.12), y, 0.08, h);
      ctx.restore();
    }
    if (o.line !== false) {
      ctx.strokeStyle = INK;
      ctx.lineWidth = o.lw || LW;
      ctx.stroke();
    }
  }
  function tube(ctx, x0, y0, x1, y1, w, col, o = {}) {
    ctx.lineCap = o.cap || 'butt';
    ctx.strokeStyle = INK;
    ctx.lineWidth = w + LW * 1.4;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.strokeStyle = col;
    ctx.lineWidth = w;
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = w * 0.22;
    const nx = (y1 - y0) / Math.hypot(x1 - x0, y1 - y0),
      ny = -(x1 - x0) / Math.hypot(x1 - x0, y1 - y0);
    ctx.beginPath();
    ctx.moveTo(x0 - nx * w * 0.22, y0 - ny * w * 0.22);
    ctx.lineTo(x1 - nx * w * 0.22, y1 - ny * w * 0.22);
    ctx.stroke();
  }
  function hose(ctx, pts, w, col = '#15171B') {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const path = () => {
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i += 3) ctx.bezierCurveTo(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], pts[i + 2][0], pts[i + 2][1]);
    };
    path();
    ctx.strokeStyle = INK;
    ctx.lineWidth = w + 0.02;
    ctx.stroke();
    path();
    ctx.strokeStyle = col;
    ctx.lineWidth = w;
    ctx.stroke();
    path();
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = w * 0.25;
    ctx.stroke();
  }

  // rotating rod segment: vertical cylinder with bands that slide with rotation
  function rod(ctx, x, y0, y1, d, rot, o = {}) {
    const r = d / 2;
    ctx.fillStyle = metalGrad(ctx, x - r, x + r, o.base || '#7E8794', o.hi || '#E6ECF2', o.lo || '#2A3039', 0.36);
    ctx.fillRect(x - r, y0, d, y1 - y0);
    // spiral wear marks: positions follow sin() of angle so they slide across the face
    ctx.save();
    ctx.beginPath();
    ctx.rect(x - r, y0, d, y1 - y0);
    ctx.clip();
    const pitch = o.pitch || 0.5;
    for (let k = -1; k < (y1 - y0) / pitch + 1; k++) {
      for (let m = 0; m < 3; m++) {
        const a = rot + (m * Math.PI * 2) / 3 + k * 0.9;
        const s = Math.sin(a),
          c = Math.cos(a);
        if (c < 0) continue;
        const xx = x + s * r * 0.92;
        ctx.fillStyle = `rgba(20,24,30,${0.35 * c})`;
        ctx.fillRect(xx - 0.006 - 0.012 * c, y0 + k * pitch + m * 0.13, 0.012 + 0.024 * c, 0.05);
      }
    }
    // tool joints every 3 m
    if (o.joints) {
      for (let yy = Math.ceil(y0 / 3) * 3; yy < y1; yy += 3) {
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(x - r, yy - 0.012, d, 0.024);
      }
    }
    ctx.restore();
    ctx.strokeStyle = INK;
    ctx.lineWidth = LW * 0.8;
    ctx.strokeRect(x - r, y0, d, y1 - y0);
  }

  function smoke(ctx, x, y, t, run, start) {
    // analytic puffs: each puff emitted at te, rises and grows
    const rate = 6;
    const now = t;
    ctx.save();
    for (let i = Math.floor((now - 3) * rate); i <= Math.floor(now * rate); i++) {
      const te = i / rate;
      const age = now - te;
      if (age < 0 || age > 3) continue;
      const k = age / 3;
      const burst = Math.exp(-Math.max(0, te - start) * 1.6) * (te >= start ? 1 : 0);
      const dens = (0.12 + 0.7 * burst) * clamp(run * 1.5);
      if (dens < 0.01) continue;
      const px = x - age * (0.35 + 0.3 * hash(i)) + Math.sin(age * 2 + i) * 0.08;
      const py = y - age * (0.9 + 0.4 * hash(i + 7));
      const rr = 0.12 + age * 0.45;
      const g = mix('#3B3A3A', '#B9B2AA', clamp(k * 1.4 + (1 - burst) * 0.5));
      ctx.fillStyle = g.replace(/[\d.]+\)$/, `${dens * (1 - k) * 0.8})`);
      ctx.beginPath();
      ctx.arc(px, py, rr, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  /* st: { t, rot, feed (0 top..1 bottom), run (0..1), start (engine start t),
     aside (0..1 head swung away for wireline), cable (0..1 wireline used),
     cableTop (y of overshot when above ground, metres), labelsHidden } */
  function rig(ctx, st) {
    const t = st.t || 0,
      run = st.run || 0;
    const vib = run * 0.006;
    const jx = Math.sin(t * 87) * vib,
      jy = Math.cos(t * 71) * vib;
    ctx.save();
    ctx.lineJoin = 'round';

    // ---- background: barrier tape and posts ----
    for (const px of [-11.2, -7.0, 4.0, 7.4]) {
      tube(ctx, px, 0, px, -1.15, 0.05, '#C9CDD2');
    }
    ctx.save();
    ctx.lineWidth = 0.05;
    ctx.setLineDash([0.22, 0.22]);
    for (const [a, b] of [[-11.2, -7.0], [4.0, 7.4]]) {
      ctx.strokeStyle = '#E8E8E8';
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(a, -1.08);
      ctx.quadraticCurveTo((a + b) / 2, -0.98, b, -1.08);
      ctx.stroke();
      ctx.strokeStyle = '#D23A2C';
      ctx.setLineDash([0.22, 0.22]);
      ctx.stroke();
    }
    ctx.restore();

    // ---- water tank (IBC) + pump unit ----
    const tx = -10.6;
    box(ctx, tx, -1.9, 1.9, 1.75, 'rgba(235,240,244,0.92)', { r: 0.06 });
    ctx.fillStyle = 'rgba(76,155,234,0.55)';
    ctx.fillRect(tx + 0.06, -1.25 + Math.sin(t * 1.7) * 0.01, 1.78, 1.05);
    ctx.strokeStyle = '#8C939C';
    ctx.lineWidth = 0.05;
    for (let k = 0; k <= 4; k++) {
      ctx.beginPath();
      ctx.moveTo(tx + (k * 1.9) / 4, -1.9);
      ctx.lineTo(tx + (k * 1.9) / 4, -0.15);
      ctx.stroke();
    }
    for (let k = 0; k <= 3; k++) {
      ctx.beginPath();
      ctx.moveTo(tx, -1.9 + (k * 1.75) / 3);
      ctx.lineTo(tx + 1.9, -1.9 + (k * 1.75) / 3);
      ctx.stroke();
    }
    box(ctx, tx - 0.05, -0.18, 2.0, 0.18, '#5C636D', { r: 0.02 });
    // pump skid
    const px0 = -8.2;
    box(ctx, px0, -0.22, 2.1, 0.22, '#4A515B', { r: 0.02 });
    box(ctx, px0 + 0.1, -1.05, 0.95, 0.83, '#2F5E8C', { r: 0.08 }); // motor
    for (let k = 0; k < 6; k++) {
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(px0 + 0.18 + k * 0.14, -0.98, 0.05, 0.68);
    }
    box(ctx, px0 + 1.1, -0.95, 0.9, 0.73, '#596370', { r: 0.05 }); // pump head
    ctx.fillStyle = '#D9DEE5';
    ctx.beginPath();
    ctx.arc(px0 + 1.55, -0.6, 0.13, 0, Math.PI * 2);
    ctx.fill();
    // suction hose tank → pump
    hose(ctx, [[tx + 1.9, -0.35], [tx + 2.3, -0.1], [px0 + 0.6, -0.05], [px0 + 1.2, -0.3]], 0.08, '#1E2A3A');

    // ---- ground shadow ----
    ctx.save();
    const sg = ctx.createRadialGradient(-2.6, 0, 0.2, -2.6, 0, 5.5);
    sg.addColorStop(0, 'rgba(0,0,0,0.45)');
    sg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sg;
    ctx.scale(1, 0.12);
    ctx.beginPath();
    ctx.arc(-2.6, 0, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(jx, jy);
    // ---- crawler tracks ----
    box(ctx, -5.45, -0.78, 4.8, 0.78, '#1C1E22', { r: 0.38, shade: false });
    ctx.save();
    ctx.beginPath();
    DG.rr(ctx, -5.45, -0.78, 4.8, 0.78, 0.38);
    ctx.clip();
    ctx.fillStyle = '#2B2E34';
    for (let x = -5.4; x < -0.6; x += 0.18) ctx.fillRect(x, -0.78, 0.09, 0.08);
    for (let x = -5.4; x < -0.6; x += 0.18) ctx.fillRect(x, -0.08, 0.09, 0.08);
    ctx.restore();
    for (const wx of [-5.05, -1.05]) {
      ctx.fillStyle = '#3B4048';
      ctx.beginPath();
      ctx.arc(wx, -0.39, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = INK;
      ctx.lineWidth = LW;
      ctx.stroke();
      ctx.fillStyle = '#8D959F';
      ctx.beginPath();
      ctx.arc(wx, -0.39, 0.1, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let k = 0; k < 6; k++) {
      ctx.fillStyle = '#4A5059';
      ctx.beginPath();
      ctx.arc(-4.45 + k * 0.6, -0.2, 0.13, 0, Math.PI * 2);
      ctx.fill();
    }
    // ---- chassis ----
    box(ctx, -5.55, -1.05, 5.2, 0.3, AMB, { r: 0.03 });
    ctx.fillStyle = AMB_D;
    ctx.fillRect(-5.55, -0.84, 5.2, 0.09);
    // ---- power pack ----
    const ev = run * 0.008 * Math.sin(t * 130);
    ctx.save();
    ctx.translate(0, ev);
    box(ctx, -5.35, -2.75, 3.15, 1.7, AMB, { r: 0.12 });
    for (let k = 0; k < 9; k++) {
      ctx.fillStyle = 'rgba(40,24,6,0.5)';
      ctx.fillRect(-4.95 + k * 0.17, -2.45, 0.07, 0.95);
    }
    ctx.strokeStyle = 'rgba(60,34,8,0.6)';
    ctx.lineWidth = 0.02;
    ctx.strokeRect(-3.15, -2.55, 0.8, 1.3);
    ctx.fillStyle = '#C23B2E'; // extinguisher
    ctx.beginPath();
    DG.rr(ctx, -2.32, -1.62, 0.16, 0.48, 0.06);
    ctx.fill();
    ctx.fillStyle = '#1F6FB8'; // PPE sign
    ctx.beginPath();
    ctx.arc(-2.75, -2.15, 0.16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(-2.75, -2.16, 0.085, 0.06, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(-2.86, -2.165, 0.22, 0.025);
    // handrail
    ctx.strokeStyle = '#E6B040';
    ctx.lineWidth = 0.045;
    ctx.beginPath();
    ctx.moveTo(-5.2, -2.75);
    ctx.lineTo(-5.2, -3.15);
    ctx.lineTo(-3.0, -3.15);
    ctx.lineTo(-3.0, -2.75);
    ctx.stroke();
    // exhaust stack
    tube(ctx, -4.55, -2.75, -4.55, -3.75, 0.13, '#5B6069');
    ctx.fillStyle = '#2A2D33';
    ctx.fillRect(-4.66, -3.82, 0.22, 0.08);
    ctx.restore();
    smoke(ctx, -4.58, -3.85, t, run, st.start == null ? -9 : st.start);
    // beacon
    const bk = run > 0.05 ? 0.5 + 0.5 * Math.sin(t * 9) : 0;
    box(ctx, -2.75, -3.0, 0.2, 0.25, '#F7B733', { r: 0.06, shade: false });
    if (bk > 0) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.restore();
    }
    st._beacon = bk;
    // hydraulic tank + winch
    box(ctx, -2.2, -2.05, 0.95, 1.0, GRY, { r: 0.06 });
    const wx = -1.72,
      wy = -2.42;
    ctx.fillStyle = '#2B3038';
    ctx.beginPath();
    ctx.arc(wx, wy, 0.36, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.lineWidth = LW;
    ctx.stroke();
    ctx.fillStyle = '#A5ADB7';
    ctx.beginPath();
    ctx.arc(wx, wy, 0.24, 0, Math.PI * 2);
    ctx.fill();
    // cable turns on the drum, spinning when the wireline runs
    const drumRot = st.winch || 0;
    ctx.strokeStyle = 'rgba(40,44,50,0.8)';
    ctx.lineWidth = 0.02;
    for (let k = 0; k < 6; k++) {
      const a = drumRot + (k * Math.PI) / 3;
      ctx.beginPath();
      ctx.moveTo(wx + Math.cos(a) * 0.06, wy + Math.sin(a) * 0.06);
      ctx.lineTo(wx + Math.cos(a) * 0.23, wy + Math.sin(a) * 0.23);
      ctx.stroke();
    }

    // ---- mast ----
    const mx0 = -0.64,
      mx1 = -0.2,
      mTop = -10.35,
      mBot = -0.95;
    // raising cylinder
    tube(ctx, -2.05, -1.15, -1.0, -3.1, 0.2, '#555D68', { cap: 'round' });
    tube(ctx, -1.0, -3.1, -0.6, -4.9, 0.09, '#DDE3EA', { cap: 'round' });
    box(ctx, mx0, mTop, mx1 - mx0, mBot - mTop, AMB, { r: 0.03 });
    ctx.fillStyle = AMB_D;
    ctx.fillRect(mx0, mTop, 0.1, mBot - mTop);
    // lightening holes
    for (let y = mTop + 0.5; y < mBot - 0.6; y += 0.62) {
      ctx.fillStyle = 'rgba(30,18,6,0.55)';
      ctx.beginPath();
      DG.rr(ctx, mx0 + 0.13, y, 0.18, 0.4, 0.06);
      ctx.fill();
    }
    // front rail
    ctx.fillStyle = AMB_L;
    ctx.fillRect(mx1 - 0.05, mTop + 0.1, 0.05, mBot - mTop - 0.2);
    // crown block & sheaves
    box(ctx, mx0 - 0.08, mTop - 0.18, 0.75, 0.22, AMB_D, { r: 0.03 });
    for (const [sx, sr] of [[-0.12, 0.27], [-0.5, 0.2]]) {
      ctx.fillStyle = '#4C535E';
      ctx.beginPath();
      ctx.arc(sx, mTop - 0.36, sr, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = INK;
      ctx.lineWidth = LW;
      ctx.stroke();
      ctx.save();
      ctx.translate(sx, mTop - 0.36);
      ctx.rotate(st.winch || 0);
      ctx.strokeStyle = '#9AA3AE';
      ctx.lineWidth = 0.03;
      ctx.beginPath();
      ctx.moveTo(-sr * 0.7, 0);
      ctx.lineTo(sr * 0.7, 0);
      ctx.moveTo(0, -sr * 0.7);
      ctx.lineTo(0, sr * 0.7);
      ctx.stroke();
      ctx.restore();
    }
    // wireline cable: winch → back sheave → down the front
    ctx.strokeStyle = '#2E3238';
    ctx.lineWidth = 0.022;
    ctx.beginPath();
    ctx.moveTo(wx + 0.2, wy - 0.3);
    ctx.lineTo(-0.7, mTop - 0.36);
    ctx.stroke();

    // ---- rotary head (slides on the mast) ----
    const aside = st.aside || 0;
    const feed = st.feed == null ? 0.3 : st.feed;
    const hTop = lerp(-8.95, -2.95, feed) - aside * 1.2;
    const hx = aside * -0.0;
    const chuckY = hTop + 1.2;
    // feed cylinder (behind the head, along the mast)
    tube(ctx, -0.42, -9.8, -0.42, hTop + 0.2, 0.1, '#DCE2E9');
    // hydraulic hoses looping from mid mast to the head motor
    hose(ctx, [[-0.62, -6.4], [-1.5, -6.6], [-1.3, hTop - 0.5], [-0.25, hTop + 0.05]], 0.07);
    hose(ctx, [[-0.62, -6.1], [-1.75, -6.2], [-1.55, hTop - 0.2], [-0.25, hTop + 0.25]], 0.07);
    // injection hose: pump → up the mast → water swivel on top of the head
    hose(ctx, [[px0 + 2.0, -0.6], [-5.8, -0.4], [-1.2, -0.6], [-0.85, -1.4], [-0.75, -3], [-0.95, hTop - 1.6], [0.02, hTop - 0.55]], 0.085, '#1E2A3A');
    ctx.save();
    ctx.translate(hx, 0);
    // head body
    box(ctx, -0.34, hTop, 0.78, 0.9, AMB, { r: 0.08 });
    for (let k = 0; k < 4; k++) {
      ctx.fillStyle = 'rgba(60,34,8,0.45)';
      ctx.fillRect(-0.28 + k * 0.17, hTop + 0.12, 0.06, 0.62);
    }
    // hydraulic motor on top
    box(ctx, -0.3, hTop - 0.42, 0.34, 0.44, '#24282F', { r: 0.06 });
    // water swivel
    box(ctx, -0.04, hTop - 0.6, 0.12, 0.6, '#9AA3AE', { r: 0.03 });
    // chuck / spindle (rotating)
    rod(ctx, 0.02, hTop + 0.9, chuckY, 0.2, st.rot || 0, { base: '#5E6672', pitch: 0.12 });
    ctx.restore();

    // ---- drill rods from chuck to the clamp (rotating) ----
    if (aside < 0.5) rod(ctx, 0.02, chuckY, -0.2, 0.11, st.rot || 0, { pitch: 0.45 });
    else rod(ctx, 0.02, -2.0, -0.2, 0.11, 0, { pitch: 0.45 });
    // wireline cable down into the rods
    if (st.cable) {
      ctx.strokeStyle = '#2A2E34';
      ctx.lineWidth = 0.02;
      ctx.beginPath();
      ctx.moveTo(-0.12, mTop - 0.36 + 0.27);
      ctx.lineTo(0.02, st.cableY == null ? -2.0 : st.cableY);
      ctx.stroke();
    }
    // ---- foot clamp ----
    box(ctx, -0.36, -0.64, 0.76, 0.42, GRY, { r: 0.05 });
    box(ctx, -0.42, -0.3, 0.88, 0.12, '#2C3138', { r: 0.03 });
    // ---- rotation guard (mesh) ----
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = AMB;
    ctx.lineWidth = 0.04;
    const gTop = Math.max(chuckY + 0.1, -2.65);
    ctx.strokeRect(-0.48, gTop, 1.0, -0.66 - gTop);
    ctx.strokeStyle = 'rgba(220,225,230,0.3)';
    ctx.lineWidth = 0.012;
    for (let x = -0.46; x < 0.52; x += 0.08) {
      ctx.beginPath();
      ctx.moveTo(x, gTop);
      ctx.lineTo(x, -0.66);
      ctx.stroke();
    }
    for (let y = gTop; y < -0.66; y += 0.08) {
      ctx.beginPath();
      ctx.moveTo(-0.48, y);
      ctx.lineTo(0.52, y);
      ctx.stroke();
    }
    ctx.restore();
    ctx.restore(); // vibration

    // ---- control console (operator outside the rotation zone) ----
    tube(ctx, 1.75, 0, 1.75, -1.05, 0.09, '#4A515B');
    ctx.save();
    ctx.translate(1.75, -1.18);
    ctx.rotate(-0.35);
    box(ctx, -0.32, -0.12, 0.64, 0.24, '#2C3139', { r: 0.03 });
    for (let k = 0; k < 4; k++) {
      const lv = st.lever && k === 1 ? st.lever : 0;
      ctx.strokeStyle = '#C9CED4';
      ctx.lineWidth = 0.025;
      ctx.beginPath();
      ctx.moveTo(-0.22 + k * 0.14, -0.12);
      ctx.lineTo(-0.22 + k * 0.14 + lv * 0.08, -0.3);
      ctx.stroke();
      ctx.fillStyle = k === 1 ? '#D23A2C' : '#1A1C20';
      ctx.beginPath();
      ctx.arc(-0.22 + k * 0.14 + lv * 0.08, -0.31, 0.03, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    // ---- casing collar + return line to the sump ----
    box(ctx, -0.12, -0.24, 0.28, 0.32, '#6E7783', { r: 0.02 });
    tube(ctx, 0.16, -0.12, 0.85, -0.04, 0.08, '#3E4652');
    // sump (decantation box), partly below ground
    box(ctx, 0.75, -0.32, 1.55, 0.32, '#565E69', { r: 0.02 });

    // ---- rod rack ----
    for (const rx of [3.0, 5.75]) {
      tube(ctx, rx - 0.3, 0, rx, -0.72, 0.06, '#5A616B');
      tube(ctx, rx + 0.3, 0, rx, -0.72, 0.06, '#5A616B');
    }
    const rows = [[-0.78, 4], [-0.89, 3], [-1.0, 2]];
    rows.forEach(([ry, n], j) => {
      for (let k = 0; k < n; k++) {
        const g = ctx.createLinearGradient(0, ry - 0.055, 0, ry + 0.055);
        g.addColorStop(0, '#E2E7EC');
        g.addColorStop(0.5, '#8B949F');
        g.addColorStop(1, '#3A414B');
        ctx.fillStyle = g;
        ctx.fillRect(2.7 + k * 0.012 + j * 0.03, ry - 0.055 - k * 0.0, 3.3, 0.11);
        ctx.strokeStyle = INK;
        ctx.lineWidth = 0.012;
        ctx.strokeRect(2.7 + k * 0.012 + j * 0.03, ry - 0.055, 3.3, 0.11);
      }
    });
    // cones
    for (const cx of [-11.8, 7.9]) {
      ctx.fillStyle = '#F06A1E';
      ctx.beginPath();
      ctx.moveTo(cx - 0.22, 0);
      ctx.lineTo(cx, -0.75);
      ctx.lineTo(cx + 0.22, 0);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#F2F2F2';
      ctx.fillRect(cx - 0.12, -0.42, 0.24, 0.08);
      ctx.fillStyle = '#222';
      ctx.fillRect(cx - 0.3, -0.04, 0.6, 0.05);
    }
    ctx.restore();
    return { hTop, chuckY, beacon: bk, mTop };
  }

  // beacon glow drawn in screen space by the scene (needs world→screen)
  DG.RIG = { rig, rod, tube, hose, box, smoke };
})();
