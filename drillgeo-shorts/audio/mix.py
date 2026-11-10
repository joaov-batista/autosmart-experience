"""Mix narration (ElevenLabs), original score and synthesised SFX from
build/timeline.json → audio/mix/drillgeo_master.wav (48 kHz stereo),
loudness-normalised for phones (-14 LUFS integrated, -1.5 dBTP)."""
import json, os, subprocess, sys
import numpy as np
from scipy.io import wavfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(HERE, 'synth'))
from dsp import SR, add, db, hp, lp, peaking, shelf_high, limiter, smooth_env, soft_clip  # noqa: E402
import sfx  # noqa: E402
import music  # noqa: E402

GAIN = {  # dB per cue type (relative); voice sits on top
    'amb_nature': -3, 'amb_site': -6, 'whoosh_down': -4, 'whip_up': -5, 'dive_whoosh': -6, 'rise_whoosh': -6,
    'pull_back_whoosh': -7, 'push_in_whoosh': -7, 'return_whoosh': -7, 'impact_sub': -1, 'impact_arrive': -3,
    'earth_rumble': -4, 'scan_shimmer': -8, 'interest_chime': -7, 'engine': -3, 'lever_clunk': -4, 'hydraulic_hiss': -9,
    'rotation_start': -5, 'rotation_loop': -6, 'cutting': -5, 'arrive_thud': -5, 'reveal_soft': -9, 'diamond_glint': -8,
    'xray_sweep': -8, 'fluid_flow': -4, 'pump': -6, 'core_slide': -6, 'motor_down': -5, 'winch_run': -5, 'latch_click': -3,
    'metal_clank': -4, 'core_break': -2, 'winch_stop': -5, 'under_drone': -6, 'drill_distant': -8, 'layer_tick': -7,
    'core_slide_metal': -4, 'box_open': -3, 'core_place': -3, 'block_place': -4, 'marker_write': -6, 'cloth_move': -8,
    'lens_swish': -8, 'feature_bell': -7, 'links_arp': -8, 'ui_tick': -12, 'ui_pop': -11, 'logo_spin': -6, 'logo_hit': -3,
}


def read_audio(path):
    tmp = os.path.join(ROOT, 'build', 'tmp_' + os.path.basename(path) + '.wav')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-c:a', 'pcm_f32le', tmp], check=True)
    sr, x = wavfile.read(tmp)
    os.remove(tmp)
    return x.astype(np.float64)


def lufs(path):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-i', path, '-af', 'loudnorm=print_format=json', '-f', 'null', '-'], capture_output=True, text=True)
    j = r.stderr[r.stderr.rfind('{'):r.stderr.rfind('}') + 1]
    return json.loads(j)


def main():
    tl = json.load(open(os.path.join(ROOT, 'build', 'timeline.json')))
    total = tl['total']
    N = int((total + 0.5) * SR)
    print(f'timeline {total:.2f}s, {len(tl["cues"])} cues, {len(tl["lines"])} lines')

    # ---- voice ----
    voice = np.zeros(N)
    meta_p = os.path.join(ROOT, 'audio', 'narration', 'clips')
    have = 0
    for l in tl['lines']:
        f = os.path.join(meta_p, l['id'] + '.wav')
        if not os.path.exists(f):
            continue
        x = read_audio(f)
        i = int(round(l['start'] * SR))
        j = min(N, i + len(x))
        voice[i:j] += x[:j - i]
        have += 1
    if have:
        voice = hp(voice, 85)
        voice = peaking(voice, 180, -1.5, 1.0)
        voice = peaking(voice, 3200, 2.5, 0.9)
        voice = shelf_high(voice, 9000, 1.5)
        # gentle compression (RMS-ish follower, 3:1 above -20 dBFS)
        env = smooth_env(np.abs(voice), 0.005, 0.12)
        thr = db(-20)
        gr = np.where(env > thr, (thr * (env / thr) ** (1 / 3)) / np.maximum(env, 1e-9), 1.0)
        voice = voice * gr
        pk = np.max(np.abs(voice))
        voice = voice / pk * db(-3)
    print(f'narration clips: {have}/{len(tl["lines"])}')

    # ---- score ----
    m = music.build(tl)
    mus = np.zeros((N, 2))
    k = min(N, len(m))
    mus[:k] = m[:k]

    # ---- sfx ----
    fx = np.zeros((N, 2))
    for i, c in enumerate(tl['cues']):
        fn = sfx.REG.get(c['type'])
        if not fn:
            print('  (no sfx for', c['type'], ')')
            continue
        kw = {kk: v for kk, v in c.items() if kk not in ('t', 'type', 'scene')}
        kw.setdefault('dur', 1.0)
        kw['seed'] = 1000 + i * 13
        try:
            y = fn(**kw)
        except TypeError:
            y = fn(kw['dur'])
        add(fx, y, c['t'], db(GAIN.get(c['type'], -6)))

    # ---- ducking: music −9 dB and sfx −4 dB under the voice ----
    venv = smooth_env(np.abs(voice), 0.04, 0.45)
    on = np.clip(venv / db(-30), 0, 1)
    duck_m = db(-9) + (1 - db(-9)) * (1 - on)
    duck_f = db(-4) + (1 - db(-4)) * (1 - on)
    mus *= duck_m[:, None]
    fx *= duck_f[:, None]

    mix = mus * db(-5) + fx * db(-2) + np.stack([voice, voice], 1) * db(0)
    mix = shelf_high(mix, 8500, -2.5)
    mix = soft_clip(mix * 0.9, 1.1)
    mix = limiter(mix, -2.0)
    os.makedirs(os.path.join(ROOT, 'build'), exist_ok=True)
    raw = os.path.join(ROOT, 'build', 'mix_raw.wav')
    wavfile.write(raw, SR, mix.astype(np.float32))
    for name, x in [('stem_music', mus * db(-5)), ('stem_sfx', fx * db(-2)), ('stem_voice', np.stack([voice, voice], 1))]:
        wavfile.write(os.path.join(ROOT, 'build', name + '.wav'), SR, x.astype(np.float32))
    # ---- loudness: two-pass loudnorm → -14 LUFS, -1.5 dBTP ----
    meas = lufs(raw)
    out = os.path.join(ROOT, 'audio', 'mix', 'drillgeo_master.wav')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    af = (f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={meas['input_i']}:measured_TP={meas['input_tp']}:"
          f"measured_LRA={meas['input_lra']}:measured_thresh={meas['input_thresh']}:offset={meas['target_offset']}:linear=true")
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', raw, '-af', af, '-ar', str(SR), '-c:a', 'pcm_s24le', out], check=True)
    fin = lufs(out)
    print(f"master: {fin['input_i']} LUFS, TP {fin['input_tp']} dBTP, LRA {fin['input_lra']} → {out}")


if __name__ == '__main__':
    main()
