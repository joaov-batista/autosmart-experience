# DrillGeo — O que existe debaixo dos nossos pés?

Curta educativo em animação 2D (Canvas, 100% por código), vertical 1080×1920, 24 fps, para YouTube Shorts, Reels e TikTok. Explica a sondagem rotativa diamantada com recuperação de testemunho: sonda, coroa, hastes, fluido, barrilete, wireline, camadas e profundidade, caixa de testemunhos e análise geológica.

## Entregas

| Arquivo | O que é |
|---|---|
| `renders/drillgeo_shorts.mp4` | filme completo, sem legenda queimada (use com `renders/drillgeo_shorts.srt`) |
| `renders/drillgeo_shorts_legendado.mp4` | filme completo com legenda queimada acima da interface do Shorts |
| `renders/drillgeo_shorts.srt` | legendas da narração |
| `audio/mix/drillgeo_master.wav` | áudio master estéreo 48 kHz, −14 LUFS |
| `docs/` | plano, roteiro, revisão técnica, direção de arte, shot list, cue sheet, timecodes, progresso |

## Como renderizar

Requisitos: Node 18+, Playwright com Chromium, Python 3 com numpy e scipy, FFmpeg.

```bash
node tools/render.js timeline                       # timeline + cues → build/timeline.json
python3 tools/captions.py                           # legendas
python3 audio/mix.py                                # narração + trilha + efeitos → master
node tools/render.js video --out build/video_master_noaudio.mp4 --crf 18 --preset medium
tools/finish.sh                                     # mux + versões de entrega
```

Para inspecionar quadros: `node tools/render.js stills --t 5,30,60 --sheet 3 --scale 0.3 --out renders/stills/x.png`.

## Estrutura

`src/engine` (núcleo, desenho) · `src/world` (geologia, paisagem, sonda, pessoas, coroa/barrilete, caixa) · `src/scenes` (S01–S09) · `src/timeline.js` (fonte única de tempo) · `audio/synth` (trilha e efeitos sintetizados) · `tools` (render, narração, legendas, cue sheet) · `tests` (QA de áudio).
