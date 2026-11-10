# Audio cue sheet

Gerado por `tools/cue_sheet.py` a partir de `build/timeline.json` (os mesmos tempos que dirigem a animação).

## Camadas

| Camada | Fonte | Tratamento |
|---|---|---|
| Narração | ElevenLabs `eleven_v4`, voz "Henrique – Clear and Knowledgeable" | HP 85 Hz, −1,5 dB @180 Hz, +2,5 dB @3,2 kHz, compressão 3:1 suave |
| Trilha | original, sintetizada (`audio/synth/music.py`), ré menor, 96 BPM | ducking −11 dB sob a voz |
| Efeitos | sintetizados (`audio/synth/sfx.py`), um por cue, semente própria | ducking −12 dB sob a voz |
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
| N01 | 0:00.80 | 4.64 s | Você já parou para pensar no que existe centenas de metros abaixo dos seus pés? |
| N02 | 0:07.44 | 3.10 s | Como podemos descobrir o que está escondido lá embaixo? |
| N03 | 0:13.20 | 9.32 s | É aqui que entra a sondagem. Com equipamentos especializados, a DrillGeo investiga o subsolo e recupera informações essenciais sobre as rochas. |
| N04 | 0:25.35 | 9.28 s | Na sondagem rotativa diamantada, a máquina transmite rotação e força de avanço através das hastes… permitindo que a coroa corte a rocha. |
| N05 | 0:36.23 | 10.70 s | Durante a perfuração, um fluido circula pelo sistema. Ele ajuda a resfriar a coroa, remover os fragmentos de rocha e manter condições adequadas para o avanço. |
| N06 | 0:48.83 | 13.56 s | Mas o objetivo não é apenas abrir um furo. É recuperar uma amostra da rocha, chamada testemunho de sondagem. Esse cilindro preserva informações valiosas sobre as características do material atravessado. |
| N07 | 1:04.28 | 8.18 s | No sistema wireline, um cabo de aço traz o tubo interno com o testemunho até a superfície, sem retirar as hastes do furo. |
| N08 | 1:15.28 | 10.88 s | Cada profundidade pode revelar uma formação diferente. Mudanças de cor, composição, textura e fraturamento ajudam a contar a história geológica daquele local. |
| N09 | 1:28.90 | 9.38 s | Na superfície, os testemunhos são organizados em caixas, identificados por furo e profundidade, preservando a sequência das rochas recuperadas. |
| N10 | 1:40.08 | 10.66 s | Com essas amostras, os geólogos estudam as formações, identificam estruturas e investigam possíveis mineralizações e outras características importantes do terreno. |
| N11 | 1:53.40 | 10.46 s | Em projetos de mineração e de investigação geológica, entender o que existe abaixo da superfície é essencial para tomar decisões com mais conhecimento e precisão. |
| N12 | 2:05.46 | 5.26 s | DrillGeo. Geologia e sondagem revelando o que a superfície não mostra. |

## Cues sincronizados

| Tempo | Cena | Cue | Som |
|---|---|---|---|
| 0:00.00 | s01 | `amb_nature` (5.69 s) | vento filtrado (2 canais descorrelacionados), pássaros FM, insetos |
| 0:03.89 | s01 | `whoosh_down` (1.60 s) | deslocamento de ar descendente + subgrave |
| 0:04.64 | s01 | `impact_sub` | impacto de abertura do corte (queda de pitch 70→26 Hz + estalo) |
| 0:04.64 | s01 | `earth_rumble` (4.25 s) | terra se deslocando (ruído marrom + crepitar) |
| 0:04.64 | s01 | `scan_shimmer` (3.45 s) | brilho cristalino da varredura de luz |
| 0:07.89 | s01 | `interest_chime` | sino FM da zona de interesse |
| 0:11.70 | s01 | `whip_up` (0.80 s) | whip-pan ascendente (ruído rosa em varredura de banda) |
| 0:12.50 | s02 | `impact_arrive` | chegada na sonda |
| 0:12.50 | s02 | `amb_site` (11.25 s) | vento leve de praça de sondagem, pássaros esparsos |
| 0:12.50 | s02 | `engine` (11.25 s) | diesel: marcha lenta → aceleração (harmônicos da combustão + ruído pulsado) |
| 0:14.25 | s02 | `ui_tick` | rótulo (clique discreto) |
| 0:15.36 | s02 | `ui_tick` | rótulo (clique discreto) |
| 0:17.04 | s02 | `ui_tick` | rótulo (clique discreto) |
| 0:18.16 | s02 | `ui_tick` | rótulo (clique discreto) |
| 0:19.46 | s02 | `ui_tick` | rótulo (clique discreto) |
| 0:19.76 | s02 | `lever_clunk` | alavanca do console |
| 0:19.96 | s02 | `hydraulic_hiss` | alívio hidráulico |
| 0:20.11 | s02 | `rotation_start` (3.64 s) | cabeçote começando a girar (rampa) |
| 0:20.58 | s02 | `ui_tick` | rótulo (clique discreto) |
| 0:23.75 | s03 | `dive_whoosh` (1.90 s) | mergulho pelas hastes |
| 0:23.75 | s03 | `rotation_loop` (11.88 s) | rotação contínua (whine hidráulico + corpo + tique) |
| 0:25.25 | s03 | `cutting` (10.38 s) | coroa cortando rocha: atrito em banda + micro-estalos + vibração 38 Hz |
| 0:25.40 | s03 | `arrive_thud` | chegada ao fundo do furo |
| 0:29.35 | s03 | `ui_tick` | rótulo (clique discreto) |
| 0:30.37 | s03 | `ui_tick` | rótulo (clique discreto) |
| 0:32.22 | s03 | `reveal_soft` | revelação suave (inset da face) |
| 0:32.52 | s03 | `diamond_glint` | brilho dos diamantes |
| 0:33.45 | s03 | `ui_tick` | rótulo (clique discreto) |
| 0:35.62 | s04 | `rotation_loop` (12.50 s) | rotação contínua (whine hidráulico + corpo + tique) |
| 0:35.62 | s04 | `fluid_flow` (12.50 s) | circulação do fluido: ruído em banda com gorgolejo + bolhas |
| 0:35.67 | s04 | `xray_sweep` | transição para raio-X |
| 0:37.02 | s04 | `ui_tick` | rótulo (clique discreto) |
| 0:39.34 | s04 | `pull_back_whoosh` (1.30 s) | recuo de câmera |
| 0:39.44 | s04 | `pump` (8.69 s) | bomba (pistão) |
| 0:40.93 | s04 | `ui_pop` | chip/lupa aparecendo |
| 0:42.74 | s04 | `ui_pop` | chip/lupa aparecendo |
| 0:44.67 | s04 | `ui_pop` | chip/lupa aparecendo |
| 0:46.98 | s04 | `push_in_whoosh` (1.20 s) | avanço de câmera para o barrilete |
| 0:48.12 | s05 | `rotation_loop` (15.16 s) | rotação contínua (whine hidráulico + corpo + tique) |
| 0:48.12 | s05 | `cutting` (14.16 s) | coroa cortando rocha: atrito em banda + micro-estalos + vibração 38 Hz |
| 0:48.52 | s05 | `core_slide` (13.66 s) | testemunho deslizando no tubo interno |
| 0:52.11 | s05 | `ui_tick` | rótulo (clique discreto) |
| 0:55.91 | s05 | `ui_tick` | rótulo (clique discreto) |
| 0:57.23 | s05 | `scan_shimmer` (4.47 s) | brilho cristalino da varredura de luz |
| 1:01.98 | s05 | `motor_down` (1.70 s) | desaceleração da rotação |
| 1:03.53 | s05 | `winch_run` (2.75 s) | guincho wireline (cabo de aço) |
| 1:03.53 | s05 | `dive_whoosh` (2.75 s) | mergulho pelas hastes |
| 1:06.60 | s05 | `latch_click` | engate do pescador / travas |
| 1:06.97 | s05 | `metal_clank` | peças metálicas (síntese modal inarmônica) |
| 1:07.91 | s05 | `core_break` | mola extratora parte o testemunho |
| 1:08.48 | s05 | `winch_run` (3.00 s) | guincho wireline (cabo de aço) |
| 1:08.48 | s05 | `rise_whoosh` (3.00 s) | subida (tubo interno / câmera) |
| 1:11.48 | s05 | `amb_site` (2.89 s) | vento leve de praça de sondagem, pássaros esparsos |
| 1:11.98 | s05 | `metal_clank` | peças metálicas (síntese modal inarmônica) |
| 1:13.28 | s05 | `winch_stop` | freio do guincho |
| 1:14.38 | s06 | `under_drone` (13.12 s) | drone subterrâneo |
| 1:14.38 | s06 | `drill_distant` (12.62 s) | perfuração abafada (distância) |
| 1:14.97 | s06 | `ui_tick` | rótulo (clique discreto) |
| 1:16.06 | s06 | `layer_tick` | troca de camada (grave + sino, afinado por camada) |
| 1:17.00 | s06 | `layer_tick` | troca de camada (grave + sino, afinado por camada) |
| 1:18.42 | s06 | `layer_tick` | troca de camada (grave + sino, afinado por camada) |
| 1:19.75 | s06 | `layer_tick` | troca de camada (grave + sino, afinado por camada) |
| 1:20.77 | s06 | `ui_pop` | chip/lupa aparecendo |
| 1:21.05 | s06 | `layer_tick` | troca de camada (grave + sino, afinado por camada) |
| 1:21.65 | s06 | `interest_chime` | sino FM da zona de interesse |
| 1:22.07 | s06 | `ui_pop` | chip/lupa aparecendo |
| 1:23.38 | s06 | `ui_pop` | chip/lupa aparecendo |
| 1:24.13 | s06 | `layer_tick` | troca de camada (grave + sino, afinado por camada) |
| 1:24.68 | s06 | `ui_pop` | chip/lupa aparecendo |
| 1:26.90 | s06 | `whip_up` (0.60 s) | whip-pan ascendente (ruído rosa em varredura de banda) |
| 1:27.50 | s07 | `amb_site` (11.88 s) | vento leve de praça de sondagem, pássaros esparsos |
| 1:27.80 | s07 | `core_slide_metal` (2.20 s) | pedra deslizando na calha metálica |
| 1:30.25 | s07 | `box_open` | tampa de madeira (rangido + batida) |
| 1:30.80 | s07 | `ui_tick` | rótulo (clique discreto) |
| 1:31.67 | s07 | `core_place` | peça de rocha na canaleta de madeira (variação por peça) |
| 1:32.35 | s07 | `core_place` | peça de rocha na canaleta de madeira (variação por peça) |
| 1:33.02 | s07 | `core_place` | peça de rocha na canaleta de madeira (variação por peça) |
| 1:33.40 | s07 | `marker_write` (1.31 s) | caneta na etiqueta |
| 1:33.70 | s07 | `core_place` | peça de rocha na canaleta de madeira (variação por peça) |
| 1:33.95 | s07 | `block_place` | taco de profundidade |
| 1:36.17 | s07 | `pull_back_whoosh` (2.80 s) | recuo de câmera |
| 1:39.38 | s08 | `amb_site` (13.12 s) | vento leve de praça de sondagem, pássaros esparsos |
| 1:39.78 | s08 | `cloth_move` | movimento do uniforme |
| 1:42.08 | s08 | `lens_swish` | lupa entrando |
| 1:42.67 | s08 | `feature_bell` | feição identificada (sino) |
| 1:43.67 | s08 | `feature_bell` | feição identificada (sino) |
| 1:44.67 | s08 | `interest_chime` | sino FM da zona de interesse |
| 1:45.58 | s08 | `interest_chime` | sino FM da zona de interesse |
| 1:46.47 | s08 | `feature_bell` | feição identificada (sino) |
| 1:48.79 | s08 | `links_arp` (1.60 s) | arpejo das ligações caixa ↔ camada |
| 1:50.90 | s08 | `return_whoosh` (1.80 s) | amostras voltando ao subsolo |
| 1:52.50 | s09 | `amb_site` (12.16 s) | vento leve de praça de sondagem, pássaros esparsos |
| 1:52.50 | s09 | `drill_distant` (11.66 s) | perfuração abafada (distância) |
| 2:03.56 | s09 | `rise_whoosh` (2.70 s) | subida (tubo interno / câmera) |
| 2:04.76 | s09 | `logo_spin` (2.20 s) | giro da hélice |
| 2:06.01 | s09 | `logo_hit` | assinatura sonora (impacto + sinos em ré maior) |
