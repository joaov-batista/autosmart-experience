/* S04 — Para que serve o líquido? The close-up turns into an x-ray half
   section: fluid goes down between the inner and outer tubes, out through the
   crown waterways, and back up the annulus carrying cuttings. The camera pulls
   back to the whole (not-to-scale) circuit: pump → swivel → rods → bit →
   annulus → collar → settling box → pump. */
(function () {
  const DG = window.DG;
  const { clamp, lerp, ep, seg, smooth, E, hash, glow, rgba, C, BIT } = DG;

  function times(S) {
    const L = S.L('N05');
    return {
      L,
      xray: [0.0, 1.0],
      title: L.start + 0.5,
      pull: [Math.max(3.0, L.start + L.dur * 0.3), Math.max(4.1, L.start + L.dur * 0.3 + 1.1)],
      chips: [L.start + L.dur * 0.46, L.start + L.dur * 0.64],
      back: [S.dur - 1.05, S.dur],
    };
  }

  // ---------- close-up x-ray ----------
  const CL = () => DG.CLOSE;
  function xrayClose(ctx, t, S, T, gt) {
    const { K, FACE_Y, BIT_DEPTH, ADV } = CL();
    const faceDepth = BIT_DEPTH + (ADV + 8 * gt) / 1000;
    const rot = DG.rampAngle(gt + 20, -3, 1, 7.5);
    CL().drawRock(ctx, faceDepth);
    const xa = E.inOutSine(seg(t, T.xray[0], T.xray[1]));
    const CT = CL().coreTex();
    ctx.save();
    ctx.translate(540, FACE_Y);
    ctx.scale(K, K);
    const top = -(FACE_Y / K) - 20;
    // section view (inside)
    BIT.section(ctx, { top, rot, coreTop: -900, tex: CT.cv, texS: K, texD0: CT.d0 * 1000, faceDepth: faceDepth * 1000, itTop: top - 40 });
    fluidSection(ctx, t, top, xa);
    // exterior fading away
    if (xa < 1) {
      ctx.globalAlpha = 1 - xa;
      BIT.exterior(ctx, { rot, top, lw: 0.7 });
      ctx.globalAlpha = 1;
    }
    ctx.restore();
    CL().chips(ctx, t + 30, 0.6 + 0.4 * xa, xa);
  }

  // fluid particles in local mm coordinates (section view)
  function fluidSection(ctx, t, top, a) {
    if (a <= 0) return;
    const G = BIT.G;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const n = 260;
    for (let i = 0; i < n; i++) {
      const side = i % 2 ? 1 : -1;
      const u = (hash(i * 7 + 3) + t * 0.42) % 1; // path parameter
      // path: down the gap (top → -20), across the face (Ri → Rh), up the annulus
      const L1 = -top - 20,
        L2 = G.Rh - G.Ri + 6,
        L3 = -top;
      const Ltot = L1 + L2 + L3;
      let d = u * Ltot,
        x,
        y;
      if (d < L1) {
        x = side * (G.itR + 1 + hash(i) * 0.9);
        y = top + d;
      } else if (d < L1 + L2) {
        const k = (d - L1) / L2;
        x = side * lerp(G.itR + 1, G.Rh - 1.5, k);
        y = lerp(-20, 1.6, Math.sin(k * Math.PI * 0.5));
      } else {
        const k = (d - L1 - L2) / L3;
        x = side * (G.otR + 1.2 + hash(i * 3) * (G.Rh - G.otR - 2.2));
        y = lerp(1.0, top, k);
      }
      const r = 1.3 + hash(i * 5) * 1.4;
      ctx.fillStyle = rgba(C.blue, 0.85 * a);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      // cuttings carried upwards in the annulus
      if (d > L1 + L2 * 0.6 && hash(i * 11) < 0.55) {
        ctx.fillStyle = `rgba(190,180,160,${0.8 * a})`;
        ctx.fillRect(x + 0.6, y - 1.6, 1.3, 1.3);
      }
    }
    // translucent fluid bodies
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = rgba(C.blue, 0.34 * a);
    for (const sgn of [-1, 1]) {
      ctx.fillRect(sgn < 0 ? -G.otRi : G.itR, top, G.otRi - G.itR, -top - 20);
      ctx.fillRect(sgn < 0 ? -G.Rh : G.otR, top, G.Rh - G.otR, -top + 1.5);
    }
    ctx.fillRect(-G.Rh, -1, 2 * G.Rh, 3);
    ctx.restore();
  }

  // ---------- full circuit schematic (screen space) ----------
  const X = 540, ROD = 40, HOLE = 86, OT = 64, IT = 48;
  const Y = { swivel: 400, ground: 640, brk: 930, barrel: 1060, face: 1420 };
  const PATH = [
    [820, 500], [820, 330], [660, 300], [X, 338], // pump → hose → swivel
    [X, Y.barrel], // down the rods
    [X + 56, Y.barrel + 40], [X + 56, Y.face - 20], // between inner and outer tube
    [X + 80, Y.face + 6], // out at the face
    [X + 75, Y.ground + 14], // up the annulus
    [X + 110, Y.ground + 16], [700, Y.ground + 14], // return line
    [740, 700], [880, 712], [905, 640], [850, 590], [820, 560], // settling box → suction → pump
  ];
  const segs = [];
  let PLEN = 0;
  for (let i = 1; i < PATH.length; i++) {
    const l = Math.hypot(PATH[i][0] - PATH[i - 1][0], PATH[i][1] - PATH[i - 1][1]);
    segs.push([PLEN, l]);
    PLEN += l;
  }
  function along(d) {
    d = ((d % PLEN) + PLEN) % PLEN;
    for (let i = 0; i < segs.length; i++) {
      const [s0, l] = segs[i];
      if (d <= s0 + l) {
        const k = (d - s0) / l;
        return [lerp(PATH[i][0], PATH[i + 1][0], k), lerp(PATH[i][1], PATH[i + 1][1], k), i];
      }
    }
    return [PATH[0][0], PATH[0][1], 0];
  }

  function schematic(ctx, t, S, T, a) {
    ctx.save();
    ctx.globalAlpha = a;
    // background: the real geological column, with the omitted stretch at the break
    ctx.fillStyle = '#0B111F';
    ctx.fillRect(0, 0, DG.W, DG.H);
    const sky = ctx.createLinearGradient(0, 0, 0, Y.ground);
    sky.addColorStop(0, '#16224A');
    sky.addColorStop(1, '#3A3F6A');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, DG.W, Y.ground);
    const R = DG.CLOSE.column();
    const sc = 18;
    ctx.save();
    ctx.globalAlpha *= 0.5;
    ctx.beginPath();
    ctx.rect(0, Y.ground, DG.W, Y.brk - Y.ground);
    ctx.clip();
    ctx.drawImage(R.cv, 540 + R.x0 * sc, Y.ground + R.y0 * sc, R.cv.width * (sc / R.s), R.cv.height * (sc / R.s));
    ctx.restore();
    ctx.save();
    ctx.globalAlpha *= 0.5;
    ctx.beginPath();
    ctx.rect(0, Y.brk, DG.W, DG.H - Y.brk);
    ctx.clip();
    const d0 = 117 - (Y.face - Y.brk) / sc;
    ctx.drawImage(R.cv, 540 + R.x0 * sc, Y.brk + (R.y0 - d0) * sc, R.cv.width * (sc / R.s), R.cv.height * (sc / R.s));
    ctx.restore();
    const vg = ctx.createLinearGradient(0, Y.ground, 0, DG.H);
    vg.addColorStop(0, 'rgba(11,17,31,0.2)');
    vg.addColorStop(1, 'rgba(11,17,31,0.75)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, Y.ground, DG.W, DG.H - Y.ground);
    // mast (context)
    ctx.fillStyle = 'rgba(242,169,59,0.55)';
    ctx.fillRect(X - 118, 0, 34, Y.ground - 40);
    // grid
    ctx.strokeStyle = 'rgba(76,155,234,0.07)';
    ctx.lineWidth = 1;
    for (let x = 0; x < DG.W; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, DG.H);
      ctx.stroke();
    }
    for (let y = 0; y < DG.H; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(DG.W, y);
      ctx.stroke();
    }
    // ground line
    ctx.strokeStyle = rgba(C.paper, 0.6);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(60, Y.ground);
    ctx.lineTo(1020, Y.ground);
    ctx.stroke();
    // hole walls (with break)
    ctx.fillStyle = '#05070C';
    ctx.fillRect(X - HOLE, Y.ground, HOLE * 2, Y.face - Y.ground + 18);
    ctx.strokeStyle = rgba(C.paperDim, 0.9);
    ctx.lineWidth = 2;
    for (const sgn of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(X + sgn * HOLE, Y.ground);
      ctx.lineTo(X + sgn * HOLE, Y.face + 18);
      ctx.stroke();
    }
    // casing
    ctx.fillStyle = '#6E7783';
    ctx.fillRect(X - HOLE - 6, Y.ground - 18, 10, 130);
    ctx.fillRect(X + HOLE - 4, Y.ground - 18, 10, 130);
    // rods
    const rot = t * 7.5;
    ctx.save();
    ctx.globalAlpha *= 0.9;
    DG.RIG.rod(ctx, X, Y.swivel + 40, Y.barrel, ROD * 2 + 16, rot, { pitch: 70 });
    ctx.restore();
    ctx.fillStyle = 'rgba(5,8,14,0.72)';
    ctx.fillRect(X - ROD + 4, Y.swivel + 40, (ROD - 4) * 2, Y.barrel - Y.swivel - 40);
    // barrel: outer tube, inner tube, core
    ctx.fillStyle = DG.metalGrad(ctx, X - OT, X + OT, '#7C8693', '#E1E7EE', '#262C35');
    ctx.fillRect(X - OT, Y.barrel, OT * 2, Y.face - Y.barrel);
    ctx.fillStyle = '#0B0E13';
    ctx.fillRect(X - OT + 8, Y.barrel + 12, (OT - 8) * 2, Y.face - Y.barrel - 26);
    ctx.fillStyle = DG.metalGrad(ctx, X - IT, X + IT, '#566070', '#B3BDC8', '#232832');
    ctx.fillRect(X - IT, Y.barrel + 22, IT * 2, Y.face - Y.barrel - 40);
    ctx.fillStyle = '#4A6A5E';
    ctx.fillRect(X - IT + 8, Y.barrel + 140, (IT - 8) * 2, Y.face - Y.barrel - 142);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(X - IT + 8, Y.barrel + 140, 14, Y.face - Y.barrel - 142);
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.fillRect(X - IT + 26, Y.barrel + 140, 8, Y.face - Y.barrel - 142);
    // crown (ring in section)
    ctx.fillStyle = '#4A4038';
    ctx.fillRect(X - HOLE + 4, Y.face - 26, HOLE - IT - 2, 26);
    ctx.fillRect(X + IT - 2, Y.face - 26, HOLE - IT - 2, 26);
    // break symbol (hundreds of metres omitted)

    ctx.fillStyle = '#0F1C3D';
    ctx.fillRect(X - HOLE - 30, Y.brk - 24, HOLE * 2 + 60, 48);
    DG.breakSymbol(ctx, X, Y.brk, HOLE * 2 + 70, { color: C.paper });
    // surface kit: head + swivel, pump, settling box
    DG.RIG.box(ctx, X - 80, Y.swivel - 44, 160, 96, '#F2A93B', { r: 10, lw: 3 });
    ctx.fillStyle = '#9AA3AE';
    ctx.fillRect(X - 12, Y.swivel - 80, 24, 40);
    DG.RIG.box(ctx, 750, 490, 150, 96, '#2F5E8C', { r: 10, lw: 3 });
    ctx.fillStyle = '#D9DEE5';
    ctx.beginPath();
    ctx.arc(825, 538, 20, 0, Math.PI * 2);
    ctx.fill();
    // settling box (partly buried)
    ctx.fillStyle = '#3E4652';
    ctx.fillRect(700, Y.ground - 16, 220, 106);
    ctx.fillStyle = rgba(C.blue, 0.5);
    ctx.fillRect(708, Y.ground + 6, 204, 76);
    ctx.fillStyle = 'rgba(170,150,120,0.85)';
    const pile = 6 + 12 * smooth(T.pull[1], S.dur, t);
    ctx.fillRect(708, Y.ground + 82 - pile, 204, pile);
    // hoses/pipes
    ctx.strokeStyle = '#1E2A3A';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.lineWidth = 18;
    ctx.moveTo(820, 492);
    ctx.lineTo(820, 330);
    ctx.lineTo(660, 300);
    ctx.lineTo(X, Y.swivel - 76);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X + HOLE, Y.ground + 16);
    ctx.lineTo(712, Y.ground + 14);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(890, Y.ground + 40);
    ctx.lineTo(905, 640);
    ctx.lineTo(860, 584);
    ctx.stroke();
    // flow particles
    ctx.globalCompositeOperation = 'lighter';
    const N = 300;
    for (let i = 0; i < N; i++) {
      const d = hash(i * 13 + 1) * PLEN + t * 260;
      const [x, y, si] = along(d);
      const jx = (hash(i * 7) - 0.5) * (si >= 4 && si <= 8 ? 10 : 12);
      ctx.fillStyle = rgba(C.blue, 0.75);
      ctx.beginPath();
      ctx.arc(x + jx, y + (hash(i * 9) - 0.5) * 8, 4 + 3 * hash(i), 0, Math.PI * 2);
      ctx.fill();
      // cuttings ride from the face to the settling box
      if (si >= 6 && si <= 11 && hash(i * 17) < 0.6) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(200,180,150,0.95)';
        ctx.fillRect(x + jx + 5, y - 4, 6, 6);
        ctx.globalCompositeOperation = 'lighter';
      }
    }
    // direction chevrons
    ctx.globalCompositeOperation = 'source-over';
    for (let k = 0; k < 14; k++) {
      const d = (k / 14) * PLEN + t * 90;
      const [x, y] = along(d);
      const [x2, y2] = along(d + 6);
      DG.arrowHead(ctx, x, y, Math.atan2(y2 - y, x2 - x), 22, rgba(C.paper, 0.9));
    }
    ctx.restore();
  }

  function overlays(ctx, t, S, T, a) {
    DG.text(ctx, 'ÁGUA', 600, 470, { size: 40, color: C.blue, alpha: ep(t, T.title, T.title + 0.8, 'linear') * a });
    const chips = [['ESFRIA', X + 100, Y.face - 40], ['LEVA O PÓ', X + 110, Y.ground + 300]];
    chips.forEach(([txt, x, y], i) => {
      const p = ep(t, T.chips[i], T.chips[i] + 0.6, 'outCubic') * a;
      if (p <= 0) return;
      const w = DG.measure(ctx, txt, { size: 32 }) + 40;
      const right = x > X;
      const bx = right ? x : x - w;
      ctx.save();
      ctx.globalAlpha = p;
      DG.rr(ctx, bx, y - 28, w, 56, 28);
      ctx.fillStyle = 'rgba(11,14,20,0.75)';
      ctx.fill();
      ctx.strokeStyle = rgba(C.blue, 0.9);
      ctx.lineWidth = 2;
      ctx.stroke();
      DG.text(ctx, txt, bx + 20, y + 1, { size: 32, shadow: false });
      ctx.restore();
    });
  }

  DG.SCENES.s04 = {
    draw(ctx, t, S) {
      const T = times(S);
      const gt = S.start + t; // global time keeps rotation continuous with S03
      const pk = E.inOutCubic(seg(t, T.pull[0], T.pull[1]));
      const bk = E.inCubic(seg(t, T.back[0], T.back[1]));
      if (pk < 1) {
        ctx.save();
        // pull back: the close-up shrinks onto the bit position of the schematic
        const f = lerp(1, 0.095, pk);
        ctx.translate(540, lerp(CL().FACE_Y, Y.face, pk));
        ctx.scale(f, f);
        ctx.translate(-540, -CL().FACE_Y);
        ctx.globalAlpha = 1 - E.inQuad(pk);
        xrayClose(ctx, t, S, T, gt);
        ctx.restore();
      }
      if (pk > 0) {
        ctx.save();
        if (bk > 0) {
          // push back into the barrel (continues in S05)
          const f = lerp(1, 9, bk);
          ctx.translate(540, Y.barrel + 150);
          ctx.scale(f, f);
          ctx.translate(-540, -(Y.barrel + 150));
        }
        schematic(ctx, t, S, T, pk);
        ctx.restore();
      }
      if (bk < 0.3) {
        ctx.save();
        ctx.globalAlpha = 1 - bk / 0.3;
        overlays(ctx, t, S, T, pk);
        ctx.restore();
      }
      if (bk > 0.55) {
        ctx.fillStyle = `rgba(11,14,20,${(bk - 0.55) / 0.45})`;
        ctx.fillRect(0, 0, DG.W, DG.H);
      }
    },
    cues(S) {
      const T = times(S);
      return [
        { type: 'rotation_loop', t: 0, dur: S.dur },
        { type: 'xray_sweep', t: 0.05 },
        { type: 'fluid_flow', t: 0, dur: S.dur },
        { type: 'pump', t: T.pull[0], dur: S.dur - T.pull[0] },
        { type: 'pull_back_whoosh', t: T.pull[0] - 0.1, dur: 1.3 },
        { type: 'ui_tick', t: T.title + 0.3 },
        ...T.chips.map((c) => ({ type: 'ui_pop', t: c + 0.1 })),
        { type: 'push_in_whoosh', t: T.back[0] - 0.1, dur: 1.2 },
      ];
    },
  };
})();
