import type { RefId } from './types';

/**
 * Fala pronta (até 5 minutos). Espinha dorsal: o Resumido, com Gold e Ragland em linguagem oral.
 * Escrita para colegas que nunca abriram o app. Referências ficam ocultas na leitura em voz alta.
 */
export const speech: { text: string; refs: RefId[] }[] = [
  {
    text: 'Boa tarde. Meu tema é a memória em pessoas com esquizofrenia. Durante a apresentação, vou usar uma frase simples como exemplo: “Ana colocou a batata na sacola azul”.',
    refs: [],
  },
  {
    text: 'Para lembrar de qualquer coisa, passamos por três momentos. Primeiro registramos a informação, o que chamamos de codificar. Depois a conservamos, que é armazenar. Por fim, conseguimos acessá-la, que é recuperar. Quando alguém diz “esqueci”, essa palavra mostra o resultado, mas não diz em qual desses momentos surgiu a dificuldade.',
    refs: [1],
  },
  {
    text: 'O primeiro ponto é manter uma informação ativa. Quando escuto “Ana colocou…”, preciso segurar “Ana” na mente até a frase terminar. Isso é a memória de trabalho: manter uma informação disponível enquanto a usamos. Na esquizofrenia, essa tarefa pode exigir mais esforço. Ela depende de grupos de neurônios do córtex pré-frontal, na parte da frente do cérebro, que trocam sinais para sustentar a informação por alguns segundos.',
    refs: [2, 3],
  },
  {
    text: 'O segundo ponto é aprender relações. Para contar amanhã o que aconteceu, não basta saber quem é Ana e reconhecer uma sacola azul. Preciso ter ligado a pessoa, a ação e o objeto: foi Ana quem colocou a batata naquela sacola. Isso é a memória episódica. Ragland e colaboradores compararam duas situações: estudar características de objetos isolados e estudar relações entre objetos. O grupo com esquizofrenia teve dificuldade principalmente na segunda. E, nessa condição, o exame de imagem mostrou menos ativação de uma região do córtex pré-frontal enquanto as pessoas aprendiam.',
    refs: [4],
  },
  {
    text: 'O terceiro ponto é recuperar. Imagine que, no dia seguinte, a pessoa lembre menos. Ela esqueceu mais depressa? Gold e colaboradores investigaram isso com 76 pessoas com esquizofrenia e 51 sem o transtorno. Quando compararam pessoas que tinham aprendido a mesma quantidade no início, a lembrança depois do intervalo foi praticamente igual. Ou seja, naquele estudo, boa parte da diferença surgiu na aprendizagem, e não num esquecimento mais rápido. A forma de perguntar também importa: numa análise de 70 estudos, a diferença entre os grupos foi maior quando as pessoas precisavam recordar sozinhas e menor quando podiam reconhecer entre opções.',
    refs: [6, 7],
  },
  {
    text: 'E o que acontece no cérebro? Pesquisadores encontraram diferenças na atividade do córtex pré-frontal e do hipocampo, uma estrutura que ajuda a ligar os elementos de um episódio, durante certas tarefas. Em estudos de tecido cerebral, também encontraram, em média, menos pontos de contato entre neurônios em algumas regiões do córtex. Esses pontos de contato são as sinapses, onde os neurônios se comunicam.',
    refs: [3, 4, 5],
  },
  {
    text: 'Mas é importante separar o que foi observado do que ainda é hipótese. Um exame de imagem mostra em que tarefa a resposta do cérebro foi diferente; ele não conta sinapses nem prova a causa. Ainda se investiga quanto cada alteração contribui para a dificuldade de cada pessoa. E as dificuldades de memória não dependem só das alucinações: elas aparecem em outros momentos e, em algumas pessoas, antes do primeiro episódio psicótico.',
    refs: [2, 4],
  },
  {
    text: 'Então, voltando à frase: uma pessoa com esquizofrenia pode reconhecer a sacola azul e ainda ter dúvida sobre quem colocou a batata nela. Reconhecer depende da familiaridade; lembrar quem fez exige ter aprendido a relação. Em média, essa aprendizagem pode ser mais difícil, mas a intensidade varia de pessoa para pessoa. Obrigada.',
    refs: [4, 7],
  },
];

/** Cinco lembretes, na ordem da fala. Tocar revela só o parágrafo correspondente. */
export const reminders: { label: string; paragraphs: number[] }[] = [
  { label: 'Manter', paragraphs: [2] },
  { label: 'Relacionar', paragraphs: [3] },
  { label: 'Recuperar', paragraphs: [4] },
  { label: 'Evidência', paragraphs: [5] },
  { label: 'Limite da conclusão', paragraphs: [6] },
];

/** “Se a professora perguntar”: poda sináptica, dopamina, NMDA e alucinações ficam aqui. */
export const teacherQuestions: { question: string; answer: string; refs: RefId[]; pid: string }[] = [
  {
    question: 'O que é poda sináptica? Ela explica o esquecimento?',
    answer:
      'Durante o desenvolvimento, o cérebro forma conexões e elimina parte delas: isso é a poda sináptica, e células chamadas micróglias participam dela. Num experimento com células derivadas de pessoas com e sem esquizofrenia, houve mais remoção de material sináptico no primeiro grupo. Em tecido humano, há menor densidade de estruturas pós-sinápticas em algumas regiões. Mas quanto isso explica as dificuldades de memória de cada pessoa ainda está em investigação.',
    refs: [5, 9],
    pid: 'm4b',
  },
  {
    question: 'Então falta dopamina no pré-frontal, e por isso a pessoa esquece?',
    answer:
      'A dopamina é investigada como possível participante das alterações cognitivas, mas a evidência não sustenta essa cadeia — “falta dopamina, então a pessoa esquece” — como explicação para uma pessoa. Os estudos de imagem com dopamina mostram resultados diferentes conforme a região, e isso não se traduz diretamente no esquecimento de alguém.',
    refs: [2, 11],
    pid: 'm5-d2',
  },
  {
    question: 'E os receptores NMDA? O problema está neles?',
    answer:
      'Os receptores NMDA respondem ao glutamato e são investigados como possíveis participantes das alterações cognitivas. Saber que eles participam do funcionamento das sinapses não demonstra que uma pessoa esqueceu algo por causa deles. Para isso, seria preciso evidência ligando esse mecanismo àquele desempenho.',
    refs: [2],
    pid: 'm5-d2',
  },
  {
    question: 'As alucinações causam a perda de memória?',
    answer:
      'Uma alucinação pode desviar a atenção no momento em que algo é dito, e aquilo pode ser registrado com pouca clareza. Mas as dificuldades de memória também existem sem alucinações e, em algumas pessoas, antes do primeiro episódio psicótico. Dificuldades em lembrar a fonte de uma informação estão associadas a algumas experiências alucinatórias, sem ser uma explicação universal.',
    refs: [2, 8, 10],
    pid: 'm5a',
  },
];

export const PRESENTATION_WARN_SECONDS = 270; // 4min30s
export const PRESENTATION_LIMIT_SECONDS = 300; // 5min
