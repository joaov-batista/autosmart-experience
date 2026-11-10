# Roteiro e narração

Voz final: ElevenLabs `eleven_v4`, voz **"George – Warm, Captivating Storyteller"** (masculina, narrador caloroso), gerada pela API (`tools/elevenlabs_api.py`). Tags de interpretação: `[curious]` nas perguntas e na virada da cena 5, `[warmly]` na apresentação e na assinatura.

> Por que mudou: a voz planejada ("Henrique – Clear and Knowledgeable", brasileira nativa) é uma voz da biblioteca. A cota gratuita compartilhada do conector recusou 10 das 12 falas ("busy"), e a chave de API usada depois é de conta gratuita, que **não pode usar vozes da biblioteca nem criar vozes pela API**. Escolhi entre as vozes padrão disponíveis por transcrição automática (ElevenLabs Scribe): todas as 12 falas foram reconhecidas como português, 11 com texto idêntico ao roteiro e a 12ª diferindo só na grafia da marca ("DrilGeo"). Relatório em `audio/narration/api/qa.json`. Para voltar à voz brasileira nativa, basta uma chave de conta paga: `python3 tools/elevenlabs_api.py 3ULAAai0IVN00DTWA6vF`.

Cada fala é um arquivo separado (`audio/narration/Nxx.mp3`), posicionado pelo `src/timeline.js`. As cenas se ajustam à duração real de cada fala e são arredondadas para o tempo da música (1 batida = 0,625 s a 96 BPM).

Os timecodes abaixo são gerados por `tools/export_timeline.mjs` a partir das durações reais das falas (ou de estimativas, enquanto a fala não existir). A tabela completa e atualizada fica em `docs/TIMECODES.md`.

## Falas (versão 2 — didática, com o mascote Geo)

Após a primeira versão, o retorno foi: "ficou legal, mas difícil de entender". A v2 é narrada em primeira pessoa pelo **Geo**, um funcionário da DrillGeo (mascote). A linguagem é do dia a dia e cada conceito vem com uma comparação: bolo e canudo, cortador de biscoito, broca do dentista, pescar o tubo, álbum de fotos. O roteiro está organizado em passos numerados.

| ID | Cena | Texto |
|---|---|---|
| N01 | Oi, eu sou o Geo | Oi! Eu sou o Geo, da equipe da DrillGeo. Você já pensou no que existe debaixo dos seus pés? Vem comigo, que eu te mostro! |
| N02 | Oi, eu sou o Geo | Lá embaixo tem camadas e mais camadas de rocha. Mas como a gente descobre o que tem lá… sem cavar um buraco gigante? |
| B01 | A ideia: o bolo e o canudo | Pensa num bolo de camadas. Se você enfia um canudo e puxa… sai uma amostrinha com todas as camadas dentro. A sondagem faz isso, só que na rocha! |
| N03 | A sonda | Essa é a sonda, a máquina que faz o furo. Ela gira uma coluna de tubos de aço, que a gente chama de hastes, e empurra tudo pra baixo. |
| N04 | A coroa | Na ponta fica a coroa: um anel cheio de diamantes. Ela gira e corta a rocha em forma de anel… igual a um cortador de biscoito. |
| N05 | A água | Enquanto ela corta, a gente manda água pelo meio dos tubos. A água esfria a coroa e leva o pó de rocha pra fora, igual à água na broca do dentista. |
| N06 | O testemunho e o pescador | E o miolo? O miolo fica inteirinho! Esse cilindro de rocha é o testemunho. Ele vai entrando num tubo, igual ao bolo dentro do canudo. |
| N07 | O testemunho e o pescador | Quando o tubo enche, a gente desce um cabo com uma peça que engata, o pescador, e puxa o tubo cheio lá do fundo. As hastes continuam no furo. |
| N08 | As camadas | Conforme o furo desce, ele atravessa camadas diferentes: terra, rocha mais mole, rocha dura, rachaduras… e às vezes um veio com minerais. |
| N09 | A caixa | Aqui em cima, as amostras vão pra uma caixa, na ordem certinha, com a profundidade anotada. É como um álbum de fotos do subsolo. |
| N10 | O geólogo | Depois, o geólogo estuda cada pedaço com lupa. Às vezes aparece sinal de minério, às vezes não… e as duas respostas são informação valiosa. |
| N11 | Resumo e DrillGeo | Resumindo: a coroa corta, o cilindro sobe, vai pra caixa, e o geólogo estuda. Assim dá pra decidir com mais segurança, antes de uma obra ou de uma mina. |
| N12 | Resumo e DrillGeo | DrillGeo. Geologia e sondagem revelando o que a superfície não mostra. |

### Comparações usadas (e por que estão corretas)

- **Bolo de camadas + canudo**: o canudo tira uma amostra cilíndrica com as camadas na mesma ordem. É exatamente o que o testemunho faz (analogia clássica de ensino de geologia).
- **Cortador de biscoito**: a coroa corta um anel e deixa o miolo inteiro.
- **Água na broca do dentista**: o fluido esfria a ferramenta e leva o pó embora.
- **Pescar**: a peça que desce no cabo e engata o tubo interno se chama, de fato, *pescador* (overshot).
- **Álbum de fotos do subsolo**: a caixa guarda as amostras em ordem, com a profundidade anotada.
- "Às vezes aparece sinal de minério, às vezes não": evita prometer descoberta mineral (regra 11 da revisão técnica).

## Textos na tela (curtos, em caixa-alta)

Selos de passo: `ENTENDA · A IDEIA`, `PASSO 1 · A SONDA` … `PASSO 8 · O GEÓLOGO`, `NO FIM · RESUMINDO`.

Rótulos (v2, palavras simples): `SONDA` · `HASTES` · `GIRA` · `EMPURRA` · `COROA – anel com diamantes` · `= cortador de biscoito` · `AVANÇA` · `ÁGUA` · `ESFRIA` · `LEVA O PÓ` · `TESTEMUNHO – o miolo de rocha` · `TUBO` · `CABO DE AÇO (wireline)` · `PESCADOR` · `MOLA EXTRATORA` · `TUBO CHEIO` · `HASTES FICAM NO FURO` · `PROFUNDIDADE` · `AMOSTRA`

Camadas (cena 6): `TERRA` · `ROCHA MAIS MOLE` · `ROCHA DURA` · `RACHADURAS` · `OUTRA ROCHA` · `VEIO COM MINERAIS` · `GRANITO`. Lupa (cena 8): `TEXTURA` · `RACHADURA` · `VEIO` · `MINERAIS` · `ROCHA ALTERADA`.

Aviso fixo sempre que há números de profundidade: `valores ilustrativos`.

## Legendas

`renders/drillgeo_shorts.srt` é gerado a partir do timeline, com blocos de até ~22 caracteres por linha e no máximo 2 linhas, na área de fala à direita do mascote (na abertura, no topo). Há duas exportações: **limpa** (para as legendas da plataforma) e **com legenda queimada**, acima da interface do Shorts.
