import type { Exercise } from './types';

/** Exercícios da prática. IDs estáveis; a correção usa o ID da alternativa, nunca a posição. */
export const exercises: Exercise[] = [
  {
    id: 'e1',
    number: 1,
    type: 'open',
    prompt: 'Defina memória em duas escalas.',
    model:
      'Em psicologia, memória é o conjunto de processos que permitem registrar, conservar e recuperar informação. Em neurociência, a pergunta é como mudanças nas células e redes tornam possível que uma experiência influencie o que a pessoa faz ou recorda depois.',
    criteria: ['Dei a definição psicológica (registrar, conservar, recuperar).', 'Dei a pergunta neurocientífica (mudanças em células e redes que permitem a influência posterior).'],
    explanation: 'As duas definições descrevem o mesmo fenômeno em escalas diferentes: uma capacidade observável e os mecanismos que a sustentam. [1, 3]',
    pid: 'c1p1',
  },
  {
    id: 'e2',
    number: 2,
    type: 'single',
    prompt: 'Qual frase diferencia corretamente glutamato e receptor NMDA?',
    choices: [
      {
        id: 'ok',
        text: 'O glutamato é um neurotransmissor; NMDA é um tipo de receptor que pode responder a ele.',
        feedback: 'Isso. Um é a molécula que transmite o sinal; o outro, a proteína que o recebe.',
      },
      {
        id: 'troca',
        text: 'NMDA é o neurotransmissor liberado; o glutamato é o receptor na célula pós-sináptica.',
        feedback: 'Os papéis estão invertidos. Essa confusão troca a molécula que transmite o sinal pela proteína que o recebe.',
      },
      {
        id: 'iguais',
        text: 'São dois nomes para a mesma molécula excitatória.',
        feedback: 'São coisas de natureza diferente: uma molécula sinalizadora e uma proteína de membrana com canal.',
      },
      {
        id: 'inibe',
        text: 'O glutamato bloqueia o canal NMDA perto do repouso.',
        feedback: 'Quem bloqueia o canal perto do repouso são os íons de magnésio. O glutamato é uma das condições para a abertura.',
      },
    ],
    correctId: 'ok',
    explanation: 'O glutamato é um neurotransmissor. NMDA designa um tipo de receptor que pode responder a ele. [2]',
    pid: 'c2p4',
  },
  {
    id: 'e3',
    number: 3,
    type: 'order',
    prompt: 'Ordene os acontecimentos de uma forma clássica de LTP.',
    items: [
      { id: 'a', text: 'Liberação de glutamato' },
      { id: 'b', text: 'Ativação de receptores AMPA e despolarização' },
      { id: 'c', text: 'Alívio do bloqueio por magnésio do canal NMDA, nas condições adequadas' },
      { id: 'd', text: 'Entrada de cálcio' },
      { id: 'e', text: 'Mudanças que podem ampliar a resposta sináptica futura' },
    ],
    explanation:
      'Glutamato → AMPA e despolarização → alívio do bloqueio por magnésio no NMDA → entrada de cálcio → mudanças (como mais receptores AMPA ou receptores mais eficazes) que podem ampliar a resposta futura. [2]',
    pid: 'c2p5',
  },
  {
    id: 'e4',
    number: 4,
    type: 'open',
    prompt: 'Explique por que a mudança duradoura na sinapse importa mais para a memória do que o breve impulso elétrico inicial.',
    model:
      'O impulso desencadeia atividade naquele momento, e essa atividade é passageira. A mudança persistente modifica como o circuito poderá responder quando a experiência já tiver terminado. É essa modificação que permite à experiência influenciar o futuro.',
    criteria: ['Precisão: distingui atividade passageira de mudança persistente.', 'Justificativa: expliquei que a mudança altera a resposta futura do circuito, depois que a experiência terminou.'],
    explanation: 'A pergunta é como uma experiência influencia o que vem depois; para isso, algo precisa permanecer modificado. [2, 3]',
    pid: 'c1p4',
  },
  {
    id: 'e5',
    number: 5,
    type: 'single',
    prompt: 'Qual frase diferencia corretamente armazenamento e consolidação?',
    choices: [
      {
        id: 'ok',
        text: 'Armazenamento descreve a retenção; consolidação descreve processos de estabilização e reorganização que contribuem para a persistência.',
        feedback: 'Isso. Um termo descreve o resultado (reter); o outro, processos que tornam a representação estável.',
      },
      {
        id: 'sin',
        text: 'São sinônimos: os dois significam guardar a informação.',
        feedback: 'Estão relacionados, mas não são sinônimos. Consolidação nomeia processos de estabilização e reorganização; armazenamento, a retenção.',
      },
      {
        id: 'transf',
        text: 'Consolidação é a transferência da lembrança do hipocampo para o córtex.',
        feedback: 'Essa imagem de transferência física obscurece a interação entre hipocampo e córtex e não descreve bem o processo.',
      },
      {
        id: 'acesso',
        text: 'Armazenamento é o acesso posterior ao que foi aprendido.',
        feedback: 'Acesso posterior é recuperação. Armazenamento é a retenção ao longo do tempo.',
      },
    ],
    correctId: 'ok',
    explanation: 'Armazenamento descreve a retenção. Consolidação descreve processos de estabilização e reorganização que contribuem para a persistência da memória. [1, 3]',
    pid: 'c3p2',
  },
  {
    id: 'e6',
    number: 6,
    type: 'single',
    prompt: 'Uma pessoa reconhece duas fotografias, mas não lembra se apareceram juntas. O que essa diferença permite investigar?',
    choices: [
      {
        id: 'ok',
        text: 'A diferença entre memória de itens e memória relacional.',
        feedback: 'Isso. Reconhecer as fotos não garante ter codificado ou recuperado corretamente a relação entre elas.',
      },
      {
        id: 'trab',
        text: 'Um problema de memória de trabalho.',
        feedback: 'A tarefa não pede manter e manipular informação durante uma operação em andamento; pede recuperar uma relação aprendida antes.',
      },
      {
        id: 'nada',
        text: 'Nada: se reconheceu as fotos, a memória do episódio está preservada.',
        feedback: 'Reconhecer cada elemento e recuperar como eles estavam ligados são demandas diferentes.',
      },
      {
        id: 'diag',
        text: 'Se a pessoa tem esquizofrenia.',
        feedback: 'Um resultado individual numa tarefa não identifica diagnóstico.',
      },
    ],
    correctId: 'ok',
    explanation: 'Memória de itens e memória relacional. Reconhecer as fotos não garante ter codificado ou recuperado a relação entre elas. [5]',
    pid: 'c3p1',
  },
  {
    id: 'e7',
    number: 7,
    type: 'single',
    prompt: 'Um teste de reconhecimento pode exigir memória relacional?',
    choices: [
      {
        id: 'sim',
        text: 'Sim. Em “qual destes pares foi apresentado junto?”, há opções, mas acertar exige discriminar as relações anteriores.',
        feedback: 'Isso. O formato da resposta (escolher entre opções) e o conteúdo a recuperar (a relação) são aspectos distintos.',
      },
      {
        id: 'nao',
        text: 'Não. Reconhecimento avalia só a familiaridade com itens isolados.',
        feedback: 'A distinção não é absoluta. Quando a pessoa precisa identificar quais elementos apareceram juntos, o reconhecimento exige contexto.',
      },
      {
        id: 'livre',
        text: 'Só se a pessoa precisar escrever a resposta sem opções.',
        feedback: 'Escrever sem opções seria recordação, não reconhecimento. E o reconhecimento já pode exigir relações.',
      },
    ],
    correctId: 'sim',
    explanation: 'O formato da resposta e o conteúdo a recuperar são aspectos distintos. [5]',
    pid: 'c5p5',
  },
  {
    id: 'e8',
    number: 8,
    type: 'single',
    prompt: 'Qual foi o achado da meta-análise de Aleman e colaboradores?',
    choices: [
      {
        id: 'ok',
        text: 'A diferença média entre os grupos foi maior na recordação; também houve diferença, menor, no reconhecimento.',
        feedback: 'Isso. Menor não significa ausente.',
      },
      {
        id: 'intacto',
        text: 'Pessoas com esquizofrenia têm reconhecimento intacto; a dificuldade aparece só na recordação.',
        feedback: 'O reconhecimento também apresentou diferença significativa. O achado não autoriza dizer que o reconhecimento é intacto.',
      },
      {
        id: 'inverso',
        text: 'A diferença foi maior no reconhecimento do que na recordação.',
        feedback: 'É o inverso: a diferença foi maior quando era preciso produzir o material sem opções.',
      },
      {
        id: 'igual',
        text: 'O formato da tarefa não alterou o tamanho da diferença.',
        feedback: 'O achado mostra justamente que o formato influencia o tamanho da dificuldade observada.',
      },
    ],
    correctId: 'ok',
    explanation: 'Na meta-análise de 70 estudos, a diferença foi maior na recordação e também presente, embora menor, no reconhecimento. [7]',
    pid: 'c5p7',
  },
  {
    id: 'e9',
    number: 9,
    type: 'single',
    prompt: '“A imagem mostrou que faltou glutamato durante aquela lembrança.” O que há de errado nessa frase?',
    choices: [
      {
        id: 'ok',
        text: 'A ressonância funcional examinou diferenças de recrutamento regional numa tarefa; não mediu a quantidade de neurotransmissor numa sinapse.',
        feedback: 'Isso. O método define o que pode ser concluído.',
      },
      {
        id: 'gaba',
        text: 'Deveria dizer GABA em vez de glutamato.',
        feedback: 'Trocar o neurotransmissor não resolve: a ressonância funcional não mede diretamente nenhum dos dois numa sinapse.',
      },
      {
        id: 'nada',
        text: 'Nada; a ressonância funcional mede a liberação de neurotransmissores.',
        feedback: 'A ressonância funcional relaciona atividade regional e tarefa. Não é uma medida direta de glutamato ou GABA na sinapse.',
      },
    ],
    correctId: 'ok',
    explanation: 'O estudo examinou diferenças de recrutamento regional associadas a uma tarefa. Não mediu diretamente a quantidade de neurotransmissor naquela sinapse. [5, 6]',
    pid: 'c6p3',
  },
  {
    id: 'e10',
    number: 10,
    type: 'open',
    prompt: '“Na esquizofrenia, qual parte do cérebro para de guardar memórias?” Como reformular essa pergunta?',
    model:
      'Eu perguntaria quais operações de memória apresentaram dificuldade, em qual tarefa e com que achados nos circuitos associados. Por exemplo: no estudo de Ragland, a dificuldade foi maior na codificação relacional, com diferenças no recrutamento pré-frontal durante essa codificação e na contribuição do hipocampo na recuperação, em condições específicas. Não há uma região que “para de guardar”.',
    criteria: ['Reformulei em termos de operação, tarefa e circuitos.', 'Citei codificação relacional, recrutamento pré-frontal e hipocampo em condições específicas, sem atribuir falha global a uma região.'],
    explanation: 'Evitar atribuir uma falha global a uma região: a memória envolve várias operações e circuitos em interação. [5, 6]',
    pid: 'c5p4',
  },
  {
    id: 'e11',
    number: 11,
    type: 'single',
    prompt: 'Como sabemos que a medicação, sozinha, não explica todos os achados cognitivos?',
    choices: [
      {
        id: 'ok',
        text: 'Foram encontradas diferenças antes do uso de antipsicóticos em amostras de primeiro episódio psicótico.',
        feedback: 'Isso. Cuide de nomear a população (primeiro episódio psicótico, mais ampla que esquizofrenia) e o limite da conclusão.',
      },
      {
        id: 'semefeito',
        text: 'Porque os estudos mostraram que antipsicóticos não afetam a cognição.',
        feedback: 'O estudo não mede o efeito de medicamentos específicos. Mostra diferenças antes do tratamento.',
      },
      {
        id: 'esq',
        text: 'Porque todas as pessoas com esquizofrenia já tinham dificuldades na infância.',
        feedback: 'Essa afirmação não está nas fontes estudadas e generaliza para todas as pessoas.',
      },
    ],
    correctId: 'ok',
    explanation: 'Diferenças antes do uso de antipsicóticos em primeiro episódio psicótico indicam que ao menos parte das dificuldades pode preceder o tratamento, nessa população. [8]',
    pid: 'c6p5',
  },
  {
    id: 'e12',
    number: 12,
    type: 'open',
    prompt: 'A professora pergunta: “Se você conhece a sequência da LTP, por que não pode dizer que foi isso que falhou no paciente?”',
    model:
      'Porque conhecer um mecanismo geral não demonstra que ele está alterado num indivíduo. A LTP descreve uma forma de plasticidade estudada no hipocampo. Para dizer que ela falhou naquele paciente, eu precisaria de evidência específica ligando esse mecanismo àquele desempenho.',
    criteria: ['Precisão: distingui mecanismo geral de alteração demonstrada numa pessoa.', 'Justificativa: disse que tipo de evidência seria necessária para fazer a ligação.'],
    explanation: 'Conhecer um mecanismo geral não demonstra sua alteração em um indivíduo. [2, 6]',
    pid: 'c6p3',
  },
];

export const getExercise = (id: string) => exercises.find((e) => e.id === id);
