# Progresso

## Estado atual

| Fase | Status | Notas |
|---|---|---|
| 1. Pesquisa e roteiro | ✅ concluída | Site institucional lido (meta-descrição, serviços, paleta, fontes, logomarca). `TECHNICAL_REVIEW.md`, `SCRIPT.md`, `SHOT_LIST.md`, `ART_DIRECTION.md`. |
| 2. Identidade visual | ✅ concluída | Paleta da marca, Space Grotesk / IBM Plex Mono / Inter, sonda genérica, coluna geológica única, coroa/barrilete em mm, caixa de testemunhos. |
| 3. Piloto | ✅ concluído | `renders/drillgeo_pilot_s01.mp4` (0–12,5 s, narração N01 real, trilha e SFX). |
| 4. Mecanismos | ✅ concluída | S03 corte da coroa (vista lateral + face), S04 fluido (raio-X + circuito completo), S05 testemunho + wireline. |
| 5. Geologia | ✅ concluída | S06 camadas/profundidade, S07 caixa, S08 análise + ligações caixa ↔ camada, S09 final. |
| 6. Pós-produção | ✅ concluída | 12/12 falas (ElevenLabs API, voz George, `eleven_v4`), verificadas por transcrição; trilha e 49 tipos de SFX; ducking (trilha −11 dB, efeitos −12 dB sob a voz); voz +7 a +14 dB sobre a base em todas as falas; master −14 LUFS / −1,5 dBTP; legendas SRT + ASS. |
| 7. Renderização | ✅ concluída | `renders/drillgeo_shorts.mp4` (limpo) e `renders/drillgeo_shorts_legendado.mp4` (legenda queimada), 2:13,75, 1080×1920, 24 fps. Master de upload (~130 MB) em `build/` (fora do git). |

## Narração (ElevenLabs)

- 1ª tentativa: conector ElevenLabs (cota gratuita compartilhada), voz "Henrique – Clear and Knowledgeable". Só 2 de 12 falas passaram; as demais voltaram "Free generations are busy".
- Solução: chave de API de outra conta (salva como segredo de rede do ambiente e injetada pelo proxy, nunca no código). Conta gratuita: sem vozes da biblioteca e sem criação de voz pela API → voz padrão **George**, escolhida entre George, Eric, Daniel e Brian por transcrição (idioma e fidelidade ao texto).
- `tools/elevenlabs_api.py` gera e confere as 12 falas; `tools/narration.py` recorta e gera `src/generated/narration_meta.js`, que reajusta o timeline às durações reais.

## Regerar a narração (ex.: voltar à voz brasileira nativa com conta paga)

```bash
python3 tools/elevenlabs_api.py <voice_id> eleven_v4
for k in N01 N02 N03 N04 N05 N06 N07 N08 N09 N10 N11 N12; do python3 tools/narration.py single audio/narration/api/$k.mp3 $k; done
node tools/render.js timeline && python3 tools/captions.py && python3 audio/mix.py
node tools/render.js video --out build/video_master_noaudio.mp4 --crf 18 --preset medium
tools/finish.sh
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
