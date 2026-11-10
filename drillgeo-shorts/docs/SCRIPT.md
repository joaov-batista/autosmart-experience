# Roteiro e narração

Voz: ElevenLabs `eleven_v4`, voz **"Henrique – Clear and Knowledgeable"** (masculina, português do Brasil, dicção clara, ritmo didático). Tags de interpretação: `[curious]` nas perguntas de abertura e `[warmly]` na assinatura.

Cada fala é um arquivo separado (`audio/narration/Nxx.mp3`), posicionado pelo `src/timeline.js`. As cenas se ajustam à duração real de cada fala e são arredondadas para o tempo da música (1 batida = 0,625 s a 96 BPM).

Os timecodes abaixo são gerados por `tools/export_timeline.mjs` a partir das durações reais das falas (ou de estimativas, enquanto a fala não existir). A tabela completa e atualizada fica em `docs/TIMECODES.md`.

## Falas

| ID | Cena | Texto (enviado ao ElevenLabs) |
|---|---|---|
| N01 | 01 O mundo escondido | [curious] Você já parou para pensar no que existe centenas de metros abaixo dos seus pés? |
| N02 | 01 | [curious] Como podemos descobrir o que está escondido lá embaixo? |
| N03 | 02 Conheça a sonda | É aqui que entra a sondagem. Com equipamentos especializados, a DrillGeo investiga o subsolo e recupera informações essenciais sobre as rochas. |
| N04 | 03 A perfuração | Na sondagem rotativa diamantada, a máquina transmite rotação e força de avanço através das hastes… permitindo que a coroa corte a rocha. |
| N05 | 04 O fluido | Durante a perfuração, um fluido circula pelo sistema. Ele ajuda a resfriar a coroa, remover os fragmentos de rocha e manter condições adequadas para o avanço. |
| N06 | 05 O testemunho | Mas o objetivo não é apenas abrir um furo. É recuperar uma amostra da rocha, chamada testemunho de sondagem. [pause] Esse cilindro preserva informações valiosas sobre as características do material atravessado. |
| N07 | 05 (wireline) | No sistema wireline, um cabo de aço traz o tubo interno com o testemunho até a superfície, sem retirar as hastes do furo. |
| N08 | 06 Camadas e profundidade | Cada profundidade pode revelar uma formação diferente. Mudanças de cor, composição, textura e fraturamento ajudam a contar a história geológica daquele local. |
| N09 | 07 Caixa de testemunhos | Na superfície, os testemunhos são organizados em caixas, identificados por furo e profundidade, preservando a sequência das rochas recuperadas. |
| N10 | 08 O que estão procurando? | Com essas amostras, os geólogos estudam as formações, identificam estruturas e investigam possíveis mineralizações e outras características importantes do terreno. |
| N11 | 09 A DrillGeo | Em projetos de mineração e de investigação geológica, entender o que existe abaixo da superfície é essencial para tomar decisões com mais conhecimento e precisão. |
| N12 | 09 (assinatura) | [warmly] DrillGeo. Geologia e sondagem revelando o que a superfície não mostra. |

### Ajustes em relação ao briefing (e por quê)

- **N07 (nova)**: o briefing pede que o público entenda *como o testemunho é recuperado* e que a cena mostre a recuperação wireline. Uma frase curta explica o que a imagem mostra: cabo de aço, tubo interno, hastes que ficam no furo.
- **N11**: o texto original ("Porque entender o que existe abaixo da superfície é essencial para tomar decisões…") ganhou o contexto *"Em projetos de mineração e de investigação geológica"*, para cumprir o objetivo de explicar por que a informação importa nesses projetos.
- As demais falas estão exatamente como no briefing.

## Textos na tela (curtos, em caixa-alta)

`COROA DIAMANTADA` · `HASTES` · `FLUIDO DE PERFURAÇÃO` · `TESTEMUNHO` · `TUBO INTERNO` · `WIRELINE` · `PROFUNDIDADE` · `CAMADAS GEOLÓGICAS` · `CAIXA DE TESTEMUNHOS`

Rótulos da sonda (cena 2): `TORRE / MASTRO` · `CABEÇOTE ROTATIVO` · `HASTES` · `UNIDADE DE PERFURAÇÃO` · `SISTEMA DE CIRCULAÇÃO` · `CONJUNTO DE AMOSTRAGEM`

Rótulos geológicos (cenas 6 e 8): `SOLO` · `ROCHA ALTERADA` · `ROCHA SÃ` · `FRATURAS` · `VEIO MINERAL` · `OUTRA LITOLOGIA` · `MINERAIS` · `TEXTURA` · `ALTERAÇÃO`

Aviso fixo sempre que há números de profundidade: `valores ilustrativos`.

## Legendas

`renders/drillgeo_shorts.srt` é gerado a partir do timeline, com blocos de até ~38 caracteres por linha e no máximo 2 linhas. Há duas exportações: uma versão **limpa** (sem legenda queimada, para usar as legendas da plataforma) e uma versão **com legenda queimada**, posicionada acima da área da interface do Shorts.
