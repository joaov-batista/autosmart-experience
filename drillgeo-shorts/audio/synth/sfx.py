"""Sound effects synthesised for each cue type of build/timeline.json.
Every function returns a stereo array; each instance gets its own seed so
repeated cues vary naturally (no copy-paste loops)."""
import numpy as np
from dsp import (SR, white, pink, brown, lp, hp, bp, sweep_filter, env_exp, env_adsr, fade, osc, fm_bell, modal,
                 karplus, reverb, pan, rng, db, t_axis, peaking)


def n_of(d):
    return max(1, int(d * SR))


def st(x, p=0.0, w=0.3):
    return pan(x, p, w)


# ---------- ambiences ----------
def amb_nature(dur, seed=1, **k):
    n = n_of(dur)
    t = np.arange(n) / SR
    wind_l = lp(pink(n, seed), 520) * (0.55 + 0.45 * np.sin(2 * np.pi * 0.11 * t + 1.0))
    wind_r = lp(pink(n, seed + 1), 560) * (0.55 + 0.45 * np.sin(2 * np.pi * 0.09 * t))
    gust = lp(np.abs(white(n, seed + 2)), 0.6) * 40
    wind = np.stack([wind_l, wind_r], 1) * (0.5 + gust[:, None] * 0.0) * 0.22
    out = wind
    r = rng(seed + 3)
    # birds: short FM chirps
    for i in range(int(dur * 1.3)):
        ts = r.uniform(0, max(0.1, dur - 0.6))
        f0 = r.uniform(2400, 4200)
        m = int(r.uniform(0.06, 0.16) * SR)
        tt = np.arange(m) / SR
        f = f0 * (1 + 0.25 * np.sin(2 * np.pi * r.uniform(18, 34) * tt)) * (1 + r.uniform(-0.3, 0.3) * tt / tt[-1])
        ch = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt / tt[-1]) ** 2
        for rep in range(r.integers(1, 4)):
            i0 = int((ts + rep * r.uniform(0.12, 0.2)) * SR)
            if i0 + m < n:
                out[i0:i0 + m] += pan(ch * 0.05, r.uniform(-0.8, 0.8))
    # insects: faint high tremolo
    ins = bp(white(n, seed + 4), 5200, 6400) * (0.5 + 0.5 * np.sin(2 * np.pi * 23 * t)) * 0.02
    out += np.stack([ins, ins * 0.7], 1)
    return fade(out, 0.6, 1.2)


def amb_site(dur, seed=2, soft=0, **k):
    n = n_of(dur)
    t = np.arange(n) / SR
    w = np.stack([lp(pink(n, seed), 420), lp(pink(n, seed + 1), 460)], 1) * 0.12 * (0.7 + 0.3 * np.sin(2 * np.pi * 0.07 * t))[:, None]
    r = rng(seed + 5)
    for i in range(int(dur * 0.5)):
        ts = r.uniform(0, max(0.1, dur - 0.3))
        f0 = r.uniform(2600, 3800)
        m = int(0.09 * SR)
        tt = np.arange(m) / SR
        ch = np.sin(2 * np.pi * f0 * tt * (1 + 0.3 * tt / tt[-1])) * np.sin(np.pi * tt / tt[-1]) ** 2 * 0.03
        i0 = int(ts * SR)
        if i0 + m < n:
            w[i0:i0 + m] += pan(ch, r.uniform(-0.9, 0.9))
    return fade(w * (0.6 if soft else 1), 0.5, 0.8)


# ---------- whooshes / transitions ----------
def whoosh(dur, seed=3, f0=300, f1=3000, gain=0.6, pan0=-0.4, pan1=0.4, shape=1.6):
    n = n_of(dur)
    tt = np.linspace(0, 1, n)
    x = pink(n, seed)
    y = sweep_filter(x, 'bp', f0, f1, q=1.8)
    e = np.sin(np.pi * np.clip(tt, 0, 1)) ** shape
    e *= np.clip(tt * 6, 0, 1)
    y = y * e * gain
    L = y * np.cos((np.linspace(pan0, pan1, n) + 1) * np.pi / 4)
    R = y * np.sin((np.linspace(pan0, pan1, n) + 1) * np.pi / 4)
    return np.stack([L, R], 1)


def whoosh_down(dur, seed=4, **k):
    return whoosh(dur, seed, 2500, 160, 0.7, 0.3, -0.3) + st(impact_low(dur, 70, 30, 0.25, seed), 0, 0)[:n_of(dur)]


def whip_up(dur, seed=5, **k):
    return whoosh(dur, seed, 200, 5000, 0.75, -0.5, 0.5, shape=2.5)


def dive_whoosh(dur, seed=6, **k):
    return whoosh(dur, seed, 1800, 140, 0.6, 0.2, -0.2, 1.2)


def rise_whoosh(dur, seed=7, **k):
    return whoosh(dur, seed, 160, 2600, 0.55, -0.2, 0.2, 1.2)


def pull_back_whoosh(dur, seed=8, **k):
    return whoosh(dur, seed, 1200, 300, 0.45, 0.4, -0.4)


def push_in_whoosh(dur, seed=9, **k):
    return whoosh(dur, seed, 300, 1800, 0.45, -0.4, 0.4)


def return_whoosh(dur, seed=10, **k):
    return whoosh(dur, seed, 2200, 250, 0.4, -0.3, 0.3) + st(shimmer(dur, seed, 0.12), 0, 0.5)[:n_of(dur)]


def impact_low(dur, f0=62, f1=28, gain=0.8, seed=0):
    n = n_of(dur)
    t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t * 5)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(n, 0.55, 0.002) * gain
    return y


def impact_sub(dur=2.5, seed=11, **k):
    n = n_of(2.5)
    y = impact_low(2.5, 70, 26, 0.9, seed)
    th = lp(white(n, seed), 400) * env_exp(n, 0.09) * 0.5
    crack = hp(white(n, seed + 1), 2500) * env_exp(n, 0.03) * 0.25
    return reverb(st(y + th + crack, 0, 0.4), 0.25, 2.8)


def impact_arrive(dur=2.0, seed=12, **k):
    n = n_of(2.0)
    y = impact_low(2.0, 80, 34, 0.75, seed) + lp(white(n, seed), 300) * env_exp(n, 0.07) * 0.4
    return reverb(st(y, 0, 0.3), 0.2, 2.0)


def logo_hit(dur=4.5, seed=13, **k):
    n = n_of(4.5)
    y = impact_low(4.5, 66, 30, 0.7, seed)
    bells = sum(fm_bell(f, 4.5, ratio=3.01, index=1.4, decay=2.2) for f in [587.33, 880.0, 1174.66]) * 0.12
    shim = shimmer(4.5, seed, 0.1)
    return reverb(st(y + bells + shim, 0, 0.6), 0.45, 3.6)


def logo_spin(dur, seed=14, **k):
    n = n_of(dur)
    tt = np.linspace(0, 1, n)
    f = 300 + 1200 * tt ** 2
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.06 * np.sin(np.pi * tt)
    return reverb(whoosh(dur, seed, 300, 4000, 0.35, -0.6, 0.6, 1.5) + st(tone + shimmer(dur, seed, 0.1), 0, 0.5), 0.35, 3.0)[:n_of(dur) + SR]


def shimmer(dur, seed=15, gain=0.15):
    n = n_of(dur)
    r = rng(seed)
    y = np.zeros(n)
    for i in range(int(dur * 22)):
        ts = r.uniform(0, max(0.01, dur - 0.15))
        f = r.choice([1174.7, 1318.5, 1760.0, 2349.3, 2637.0, 3520.0]) * r.uniform(0.998, 1.002)
        m = int(r.uniform(0.08, 0.3) * SR)
        g = fm_bell(f, m / SR, ratio=2.0, index=0.6, decay=m / SR * 0.5) * r.uniform(0.3, 1)
        i0 = int(ts * SR)
        y[i0:i0 + len(g)] += g[:max(0, n - i0)]
    y += hp(white(n, seed), 6000) * 0.05 * np.sin(np.pi * np.linspace(0, 1, n))
    return y * gain


def scan_shimmer(dur, seed=16, **k):
    return reverb(st(shimmer(dur, seed, 0.22), 0, 0.8), 0.4, 2.6)


def interest_chime(dur=3.0, seed=17, idx=0, **k):
    notes = [[587.33, 880.0], [659.25, 987.77], [587.33, 1174.66], [698.46, 1046.5]][seed % 4]
    y = sum(fm_bell(f, 3.0, ratio=3.5, index=1.8, decay=1.4) for f in notes) * 0.16
    return reverb(st(y, 0.2, 0.6), 0.45, 3.0)


def earth_rumble(dur, seed=18, **k):
    n = n_of(dur)
    y = lp(brown(n, seed), 140) * 0.55 * np.sin(np.pi * np.linspace(0, 1, n)) ** 0.7
    r = rng(seed)
    for i in range(int(dur * 30)):
        i0 = int(r.uniform(0, n - 2000))
        y[i0:i0 + 1500] += hp(white(1500, seed + i), 1200) * env_exp(1500, 0.004) * r.uniform(0.05, 0.2)
    return st(y, 0, 0.6)


# ---------- machine ----------
def engine(dur, seed=19, idleUntil=0, rev=0, **k):
    n = n_of(dur)
    t = np.arange(n) / SR
    up = np.clip((t - rev) / 1.4, 0, 1) if rev else np.zeros(n)
    up = up * up * (3 - 2 * up)
    f0 = 21 + 15 * up + 0.4 * np.sin(2 * np.pi * 0.3 * t)
    ph = 2 * np.pi * np.cumsum(f0) / SR
    y = np.zeros(n)
    for h, a in enumerate([1.0, 0.7, 0.55, 0.35, 0.3, 0.2, 0.14, 0.1], start=1):
        y += a * np.sin(h * ph + h * 0.7)
    puls = (0.5 + 0.5 * np.sin(ph)) ** 3
    comb = bp(pink(n, seed), 120, 900) * (0.4 + 0.8 * puls) * (0.6 + 0.6 * up)
    rattle = bp(white(n, seed + 1), 1800, 4200) * (0.5 + 0.5 * np.sin(ph * 2)) ** 6 * 0.25
    y = (y * 0.32 + comb * 0.5 + rattle) * (0.55 + 0.45 * up)
    y = lp(y, 1800)
    return fade(st(y, -0.25, 0.5), 0.4, 0.6) * 0.5


def lever_clunk(dur=0.6, seed=20, **k):
    y = modal([180, 410, 935, 1720], [0.6, 0.4, 0.25, 0.15], [0.09, 0.07, 0.05, 0.03], 0.6, seed)
    y += lp(white(n_of(0.6), seed), 600) * env_exp(n_of(0.6), 0.02) * 0.4
    return reverb(st(y * 0.6, 0.3, 0.2), 0.15, 1.2)


def hydraulic_hiss(dur=1.2, seed=21, **k):
    n = n_of(1.2)
    y = hp(white(n, seed), 2600) * env_adsr(n, 0.02, 0.2, 0.4, 0.6) * 0.18
    wh = np.sin(2 * np.pi * np.cumsum(np.linspace(500, 900, n)) / SR) * env_adsr(n, 0.1, 0.2, 0.5, 0.6) * 0.05
    return st(y + wh, 0.2, 0.4)


def rotation(dur, seed=22, start=False, fadeOut=0, **k):
    n = n_of(dur)
    t = np.arange(n) / SR
    ramp = np.clip(t / 1.8, 0, 1) if start else np.ones(n)
    ramp = ramp * ramp * (3 - 2 * ramp)
    if fadeOut:
        ramp *= np.clip((dur - t) / fadeOut, 0, 1) ** 0.8
    wob = 1 + 0.01 * np.sin(2 * np.pi * 0.21 * t + seed) + 0.006 * lp(white(n, seed), 2)
    fw = (230 + 150 * ramp) * wob
    ph = 2 * np.pi * np.cumsum(fw) / SR
    whine = (np.sin(ph) * 0.5 + np.sin(2 * ph) * 0.25 + np.sin(3.01 * ph) * 0.12) * 0.07
    hum = np.sin(2 * np.pi * np.cumsum(55 * wob) / SR) * 0.12
    rpm = 1.2 * ramp
    am = 0.75 + 0.25 * np.sin(2 * np.pi * np.cumsum(rpm) / SR)
    body = bp(pink(n, seed + 1), 90, 420) * 0.25 * am
    tick = bp(white(n, seed + 2), 2500, 5000) * (0.5 + 0.5 * np.sin(2 * np.pi * np.cumsum(rpm * 6) / SR)) ** 8 * 0.08
    y = (whine + hum + body + tick) * ramp
    return fade(st(y, 0.1, 0.5), 0.05, 0.4) * 0.7


def rotation_start(dur, seed=23, **k):
    return rotation(dur, seed, start=True)


def rotation_loop(dur, seed=24, fadeOut=0, **k):
    return rotation(dur, seed, fadeOut=fadeOut)


def motor_down(dur, seed=25, **k):
    n = n_of(dur)
    tt = np.linspace(0, 1, n)
    f = 380 * (1 - 0.75 * tt ** 0.7)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * (1 - tt) * 0.08 + bp(pink(n, seed), 80, 300) * (1 - tt) * 0.2
    return st(y, 0, 0.4)


def cutting(dur, seed=26, **k):
    n = n_of(dur)
    t = np.arange(n) / SR
    r = rng(seed)
    grind = bp(white(n, seed), 700, 3200) * (0.55 + 0.45 * np.abs(lp(white(n, seed + 1), 9) * 6)).clip(0, 1.4)
    vib = 0.7 + 0.3 * np.sin(2 * np.pi * 38 * t)
    crack = np.zeros(n)
    for i in range(int(dur * 40)):
        i0 = int(r.uniform(0, n - 800))
        crack[i0:i0 + 600] += hp(white(600, seed + i), 1500) * env_exp(600, 0.0025) * r.uniform(0.1, 0.5)
    low = lp(brown(n, seed + 3), 90) * 0.35
    y = (grind * 0.16 * vib + crack * 0.3 + low) * env_adsr(n, 0.4, 0.1, 1, 0.6)
    return st(y, 0, 0.5) * 0.8


def drill_distant(dur, seed=27, **k):
    y = cutting(dur, seed)[:, 0] * 0.5 + rotation(dur, seed + 1)[:, 0] * 0.5
    return st(lp(y, 650) * 0.6, 0, 0.6)


def arrive_thud(dur=1.0, seed=28, **k):
    n = n_of(1.0)
    y = impact_low(1.0, 90, 45, 0.6, seed) + lp(white(n, seed), 500) * env_exp(n, 0.05) * 0.3
    return st(y, 0, 0.2)


def xray_sweep(dur=1.2, seed=29, **k):
    n = n_of(1.2)
    tt = np.linspace(0, 1, n)
    f = 200 * (12 ** tt)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt) * 0.06
    return reverb(st(y, 0, 0.7) + whoosh(1.2, seed, 400, 6000, 0.25), 0.3, 2.0)


def fluid_flow(dur, seed=30, **k):
    n = n_of(dur)
    t = np.arange(n) / SR
    base = bp(pink(n, seed), 300, 1600)
    gurg = (0.6 + 0.4 * lp(white(n, seed + 1), 14) * 8).clip(0.1, 1.5)
    y = base * gurg * 0.12
    r = rng(seed + 2)
    for i in range(int(dur * 9)):
        m = int(r.uniform(0.02, 0.06) * SR)
        tt = np.arange(m) / SR
        f = r.uniform(280, 700) * (1 + 2.5 * tt / tt[-1])
        b = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(m, m / SR * 0.4) * r.uniform(0.02, 0.07)
        i0 = int(r.uniform(0, n - m))
        y[i0:i0 + m] += b
    return fade(st(y, 0, 0.7), 0.4, 0.6)


def pump(dur, seed=31, **k):
    n = n_of(dur)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for i in range(int(dur * 2.2)):
        i0 = int((i / 2.2) * SR)
        th = impact_low(0.25, 70, 50, 0.25, seed + i)
        y[i0:i0 + len(th)] += th[:max(0, n - i0)]
    y += np.sin(2 * np.pi * 100 * t) * 0.03 + bp(pink(n, seed), 150, 500) * 0.05
    return fade(st(lp(y, 900), 0.4, 0.3), 0.6, 0.6)


def core_slide(dur, seed=32, **k):
    n = n_of(dur)
    y = bp(pink(n, seed), 400, 2400) * (0.5 + 0.5 * lp(np.abs(white(n, seed + 1)), 3) * 4).clip(0, 1.3) * 0.08
    return fade(st(y, 0, 0.4), 0.5, 0.8)


def winch_run(dur, seed=33, up=0, **k):
    n = n_of(dur)
    tt = np.linspace(0, 1, n)
    sp = np.sin(np.pi * tt) ** 0.6
    f = (520 + (380 if up else 120) * sp) * (1 + 0.004 * np.sin(2 * np.pi * 7 * tt * dur))
    y = (np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.05 + np.sin(2 * np.pi * np.cumsum(f * 2.02) / SR) * 0.02) * sp
    cable = bp(white(n, seed), 1500, 5000) * 0.03 * sp
    return st(y + cable, -0.1, 0.5)


def latch_click(dur=0.5, seed=34, **k):
    y = modal([2100, 3900, 6100], [0.5, 0.3, 0.2], [0.02, 0.015, 0.01], 0.5, seed)
    y2 = np.roll(modal([1800, 3400], [0.4, 0.25], [0.02, 0.012], 0.5, seed + 1), int(0.045 * SR))
    return reverb(st((y + y2) * 0.5, 0.1, 0.2), 0.2, 1.0)


def metal_clank(dur=2.0, seed=35, **k):
    f0 = [410, 455, 380][seed % 3]
    y = modal([f0, f0 * 2.76, f0 * 5.40, f0 * 8.93], [0.5, 0.35, 0.2, 0.1], [0.9, 0.5, 0.25, 0.12], 2.0, seed)
    y += hp(white(n_of(2.0), seed), 2000) * env_exp(n_of(2.0), 0.01) * 0.3
    return reverb(st(y * 0.35, 0.15, 0.3), 0.25, 1.8)


def core_break(dur=1.0, seed=36, **k):
    n = n_of(1.0)
    snap = hp(white(n, seed), 1200) * env_exp(n, 0.006) * 0.8
    low = impact_low(1.0, 120, 60, 0.35, seed)
    crumble = np.zeros(n)
    r = rng(seed)
    for i in range(14):
        i0 = int(r.uniform(0.01, 0.25) * SR)
        crumble[i0:i0 + 900] += bp(white(900, seed + i), 1500, 5000) * env_exp(900, 0.004) * r.uniform(0.05, 0.25)
    return reverb(st(snap + low + crumble, 0, 0.3), 0.2, 1.4) * 0.7


def winch_stop(dur=1.0, seed=37, **k):
    n = n_of(1.0)
    tt = np.linspace(0, 1, n)
    sq = np.sin(2 * np.pi * np.cumsum(1400 - 500 * tt) / SR) * env_exp(n, 0.12) * 0.04
    return st(sq, 0, 0.3) + metal_clank(1.0, seed)[:n] * 0.6


def core_slide_metal(dur, seed=38, **k):
    n = n_of(dur)
    y = bp(pink(n, seed), 700, 3600) * (0.4 + 0.6 * lp(np.abs(white(n, seed + 1)), 4) * 4).clip(0, 1.2) * 0.09
    y += modal([780, 1530], [0.1, 0.05], [0.3, 0.2], dur, seed)[:n] * np.linspace(1, 0.3, n)
    return fade(st(y, 0.2, 0.3), 0.15, 0.5)


def box_open(dur=1.4, seed=39, **k):
    n = n_of(1.4)
    tt = np.linspace(0, 1, n)
    f = 140 + 60 * np.sin(2 * np.pi * 3 * tt) + 40 * tt
    creak = osc(f, n, 'saw') * (0.5 + 0.5 * np.sin(2 * np.pi * np.cumsum(np.full(n, 26.0)) / SR)) ** 4
    creak = bp(creak, 400, 2200) * np.sin(np.pi * np.clip(tt * 1.4, 0, 1)) * 0.08
    knock = np.roll(modal([210, 520, 1100], [0.5, 0.3, 0.15], [0.12, 0.06, 0.03], 1.4, seed), int(1.05 * SR))
    return reverb(st(creak + knock * 0.5, -0.1, 0.3), 0.15, 1.2)


def core_place(dur=0.8, seed=40, idx=0, **k):
    r = rng(seed + idx * 7)
    f = r.uniform(170, 260)
    y = modal([f, f * 2.3, f * 4.1], [0.6, 0.25, 0.12], [0.07, 0.04, 0.02], 0.8, seed + idx)
    y += hp(white(n_of(0.8), seed + idx), 2500) * env_exp(n_of(0.8), 0.004) * 0.35
    return reverb(st(y * 0.6, r.uniform(-0.3, 0.3), 0.2), 0.12, 1.0)


def block_place(dur=0.6, seed=41, **k):
    y = modal([620, 1440, 2700], [0.5, 0.25, 0.1], [0.05, 0.03, 0.02], 0.6, seed)
    return reverb(st(y * 0.5, 0.2, 0.2), 0.1, 0.9)


def marker_write(dur, seed=42, **k):
    n = n_of(dur)
    t = np.arange(n) / SR
    strokes = (0.5 + 0.5 * np.sin(2 * np.pi * 5.5 * t + 2 * np.sin(2 * np.pi * 1.3 * t))) ** 2
    y = bp(white(n, seed), 2500, 7000) * strokes * 0.05
    return fade(st(y, -0.2, 0.2), 0.05, 0.1)


def cloth_move(dur=1.0, seed=43, **k):
    n = n_of(1.0)
    y = bp(pink(n, seed), 600, 3000) * np.sin(np.pi * np.linspace(0, 1, n)) ** 2 * 0.06
    return st(y, 0, 0.4)


def lens_swish(dur=0.6, seed=44, **k):
    return whoosh(0.6, seed, 800, 3500, 0.2, 0.3, -0.3)


def feature_bell(dur=2.0, seed=45, idx=0, **k):
    f = [880.0, 987.77, 1174.66, 1318.51, 1046.5][idx % 5]
    y = fm_bell(f, 2.0, ratio=2.0, index=1.0, decay=0.8) * 0.1
    return reverb(st(y, -0.2 + 0.1 * idx, 0.5), 0.4, 2.2)


def links_arp(dur, seed=46, **k):
    n = n_of(dur + 1.5)
    y = np.zeros(n)
    notes = [587.33, 698.46, 880.0, 1046.5, 1174.66, 1396.9, 1760.0]
    for i, f in enumerate(notes):
        g = fm_bell(f, 1.2, ratio=3.0, index=0.8, decay=0.5) * 0.07
        i0 = int(i * dur / len(notes) * SR)
        y[i0:i0 + len(g)] += g[:max(0, n - i0)]
    return reverb(st(y, 0, 0.6), 0.4, 2.4)


def ui_tick(dur=0.3, seed=47, **k):
    n = n_of(0.3)
    t = np.arange(n) / SR
    y = np.sin(2 * np.pi * 2300 * t) * env_exp(n, 0.012) * 0.12 + hp(white(n, seed), 4000) * env_exp(n, 0.003) * 0.08
    return reverb(st(y, 0.1, 0.3), 0.15, 1.0)


def ui_pop(dur=0.4, seed=48, **k):
    n = n_of(0.4)
    tt = np.arange(n) / SR
    f = 600 + 900 * np.exp(-tt * 30)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(n, 0.05) * 0.09
    return reverb(st(y, 0, 0.3), 0.2, 1.2)


def reveal_soft(dur=1.6, seed=49, **k):
    return reverb(st(shimmer(1.6, seed, 0.12), 0, 0.7), 0.4, 2.2)


def diamond_glint(dur=1.2, seed=50, **k):
    n = n_of(1.2)
    y = fm_bell(3520, 1.2, ratio=1.5, index=0.5, decay=0.25) * 0.06 + fm_bell(4186, 1.2, ratio=1.5, index=0.5, decay=0.2) * 0.04
    return reverb(st(y, 0.3, 0.6), 0.4, 2.0)


def layer_tick(dur=1.6, seed=51, idx=0, **k):
    n = n_of(1.6)
    f = [146.83, 130.81, 116.54, 110.0, 98.0, 87.31, 73.42][idx % 7]
    thoom = impact_low(1.6, f * 1.6, f, 0.35, seed)
    ch = fm_bell(f * 8, 1.6, ratio=2.0, index=0.8, decay=0.6) * 0.05
    return reverb(st(thoom + ch, 0, 0.5), 0.3, 2.4)


def under_drone(dur, seed=52, **k):
    n = n_of(dur)
    t = np.arange(n) / SR
    y = lp(brown(n, seed), 110) * 0.25 * (0.8 + 0.2 * np.sin(2 * np.pi * 0.2 * t))
    return fade(st(y, 0, 0.7), 0.6, 0.6)


REG = {k: v for k, v in globals().items() if callable(v) and not k.startswith('_')}
