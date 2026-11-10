/* "Geo" — DrillGeo crew member mascot (front view, friendly anime style).
   PPE: white hard hat with the helix mark, safety glasses (pushed up),
   navy coverall with reflective bands, gloves. Lip-sync from DG.MOUTH,
   blinking, breathing and blended gesture poses.
   Units: u = head radius; origin = head centre; y down. */
(function () {
  const DG = window.DG;
  const { clamp, lerp, smooth, E, hash, fract, rgba, mix, glow, C } = DG;
  const INK = '#151821';
  const SKIN = '#B07A5A', SKIN_D = '#8F5E44', HAIR = '#2A1D16';
  const NAVY = '#1F2D52', NAVY_D = '#16203D', BAND = '#D9DEE6', GLOVE = '#E3B23C';

  // ---------- gestures: [upper-arm angle from down (outward +), forearm bend (inward −), hand] ----------
  const G = {
    idle: { L: [0.14, -0.12, 'open'], R: [0.14, -0.12, 'open'] },
    wave: { L: [0.14, -0.12, 'open'], R: [2.35, 0.45, 'open'], wave: 1 },
    point_up: { L: [0.16, -0.1, 'open'], R: [2.55, 0.18, 'point'] },
    point_right: { L: [0.16, -0.1, 'open'], R: [1.62, 0.12, 'point'] },
    explain: { L: [0.42, -1.95, 'open'], R: [0.42, -1.95, 'open'], talk: 1 },
    explain_r: { L: [0.16, -0.1, 'open'], R: [0.5, -2.05, 'open'], talk: 1 },
    thumbs: { L: [0.16, -0.1, 'open'], R: [0.55, -2.25, 'thumb'] },
    hold: { L: [0.32, -1.95, 'open'], R: [0.32, -1.95, 'open'] },
    count1: { L: [0.16, -0.1, 'open'], R: [0.55, -2.35, 'one'] },
    count2: { L: [0.16, -0.1, 'open'], R: [0.55, -2.35, 'two'] },
    count3: { L: [0.16, -0.1, 'open'], R: [0.55, -2.35, 'three'] },
    count4: { L: [0.16, -0.1, 'open'], R: [0.55, -2.35, 'four'] },
    point_down: { L: [0.16, -0.1, 'open'], R: [0.75, 0.2, 'point'] },
  };

  function limb(ctx, x0, y0, x1, y1, w, col) {
    ctx.lineCap = 'round';
    ctx.strokeStyle = INK;
    ctx.lineWidth = w + 0.14;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.strokeStyle = col;
    ctx.lineWidth = w;
    ctx.stroke();
  }

  function hand(ctx, x, y, ang, kind, side) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ang);
    if (side < 0) ctx.scale(-1, 1);
    ctx.fillStyle = GLOVE;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 0.07;
    const finger = (fx, fy, len, a) => {
      ctx.save();
      ctx.translate(fx, fy);
      ctx.rotate(a);
      ctx.beginPath();
      DG.rr(ctx, -0.075, 0, 0.15, len, 0.075);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };
    // palm
    ctx.beginPath();
    DG.rr(ctx, -0.27, -0.05, 0.54, 0.5, 0.2);
    ctx.fill();
    ctx.stroke();
    const up = (k) => [-0.2 + k * 0.13, 0.4];
    if (kind === 'open') {
      for (let k = 0; k < 4; k++) finger(-0.2 + k * 0.13, 0.38, 0.32 - Math.abs(k - 1.5) * 0.04, (k - 1.5) * 0.08);
      finger(0.27, 0.12, 0.26, -0.9);
    } else if (kind === 'point') {
      finger(-0.15, 0.38, 0.5, 0);
      ctx.beginPath();
      DG.rr(ctx, -0.04, 0.32, 0.3, 0.2, 0.1);
      ctx.fill();
      ctx.stroke();
      finger(0.27, 0.1, 0.2, -1.0);
    } else if (kind === 'thumb') {
      ctx.beginPath();
      DG.rr(ctx, -0.26, 0.3, 0.52, 0.22, 0.1);
      ctx.fill();
      ctx.stroke();
      finger(0.22, 0.05, 0.42, Math.PI + 0.15);
    } else {
      const n = { one: 1, two: 2, three: 3, four: 4 }[kind] || 0;
      for (let k = 0; k < 4; k++) {
        if (k < n) finger(-0.2 + k * 0.13, 0.38, 0.34, (k - 1.5) * 0.06);
      }
      if (n < 4) {
        ctx.beginPath();
        DG.rr(ctx, -0.26 + n * 0.13, 0.32, 0.52 - n * 0.13, 0.18, 0.09);
        ctx.fill();
        ctx.stroke();
      }
      finger(0.27, 0.1, 0.2, -1.0);
    }
    ctx.restore();
  }

  function arm(ctx, side, pose, br, t) {
    const sx = side * 1.32,
      sy = 1.62 + br;
    let [a1, a2, hk] = pose;
    const ux = Math.sin(a1) * side,
      uy = Math.cos(a1);
    const ex = sx + ux * 1.2,
      ey = sy + uy * 1.2;
    const a = a1 + a2;
    const fx = Math.sin(a) * side,
      fy = Math.cos(a);
    const hx = ex + fx * 1.05,
      hy = ey + fy * 1.05;
    limb(ctx, sx, sy, ex, ey, 0.52, NAVY);
    limb(ctx, ex, ey, hx, hy, 0.46, NAVY);
    // reflective cuff
    limb(ctx, lerp(ex, hx, 0.72), lerp(ey, hy, 0.72), lerp(ex, hx, 0.8), lerp(ey, hy, 0.8), 0.47, BAND);
    hand(ctx, hx + fx * 0.05, hy + fy * 0.05, -Math.atan2(fx, fy), hk, side);
  }

  function blendPose(a, b, k) {
    return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), k < 0.5 ? a[2] : b[2]];
  }

  /* o: { x, y, u, t, mouth (0..1), gesture, prev, gk (blend 0..1), look:[x,y], alpha, full } */
  function draw(ctx, o) {
    const t = o.t,
      u = o.u;
    const g1 = G[o.gesture] || G.idle,
      g0 = G[o.prev] || g1;
    const k = o.gk == null ? 1 : o.gk;
    const br = Math.sin(t * 1.9) * 0.035;
    const talk = o.mouth || 0;
    ctx.save();
    ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
    ctx.translate(o.x, o.y);
    ctx.scale(u, u);
    // soft dark halo for separation from busy backgrounds
    ctx.save();
    ctx.scale(1, 1.25);
    const halo = ctx.createRadialGradient(0, 1.6, 0.5, 0, 1.6, 4.2);
    halo.addColorStop(0, 'rgba(8,10,18,0.55)');
    halo.addColorStop(1, 'rgba(8,10,18,0)');
    ctx.fillStyle = halo;
    ctx.fillRect(-5, -3, 10, 10);
    ctx.restore();
    ctx.lineJoin = 'round';
    // ---- legs (full mode) ----
    if (o.full) {
      for (const sd of [-1, 1]) {
        limb(ctx, sd * 0.55, 4.25, sd * 0.68, 6.3, 0.74, NAVY_D);
        ctx.lineCap = 'butt';
        ctx.strokeStyle = BAND;
        ctx.lineWidth = 0.16;
        ctx.beginPath();
        ctx.moveTo(sd * 0.62 - 0.36, 5.55);
        ctx.lineTo(sd * 0.62 + 0.36, 5.58);
        ctx.stroke();
        ctx.fillStyle = '#2A2420';
        ctx.strokeStyle = INK;
        ctx.lineWidth = 0.07;
        ctx.beginPath();
        DG.rr(ctx, sd * 0.68 - 0.45 + sd * 0.12, 6.2, 0.9, 0.42, 0.18);
        ctx.fill();
        ctx.stroke();
      }
    }
    // ---- torso ----
    const ty = br;
    ctx.save();
    ctx.translate(0, ty);
    ctx.fillStyle = NAVY;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 0.08;
    const bot = o.full ? 4.45 : 9;
    ctx.beginPath();
    ctx.moveTo(-0.42, 1.15);
    ctx.quadraticCurveTo(-1.35, 1.25, -1.55, 1.95);
    ctx.quadraticCurveTo(-1.5, 3.3, -1.25, 4.1);
    ctx.lineTo(-1.2, bot);
    ctx.lineTo(1.2, bot);
    ctx.lineTo(1.25, 4.1);
    ctx.quadraticCurveTo(1.5, 3.3, 1.55, 1.95);
    ctx.quadraticCurveTo(1.35, 1.25, 0.42, 1.15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.clip();
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.fillRect(0.6, 1, 1.2, 4);
    // reflective bands: shoulder straps + chest band
    ctx.fillStyle = BAND;
    ctx.fillRect(-0.95, 1.2, 0.26, 2.0);
    ctx.fillRect(0.69, 1.2, 0.26, 2.0);
    ctx.fillRect(-1.6, 3.05, 3.2, 0.26);
    ctx.fillStyle = C.amber;
    ctx.fillRect(-1.6, 3.15, 3.2, 0.06);
    ctx.fillRect(-0.86, 1.2, 0.06, 2.0);
    ctx.fillRect(0.78, 1.2, 0.06, 2.0);
    // belt
    ctx.fillStyle = '#2B2F38';
    ctx.fillRect(-1.6, 3.95, 3.2, 0.22);
    ctx.fillStyle = '#C9CED4';
    ctx.fillRect(-0.16, 3.93, 0.32, 0.26);
    ctx.restore();
    // collar
    ctx.fillStyle = NAVY_D;
    ctx.beginPath();
    ctx.moveTo(-0.5, 1.12);
    ctx.lineTo(0, 1.75);
    ctx.lineTo(0.5, 1.12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // chest patch: helix + wordmark
    if (DG.IMG.logo) ctx.drawImage(DG.IMG.logo, 0.98 - 0.22, 2.2, 0.38, 0.38);
    ctx.save();
    ctx.scale(0.01, 0.01);
    DG.text(ctx, 'Drill', -150, 260, { size: 24, tracking: 0, shadow: false, color: C.paper });
    DG.text(ctx, 'Geo', -150 + DG.measure(ctx, 'Drill', { size: 24, tracking: 0 }), 260, { size: 24, tracking: 0, shadow: false, color: C.blue });
    ctx.restore();
    ctx.restore();
    // ---- neck ----
    ctx.fillStyle = SKIN_D;
    ctx.fillRect(-0.34, 0.75, 0.68, 0.55);
    // ---- head ----
    const tilt = (talk - 0.3) * 0.035 + Math.sin(t * 2.1) * 0.02 + (o.tilt || 0);
    ctx.save();
    ctx.translate(0, br * 0.6);
    ctx.rotate(tilt);
    // ears
    for (const sd of [-1, 1]) {
      ctx.fillStyle = SKIN;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 0.07;
      ctx.beginPath();
      ctx.ellipse(sd * 0.98, 0.12, 0.17, 0.25, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    // face
    ctx.fillStyle = SKIN;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 0.08;
    ctx.beginPath();
    ctx.moveTo(-0.98, -0.2);
    ctx.bezierCurveTo(-1.02, 0.55, -0.55, 1.0, 0, 1.02);
    ctx.bezierCurveTo(0.55, 1.0, 1.02, 0.55, 0.98, -0.2);
    ctx.bezierCurveTo(0.95, -0.9, -0.95, -0.9, -0.98, -0.2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.clip();
    ctx.fillStyle = 'rgba(90,50,30,0.22)';
    ctx.beginPath();
    ctx.ellipse(0.85, 0.3, 0.5, 1.0, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // sideburns
    ctx.fillStyle = HAIR;
    for (const sd of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(sd * 0.98, -0.45);
      ctx.lineTo(sd * 0.98, 0.1);
      ctx.lineTo(sd * 0.84, 0.0);
      ctx.lineTo(sd * 0.8, -0.45);
      ctx.closePath();
      ctx.fill();
    }
    // cheeks
    ctx.fillStyle = 'rgba(225,110,95,0.28)';
    for (const sd of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(sd * 0.6, 0.42, 0.17, 0.09, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // eyes
    const blinkPh = fract((t + 0.37) / 3.6);
    const blink = blinkPh < 0.035 ? 1 - Math.abs(blinkPh / 0.0175 - 1) : 0;
    const lk = o.look || [0, 0];
    for (const sd of [-1, 1]) {
      const ex = sd * 0.38,
        ey = 0.05;
      ctx.save();
      ctx.translate(ex, ey);
      ctx.scale(1, Math.max(0.08, 1 - blink));
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(0, 0, 0.21, 0.26, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.save();
      ctx.clip();
      ctx.fillStyle = '#4A2C1C';
      ctx.beginPath();
      ctx.arc(lk[0] * 0.07, lk[1] * 0.07 + 0.02, 0.16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#120C09';
      ctx.beginPath();
      ctx.arc(lk[0] * 0.08, lk[1] * 0.08 + 0.02, 0.085, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(lk[0] * 0.07 - 0.06, lk[1] * 0.07 - 0.06, 0.05, 0, Math.PI * 2);
      ctx.arc(lk[0] * 0.07 + 0.05, lk[1] * 0.07 + 0.07, 0.022, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.restore();
      // upper lash line
      ctx.strokeStyle = INK;
      ctx.lineWidth = 0.09;
      ctx.lineCap = 'round';
      ctx.beginPath();
      const ly = ey - 0.24 * (1 - blink) + 0.02;
      ctx.moveTo(ex - 0.23, ey + 0.02 * (1 - blink) - 0.02);
      ctx.quadraticCurveTo(ex, ly - 0.08 * (1 - blink), ex + 0.23, ey + 0.02 * (1 - blink) - 0.04);
      ctx.stroke();
      // brow
      const raise = (o.brow || 0) + talk * 0.06;
      ctx.lineWidth = 0.11;
      ctx.beginPath();
      ctx.moveTo(ex - 0.2 * sd - 0.02 * sd, -0.32 - raise + 0.03);
      ctx.quadraticCurveTo(ex, -0.4 - raise, ex + 0.22 * sd, -0.33 - raise + 0.04);
      ctx.strokeStyle = HAIR;
      ctx.stroke();
    }
    // nose
    ctx.strokeStyle = SKIN_D;
    ctx.lineWidth = 0.07;
    ctx.beginPath();
    ctx.moveTo(0.03, 0.22);
    ctx.quadraticCurveTo(0.1, 0.34, 0.0, 0.36);
    ctx.stroke();
    // mouth (lip-sync)
    const mo = clamp(talk);
    const mw = 0.3 + 0.08 * mo,
      mh = 0.05 + 0.3 * mo;
    ctx.save();
    ctx.translate(0, 0.6);
    if (mo < 0.08) {
      ctx.strokeStyle = '#5A2A20';
      ctx.lineWidth = 0.08;
      ctx.beginPath();
      ctx.moveTo(-0.22, -0.03);
      ctx.quadraticCurveTo(0, 0.12, 0.22, -0.03);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#5A1C18';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 0.06;
      ctx.beginPath();
      ctx.moveTo(-mw, -0.04);
      ctx.quadraticCurveTo(0, -0.08, mw, -0.04);
      ctx.quadraticCurveTo(mw * 0.9, mh, 0, mh + 0.04);
      ctx.quadraticCurveTo(-mw * 0.9, mh, -mw, -0.04);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.save();
      ctx.clip();
      ctx.fillStyle = '#F4F1EA';
      ctx.fillRect(-mw, -0.08, mw * 2, 0.07 + 0.03 * mo);
      ctx.fillStyle = '#D9675E';
      ctx.beginPath();
      ctx.ellipse(0, mh + 0.02, mw * 0.6, 0.1 * mo + 0.02, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
    // hard hat
    ctx.fillStyle = '#F4F6F8';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 0.08;
    ctx.beginPath();
    ctx.moveTo(-1.1, -0.38);
    ctx.bezierCurveTo(-1.15, -1.55, 1.15, -1.55, 1.1, -0.38);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(150,165,185,0.35)';
    ctx.beginPath();
    ctx.ellipse(0.55, -0.75, 0.38, 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath();
    ctx.ellipse(-0.45, -1.0, 0.25, 0.14, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(150,160,175,0.9)';
    ctx.lineWidth = 0.08;
    ctx.beginPath();
    ctx.moveTo(0, -1.4);
    ctx.lineTo(0, -0.42);
    ctx.stroke();
    // brim
    ctx.fillStyle = '#E8EBEF';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 0.08;
    ctx.beginPath();
    ctx.ellipse(0, -0.38, 1.3, 0.17, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // helix mark on the hat
    if (DG.IMG.logo) ctx.drawImage(DG.IMG.logo, -0.27 - 0.32, -1.0, 0.5, 0.5);
    // safety glasses pushed up on the hat
    ctx.fillStyle = 'rgba(190,225,250,0.55)';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 0.06;
    for (const sd of [-1, 1]) {
      ctx.beginPath();
      DG.rr(ctx, sd * 0.47 - 0.25 + 0.3, -0.66, 0.44, 0.22, 0.09);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore(); // head
    // ---- arms (blended gesture) ----
    let L = blendPose(g0.L, g1.L, k),
      R = blendPose(g0.R, g1.R, k);
    if (g1.wave) R = [R[0], R[1] + Math.sin(t * 9) * 0.35 * k, R[2]];
    if (g1.talk) {
      const w = Math.sin(t * 3.1) * 0.12 * k * (0.4 + talk);
      L = [L[0] + w * 0.4, L[1] - w, L[2]];
      R = [R[0] - w * 0.4, R[1] + w, R[2]];
    }
    arm(ctx, -1, L, br, t);
    arm(ctx, 1, R, br, t);
    ctx.restore();
  }

  // ---------- staging: where the mascot is and what it does ----------
  const PRESENTER = { x: 222, y: 1334, u: 82 };
  const FULL = { x: 540, y: 820, u: 132 };

  function lineAt(T) {
    for (const sc of DG.TL.scenes) for (const k in sc.lines) {
      const l = sc.lines[k];
      if (T >= l.gstart && T < l.gstart + l.dur) return l;
    }
    return null;
  }
  function mouthAt(T) {
    const l = lineAt(T);
    if (!l || !DG.MOUTH || !DG.MOUTH[l.id]) return 0;
    const a = DG.MOUTH[l.id];
    const f = (T - l.gstart) * DG.FPS;
    const i = Math.floor(f);
    return lerp(a[i] || 0, a[i + 1] || 0, f - i);
  }

  /* default choreography: point at the content when a line starts, then talk with
     the hands; scenes may give explicit cues: [[localTime, gesture], ...] */
  function gestureAt(T, sc) {
    const m = DG.SCENES[sc.id];
    const local = T - sc.start;
    let keys = m && m.mascot ? m.mascot(DG.sceneInfo(sc)) : null;
    if (!keys || !keys.length) {
      keys = [[0, 'idle']];
      for (const k in sc.lines) {
        const l = sc.lines[k];
        keys.push([l.start, 'point_up'], [l.start + 1.3, 'explain'], [l.start + l.dur * 0.6, 'explain_r'], [l.start + l.dur + 0.1, 'idle']);
      }
    }
    keys.sort((a, b) => a[0] - b[0]);
    let cur = keys[0],
      prev = keys[0];
    for (const kk of keys) if (kk[0] <= local) {
      prev = cur;
      cur = kk;
    }
    return { gesture: cur[1], prev: prev[1], gk: E.inOutSine(clamp((local - cur[0]) / 0.38)) };
  }

  function overlay(ctx, T) {
    const sc = DG.TL.scenes.find((s) => T >= s.start && T < s.end) || DG.TL.scenes[DG.TL.scenes.length - 1];
    const m = DG.SCENES[sc.id];
    const local = T - sc.start;
    const st = m && m.mascotStage ? m.mascotStage(local, DG.sceneInfo(sc)) : { mode: 'presenter' };
    if (st.mode === 'none') return;
    const fk = st.fullK == null ? (st.mode === 'full' ? 1 : 0) : st.fullK;
    const pos = { x: lerp(PRESENTER.x, FULL.x, fk), y: lerp(PRESENTER.y, FULL.y, fk), u: lerp(PRESENTER.u, FULL.u, fk) };
    const enter = st.enter == null ? 1 : st.enter;
    pos.y += (1 - E.outBack(clamp(enter))) * 520;
    const g = gestureAt(T, sc);
    const talking = mouthAt(T);
    const look = g.gesture.startsWith('point') ? [0.8, -0.6] : st.look || [0.15, 0];
    draw(ctx, { ...pos, t: T, mouth: talking, gesture: g.gesture, prev: g.prev, gk: g.gk, look, full: fk > 0.5, alpha: st.alpha, brow: st.brow });
  }

  DG.MASCOT = { draw, overlay, G, mouthAt, lineAt, PRESENTER, FULL };
})();
