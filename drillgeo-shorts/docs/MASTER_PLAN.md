# DrillGeo — O que existe debaixo dos nossos pés?

Curta educativo em animação 2D, vertical 9:16 (1080×1920, 24 fps), português do Brasil, para YouTube Shorts, Reels e TikTok.

## Objetivo

Mostrar, com o processo acontecendo na tela, como funciona a **sondagem rotativa diamantada com recuperação contínua de testemunho**: para que serve, o que a sonda faz, como coroa, hastes, fluido e barrilete trabalham juntos, como o testemunho é recuperado por wireline e organizado em caixas, e o que os geólogos analisam.

Conceito: *"A superfície mostra apenas uma pequena parte da história. A DrillGeo ajuda a descobrir o que existe abaixo dela."*
O site institucional usa o mote **"Cada camada do subsolo conta uma história."**, e o filme é construído em torno dessa ideia.

## Decisões de produção

| Tema | Decisão |
|---|---|
| Visual | 100% desenhado por código em **Canvas 2D** (sem 3D, sem vídeo/imagem por IA). Cenários, sonda, pessoas, rochas e partículas são procedurais. |
| Renderização | Página HTML com `renderFrame(t)` puro (sem estado acumulado) → Chromium headless via Playwright → JPEG por quadro → FFmpeg (H.264). 4 workers em paralelo, cada um com um trecho do filme. |
| Determinismo | Toda animação é função do tempo `t`. Partículas são analíticas (posição calculada a partir do instante de emissão). Qualquer quadro pode ser renderizado isoladamente: isso permite stills de inspeção e renderização paralela. |
| Fonte da verdade do tempo | `src/timeline.js`: duração das cenas, falas e cues sonoros. O pipeline de áudio lê o mesmo arquivo (exportado para `build/timeline.json`). |
| Grade musical | 96 BPM (compasso de 2,5 s). As cenas são arredondadas para meio compasso (1,25 s), de modo que os cortes caem no tempo da trilha. |
| Narração | ElevenLabs (`eleven_v4`, voz "Henrique – Clear and Knowledgeable"), **somente voz**. Uma fala por bloco do roteiro, posicionada pelo timeline. |
| Trilha e SFX | Originais, sintetizados em Python (numpy/scipy) a partir do mesmo timeline: nada de bibliotecas de terceiros. |
| Marca | Logomarca oficial (hélice) obtida do site institucional `drillgeo.com.br/assets/logo/Helice_uniforme-recortado.png`. Wordmark composto como no site: "Drill" (papel) + "Geo" (azul), Space Grotesk 700. Paleta da marca extraída do CSS do site. |
| Equipamento | Sonda **genérica**, tecnicamente coerente, **não** apresentada como modelo da frota da empresa. |

## Estrutura

```
drillgeo-shorts/
  docs/        documentos (este, roteiro, revisão técnica, direção de arte, shot list, cue sheet, progresso)
  src/         motor 2D (engine/), mundo e equipamentos (world/), cenas (scenes/), timeline, página de render
  assets/      fontes, marca, referências
  audio/       narração (ElevenLabs), síntese de trilha e SFX, mix
  tools/       renderizador Playwright, stills/contact sheets, exportação do timeline
  renders/     saídas (stills de inspeção, segmentos, MP4 final)
  tests/       verificações automáticas (determinismo, safe areas, sincronismo, níveis)
```

(As pastas `equipment/`, `geology/`, `scenes/` e `effects/` pedidas no briefing ficam dentro de `src/` como `world/` e `scenes/`, porque são código, não arte estática. Os diretórios de topo com esses nomes guardam notas de design, quando houver.)

## Fases

1. Pesquisa e roteiro: conceitos validados, roteiro com timecodes, storyboard vertical.
2. Identidade visual: paleta, tipografia, design da sonda, camadas, coroa, barrilete e caixa.
3. Piloto: primeiros ~12 s com trilha, SFX e narração.
4. Mecanismos: perfuração, fluido, formação do testemunho, wireline.
5. Geologia: camadas e profundidade, caixa de testemunhos, análise.
6. Pós: narração, trilha, efeitos, legendas, marca.
7. Render: MP4 completo, verificação de sincronismo, níveis e safe areas.

O andamento fica registrado em `PROGRESS.md`.
