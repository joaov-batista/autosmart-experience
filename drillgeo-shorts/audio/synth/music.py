"""Original score for DrillGeo Shorts — synthesised, D minor, 96 BPM.
Sections follow build/timeline.json so every scene change lands on a beat."""
import json
import numpy as np
from dsp import (SR, white, pink, brown, lp, hp, bp, sweep_filter, env_exp, env_adsr, fade, osc, fm_bell, karplus,
                 supersaw, reverb, pan, add, db, rng, silence)

BEAT = 0.625
BAR = BEAT * 4


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


CH = {
    'Dm': [50, 53, 57, 64], 'Bb': [46, 50, 53, 60], 'F': [53, 57, 60, 67], 'C': [48, 52, 55, 62],
    'Gm': [43, 50, 55, 58], 'A': [45, 49, 52, 57], 'Am': [45, 52, 55, 60], 'D': [50, 54, 57, 64], 'Fsus': [53, 58, 60, 67],
}
ROOT = {'Dm': 38, 'Bb': 34, 'F': 41, 'C': 36, 'Gm': 43, 'A': 45, 'Am': 45, 'D': 38, 'Fsus': 41}


class Score:
    def __init__(self, total):
        self.n = int((total + 6) * SR)
        self.bus = {k: np.zeros((self.n, 2)) for k in ['pad', 'bass', 'drums', 'keys', 'bells', 'fx']}

    def put(self, bus, x, t, g=1.0):
        add(self.bus[bus], x, t, g)


# ---------------- instruments ----------------
def pad(chord, dur, bright=1200, seed=0, attack=0.6, release=1.2):
    n = int((dur + release) * SR)
    ys = []
    for c in range(2):
        y = supersaw([mtof(m) for m in chord], n, detune=0.14, voices=3, seed=seed * 7 + c)
        y = lp(y, bright, 2)
        ys.append(y)
    y = np.stack(ys, 1)
    e = env_adsr(n, attack, 0.4, 0.85, release, sustain_len=dur)
    return y * e[:, None] * 0.55


def sub(m, dur, seed=0):
    n = int((dur + 0.3) * SR)
    t = np.arange(n) / SR
    y = np.sin(2 * np.pi * mtof(m) * t)
    return y * env_adsr(n, 0.02, 0.1, 0.9, 0.3, sustain_len=dur) * 0.5


def bass_pluck(m, dur=0.3, cut=900, seed=0):
    n = int((dur + 0.15) * SR)
    y = osc(mtof(m), n, 'saw') * 0.6 + osc(mtof(m) * 0.5, n, 'sine') * 0.5
    y = sweep_filter(y, 'lp', cut * 2.2, cut * 0.4, block=256)
    return y * env_exp(n, dur * 0.7, 0.003) * 0.55


def kick(g=1.0, seed=0):
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    f = 45 + 95 * np.exp(-t * 28)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(n, 0.18, 0.001)
    y += bp(white(n, seed), 1500, 6000) * env_exp(n, 0.003) * 0.08
    return np.tanh(y * 1.6) * 0.75 * g


def snare(g=1.0, seed=0):
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    y = bp(white(n, seed), 1200, 7000) * env_exp(n, 0.07) * 0.5 + np.sin(2 * np.pi * 190 * t) * env_exp(n, 0.05) * 0.35
    return y * g


def clap(g=1.0, seed=0):
    n = int(0.4 * SR)
    y = np.zeros(n)
    for k in range(3):
        i = int(k * 0.011 * SR)
        y[i:] += bp(white(n - i, seed + k), 900, 4000) * env_exp(n - i, 0.02 if k < 2 else 0.12)
    return y * 0.4 * g


def hat(g=1.0, open_=False, seed=0):
    n = int((0.35 if open_ else 0.08) * SR)
    t = np.arange(n) / SR
    metal = sum(np.sign(np.sin(2 * np.pi * f * t)) for f in [317, 452, 589, 731, 880, 1052])
    y = hp(metal * 0.15 + white(n, seed) * 0.6, 7000) * env_exp(n, 0.12 if open_ else 0.022)
    return y * 0.13 * g


def tom(f=110, g=1.0, seed=0):
    n = int(0.5 * SR)
    t = np.arange(n) / SR
    ff = f * (1 + 0.6 * np.exp(-t * 18))
    y = np.sin(2 * np.pi * np.cumsum(ff) / SR) * env_exp(n, 0.2) + bp(white(n, seed), 200, 1500) * env_exp(n, 0.03) * 0.2
    return y * 0.45 * g


def anvil(g=1.0, seed=0):
    n = int(0.9 * SR)
    t = np.arange(n) / SR
    y = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t / d) for f, a, d in [(523, 0.5, 0.4), (1311, 0.3, 0.25), (2207, 0.2, 0.15), (3330, 0.1, 0.08)])
    return y * 0.25 * g


def pluck(m, dur=0.6, bright=0.5, seed=0):
    return karplus(mtof(m), dur, decay=0.993, bright=bright, seed=seed) * 0.5


def marimba(m, dur=0.8, seed=0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = mtof(m)
    y = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.35) + 0.35 * np.sin(2 * np.pi * f * 3.93 * t) * np.exp(-t / 0.06) + 0.15 * np.sin(2 * np.pi * f * 9.2 * t) * np.exp(-t / 0.02)
    return y * 0.35


def bell(m, dur=2.0, seed=0, idx=1.6):
    return fm_bell(mtof(m), dur, ratio=3.5, index=idx, decay=dur * 0.45) * 0.22


def liquid(m, dur=0.35, seed=0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = mtof(m) * (1 + 0.004 * np.sin(2 * np.pi * 6 * t))
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.25 * np.sin(4 * np.pi * np.cumsum(f) / SR)
    return y * env_exp(n, 0.12, 0.004) * 0.25


def riser(dur, seed=0, g=1.0):
    n = int(dur * SR)
    tt = np.linspace(0, 1, n)
    y = sweep_filter(white(n, seed), 'bp', 300, 7000, q=1.5) * tt ** 2 * 0.35
    f = 110 * 2 ** (tt * 2)
    y += osc(f, n, 'saw') * tt ** 3 * 0.05
    return y * g


def delay(x, time=0.469, fb=0.35, mix=0.3):
    d = int(time * SR)
    y = x.copy()
    out = np.zeros_like(x)
    acc = x.copy()
    for k in range(1, 6):
        sh = np.zeros_like(x)
        if d * k < len(x):
            sh[d * k:] = x[:-d * k] * (fb ** k)
        # ping-pong
        if k % 2:
            sh = sh[:, ::-1]
        acc += sh
    return x * (1 - mix) + acc * mix


# ---------------- arrangement ----------------
def build(tl):
    sc = {s['id']: s for s in tl['scenes']}
    total = tl['total']
    S = Score(total)
    cues = tl['cues']

    def cue(scene, typ, k=0):
        cs = [c for c in cues if c['scene'] == scene and c['type'] == typ]
        return cs[k]['t'] if len(cs) > k else None

    def bars(s):
        return int(round(s['dur'] / BAR + 0.49))

    def chords_for(s, prog):
        for b in range(bars(s)):
            yield b, s['start'] + b * BAR, prog[b % len(prog)]

    # ---- S01 mystery → reveal ----
    s = sc['s01']
    s0 = cue('s01', 'impact_sub') or s['start'] + 6
    S.put('pad', pad(CH['Dm'], s0 - s['start'] + 0.3, bright=700, seed=1, attack=2.5, release=1.5), s['start'], 0.55)
    S.put('bass', sub(26, s['dur'], 1), s['start'], 0.6)
    for i, (m, tt) in enumerate([(69, 1.0), (65, 2.3), (64, 3.6), (62, 4.6)]):
        S.put('bells', pan(bell(m, 2.6, i, 1.2), [-0.3, 0.2, -0.1, 0.3][i]), s['start'] + tt, 0.45)
    S.put('pad', pad(CH['Dm'] + [69], s['end'] - s0 if 'end' in s else s['start'] + s['dur'] - s0, bright=2600, seed=2, attack=0.2, release=1.0), s0, 0.75)
    g0 = cue('s01', 'interest_chime') or s0 + 2
    for i, m in enumerate([81, 76, 74, 81]):
        S.put('bells', pan(bell(m, 2.2, 10 + i, 1.0), 0.4 - 0.25 * i), g0 + i * BEAT * 0.5, 0.45)
    S.put('fx', pan(riser(0.9, 3, 0.8), 0), s['start'] + s['dur'] - 0.9)

    # ---- SB the cake & the straw: light and playful ----
    s = sc['sb']
    prog = ['F', 'C', 'Dm', 'Bb']
    pat = [0, 2, 1, 3, 2, 1, 3, 2]
    for b, t0, ch in chords_for(s, prog):
        S.put('pad', pad(CH[ch], BAR, bright=1900, seed=210 + b, attack=0.3), t0, 0.35)
        S.put('bass', pan(sub(ROOT[ch], BAR * 0.9, b), 0), t0, 0.45)
        for k in range(8):
            S.put('keys', pan(marimba(CH[ch][pat[k]] + 12, 0.6, 220 + b * 8 + k), 0.3 * np.cos(k * 1.3)), t0 + k * BEAT / 2, 0.6)
        S.put('drums', pan(kick(0.55, 230 + b), 0), t0)
        S.put('drums', pan(hat(0.5, seed=240 + b), 0.3), t0 + 2 * BEAT)
    S.put('fx', pan(riser(0.9, 5, 0.7), 0), s['start'] + s['dur'] - 0.9)

    # ---- S02 industrial pulse ----
    s = sc['s02']
    st0 = cue('s02', 'rotation_start') or s['start'] + 7
    prog = ['Dm', 'Bb', 'F', 'C']
    for b, t0, ch in chords_for(s, prog):
        S.put('pad', pad(CH[ch], BAR, bright=1400 + 200 * b, seed=20 + b, attack=0.15), t0, 0.5)
        for k in range(8):
            tb = t0 + k * BEAT / 2
            S.put('bass', pan(bass_pluck(ROOT[ch] + (12 if k in (3, 6) else 0), 0.25, 700 + 60 * b, 30 + b * 8 + k), 0), tb, 0.8)
            S.put('drums', pan(hat(0.7 + 0.3 * (k % 2 == 0), seed=b * 8 + k), 0.35), tb, 0.8)
        S.put('drums', pan(kick(0.9, b), 0), t0)
        S.put('drums', pan(kick(0.75, b + 50), 0), t0 + 2 * BEAT)
        S.put('drums', pan(anvil(0.6, b), -0.4), t0 + 3 * BEAT + BEAT / 2)
        if t0 >= st0 - 0.1:
            S.put('drums', pan(clap(0.8, b), 0.1), t0 + BEAT)
            S.put('drums', pan(clap(0.8, b + 9), -0.1), t0 + 3 * BEAT)

    # ---- S03 drilling: driving, rising intensity ----
    s = sc['s03']
    prog = ['Dm', 'Bb', 'Gm', 'A']

    for i, f in enumerate([180, 160, 140, 120, 100, 90]):
        S.put('drums', pan(tom(f, 0.9, 60 + i), -0.5 + 0.2 * i), s['start'] + i * BEAT / 4, 0.9)
    for b, t0, ch in chords_for(s, prog):
        inten = min(1.0, 0.6 + 0.15 * b)
        S.put('pad', pad(CH[ch], BAR, bright=1800 + 300 * b, seed=40 + b, attack=0.1), t0, 0.45)
        for k in range(16):
            tb = t0 + k * BEAT / 4
            if k % 2 == 0 or b >= 2:
                S.put('bass', pan(bass_pluck(ROOT[ch] + (12 if k % 8 == 6 else 0), 0.16, 900 + 120 * b, 70 + b * 16 + k), 0), tb, 0.65 * inten)
            S.put('drums', pan(hat(0.55 + 0.3 * (k % 4 == 2), seed=200 + b * 16 + k), 0.4), tb, 0.8 * inten)
        for k in range(4):
            S.put('drums', pan(kick(1.0, 300 + b * 4 + k), 0), t0 + k * BEAT, inten)
        S.put('drums', pan(snare(0.8, b), 0.05), t0 + BEAT, inten)
        S.put('drums', pan(snare(0.9, b + 31), -0.05), t0 + 3 * BEAT, inten)
        if b % 2 == 1:
            for i, f in enumerate([200, 170, 140, 120]):
                S.put('drums', pan(tom(f, 0.8, 90 + b * 4 + i), 0.5 - 0.3 * i), t0 + 3 * BEAT + i * BEAT / 4, 0.8 * inten)

    # ---- S04 fluid: lighter groove + liquid arpeggio ----
    s = sc['s04']
    prog = ['Dm', 'F', 'C', 'Gm']
    arp = [0, 2, 3, 1, 2, 3, 0, 3]
    for b, t0, ch in chords_for(s, prog):
        S.put('pad', pad(CH[ch], BAR, bright=1500, seed=60 + b, attack=0.3), t0, 0.45)
        S.put('bass', pan(sub(ROOT[ch], BAR * 0.95, b), 0), t0, 0.7)
        notes = CH[ch]
        for k in range(16):
            m = notes[arp[k % 8]] + 12
            S.put('keys', pan(liquid(m, 0.3, b * 16 + k), 0.5 * np.sin(k * 0.7)), t0 + k * BEAT / 4, 0.55)
        S.put('drums', pan(kick(0.7, 400 + b), 0), t0)
        S.put('drums', pan(kick(0.55, 410 + b), 0), t0 + 2.5 * BEAT)
        for k in range(8):
            S.put('drums', pan(hat(0.5, seed=500 + b * 8 + k), -0.3), t0 + k * BEAT / 2 + (0.06 if k % 2 else 0), 0.6)
    pin = cue('s04', 'push_in_whoosh')
    if pin:
        S.put('fx', pan(riser(1.1, 41, 0.6), 0), pin - 0.1)

    # ---- S05 core: precise pizzicato → wireline tension ----
    s = sc['s05']
    full = cue('s05', 'motor_down') or s['start'] + 13
    surf = (cue('s05', 'metal_clank', 1) or s['start'] + s['dur'] - 2)
    prog = ['Dm', 'F', 'Am', 'C']
    motif = [62, 65, 69, 64, 62, 69, 67, 65]
    for b, t0, ch in chords_for(s, prog):
        if t0 < full - 0.2:
            S.put('pad', pad(CH[ch], BAR, bright=1100, seed=80 + b, attack=0.4), t0, 0.4)
            S.put('bass', pan(sub(ROOT[ch], BAR * 0.9, b), 0), t0, 0.55)
            for k in range(8):
                m = motif[k] + (CH[ch][0] - 50) * (k in (2, 5))
                S.put('keys', pan(pluck(m + 12, 0.5, 0.45, 800 + b * 8 + k), -0.4 + 0.1 * k), t0 + k * BEAT / 2, 0.9)
            S.put('drums', pan(kick(0.6, 600 + b), 0), t0)
            S.put('drums', pan(hat(0.6, seed=700 + b), 0.3), t0 + 2 * BEAT)
        else:
            # wireline: clock-like ticking, low pulse, tension pad
            if t0 < surf - 0.2:
                S.put('pad', pad([38, 45, 50, 51], BAR, bright=700, seed=90 + b, attack=0.5), t0, 0.45)
                for k in range(8):
                    S.put('drums', pan(hat(0.8 if k % 2 == 0 else 0.5, seed=900 + b * 8 + k), 0.5 * (-1) ** k), t0 + k * BEAT / 2, 0.7)
                for k in range(4):
                    S.put('bass', pan(sub(26, 0.25, k), 0), t0 + k * BEAT, 0.8)
    up = cue('s05', 'rise_whoosh')
    if up:
        S.put('fx', pan(riser(surf - up, 51, 0.7), 0), up)
    S.put('drums', pan(kick(1.0, 951), 0), surf)
    S.put('pad', pad(CH['F'], s['start'] + s['dur'] - surf, bright=1600, seed=95, attack=0.05), surf, 0.45)

    # ---- S06 layers: deep pulse + descending bells ----
    s = sc['s06']
    prog = ['Dm', 'Bb', 'F', 'C']
    for b, t0, ch in chords_for(s, prog):
        S.put('pad', pad([m - 12 for m in CH[ch]] + [CH[ch][0]], BAR, bright=900, seed=100 + b, attack=0.4), t0, 0.55)
        for k in range(8):
            S.put('bass', pan(bass_pluck(ROOT[ch] - (0 if ROOT[ch] < 40 else 12), 0.22, 500, 1000 + b * 8 + k), 0), t0 + k * BEAT / 2, 0.75)
        for k, m in enumerate(sorted(CH[ch], reverse=True)):
            S.put('bells', pan(bell(m + 12, 1.8, 1100 + b * 4 + k, 1.0), 0.4 - 0.25 * k), t0 + k * BEAT, 0.35)
        S.put('drums', pan(kick(0.8, 1200 + b), 0), t0)
        S.put('drums', pan(kick(0.6, 1210 + b), 0), t0 + 2 * BEAT)

    # ---- S07 core box: light marimba ----
    s = sc['s07']
    prog = ['F', 'C', 'Dm', 'Bb']
    pat = [0, 2, 1, 3, 2, 1, 3, 2]
    for b, t0, ch in chords_for(s, prog):
        S.put('pad', pad(CH[ch], BAR, bright=1700, seed=120 + b, attack=0.5), t0, 0.35)
        S.put('bass', pan(sub(ROOT[ch], BAR * 0.9, b), 0), t0, 0.5)
        for k in range(8):
            S.put('keys', pan(marimba(CH[ch][pat[k]] + 12, 0.7, b * 8 + k), 0.35 * np.cos(k)), t0 + k * BEAT / 2, 0.7)
        for k in range(16):
            S.put('drums', pan(hp(white(int(0.05 * SR), 1300 + b * 16 + k), 6000) * env_exp(int(0.05 * SR), 0.015) * (0.06 if k % 2 else 0.1), 0.2), t0 + k * BEAT / 4)

    # ---- S08 analysis: wonder ----
    s = sc['s08']
    prog = ['F', 'Am', 'Bb', 'C']
    for b, t0, ch in chords_for(s, prog):
        S.put('pad', pad(CH[ch] + [CH[ch][1] + 12], BAR, bright=2200, seed=140 + b, attack=0.6), t0, 0.45)
        S.put('bass', pan(sub(ROOT[ch], BAR * 0.9, b), 0), t0, 0.5)
        for k in range(6):
            m = CH[ch][(k * 2) % 4] + 24
            S.put('bells', pan(bell(m, 1.6, 1400 + b * 6 + k, 0.9), -0.5 + 0.2 * k), t0 + k * BEAT * 0.66, 0.28)
        S.put('drums', pan(kick(0.5, 1500 + b), 0), t0)

    # ---- S09 closing build → D major on the logo ----
    s = sc['s09']
    logo = cue('s09', 'logo_hit') or s['start'] + s['dur'] - 6
    prog = ['Bb', 'F', 'C', 'Dm', 'Bb', 'C', 'Fsus', 'A']
    for b, t0, ch in chords_for(s, prog):
        if t0 >= logo - 0.3:
            break
        inten = min(1.0, 0.45 + 0.12 * b)
        S.put('pad', pad(CH[ch] + [CH[ch][0] + 12], BAR, bright=1600 + 500 * b, seed=160 + b, attack=0.3), t0, 0.5)
        S.put('bass', pan(sub(ROOT[ch], BAR * 0.95, b), 0), t0, 0.6)
        for k in range(8):
            S.put('bass', pan(bass_pluck(ROOT[ch] + 12, 0.2, 900, 1600 + b * 8 + k), 0), t0 + k * BEAT / 2, 0.35 * inten)
        for k in range(4):
            S.put('drums', pan(kick(0.9, 1700 + b * 4 + k), 0), t0 + k * BEAT, inten)
        if b >= 2:
            S.put('drums', pan(snare(0.8, b), 0), t0 + BEAT, inten)
            S.put('drums', pan(snare(0.8, b + 7), 0), t0 + 3 * BEAT, inten)
            for k in range(8):
                S.put('drums', pan(hat(0.6, seed=1800 + b * 8 + k), 0.35), t0 + k * BEAT / 2, 0.7 * inten)
    S.put('fx', pan(riser(1.6, 61, 0.8), 0), logo - 1.6)
    end = s['start'] + s['dur']
    S.put('pad', pad(CH['D'] + [62, 69, 74], end - logo + 1.5, bright=3200, seed=190, attack=0.05, release=3.0), logo, 0.75)
    S.put('bass', pan(sub(26, end - logo, 9), 0), logo, 0.7)
    S.put('drums', pan(kick(1.2, 1999), 0), logo)
    for i, m in enumerate([74, 78, 81, 86, 90]):
        S.put('bells', pan(bell(m, 3.2, 2000 + i, 1.2), -0.4 + 0.2 * i), logo + 0.15 * i, 0.4)

    # ---- buses → stereo mix ----
    out = np.zeros((S.n, 2))
    out += reverb(S.bus['pad'], 0.35, 3.2, 11)[:S.n] * db(-6)
    out += S.bus['bass'] * db(-4)
    out += lp(reverb(S.bus['drums'], 0.12, 1.4, 12)[:S.n], 11000) * db(-6)
    out += reverb(delay(S.bus['keys'], 0.469, 0.3, 0.25), 0.3, 2.2, 13)[:S.n] * db(-5)
    out += reverb(S.bus['bells'], 0.5, 3.4, 14)[:S.n] * db(-6)
    out += reverb(S.bus['fx'], 0.3, 2.2, 15)[:S.n] * db(-8)
    out = hp(out, 28)
    return out[:int((total + 3) * SR)]


if __name__ == '__main__':
    import sys, soundfile  # noqa
