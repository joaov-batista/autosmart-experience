import type { OralQuestion } from './types';

/** Banca oral: perguntas abertas para responder em voz alta, com réplica e autoavaliação. */
export const oralQuestions: OralQuestion[] = [
  {
    id: 'b1',
    number: 2,
    question: 'Qual é a diferença entre manter uma informação ativa, aprender uma relação e recuperar uma experiência?',
    model:
      'Manter ativa é a memória de trabalho: segurar “Ana” na mente até a frase terminar. Aprender uma relação é ligar os elementos de um episódio: que foi Ana quem colocou a batata naquela sacola. Recuperar é acessar depois o que foi aprendido, por exemplo contar a cena amanhã. Uma dificuldade pode aparecer em qualquer uma dessas operações.',
    criteria: ['Precisão do conceito: descrevi as três operações com um exemplo.', 'Justificativa: disse por que é útil separá-las (o “esqueci” não diz qual falhou).'],
    followUp: {
      question: 'Dá para ter Ana e a sacola disponíveis e mesmo assim errar quem colocou a batata?',
      guidance: 'Sim. Ter A e B disponíveis não garante ter aprendido a relação entre eles; são duas operações diferentes.',
    },
    pid: 'm3-nota',
    refs: [1, 3, 4],
  },
  {
    id: 'b2',
    number: 3,
    question: 'O que o estudo de Gold mostrou: as pessoas com esquizofrenia esquecem mais depressa?',
    model:
      'Gold e colaboradores compararam 76 pessoas com esquizofrenia e 51 sem o transtorno, logo depois de aprender histórias e figuras e após um intervalo. Comparando pessoas que tinham lembrado a mesma quantidade no início, o desempenho depois foi praticamente igual. Naquele estudo, boa parte da diferença surgiu na aprendizagem inicial, não num esquecimento mais rápido.',
    criteria: ['Precisão do conceito: descrevi o que foi comparado (mesma lembrança inicial).', 'Justificativa: expliquei por que comparar só o resultado final não mostra a velocidade do esquecimento.'],
    followUp: {
      question: 'Isso vale para qualquer tarefa e qualquer pessoa?',
      guidance: 'Não necessariamente. O próprio texto ressalta que outras tarefas e outras pessoas podem apresentar resultados diferentes.',
    },
    pid: 'm3d',
    refs: [6],
  },
  {
    id: 'b3',
    number: 4,
    question: 'O que o estudo de Ragland encontrou, e o que a imagem do cérebro não pode dizer?',
    model:
      'Ragland comparou estudar características de objetos com estudar relações entre objetos. O grupo com esquizofrenia teve dificuldade especialmente na condição relacional, com menor ativação de uma região pré-frontal durante a aprendizagem e diferenças na resposta do hipocampo num teste posterior. A imagem mostra em qual condição a resposta cerebral diferiu; ela não conta sinapses nem prova sozinha a causa.',
    criteria: ['Precisão do conceito: descrevi itens × relações e onde houve diferença.', 'Justificativa: disse o limite da ressonância funcional.'],
    followUp: {
      question: 'O que o estudo realmente mediu?',
      guidance: 'Desempenho em tarefas de itens e de relações, e respostas cerebrais relacionadas à atividade durante essas tarefas. Não mediu sinapses.',
    },
    pid: 'm3b',
    refs: [4],
  },
  {
    id: 'b4',
    number: 7,
    question: 'O que é poda sináptica e o que se sabe sobre ela na esquizofrenia?',
    model:
      'Poda sináptica é a eliminação de parte das conexões durante o desenvolvimento, com participação das micróglias. Num experimento com células derivadas de pessoas com e sem esquizofrenia, houve mais remoção de material sináptico no primeiro grupo, e fatores do sistema complemento explicaram parte disso. Em tecido humano, há menor densidade de estruturas pós-sinápticas em algumas regiões. Quanto isso explica as dificuldades de cada pessoa ainda é investigado.',
    criteria: ['Precisão do conceito: separei o observado no laboratório do observado em tecido humano.', 'Justificativa: disse o que ainda é hipótese.'],
    followUp: {
      question: 'Então a poda causa o esquecimento?',
      guidance: 'Isso não foi demonstrado. Para ligar a poda a um esquecimento específico, seria preciso outro tipo de evidência.',
    },
    pid: 'm4b',
    refs: [5, 9],
  },
  {
    id: 'b5',
    number: 8,
    question: 'Qual é o papel das alucinações nas dificuldades de memória?',
    model:
      'Uma voz pode desviar a atenção no momento em que alguém diz “sacola azul”, e a cor pode ser registrada com pouca clareza. Mas as dificuldades cognitivas também aparecem sem alucinações e, em parte das pessoas, antes do primeiro episódio psicótico. Então a alucinação explica uma maneira de atrapalhar uma conversa, não todas as dificuldades.',
    criteria: ['Precisão do conceito: expliquei a interferência na atenção no momento do registro.', 'Justificativa: disse que as dificuldades também existem sem alucinações.'],
    followUp: {
      question: 'E a memória da fonte? Ela explica ouvir vozes?',
      guidance: 'Dificuldades para identificar se algo foi visto, ouvido ou imaginado estão associadas a algumas experiências alucinatórias, mas a associação não é uma explicação universal.',
    },
    pid: 'm5a',
    refs: [2, 8, 10],
  },
  {
    id: 'b6',
    number: 9,
    question: 'Afinal, por que uma pessoa pode reconhecer a sacola e não lembrar quem a trouxe?',
    model:
      'Reconhecer a sacola pode depender da familiaridade. Lembrar quem a trouxe exige aprender e recuperar a relação entre pessoa, objeto e contexto. Em média, essa aprendizagem relacional pode ser mais difícil na esquizofrenia. A intensidade varia entre pessoas.',
    criteria: ['Precisão do conceito: separei familiaridade de relação.', 'Justificativa: falei em tendência média e variação individual.'],
    followUp: {
      question: 'Qual parte dessa conclusão vale para grupos e qual vale para uma pessoa?',
      guidance: 'A dificuldade relacional é uma tendência média entre grupos. Para uma pessoa, é preciso saber o que ela aprendeu, o que a tarefa exigia e em que condições conseguiu lembrar.',
    },
    pid: 'm3',
    refs: [4, 7],
  },
];

export const getOral = (id: string) => oralQuestions.find((q) => q.id === id);
