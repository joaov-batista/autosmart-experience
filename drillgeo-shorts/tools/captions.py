"""Narration captions from build/timeline.json → renders/drillgeo_shorts.srt and
build/captions.ass (burn-in style: above the Shorts UI, Inter SemiBold, soft box)."""
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
tl = json.load(open(os.path.join(ROOT, 'build/timeline.json')))
MAXC = 34  # chars per caption line


def chunks(text):
    text = re.sub(r'\s+', ' ', text.replace('…', '...')).strip()
    # split into phrases at punctuation, then pack words into ≤2 lines of MAXC
    words = text.split(' ')
    out, cur = [], []
    for w in words:
        cand = ' '.join(cur + [w])
        if len(cand) > MAXC * 2 - 2 and cur:
            out.append(' '.join(cur))
            cur = [w]
        else:
            cur.append(w)
        if re.search(r'[.?!]$', w) and len(' '.join(cur)) > 18:
            out.append(' '.join(cur))
            cur = []
    if cur:
        out.append(' '.join(cur))
    return out


def two_lines(s):
    if len(s) <= MAXC:
        return s
    best = None
    for i, ch in enumerate(s):
        if ch == ' ':
            a, b = s[:i], s[i + 1:]
            score = max(len(a), len(b))
            if best is None or score < best[0]:
                best = (score, a, b)
    return best[1] + '\n' + best[2]


def ts(t, ass=False):
    h, m = int(t // 3600), int(t % 3600 // 60)
    s = t % 60
    return f'{h}:{m:02d}:{s:05.2f}' if ass else f'{h:02d}:{m:02d}:{s:06.3f}'.replace('.', ',')


events = []
for l in tl['lines']:
    cs = chunks(l['text'])
    total = sum(len(c) for c in cs)
    t = l['start']
    for c in cs:
        d = l['dur'] * len(c) / total
        events.append((t, t + d - 0.04, two_lines(c)))
        t += d
srt = '\n'.join(f'{i + 1}\n{ts(a)} --> {ts(b)}\n{txt}\n' for i, (a, b, txt) in enumerate(events))
os.makedirs(os.path.join(ROOT, 'renders'), exist_ok=True)
open(os.path.join(ROOT, 'renders/drillgeo_shorts.srt'), 'w').write(srt)
ass = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,Inter SemiBold,50,&H00F3EFED,&H00F3EFED,&H00140E0B,&H8C140E0B,0,0,0,0,100,100,0,0,3,14,0,2,90,90,500,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
for a, b, txt in events:
    ass += f"Dialogue: 0,{ts(a, True)},{ts(b, True)},Cap,,0,0,0,,{{\\fad(80,80)}}{txt.replace(chr(10), '\\N')}\n"
os.makedirs(os.path.join(ROOT, 'build'), exist_ok=True)
open(os.path.join(ROOT, 'build/captions.ass'), 'w').write(ass)
print(f'{len(events)} caption events')
