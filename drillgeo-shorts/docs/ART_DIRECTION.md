# Direção de arte

**Linguagem:** anime 2D cinematográfico + ilustração técnica animada. Céus pintados em degradê com nuvens iluminadas pelo sol baixo, silhuetas fortes, luz de recorte (*rim light*), perspectiva atmosférica nas montanhas. No subsolo, o tom esfria e escurece com a profundidade, e o furo vira a fonte de luz da cena. Os mecanismos aparecem em meio-corte, com transparências e setas finas, sempre com acabamento de filme (gradientes metálicos, brilho, partículas, grão leve, vinheta).

## Paleta

Tokens da marca (CSS do site institucional) e extensões do filme:

| Token | Hex | Uso |
|---|---|---|
| `bg` | `#0B0E14` | fundo profundo, sombras, cartela final |
| `navy` | `#0F1C3D` | subsolo profundo, céu noturno do final |
| `blue-deep` | `#1B4F9C` | fluido (núcleo), linhas técnicas |
| `blue-bright` | `#4C9BEA` | fluido translúcido, "Geo" do wordmark, destaques técnicos |
| `rock` | `#A34A28` | solo laterítico |
| `rock-soft` | `#C97148` | saprolito / rocha alterada |
| `amber` | `#F2A93B` | pintura da sonda, setas de rotação/avanço, brilho da feição de interesse |
| `paper` | `#EDEFF3` | textos, rótulos |
| `paper-dim` | `#97A0B3` | linhas de chamada, régua, textos secundários |
| céu (filme) | `#18244F → #4A64A8 → #E9925C → #F8C98A` | golden hour da abertura |
| montanhas (filme) | `#9AAACB`, `#6577A3`, `#3A4668`, `#263049` | 4 planos de perspectiva atmosférica |
| gnaisse | `#59647A` / `#8A93A6` / `#3C4456` | bandas |
| anfibolito | `#2F4A42` / `#466457` | rocha verde-escura |
| granito | `#B58C86` / `#E2CFC5` / `#3A3335` | pintalgado |
| quartzo / sulfeto | `#E8EEF0` / `#E7B94A` | veio e cristais dourados |

## Tipografia (a mesma do site)

- **Space Grotesk 700**: rótulos e títulos em caixa-alta, tracking +6%.
- **IBM Plex Mono 400/600**: números de profundidade, régua, etiquetas de caixa.
- **Inter SemiBold**: legendas de narração.
- Wordmark: "Drill" em `paper` + "Geo" em `blue-bright`, Space Grotesk 700, ao lado da hélice oficial.

Rótulo padrão: texto 34–40 px, ponto âmbar de 8 px, linha de chamada fina (2 px, `paper-dim`) até a peça, entrada com *wipe* de 0,35 s e saída com *fade*.

## Safe areas (1080×1920)

- **Texto e informação essencial**: x 70–900, y 220–1240.
- **Faixa de legenda** (versão com legenda): y 1260–1440, centralizada.
- **Reservado para a interface** (não pôr texto): y > 1480 (título, canal, descrição), x > 930 entre y 900–1700 (botões), y < 160 (barra superior).
- A imagem continua viva nessas áreas; só não carrega informação.

## Regras de desenho

- Contorno escuro fino (`#0B0E14` a 50–70%) nos equipamentos e personagens, como em cel animation, com uma sombra dura e um realce de recorte por peça.
- Metal: gradiente cilíndrico (escuro → realce → médio → escuro) e reflexo especular estreito que acompanha a rotação.
- Rocha: cor-base por unidade + ruído fractal por pixel + feições vetoriais (bandas, cristais, fraturas, veios). A mesma função de textura gera o corte geológico e os testemunhos, para que o testemunho tenha a cara da camada de onde saiu.
- Partículas analíticas: poeira, lascas, gotas de fluido, faíscas de diamante, pólen ao vento.
- Movimento de câmera sempre com *easing* (sem cortes secos sem motivação). Transições com continuidade espacial: mergulho no solo, tilt pelas hastes, zoom no barrilete, subida pelo cabo, retorno ao subsolo.
- Grão de filme leve (3–4%) e vinheta suave em todos os quadros.

## Mascote "Geo" (v2)

Funcionário da DrillGeo de frente para a câmera, em estilo anime simpático (cabeça grande e olhos expressivos).
- **EPI:** capacete branco com a hélice da marca, óculos de proteção levantados, uniforme marinho com faixas refletivas e detalhe âmbar, luvas amarelas e botas.
- **Peito:** patch "DrillGeo".
- **Animação:** boca sincronizada com a narração (envelope da voz por quadro, `tools/mouth.py`), piscadas, respiração e gestos com transição suave (acenar, apontar, explicar com as mãos, joinha, contar nos dedos).
- **Posição:** apresentador no canto inferior esquerdo (cabeça em y≈1330; o corpo pode ficar sob a interface do Shorts). Na abertura aparece grande, de corpo inteiro, e encolhe quando a câmera mergulha. As legendas viram a "fala" à direita dele.
- **Layout:** o conteúdo técnico foi afastado do canto do mascote (rótulos, inset, rack de caixas, caixas da cena 8).

## Personagens

Proporção de 7,5 cabeças, estilo anime sóbrio. EPI completo: capacete (branco para o geólogo, âmbar para os sondadores), óculos, protetor auricular nos operadores, luvas, botas, uniforme marinho com faixas refletivas. Movimentos econômicos: respiração, olhar, alavanca, guia do tubo. Ninguém fica na zona de rotação.

## A sonda (genérica)

Sonda hidráulica sobre esteiras, pintada em âmbar: unidade de força com escapamento, painel de comando com alavancas e manômetros, mastro em perfil caixão com polia no topo, cabeçote rotativo deslizante com motor hidráulico e mangueiras, morsa de base, gaiola de proteção, guincho wireline, rack de hastes, bomba, mangueira de injeção, caixa d'água e caixa de decantação. Não reproduz nenhum modelo comercial.
