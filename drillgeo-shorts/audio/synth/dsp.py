"""Small DSP toolkit for the DrillGeo Shorts score and sound design.
Everything is deterministic (seeded) so renders are reproducible."""
import numpy as np
from scipy import signal

SR = 48000


def rng(seed):
    return np.random.default_rng(seed)


def t_axis(dur):
    return np.arange(int(round(dur * SR))) / SR


def silence(dur, ch=2):
    return np.zeros((int(round(dur * SR)), ch))


# ---------------- noise ----------------
def white(n, seed=0):
    return rng(seed).standard_normal(n)


def pink(n, seed=0):
    # Voss-McCartney-ish via filtering white noise (Paul Kellet coefficients)
    b = [0.049922035, -0.095993537, 0.050612699, -0.004408786]
    a = [1, -2.494956002, 2.017265875, -0.522189400]
    x = signal.lfilter(b, a, white(n, seed))
    return x / (np.std(x) + 1e-9)


def brown(n, seed=0):
    x = np.cumsum(white(n, seed))
    x = signal.lfilter([1, -1], [1, -0.995], x)
    return x / (np.std(x) + 1e-9)


# ---------------- filters ----------------
def _sos(kind, f, order=2):
    nyq = SR / 2
    if kind == 'bp':
        lo, hi = max(10, f[0]) / nyq, min(nyq * 0.98, f[1]) / nyq
        return signal.butter(order, [lo, hi], btype='band', output='sos')
    f = min(max(f, 10), nyq * 0.98) / nyq
    return signal.butter(order, f, btype='low' if kind == 'lp' else 'high', output='sos')


def lp(x, f, order=2):
    return signal.sosfilt(_sos('lp', f, order), x, axis=0)


def hp(x, f, order=2):
    return signal.sosfilt(_sos('hp', f, order), x, axis=0)


def bp(x, lo, hi, order=2):
    return signal.sosfilt(_sos('bp', (lo, hi), order), x, axis=0)


def sweep_filter(x, kind, f0, f1, block=512, curve='exp', q=None):
    """time-varying lowpass/highpass/bandpass (mono), cutoff glides f0 → f1"""
    n = len(x)
    out = np.zeros(n)
    nb = int(np.ceil(n / block))
    zi = None
    for i in range(nb):
        k = i / max(1, nb - 1)
        f = f0 * (f1 / f0) ** k if curve == 'exp' else f0 + (f1 - f0) * k
        if kind == 'bp':
            sos = _sos('bp', (f / (q or 1.6), f * (q or 1.6)))
        else:
            sos = _sos(kind, f)
        if zi is None or zi.shape[0] != sos.shape[0]:
            zi = np.zeros((sos.shape[0], 2))
        seg = x[i * block:(i + 1) * block]
        y, zi = signal.sosfilt(sos, seg, zi=zi)
        out[i * block:(i + 1) * block] = y
    return out


def peaking(x, f, gain_db, q=1.0):
    A = 10 ** (gain_db / 40)
    w = 2 * np.pi * f / SR
    al = np.sin(w) / (2 * q)
    b = [1 + al * A, -2 * np.cos(w), 1 - al * A]
    a = [1 + al / A, -2 * np.cos(w), 1 - al / A]
    return signal.lfilter(b, a, x, axis=0)


def shelf_high(x, f, gain_db):
    A = 10 ** (gain_db / 40)
    w = 2 * np.pi * f / SR
    al = np.sin(w) / 2 * np.sqrt(2)
    c = np.cos(w)
    b = [A * ((A + 1) + (A - 1) * c + 2 * np.sqrt(A) * al), -2 * A * ((A - 1) + (A + 1) * c), A * ((A + 1) + (A - 1) * c - 2 * np.sqrt(A) * al)]
    a = [(A + 1) - (A - 1) * c + 2 * np.sqrt(A) * al, 2 * ((A - 1) - (A + 1) * c), (A + 1) - (A - 1) * c - 2 * np.sqrt(A) * al]
    return signal.lfilter(b, a, x, axis=0)


# ---------------- envelopes ----------------
def env_adsr(n, a, d, s, r, sustain_len=None):
    a, d, r = int(a * SR), int(d * SR), int(r * SR)
    e = np.zeros(n)
    i = 0
    if a > 0:
        m = min(a, n)
        e[:m] = np.linspace(0, 1, a)[:m]
    i = a
    if i < n and d > 0:
        m = min(d, n - i)
        e[i:i + m] = np.linspace(1, s, d)[:m]
    i += d
    rel_start = n - r if sustain_len is None else min(n, a + d + int(sustain_len * SR))
    if i < rel_start:
        e[i:rel_start] = s
    if rel_start < n:
        m = n - rel_start
        e[rel_start:] = np.linspace(e[rel_start - 1] if rel_start > 0 else s, 0, m)
    return e


def env_exp(n, decay, attack=0.002):
    t = np.arange(n) / SR
    e = np.exp(-t / max(1e-4, decay))
    na = int(attack * SR)
    if na > 1:
        e[:na] *= np.linspace(0, 1, na)
    return e


def fade(x, fin=0.01, fout=0.05):
    n = len(x)
    a, b = int(fin * SR), int(fout * SR)
    g = np.ones(n)
    if a > 0:
        g[:min(a, n)] = np.linspace(0, 1, a)[:min(a, n)]
    if b > 0:
        g[max(0, n - b):] *= np.linspace(1, 0, min(b, n))
    return x * (g[:, None] if x.ndim == 2 else g)


def smooth_env(x, attack, release):
    """envelope follower (mono, abs input)"""
    a = np.exp(-1 / (attack * SR))
    r = np.exp(-1 / (release * SR))
    # two-pass approximation without python loops: release smoothing then attack
    y = signal.lfilter([1 - r], [1, -r], x)
    y = np.maximum(y, signal.lfilter([1 - a], [1, -a], x))
    return y


# ---------------- oscillators / instruments ----------------
def osc(freq, n, kind='sine', phase=0.0):
    f = np.broadcast_to(np.asarray(freq, dtype=float), (n,))
    ph = 2 * np.pi * np.cumsum(f) / SR + phase
    if kind == 'sine':
        return np.sin(ph)
    if kind == 'saw':
        # polyBLEP-free saw: band-limit by summing harmonics up to nyquist (cheap version: filtered naive saw)
        s = 2 * ((ph / (2 * np.pi)) % 1) - 1
        return s
    if kind == 'square':
        return np.sign(np.sin(ph))
    if kind == 'tri':
        return 2 * np.abs(2 * ((ph / (2 * np.pi)) % 1) - 1) - 1
    raise ValueError(kind)


def fm_bell(f, dur, ratio=3.5, index=2.5, decay=1.2, seed=0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    ie = index * np.exp(-t / (decay * 0.4))
    mod = np.sin(2 * np.pi * f * ratio * t) * ie
    car = np.sin(2 * np.pi * f * t + mod)
    return car * env_exp(n, decay, 0.003)


def modal(freqs, amps, decays, dur, seed=0):
    """struck object: sum of decaying sinusoids (metal, wood, stone)"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    r = rng(seed)
    y = np.zeros(n)
    for f, a, d in zip(freqs, amps, decays):
        y += a * np.sin(2 * np.pi * f * t + r.uniform(0, 6.28)) * np.exp(-t / d)
    return y


def karplus(f, dur, decay=0.996, bright=0.5, seed=0):
    n = int(dur * SR)
    L = max(2, int(SR / f))
    x = np.zeros(n)
    burst = rng(seed).uniform(-1, 1, L)
    burst = lp(burst, 1500 + 7000 * bright)
    x[:L] = burst
    a = np.zeros(L + 2)
    a[0] = 1
    a[L] = -0.5 * decay
    a[L + 1] = -0.5 * decay
    return signal.lfilter([1], a, x)


def supersaw(freqs, n, detune=0.12, voices=3, seed=0):
    y = np.zeros(n)
    r = rng(seed)
    for f in np.atleast_1d(freqs):
        for v in range(voices):
            d = (v - (voices - 1) / 2) * detune
            y += osc(f * 2 ** (d / 12), n, 'saw', r.uniform(0, 6.28))
    return y / (voices * len(np.atleast_1d(freqs)))


# ---------------- space ----------------
_IR = {}


def reverb_ir(seconds=2.4, seed=7, damp=5000, predelay=0.012):
    key = (seconds, seed, damp, predelay)
    if key in _IR:
        return _IR[key]
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = np.zeros((n, 2))
    for c in range(2):
        nz = white(n, seed + c)
        nz = lp(nz, damp)
        ir[:, c] = nz * np.exp(-t * 6.9 / seconds)
    pd = int(predelay * SR)
    ir = np.vstack([np.zeros((pd, 2)), ir])
    # early reflections
    r = rng(seed + 9)
    for k in range(8):
        i = pd + int(r.uniform(0.004, 0.06) * SR)
        ir[i, :] += r.uniform(0.2, 0.6) * np.array([r.uniform(0.5, 1), r.uniform(0.5, 1)])
    ir /= np.sqrt(np.sum(ir ** 2) / 2)
    _IR[key] = ir
    return ir


def reverb(x, mix=0.25, seconds=2.4, seed=7, damp=5000):
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    ir = reverb_ir(seconds, seed, damp)
    wet = np.stack([signal.fftconvolve(x[:, c], ir[:, c])[:len(x) + len(ir)] for c in range(2)], 1)
    dry = np.vstack([x, np.zeros((len(wet) - len(x), 2))])
    return dry * (1 - mix * 0.5) + wet * mix


def pan(x, p=0.0, width=0.0, seed=0):
    """equal-power pan of a mono signal; width adds a decorrelated side (Haas-free)"""
    p = np.clip(p, -1, 1)
    a = (p + 1) * np.pi / 4
    L, R = np.cos(a) * x, np.sin(a) * x
    if width > 0:
        d = int(0.011 * SR)
        side = np.concatenate([np.zeros(d), x[:-d]]) if len(x) > d else x
        L = L + width * 0.5 * side
        R = R - width * 0.5 * side
    return np.stack([L, R], 1)


def add(buf, x, t, gain=1.0):
    """mix stereo (or mono) x into buf at time t (s)"""
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    i = int(round(t * SR))
    if i < 0:
        x = x[-i:]
        i = 0
    j = min(len(buf), i + len(x))
    if j > i:
        buf[i:j] += x[:j - i] * gain


def db(g):
    return 10 ** (g / 20)


def soft_clip(x, drive=1.0):
    return np.tanh(x * drive) / np.tanh(drive)


def limiter(x, ceiling_db=-1.0, lookahead=0.004, release=0.08):
    """simple lookahead peak limiter (stereo-linked)"""
    c = db(ceiling_db)
    peak = np.max(np.abs(x), axis=1)
    la = int(lookahead * SR)
    # moving max over lookahead window
    from scipy.ndimage import maximum_filter1d
    pk = maximum_filter1d(peak, size=2 * la + 1, origin=0)
    g = np.minimum(1.0, c / np.maximum(pk, 1e-9))
    # smooth gain: fast attack (already lookahead), release
    r = np.exp(-1 / (release * SR))
    g_s = signal.lfilter([1 - r], [1, -r], g)
    g = np.minimum(g, g_s)
    return x * g[:, None]
