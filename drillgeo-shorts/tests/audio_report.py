"""Audio QA: per-second loudness of each stem + scene boundaries, clipping check."""
import json, os, sys
import numpy as np
from scipy.io import wavfile
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
tl = json.load(open(os.path.join(ROOT, 'build/timeline.json')))
def rms_db(x, sr, win=0.5):
    n = int(win * sr); k = len(x) // n
    x = x[:k * n].reshape(k, n, -1)
    return 20 * np.log10(np.sqrt(np.mean(x ** 2, axis=(1, 2))) + 1e-9)
out = {}
for name in ['stem_music', 'stem_sfx', 'stem_voice']:
    sr, x = wavfile.read(os.path.join(ROOT, 'build', name + '.wav'))
    out[name] = rms_db(x.astype(np.float64), sr)
sr, m = wavfile.read(os.path.join(ROOT, 'audio/mix/drillgeo_master.wav'))
m = m.astype(np.float64) / (2 ** 31 if m.dtype == np.int32 else 1)
print('master peak', 20 * np.log10(np.max(np.abs(m)) + 1e-12), 'dBFS; samples > -0.5 dBFS:', int(np.sum(np.abs(m) > 10 ** (-0.5 / 20))))
for s in tl['scenes']:
    a, b = int(s['start'] / 0.5), int((s['start'] + s['dur']) / 0.5)
    row = '  '.join(f"{k[5:]}:{np.mean(v[a:b]):6.1f}" for k, v in out.items())
    print(f"{s['id']} {s['start']:6.2f}-{s['start']+s['dur']:6.2f}  {row}")
