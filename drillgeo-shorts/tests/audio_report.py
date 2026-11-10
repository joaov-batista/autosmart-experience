"""Audio QA: level of voice vs. bed (music + sfx) while the narration speaks,
per scene, plus master peak / clipping check."""
import json, os
import numpy as np
from scipy.io import wavfile
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
tl = json.load(open(os.path.join(ROOT, 'build/timeline.json')))
def load(n):
    sr, x = wavfile.read(os.path.join(ROOT, 'build', n + '.wav'))
    return sr, x.astype(np.float64).mean(axis=1)
sr, voice = load('stem_voice'); _, mus = load('stem_music'); _, fx = load('stem_sfx')
rms = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)
sr2, m = wavfile.read(os.path.join(ROOT, 'audio/mix/drillgeo_master.wav'))
m = m.astype(np.float64) / (2 ** 31 if m.dtype == np.int32 else 1)
print(f"master peak {20*np.log10(np.max(np.abs(m))):.2f} dBFS, samples > -0.5 dBFS: {int(np.sum(np.abs(m) > 10 ** (-0.5 / 20)))}")
worst = 99
for l in tl['lines']:
    a, b = int(l['start'] * sr), int((l['start'] + l['dur']) * sr)
    v, bed = rms(voice[a:b]), rms(mus[a:b] + fx[a:b])
    worst = min(worst, v - bed)
    print(f"{l['id']} {l['start']:6.2f}s  voice {v:6.1f}  music {rms(mus[a:b]):6.1f}  sfx {rms(fx[a:b]):6.1f}  voice-bed {v - bed:+5.1f} dB")
print(f"worst voice-over-bed margin: {worst:+.1f} dB (target ≥ +8)")
