import type { Exercise } from './types';

/**
 * Prática depois da leitura. IDs estáveis; a correção usa o ID da alternativa, nunca a posição.
 * `pid` aponta o parágrafo que responde à dúvida (“Entender meu erro”).
 */
export const exercises: Exercise[] = [
  {
    id: 'q1',
    number: 1,
    type: 'single',
    prompt: 'Se a pessoa esqueceu a cor da sacola, isso prova que a informação se apagou?',
    choices: [
      {
        id: 'nao',
        text: 'Não. Ela pode ter registrado mal a cor, aprendido mal a ligação entre a cor e a sacola, ou ter dificuldade para recuperar o detalhe.',
        feedback: 'Isso. “Esqueci” mostra o resultado, não o momento em que surgiu a dificuldade.',
      },
      {
        id: 'sim',
        text: 'Sim. Se não lembra, é porque a informação foi apagada da memória.',
        feedback: 'Essa conclusão salta etapas. A cor pode nem ter sido bem registrada, ou pode estar lá e difícil de acessar.',
      },
      {
        id: 'atencao',
        text: 'Não. Prova que ela não prestou atenção.',
        feedback: 'Atenção é uma das possibilidades, não a única. Ela também pode ter registrado e ter dificuldade para recuperar.',
      },
    ],
    correctId: 'nao',
    explanation:
      'Ela pode ter registrado mal a cor, aprendido mal a ligação entre a cor e aquela sacola ou encontrado dificuldade para recuperar o detalhe. Para distinguir essas possibilidades, precisamos saber como aprendeu e como foi testada. [1]',
    pid: 'm1',
  },
  {
    id: 'q2',
    number: 2,
    type: 'open',
    prompt: 'O que muda entre segurar “Ana” até o fim da frase e lembrar amanhã que Ana trouxe a sacola?',
    model:
      'A primeira tarefa exige manter informação disponível durante uma atividade: é a memória de trabalho. A segunda exige aprender e depois recuperar a relação entre os elementos de um episódio: é a memória episódica.',
    criteria: ['Disse que a primeira é manter uma informação ativa enquanto a uso.', 'Disse que a segunda é aprender e recuperar a relação entre pessoa, objeto e ação.'],
    explanation: 'Manter uma informação ativa e aprender uma relação são operações diferentes. [3, 4]',
    pid: 'm3-nota',
  },
  {
    id: 'q3',
    number: 3,
    type: 'single',
    prompt: 'Por que Gold comparou pessoas que tinham lembrado a mesma quantidade logo no início?',
    choices: [
      {
        id: 'ok',
        text: 'Para separar o quanto foi aprendido no início do quanto foi retido depois.',
        feedback: 'Isso. Só assim dá para saber se alguém esqueceu mais depressa.',
      },
      {
        id: 'justo',
        text: 'Para que os grupos tivessem o mesmo número de participantes.',
        feedback: 'Os grupos tinham tamanhos diferentes (76 e 51). A comparação igualou a lembrança inicial, não o número de pessoas.',
      },
      {
        id: 'facil',
        text: 'Para mostrar que pessoas com esquizofrenia não têm dificuldade de memória.',
        feedback: 'O estudo não diz isso. Mostra que, naquela tarefa, boa parte da diferença surgiu na aprendizagem inicial.',
      },
    ],
    correctId: 'ok',
    explanation:
      'Se duas pessoas começam com quantidades diferentes, comparar só o resultado final não mostra quem esqueceu mais depressa. [6]',
    pid: 'm3d',
  },
  {
    id: 'e7',
    number: 4,
    type: 'single',
    prompt: 'A pergunta “qual destas pessoas trouxe a sacola?” oferece opções. Ela exige memória relacional?',
    choices: [
      {
        id: 'sim',
        text: 'Sim. Há opções, mas acertar exige lembrar a ligação entre a pessoa e a sacola.',
        feedback: 'Isso. Vale olhar a ajuda oferecida e também a informação que a pergunta exige.',
      },
      {
        id: 'nao',
        text: 'Não. Toda pergunta com opções avalia só familiaridade.',
        feedback: 'Reconhecer a sacola pode se apoiar na familiaridade; escolher quem a trouxe exige a relação.',
      },
      {
        id: 'livre',
        text: 'Só se a pessoa precisar escrever a resposta sem opções.',
        feedback: 'Escrever sem opções seria recordação livre. Mesmo com opções, a relação ainda precisa ser lembrada.',
      },
    ],
    correctId: 'sim',
    explanation: 'O formato da pergunta (com opções) e a informação que ela exige (a relação) são coisas diferentes. [1, 4]',
    pid: 'm3e',
  },
  {
    id: 'e8',
    number: 5,
    type: 'single',
    prompt: 'O que a meta-análise de Aleman e colaboradores encontrou?',
    choices: [
      { id: 'ok', text: 'Diferença média maior em recordação; no reconhecimento, também houve diferença, mas menor.', feedback: 'Isso. Menor não significa ausente.' },
      { id: 'intacto', text: 'O reconhecimento é intacto em pessoas com esquizofrenia.', feedback: 'Também houve diferença no reconhecimento, só que menor.' },
      { id: 'inverso', text: 'A diferença foi maior no reconhecimento.', feedback: 'É o inverso: a diferença foi maior quando era preciso recordar.' },
    ],
    correctId: 'ok',
    explanation: 'Aleman reuniu 70 estudos: pistas e opções podem ajudar em algumas situações, e a necessidade de ajuda varia. [7]',
    pid: 'm3f',
  },
  {
    id: 'q4',
    number: 6,
    type: 'single',
    prompt: 'Ver menos ativação do hipocampo em um exame prova que a pessoa tem menos sinapses?',
    choices: [
      {
        id: 'nao',
        text: 'Não. A ressonância funcional compara respostas relacionadas à atividade durante uma tarefa; sinapses são investigadas por outros métodos.',
        feedback: 'Isso. O método define o que pode ser concluído.',
      },
      {
        id: 'sim',
        text: 'Sim. Menos ativação significa menos conexões.',
        feedback: 'A imagem mostra em qual condição a resposta cerebral diferiu. Ela não conta sinapses.',
      },
      {
        id: 'quase',
        text: 'Sim, desde que o grupo seja grande.',
        feedback: 'Um grupo maior dá mais confiança sobre o que foi medido, mas não muda o que o exame mede.',
      },
    ],
    correctId: 'nao',
    explanation: 'A densidade de estruturas sinápticas é investigada por outros métodos, como estudos de tecido cerebral. [4, 5]',
    pid: 'm3b',
  },
  {
    id: 'q5',
    number: 7,
    type: 'single',
    prompt: 'O que o experimento sobre poda sináptica realmente demonstrou?',
    choices: [
      {
        id: 'ok',
        text: 'Em modelos celulares derivados de participantes com esquizofrenia, houve maior remoção de material sináptico.',
        feedback: 'Isso. É uma observação em laboratório, com um limite claro.',
      },
      {
        id: 'causa',
        text: 'Que a poda sináptica causa o esquecimento das pessoas com esquizofrenia.',
        feedback: 'Para afirmar que causou um esquecimento específico, seria preciso outro tipo de evidência.',
      },
      {
        id: 'vivos',
        text: 'Que pessoas vivas com esquizofrenia perdem sinapses todos os dias.',
        feedback: 'O experimento usou modelos celulares. Quanto a poda explica diferenças em pessoas vivas continua em investigação.',
      },
    ],
    correctId: 'ok',
    explanation: 'Observado: maior remoção de material no modelo de laboratório. Em investigação: quanto isso explica diferenças em pessoas e em cada dificuldade de memória. [5, 9]',
    pid: 'm4b',
  },
  {
    id: 'q6',
    number: 8,
    type: 'single',
    prompt: 'Uma pessoa pode ter dificuldade de memória quando não está alucinando?',
    choices: [
      {
        id: 'sim',
        text: 'Sim. A alucinação pode interferir na atenção numa situação, mas as dificuldades cognitivas também existem em outros momentos.',
        feedback: 'Isso. E em parte das pessoas elas aparecem antes do primeiro episódio psicótico.',
      },
      {
        id: 'nao',
        text: 'Não. As dificuldades de memória só acontecem durante as alucinações.',
        feedback: 'A alucinação é uma maneira de atrapalhar uma conversa, não a única origem das dificuldades.',
      },
      {
        id: 'fonte',
        text: 'Não, porque toda dificuldade de memória vem de confundir o que foi imaginado com o que foi ouvido.',
        feedback: 'Problemas de memória da fonte estão associados a algumas experiências, mas não explicam todas as dificuldades.',
      },
    ],
    correctId: 'sim',
    explanation: 'Uma alucinação pode desviar a atenção naquela conversa; as dificuldades cognitivas associadas à esquizofrenia também existem sem alucinações. [2, 8]',
    pid: 'm5a',
  },
  {
    id: 'q7',
    number: 9,
    type: 'open',
    prompt: 'Pergunta final da professora: “Afinal, por que uma pessoa pode reconhecer a sacola e não lembrar quem a trouxe?”',
    model:
      'Reconhecer a sacola pode depender da familiaridade. Lembrar quem a trouxe exige aprender e recuperar a relação entre pessoa, objeto e contexto. Em média, essa aprendizagem relacional pode ser mais difícil na esquizofrenia. A intensidade varia entre pessoas.',
    criteria: ['Separei familiaridade com o objeto de lembrar a relação (quem trouxe).', 'Disse que a dificuldade relacional é uma tendência média e que varia entre pessoas.'],
    explanation: 'É a síntese da apresentação: item × relação, tendência média × pessoa. [4, 7]',
    pid: 'm3',
  },
];

export const getExercise = (id: string) => exercises.find((e) => e.id === id);
