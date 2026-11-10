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
| N01 | 0:00.60 | 8.10 s | Oi! Eu sou o Geo, da equipe da DrillGeo. Você já pensou no que existe debaixo dos seus pés? Vem comigo, que eu te mostro! |
| N02 | 0:10.90 | 7.70 s | Lá embaixo tem camadas e mais camadas de rocha. Mas como a gente descobre o que tem lá… sem cavar um buraco gigante? |
| B01 | 0:20.80 | 9.68 s | Pensa num bolo de camadas. Se você enfia um canudo e puxa… sai uma amostrinha com todas as camadas dentro. A sondagem faz isso, só que na rocha! |
| N03 | 0:33.20 | 8.66 s | Essa é a sonda, a máquina que faz o furo. Ela gira uma coluna de tubos de aço, que a gente chama de hastes, e empurra tudo pra baixo. |
| N04 | 0:44.73 | 9.44 s | Na ponta fica a coroa: um anel cheio de diamantes. Ela gira e corta a rocha em forma de anel… igual a um cortador de biscoito. |
| N05 | 0:56.23 | 9.54 s | Enquanto ela corta, a gente manda água pelo meio dos tubos. A água esfria a coroa e leva o pó de rocha pra fora, igual à água na broca do dentista. |
| N06 | 1:07.58 | 9.54 s | E o miolo? O miolo fica inteirinho! Esse cilindro de rocha é o testemunho. Ele vai entrando num tubo, igual ao bolo dentro do canudo. |
| N07 | 1:19.02 | 9.72 s | Quando o tubo enche, a gente desce um cabo com uma peça que engata, o pescador, e puxa o tubo cheio lá do fundo. As hastes continuam no furo. |
| N08 | 1:31.42 | 10.18 s | Conforme o furo desce, ele atravessa camadas diferentes: terra, rocha mais mole, rocha dura, rachaduras… e às vezes um veio com minerais. |
| N09 | 1:44.53 | 8.48 s | Aqui em cima, as amostras vão pra uma caixa, na ordem certinha, com a profundidade anotada. É como um álbum de fotos do subsolo. |
| N10 | 1:55.08 | 10.52 s | Depois, o geólogo estuda cada pedaço com lupa. Às vezes aparece sinal de minério, às vezes não… e as duas respostas são informação valiosa. |
| N11 | 2:08.30 | 10.88 s | Resumindo: a coroa corta, o cilindro sobe, vai pra caixa, e o geólogo estuda. Assim dá pra decidir com mais segurança, antes de uma obra ou de uma mina. |
| N12 | 2:20.78 | 5.14 s | DrillGeo. Geologia e sondagem revelando o que a superfície não mostra. |

## Cues sincronizados

| Tempo | Cena | Cue | Som |
|---|---|---|---|
| 0:00.00 | s01 | `amb_nature` (8.95 s) | vento filtrado (2 canais descorrelacionados), pássaros FM, insetos |
| 0:07.15 | s01 | `whoosh_down` (1.60 s) | deslocamento de ar descendente + subgrave |
| 0:07.90 | s01 | `impact_sub` | impacto de abertura do corte (queda de pitch 70→26 Hz + estalo) |
| 0:07.90 | s01 | `earth_rumble` (4.25 s) | terra se deslocando (ruído marrom + crepitar) |
| 0:07.90 | s01 | `scan_shimmer` (3.45 s) | brilho cristalino da varredura de luz |
| 0:11.15 | s01 | `interest_chime` | sino FM da zona de interesse |
| 0:19.20 | s01 | `whip_up` (0.80 s) | whip-pan ascendente (ruído rosa em varredura de banda) |
| 0:20.00 | sb | `impact_arrive` | chegada na sonda |
| 0:20.60 | sb | `ui_pop` | chip/lupa aparecendo |
| 0:22.74 | sb | `straw_in` (1.55 s) |  |
| 0:24.67 | sb | `straw_out` (1.16 s) |  |
| 0:26.60 | sb | `reveal_soft` | revelação suave (inset da face) |
| 0:27.77 | sb | `xray_sweep` | transição para raio-X |
| 0:28.07 | sb | `drill_distant` (4.43 s) | perfuração abafada (distância) |
| 0:31.80 | sb | `whip_up` (0.70 s) | whip-pan ascendente (ruído rosa em varredura de banda) |
| 0:32.50 | s02 | `impact_arrive` | chegada na sonda |
| 0:32.50 | s02 | `amb_site` (10.62 s) | vento leve de praça de sondagem, pássaros esparsos |
| 0:32.50 | s02 | `engine` (10.62 s) | diesel: marcha lenta → aceleração (harmônicos da combustão + ruído pulsado) |
| 0:33.85 | s02 | `ui_tick` | rótulo (clique discreto) |
| 0:35.65 | s02 | `lever_clunk` | alavanca do console |
| 0:35.85 | s02 | `hydraulic_hiss` | alívio hidráulico |
| 0:36.00 | s02 | `rotation_start` (7.13 s) | cabeçote começando a girar (rampa) |
| 0:36.52 | s02 | `ui_tick` | rótulo (clique discreto) |
| 0:38.87 | s02 | `ui_tick` | rótulo (clique discreto) |
| 0:40.67 | s02 | `ui_tick` | rótulo (clique discreto) |
| 0:43.12 | s03 | `dive_whoosh` (1.90 s) | mergulho pelas hastes |
| 0:43.12 | s03 | `rotation_loop` (12.50 s) | rotação contínua (whine hidráulico + corpo + tique) |
| 0:44.62 | s03 | `cutting` (11.00 s) | coroa cortando rocha: atrito em banda + micro-estalos + vibração 38 Hz |
| 0:44.77 | s03 | `arrive_thud` | chegada ao fundo do furo |
| 0:45.97 | s03 | `ui_tick` | rótulo (clique discreto) |
| 0:48.98 | s03 | `ui_tick` | rótulo (clique discreto) |
| 0:49.92 | s03 | `ui_tick` | rótulo (clique discreto) |
| 0:50.39 | s03 | `reveal_soft` | revelação suave (inset da face) |
| 0:50.69 | s03 | `diamond_glint` | brilho dos diamantes |
| 0:52.38 | s03 | `ui_pop` | chip/lupa aparecendo |
| 0:55.62 | s04 | `rotation_loop` (11.25 s) | rotação contínua (whine hidráulico + corpo + tique) |
| 0:55.62 | s04 | `fluid_flow` (11.25 s) | circulação do fluido: ruído em banda com gorgolejo + bolhas |
| 0:55.67 | s04 | `xray_sweep` | transição para raio-X |
| 0:57.02 | s04 | `ui_tick` | rótulo (clique discreto) |
| 0:58.99 | s04 | `pull_back_whoosh` (1.30 s) | recuo de câmera |
| 0:59.09 | s04 | `pump` (7.79 s) | bomba (pistão) |
| 1:00.71 | s04 | `ui_pop` | chip/lupa aparecendo |
| 1:02.43 | s04 | `ui_pop` | chip/lupa aparecendo |
| 1:05.72 | s04 | `push_in_whoosh` (1.20 s) | avanço de câmera para o barrilete |
| 1:06.88 | s05 | `rotation_loop` (11.14 s) | rotação contínua (whine hidráulico + corpo + tique) |
| 1:06.88 | s05 | `cutting` (10.14 s) | coroa cortando rocha: atrito em banda + micro-estalos + vibração 38 Hz |
| 1:07.28 | s05 | `core_slide` (9.64 s) | testemunho deslizando no tubo interno |
| 1:11.88 | s05 | `ui_tick` | rótulo (clique discreto) |
| 1:13.49 | s05 | `scan_shimmer` (3.15 s) | brilho cristalino da varredura de luz |
| 1:13.98 | s05 | `ui_tick` | rótulo (clique discreto) |
| 1:16.72 | s05 | `motor_down` (1.70 s) | desaceleração da rotação |
| 1:18.41 | s05 | `winch_run` (3.10 s) | guincho wireline (cabo de aço) |
| 1:18.41 | s05 | `dive_whoosh` (3.10 s) | mergulho pelas hastes |
| 1:22.08 | s05 | `latch_click` | engate do pescador / travas |
| 1:22.78 | s05 | `metal_clank` | peças metálicas (síntese modal inarmônica) |
| 1:24.02 | s05 | `core_break` | mola extratora parte o testemunho |
| 1:24.52 | s05 | `winch_run` (2.80 s) | guincho wireline (cabo de aço) |
| 1:24.52 | s05 | `rise_whoosh` (2.80 s) | subida (tubo interno / câmera) |
| 1:27.31 | s05 | `amb_site` (3.31 s) | vento leve de praça de sondagem, pássaros esparsos |
| 1:27.81 | s05 | `metal_clank` | peças metálicas (síntese modal inarmônica) |
| 1:29.37 | s05 | `winch_stop` | freio do guincho |
| 1:30.62 | s06 | `under_drone` (12.50 s) | drone subterrâneo |
| 1:30.62 | s06 | `drill_distant` (12.00 s) | perfuração abafada (distância) |
| 1:31.22 | s06 | `ui_tick` | rótulo (clique discreto) |
| 1:32.22 | s06 | `layer_tick` | troca de camada (grave + sino, afinado por camada) |
| 1:33.12 | s06 | `layer_tick` | troca de camada (grave + sino, afinado por camada) |
| 1:34.47 | s06 | `layer_tick` | troca de camada (grave + sino, afinado por camada) |
| 1:35.74 | s06 | `layer_tick` | troca de camada (grave + sino, afinado por camada) |
| 1:36.96 | s06 | `layer_tick` | troca de camada (grave + sino, afinado por camada) |
| 1:37.54 | s06 | `interest_chime` | sino FM da zona de interesse |
| 1:39.90 | s06 | `layer_tick` | troca de camada (grave + sino, afinado por camada) |
| 1:42.53 | s06 | `whip_up` (0.60 s) | whip-pan ascendente (ruído rosa em varredura de banda) |
| 1:43.12 | s07 | `amb_site` (11.25 s) | vento leve de praça de sondagem, pássaros esparsos |
| 1:43.42 | s07 | `core_slide_metal` (2.20 s) | pedra deslizando na calha metálica |
| 1:45.88 | s07 | `box_open` | tampa de madeira (rangido + batida) |
| 1:46.42 | s07 | `ui_tick` | rótulo (clique discreto) |
| 1:47.30 | s07 | `core_place` | peça de rocha na canaleta de madeira (variação por peça) |
| 1:47.97 | s07 | `core_place` | peça de rocha na canaleta de madeira (variação por peça) |
| 1:48.60 | s07 | `marker_write` (1.19 s) | caneta na etiqueta |
| 1:48.65 | s07 | `core_place` | peça de rocha na canaleta de madeira (variação por peça) |
| 1:49.32 | s07 | `core_place` | peça de rocha na canaleta de madeira (variação por peça) |
| 1:49.58 | s07 | `block_place` | taco de profundidade |
| 1:51.17 | s07 | `pull_back_whoosh` (2.80 s) | recuo de câmera |
| 1:54.38 | s08 | `amb_site` (13.12 s) | vento leve de praça de sondagem, pássaros esparsos |
| 1:54.78 | s08 | `cloth_move` | movimento do uniforme |
| 1:57.08 | s08 | `lens_swish` | lupa entrando |
| 1:57.67 | s08 | `feature_bell` | feição identificada (sino) |
| 1:58.67 | s08 | `feature_bell` | feição identificada (sino) |
| 1:59.67 | s08 | `interest_chime` | sino FM da zona de interesse |
| 2:00.58 | s08 | `interest_chime` | sino FM da zona de interesse |
| 2:01.47 | s08 | `feature_bell` | feição identificada (sino) |
| 2:03.68 | s08 | `links_arp` (1.60 s) | arpejo das ligações caixa ↔ camada |
| 2:05.90 | s08 | `return_whoosh` (1.80 s) | amostras voltando ao subsolo |
| 2:07.50 | s09 | `amb_site` (12.48 s) | vento leve de praça de sondagem, pássaros esparsos |
| 2:07.50 | s09 | `drill_distant` (11.98 s) | perfuração abafada (distância) |
| 2:09.44 | s09 | `ui_pop` | chip/lupa aparecendo |
| 2:10.74 | s09 | `ui_pop` | chip/lupa aparecendo |
| 2:11.94 | s09 | `ui_pop` | chip/lupa aparecendo |
| 2:13.14 | s09 | `ui_pop` | chip/lupa aparecendo |
| 2:18.88 | s09 | `rise_whoosh` (2.70 s) | subida (tubo interno / câmera) |
| 2:20.08 | s09 | `logo_spin` (2.20 s) | giro da hélice |
| 2:21.33 | s09 | `logo_hit` | assinatura sonora (impacto + sinos em ré maior) |
