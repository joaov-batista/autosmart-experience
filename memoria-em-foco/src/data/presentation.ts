import type { RefId } from './types';

export const scriptParagraphs: string[] = [
  'Imagine que, no fim da aula, a professora avisa: “A apresentação mudou para quinta-feira, na sala 12”. Na quinta, uma aluna vai à sala antiga. Ela diz: “Eu esqueci”. Parece uma explicação completa, mas ainda resta uma pergunta: o que aconteceu entre ouvir o aviso e procurar a sala?',
  'Em psicologia, memória é o conjunto de processos que nos permite registrar, conservar e recuperar informações e experiências. O registro é a codificação. Se eu estava conversando enquanto ouvi o aviso, talvez tenha registrado o dia, mas perdido o número da sala. O armazenamento é a retenção da informação ao longo do tempo. A recuperação acontece quando tento lembrar o número na quinta-feira. Por isso, duas pessoas podem dizer “esqueci” e ter chegado àquela situação por caminhos diferentes.',
  'Também usamos a memória para fazer coisas no presente. Quando guardo dois preços na cabeça enquanto calculo a diferença, estou usando a memória de trabalho. Já quando conto a alguém o que aconteceu ontem na cantina, uso a memória episódica: recupero uma experiência e seu contexto.',
  'O que muda na esquizofrenia? Além de sintomas como delírios e alucinações, podem ocorrer dificuldades cognitivas. Por exemplo, pode ser trabalhoso manter várias instruções na mente enquanto outra pessoa continua falando, ou aprender e depois recordar informações novas. No cotidiano, isso pode afetar uma conversa ou uma tarefa da faculdade. O impacto varia de pessoa para pessoa.',
  'Um resultado de pesquisa ajuda a tornar essa comparação mais precisa. Aleman e colaboradores reuniram 70 estudos. Em média, a diferença entre os grupos foi maior quando as pessoas precisavam recordar o material por conta própria. Quando podiam reconhecer o material entre opções, a diferença foi menor, embora ainda estivesse presente. Dá para perceber a distinção pensando em duas perguntas: “Quais palavras eu disse?” e “Você ouviu a palavra manga?”. As duas envolvem memória, mas oferecem apoios diferentes.',
  'Voltando à aluna que foi para a sala antiga: saber o diagnóstico dela não nos diz por que ela esqueceu aquele aviso. Podemos perguntar o que ela conseguiu registrar, se uma pista ajuda e se isso acontece em outras situações. A pesquisa descreve tendências entre grupos. Entender a pessoa exige observar quais tarefas são difíceis para ela e em quais condições ela consegue realizá-las.',
];

/** Fontes de cada parágrafo, para consulta durante o ensaio (não são lidas em voz alta). */
export const scriptRefs: RefId[][] = [[], [1], [1], [2, 3], [4], [3, 4]];

export const supportCards: { title: string; points: string[]; refs: RefId[] }[] = [
  {
    title: 'Aviso da sala',
    points: [
      '“Mudou para quinta, sala 12.”',
      'Aluna vai à sala antiga: “Eu esqueci”.',
      'Pergunta: o que aconteceu entre ouvir e procurar a sala?',
    ],
    refs: [],
  },
  {
    title: 'Três processos',
    points: [
      'Memória = registrar, conservar, recuperar.',
      'Codificação: conversando → pegou o dia, perdeu a sala.',
      'Armazenamento: reter ao longo do tempo.',
      'Recuperação: tentar lembrar na quinta.',
      'Mesmo “esqueci”, caminhos diferentes.',
    ],
    refs: [1],
  },
  {
    title: 'Troco e cantina',
    points: [
      'Dois preços na cabeça → memória de trabalho.',
      'Contar o que houve na cantina → memória episódica.',
    ],
    refs: [1],
  },
  {
    title: 'Estudo das listas',
    points: [
      'Esquizofrenia: delírios, alucinações e também dificuldades cognitivas.',
      'Manter instruções / aprender e recordar coisas novas. Varia entre pessoas.',
      'Aleman et al.: 70 estudos.',
      'Recordar sozinho → diferença maior.',
      'Reconhecer entre opções → menor, mas presente.',
      '“Quais palavras eu disse?” × “Ouviu manga?”',
    ],
    refs: [2, 4],
  },
  {
    title: 'Voltar ao caso',
    points: [
      'Diagnóstico não explica aquele esquecimento.',
      'Perguntar: o que registrou? Pista ajuda? Repete?',
      'Pesquisa = tendências de grupos.',
      'Pessoa = quais tarefas são difíceis e em que condições consegue.',
    ],
    refs: [3, 4],
  },
];

export const PRESENTATION_WARN_SECONDS = 270; // 4min30s
export const PRESENTATION_LIMIT_SECONDS = 300; // 5min
