# Progresso

## Estado atual

| Fase | Status | Notas |
|---|---|---|
| 1. Pesquisa e roteiro | ✅ concluída | Site institucional lido (meta-descrição, serviços, paleta, fontes, logomarca). `TECHNICAL_REVIEW.md`, `SCRIPT.md`, `SHOT_LIST.md`, `ART_DIRECTION.md`. |
| 2. Identidade visual | ✅ concluída | Paleta da marca, Space Grotesk / IBM Plex Mono / Inter, sonda genérica, coluna geológica única, coroa/barrilete em mm, caixa de testemunhos. |
| 3. Piloto | ✅ concluído | `renders/drillgeo_pilot_s01.mp4` (0–12,5 s, narração N01 real, trilha e SFX). |
| 4. Mecanismos | ✅ concluída | S03 corte da coroa (vista lateral + face), S04 fluido (raio-X + circuito completo), S05 testemunho + wireline. |
| 5. Geologia | ✅ concluída | S06 camadas/profundidade, S07 caixa, S08 análise + ligações caixa ↔ camada, S09 final. |
| 6. Pós-produção | 🟡 quase concluída | Trilha e 49 tipos de SFX sintetizados; mix com ducking e loudness (−14 LUFS / −1,5 dBTP); legendas SRT + ASS. **Narração: 2 de 12 falas geradas** (N01, N04) — ElevenLabs gratuito recusou as demais ("busy"). |
| 7. Renderização | ✅ filme completo | `renders/drillgeo_shorts.mp4` (limpo) e `renders/drillgeo_shorts_legendado.mp4` (legenda queimada) — 9 cenas, ~2:11. Re-render automático quando as falas chegarem. |

## Narração (ElevenLabs)

- Fluxo: `DrillGeo Shorts — Narração` (voz "Henrique – Clear and Knowledgeable", `eleven_v4`).
- A cota gratuita compartilhada aceita **uma geração por turno**: as tentativas paralelas falharam com "Free generations are busy" (sem cobrança).
- Estratégia: as 10 falas restantes vão numa **única take**, separadas por `[long pause]`. `tools/narration.py combined` corta nas 9 pausas mais longas e confere a taxa de caracteres por segundo de cada trecho.
- Sem a narração, o timeline usa durações estimadas (`DG.NARR[*].est`), e o filme continua renderizável.

## Para fechar a narração

```bash
# 1. gerar a take combinada (texto em docs/SCRIPT.md, falas N02,N03,N05–N12 separadas por [long pause])
python3 tools/narration.py combined audio/narration/take_resto.mp3 N02,N03,N05,N06,N07,N08,N09,N10,N11,N12
node tools/render.js timeline && python3 tools/captions.py && python3 audio/mix.py
node tools/render.js video --out build/video_master_noaudio.mp4 --crf 18 --preset medium
# 2. mux / versões: ver tools/finish.sh
```

## Rede

- O ambiente padrão bloqueava `elevenlabsusercontent.com` (download das falas) e `drillgeo.com.br`. Foi criado o ambiente pessoal `autosmart-experience`, que libera só esses hosts.

## Comandos

```bash
cd drillgeo-shorts
node tools/render.js timeline                                   # exporta build/timeline.json + docs/TIMECODES.md
node tools/render.js stills --t 1,6,12 --sheet 3 --scale 0.3 --out renders/stills/x.png
python3 audio/mix.py                                            # narração + trilha + SFX → audio/mix/drillgeo_master.wav
node tools/render.js video --out renders/drillgeo_shorts.mp4 --audio audio/mix/drillgeo_master.wav --workers 4
python3 tools/cue_sheet.py                                      # docs/AUDIO_CUE_SHEET.md
python3 tests/audio_report.py                                   # níveis por cena / clipping
```

## Decisões registradas

- Grão de filme em 2,5%: com 4,5% o arquivo crescia ~30% sem ganho visual relevante no celular.
- Diâmetro do furo exagerado nas vistas gerais, e esquema do fluido fora de escala, com símbolo de interrupção (ver `TECHNICAL_REVIEW.md`).
- Logomarca: arquivo do site institucional. Trocar pelo arquivo-mestre, se a empresa tiver.
