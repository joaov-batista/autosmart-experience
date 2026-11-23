import type { OralQuestion } from './types';

/** Banca oral: perguntas 4, 6, 7, 9, 10 e 12 da prática, com réplica pertinente. */
export const oralQuestions: OralQuestion[] = [
  {
    id: 'o4',
    number: 4,
    question: 'Por que a mudança duradoura na sinapse importa mais para a memória do que o impulso elétrico inicial?',
    model:
      'O impulso produz atividade naquele momento, e essa atividade passa. A mudança persistente, como na potenciação de longa duração, altera como o circuito vai responder depois que a experiência terminou. É isso que permite a experiência influenciar o que lembramos amanhã.',
    criteria: [
      'Precisão do conceito: distingui atividade passageira de mudança persistente na sinapse.',
      'Justificativa: expliquei que a mudança altera a resposta futura do circuito.',
    ],
    followUp: {
      question: 'Isso vale para uma lembrança inteira?',
      guidance:
        'A LTP explica um mecanismo possível de fortalecimento numa sinapse. Uma lembrança autobiográfica inteira envolve muitos circuitos e processos adicionais, e existem outras formas de plasticidade.',
    },
    pid: 'c2p7',
    refs: [2, 3],
  },
  {
    id: 'o6',
    number: 6,
    question: 'Uma pessoa reconhece duas fotografias, mas não lembra se apareceram juntas. O que isso permite investigar?',
    model:
      'Permite separar memória de itens e memória relacional. Reconhecer cada foto mostra que os itens parecem familiares, mas não garante que a ligação entre eles foi codificada ou recuperada. Essa distinção é central no estudo de Ragland.',
    criteria: [
      'Precisão do conceito: nomeei memória de itens e memória relacional.',
      'Justificativa: expliquei por que reconhecer itens não garante recuperar a relação.',
    ],
    followUp: {
      question: 'Isso vale para todo indivíduo? Esse resultado diz se a pessoa tem esquizofrenia?',
      guidance:
        'Não. Um resultado individual nessa tarefa não identifica diagnóstico. O estudo comparou grupos e encontrou diferença média; perfis variam entre pessoas.',
    },
    pid: 'c5p5',
    refs: [5],
  },
  {
    id: 'o7',
    number: 7,
    question: 'Um teste de reconhecimento pode exigir memória relacional?',
    model:
      'Pode. Se pergunto “qual destes pares foi apresentado junto?”, a pessoa escolhe entre opções, mas só acerta se discriminar as relações anteriores. O formato da resposta e o conteúdo que precisa ser recuperado são coisas diferentes.',
    criteria: [
      'Precisão do conceito: dei um exemplo de reconhecimento que exige relação.',
      'Justificativa: separei formato da resposta de conteúdo a recuperar.',
    ],
    followUp: {
      question: 'Então como isso se relaciona com o achado de Aleman?',
      guidance:
        'Aleman mostrou que, em média, a diferença entre grupos foi maior na recordação e menor (mas presente) no reconhecimento. O formato influencia o tamanho da dificuldade; ainda assim, o reconhecimento pode exigir contexto e não está garantidamente intacto.',
    },
    pid: 'c5p5',
    refs: [5, 7],
  },
  {
    id: 'o9',
    number: 9,
    question: '“A imagem mostrou que faltou glutamato durante aquela lembrança.” O que há de errado?',
    model:
      'A ressonância funcional examina diferenças de recrutamento de regiões cerebrais durante uma tarefa. Ela não mede diretamente a quantidade de glutamato ou de GABA numa sinapse. A frase conclui algo que o método não mediu.',
    criteria: [
      'Precisão do conceito: disse o que a ressonância funcional mede (recrutamento regional na tarefa).',
      'Justificativa: expliquei por que não se pode concluir sobre neurotransmissor numa sinapse.',
    ],
    followUp: {
      question: 'O que o estudo realmente mediu?',
      guidance:
        'Ragland e colaboradores mediram desempenho numa tarefa que separa aprendizagem de itens e de relações e, com ressonância funcional, o recrutamento pré-frontal e hipocampal em condições específicas.',
    },
    pid: 'c6p3',
    refs: [5, 6],
  },
  {
    id: 'o10',
    number: 10,
    question: '“Na esquizofrenia, qual parte do cérebro para de guardar memórias?” Como você responderia?',
    model:
      'Eu reformularia: quais operações tiveram dificuldade, em qual tarefa e com quais achados nos circuitos? No estudo de Ragland, a dificuldade foi maior na codificação relacional, com diferenças no recrutamento pré-frontal nessa codificação e na contribuição do hipocampo na recuperação, em condições específicas. Não há uma região que simplesmente para de guardar.',
    criteria: [
      'Precisão do conceito: citei codificação relacional, pré-frontal e hipocampo em condições específicas.',
      'Justificativa: expliquei por que não faz sentido atribuir uma falha global a uma região.',
    ],
    followUp: {
      question: 'Isso vale para toda pessoa com esquizofrenia?',
      guidance:
        'São diferenças médias entre grupos. A intensidade e o perfil variam entre indivíduos; o diagnóstico sozinho não prevê o que uma pessoa conserva.',
    },
    pid: 'c5p4',
    refs: [5, 6],
  },
  {
    id: 'o12',
    number: 12,
    question: 'Se você conhece a sequência da LTP, por que não pode dizer que foi isso que falhou no paciente?',
    model:
      'Porque conhecer um mecanismo geral não demonstra que ele está alterado numa pessoa. A participação de receptores NMDA numa forma de plasticidade no hipocampo não mostra que alguém esqueceu por falha nesses receptores. Seria preciso evidência específica ligando aquele mecanismo àquele desempenho.',
    criteria: [
      'Precisão do conceito: distingui mecanismo geral de alteração demonstrada no indivíduo.',
      'Justificativa: disse que tipo de evidência faltaria para fazer a ligação.',
    ],
    followUp: {
      question: 'Então o que se pode dizer com segurança sobre sinapses na esquizofrenia?',
      guidance:
        'Que mudanças na função e na coordenação de circuitos (excitação por glutamato, inibição por GABA, no pré-frontal) são investigadas como mecanismos que podem contribuir para as dificuldades cognitivas. Estudos de tecido, imagem e modelos respondem a perguntas diferentes.',
    },
    pid: 'c6p4',
    refs: [2, 5, 6],
  },
];

export const getOral = (id: string) => oralQuestions.find((q) => q.id === id);
