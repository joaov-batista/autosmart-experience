# Audio cue sheet

Gerado por `tools/cue_sheet.py` a partir de `build/timeline.json` (os mesmos tempos que dirigem a animação).

## Camadas

| Camada | Fonte | Tratamento |
|---|---|---|
| Narração | ElevenLabs `eleven_v4`, voz "Henrique – Clear and Knowledgeable" | HP 85 Hz, −1,5 dB @180 Hz, +2,5 dB @3,2 kHz, compressão 3:1 suave |
| Trilha | original, sintetizada (`audio/synth/music.py`), ré menor, 96 BPM | ducking −9 dB sob a voz |
| Efeitos | sintetizados (`audio/synth/sfx.py`), um por cue, semente própria | ducking −4 dB sob a voz |
| Master | soma → shelf −2,5 dB @8,5 kHz → soft clip → limitador −2 dBFS → loudnorm 2 passes | **−14 LUFS integrados, −1,5 dBTP**, estéreo 48 kHz |

## Trilha por cena

| Cena | Clima | Harmonia | Instrumentação |
|---|---|---|---|
| S01 | mistério, descoberta | Dm(add9) | pad escuro, sub D1, sinos esparsos; pad abre no impacto; riser para S02 |
| S02 | tecnológico, industrial | Dm–Bb–F–C | baixo ostinato em colcheias, bumbo 1/3, hats, bigorna; palmas entram quando a rotação liga |
| S03 | perfuração, intensidade crescente | Dm–Bb–Gm–A | 4/4, baixo em semicolcheias, toms de virada, caixa 2/4 |
| S04 | fluxo | Dm–F–C–Gm | arpejo "líquido" em semicolcheias com delay ping-pong, groove leve |
| S05 | preciso, curioso → tensão | Dm–F–Am–C → pedal | pizzicato Karplus-Strong; no wireline: tique de relógio, pulso grave, riser; impacto na superfície |
| S06 | profundidade | Dm–Bb–F–C (oitava abaixo) | pulso de baixo, sinos descendentes por compasso |
| S07 | cuidado, organização | F–C–Dm–Bb | marimba, shaker leve |
| S08 | descoberta científica | F–Am–Bb–C | sinos em arpejo, pad quente |
| S09 | inspirador, institucional | Bb–F–C–Dm–Bb–C–Fsus–A → **D** | crescendo de bateria e pad; acorde de ré maior na hélice, cauda longa |

## Falas

| Fala | Início | Duração | Texto |
|---|---|---|---|
| N01 | 0:00.80 | 4.48 s | Você já parou para pensar no que existe centenas de metros abaixo dos seus pés? |
| N02 | 0:07.28 | 3.60 s | Como podemos descobrir o que está escondido lá embaixo? |
| N03 | 0:13.20 | 9.60 s | É aqui que entra a sondagem. Com equipamentos especializados, a DrillGeo investiga o subsolo e recupera informações essenciais sobre as rochas. |
| N04 | 0:25.35 | 8.52 s | Na sondagem rotativa diamantada, a máquina transmite rotação e força de avanço através das hastes… permitindo que a coroa corte a rocha. |
| N05 | 0:35.60 | 10.20 s | Durante a perfuração, um fluido circula pelo sistema. Ele ajuda a resfriar a coroa, remover os fragmentos de rocha e manter condições adequadas para o avanço. |
| N06 | 0:47.58 | 13.60 s | Mas o objetivo não é apenas abrir um furo. É recuperar uma amostra da rocha, chamada testemunho de sondagem. Esse cilindro preserva informações valiosas sobre as características do material atravessado. |
| N07 | 1:03.08 | 7.80 s | No sistema wireline, um cabo de aço traz o tubo interno com o testemunho até a superfície, sem retirar as hastes do furo. |
| N08 | 1:13.40 | 10.10 s | Cada profundidade pode revelar uma formação diferente. Mudanças de cor, composição, textura e fraturamento ajudam a contar a história geológica daquele local. |
| N09 | 1:26.40 | 9.20 s | Na superfície, os testemunhos são organizados em caixas, identificados por furo e profundidade, preservando a sequência das rochas recuperadas. |
| N10 | 1:37.58 | 10.60 s | Com essas amostras, os geólogos estudam as formações, identificam estruturas e investigam possíveis mineralizações e outras características importantes do terreno. |
| N11 | 1:50.90 | 10.50 s | Em projetos de mineração e de investigação geológica, entender o que existe abaixo da superfície é essencial para tomar decisões com mais conhecimento e precisão. |
| N12 | 2:03.00 | 4.60 s | DrillGeo. Geologia e sondagem revelando o que a superfície não mostra. |

## Cues sincronizados

| Tempo | Cena | Cue | Som |
|---|---|---|---|
| 0:00.00 | s01 | `amb_nature` (5.53 s) | vento filtrado (2 canais descorrelacionados), pássaros FM, insetos |
| 0:03.73 | s01 | `whoosh_down` (1.60 s) | deslocamento de ar descendente + subgrave |
| 0:04.48 | s01 | `impact_sub` | impacto de abertura do corte (queda de pitch 70→26 Hz + estalo) |
| 0:04.48 | s01 | `earth_rumble` (4.25 s) | terra se deslocando (ruído marrom + crepitar) |
| 0:04.48 | s01 | `scan_shimmer` (3.45 s) | brilho cristalino da varredura de luz |
| 0:07.73 | s01 | `interest_chime` | sino FM da zona de interesse |
| 0:11.70 | s01 | `whip_up` (0.80 s) | whip-pan ascendente (ruído rosa em varredura de banda) |
| 0:12.50 | s02 | `impact_arrive` | chegada na sonda |
| 0:12.50 | s02 | `amb_site` (11.25 s) | vento leve de praça de sondagem, pássaros esparsos |
| 0:12.50 | s02 | `engine` (11.25 s) | diesel: marcha lenta → aceleração (harmônicos da combustão + ruído pulsado) |
| 0:14.27 | s02 | `ui_tick` | rótulo (clique discreto) |
| 0:15.42 | s02 | `ui_tick` | rótulo (clique discreto) |
| 0:17.15 | s02 | `ui_tick` | rótulo (clique discreto) |
| 0:18.30 | s02 | `ui_tick` | rótulo (clique discreto) |
| 0:19.64 | s02 | `ui_tick` | rótulo (clique discreto) |
| 0:19.96 | s02 | `lever_clunk` | alavanca do console |
| 0:20.16 | s02 | `hydraulic_hiss` | alívio hidráulico |
| 0:20.31 | s02 | `rotation_start` (3.44 s) | cabeçote começando a girar (rampa) |
| 0:20.80 | s02 | `ui_tick` | rótulo (clique discreto) |
| 0:23.75 | s03 | `dive_whoosh` (1.90 s) | mergulho pelas hastes |
| 0:23.75 | s03 | `rotation_loop` (11.25 s) | rotação contínua (whine hidráulico + corpo + tique) |
| 0:25.25 | s03 | `cutting` (9.75 s) | coroa cortando rocha: atrito em banda + micro-estalos + vibração 38 Hz |
| 0:25.40 | s03 | `arrive_thud` | chegada ao fundo do furo |
| 0:29.03 | s03 | `ui_tick` | rótulo (clique discreto) |
| 0:29.97 | s03 | `ui_tick` | rótulo (clique discreto) |
| 0:31.65 | s03 | `reveal_soft` | revelação suave (inset da face) |
| 0:31.95 | s03 | `diamond_glint` | brilho dos diamantes |
| 0:32.81 | s03 | `ui_tick` | rótulo (clique discreto) |
| 0:35.00 | s04 | `rotation_loop` (11.88 s) | rotação contínua (whine hidráulico + corpo + tique) |
| 0:35.00 | s04 | `fluid_flow` (11.88 s) | circulação do fluido: ruído em banda com gorgolejo + bolhas |
| 0:35.05 | s04 | `xray_sweep` | transição para raio-X |
| 0:36.40 | s04 | `ui_tick` | rótulo (clique discreto) |
| 0:38.56 | s04 | `pull_back_whoosh` (1.30 s) | recuo de câmera |
| 0:38.66 | s04 | `pump` (8.21 s) | bomba (pistão) |
| 0:40.09 | s04 | `ui_pop` | chip/lupa aparecendo |
| 0:41.82 | s04 | `ui_pop` | chip/lupa aparecendo |
| 0:43.66 | s04 | `ui_pop` | chip/lupa aparecendo |
| 0:45.73 | s04 | `push_in_whoosh` (1.20 s) | avanço de câmera para o barrilete |
| 0:46.88 | s05 | `rotation_loop` (15.20 s) | rotação contínua (whine hidráulico + corpo + tique) |
| 0:46.88 | s05 | `cutting` (14.20 s) | coroa cortando rocha: atrito em banda + micro-estalos + vibração 38 Hz |
| 0:47.27 | s05 | `core_slide` (13.70 s) | testemunho deslizando no tubo interno |
| 0:50.87 | s05 | `ui_tick` | rótulo (clique discreto) |
| 0:54.67 | s05 | `ui_tick` | rótulo (clique discreto) |
| 0:56.01 | s05 | `scan_shimmer` (4.49 s) | brilho cristalino da varredura de luz |
| 1:00.77 | s05 | `motor_down` (1.70 s) | desaceleração da rotação |
| 1:02.33 | s05 | `winch_run` (2.75 s) | guincho wireline (cabo de aço) |
| 1:02.33 | s05 | `dive_whoosh` (2.75 s) | mergulho pelas hastes |
| 1:05.39 | s05 | `latch_click` | engate do pescador / travas |
| 1:05.77 | s05 | `metal_clank` | peças metálicas (síntese modal inarmônica) |
| 1:06.70 | s05 | `core_break` | mola extratora parte o testemunho |
| 1:07.28 | s05 | `winch_run` (3.00 s) | guincho wireline (cabo de aço) |
| 1:07.28 | s05 | `rise_whoosh` (3.00 s) | subida (tubo interno / câmera) |
| 1:10.28 | s05 | `amb_site` (2.23 s) | vento leve de praça de sondagem, pássaros esparsos |
| 1:10.78 | s05 | `metal_clank` | peças metálicas (síntese modal inarmônica) |
| 1:11.65 | s05 | `winch_stop` | freio do guincho |
| 1:12.50 | s06 | `under_drone` (12.50 s) | drone subterrâneo |
| 1:12.50 | s06 | `drill_distant` (12.00 s) | perfuração abafada (distância) |
| 1:13.10 | s06 | `ui_tick` | rótulo (clique discreto) |
| 1:14.10 | s06 | `layer_tick` | troca de camada (grave + sino, afinado por camada) |
| 1:15.00 | s06 | `layer_tick` | troca de camada (grave + sino, afinado por camada) |
| 1:16.34 | s06 | `layer_tick` | troca de camada (grave + sino, afinado por camada) |
| 1:17.62 | s06 | `layer_tick` | troca de camada (grave + sino, afinado por camada) |
| 1:18.50 | s06 | `ui_pop` | chip/lupa aparecendo |
| 1:18.84 | s06 | `layer_tick` | troca de camada (grave + sino, afinado por camada) |
| 1:19.42 | s06 | `interest_chime` | sino FM da zona de interesse |
| 1:19.71 | s06 | `ui_pop` | chip/lupa aparecendo |
| 1:20.92 | s06 | `ui_pop` | chip/lupa aparecendo |
| 1:21.78 | s06 | `layer_tick` | troca de camada (grave + sino, afinado por camada) |
| 1:22.14 | s06 | `ui_pop` | chip/lupa aparecendo |
| 1:24.40 | s06 | `whip_up` (0.60 s) | whip-pan ascendente (ruído rosa em varredura de banda) |
| 1:25.00 | s07 | `amb_site` (11.88 s) | vento leve de praça de sondagem, pássaros esparsos |
| 1:25.30 | s07 | `core_slide_metal` (2.20 s) | pedra deslizando na calha metálica |
| 1:27.75 | s07 | `box_open` | tampa de madeira (rangido + batida) |
| 1:28.30 | s07 | `ui_tick` | rótulo (clique discreto) |
| 1:29.17 | s07 | `core_place` | peça de rocha na canaleta de madeira (variação por peça) |
| 1:29.85 | s07 | `core_place` | peça de rocha na canaleta de madeira (variação por peça) |
| 1:30.52 | s07 | `core_place` | peça de rocha na canaleta de madeira (variação por peça) |
| 1:30.82 | s07 | `marker_write` (1.29 s) | caneta na etiqueta |
| 1:31.20 | s07 | `core_place` | peça de rocha na canaleta de madeira (variação por peça) |
| 1:31.45 | s07 | `block_place` | taco de profundidade |
| 1:33.67 | s07 | `pull_back_whoosh` (2.80 s) | recuo de câmera |
| 1:36.88 | s08 | `amb_site` (13.12 s) | vento leve de praça de sondagem, pássaros esparsos |
| 1:37.28 | s08 | `cloth_move` | movimento do uniforme |
| 1:39.58 | s08 | `lens_swish` | lupa entrando |
| 1:40.17 | s08 | `feature_bell` | feição identificada (sino) |
| 1:41.17 | s08 | `feature_bell` | feição identificada (sino) |
| 1:42.17 | s08 | `interest_chime` | sino FM da zona de interesse |
| 1:43.08 | s08 | `interest_chime` | sino FM da zona de interesse |
| 1:43.97 | s08 | `feature_bell` | feição identificada (sino) |
| 1:46.24 | s08 | `links_arp` (1.60 s) | arpejo das ligações caixa ↔ camada |
| 1:48.40 | s08 | `return_whoosh` (1.80 s) | amostras voltando ao subsolo |
| 1:50.00 | s09 | `amb_site` (12.20 s) | vento leve de praça de sondagem, pássaros esparsos |
| 1:50.00 | s09 | `drill_distant` (11.70 s) | perfuração abafada (distância) |
| 2:01.10 | s09 | `rise_whoosh` (2.70 s) | subida (tubo interno / câmera) |
| 2:02.30 | s09 | `logo_spin` (2.20 s) | giro da hélice |
| 2:03.55 | s09 | `logo_hit` | assinatura sonora (impacto + sinos em ré maior) |
