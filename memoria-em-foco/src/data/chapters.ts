import type { Chapter } from './types';

/**
 * Texto de estudo. IDs de parágrafo (c1p1, c2p3…) são estáveis: o marcador de leitura,
 * a revisão e os links da prática apontam para eles.
 */
export const chapters: Chapter[] = [
  {
    id: 'c1',
    number: 1,
    title: 'O que é memória, biologicamente?',
    keyIdea: 'Memória pode ser descrita como capacidade (registrar, conservar, recuperar) ou investigada como mudança física no cérebro. A experiência passa; a mudança no circuito fica.',
    minutes: 2,
    blocks: [
      {
        kind: 'p',
        id: 'c1p1',
        text: 'Em psicologia, memória é o conjunto de processos pelos quais uma experiência pode ser registrada, conservada e utilizada posteriormente. Em neurociência, a pergunta é mais específica: o que uma experiência modifica no sistema nervoso para que ela influencie o que uma pessoa consegue fazer ou recordar depois? As duas definições descrevem o mesmo fenômeno em escalas diferentes. Uma descreve uma capacidade observável. A outra investiga os mecanismos que sustentam essa capacidade. [1, 3]',
      },
      {
        kind: 'p',
        id: 'c1p2',
        text: 'Durante uma experiência, diferentes populações de neurônios entram em atividade. Algumas processam características sensoriais, outras representam significados, relações e contexto. A atividade daquele momento é passageira. Para que a experiência tenha efeitos duradouros, algo precisa mudar na maneira como os neurônios respondem ou se comunicam. A capacidade do sistema nervoso de se modificar com a atividade e com a experiência recebe o nome de **plasticidade neural**. [2, 3]',
      },
      {
        kind: 'p',
        id: 'c1p3',
        text: 'O termo **traço de memória**, ou **engrama**, designa as modificações físicas duradouras associadas a uma experiência e que contribuem para sua recuperação posterior. Um traço pode envolver conjuntos de células e mudanças nas conexões entre elas. Quando recordamos, parte da atividade associada à experiência pode ser reativada.',
      },
      {
        kind: 'p',
        id: 'c1p4',
        text: 'Isso ajuda a responder uma pergunta importante: como conseguimos lembrar de algo mesmo depois que os neurônios deixaram de apresentar o padrão de atividade original? A experiência alterou o circuito, modificando sua possibilidade de responder no futuro. Grande parte da evidência experimental que permite identificar e manipular células de um engrama vem de estudos em animais. [3]',
      },
    ],
  },
  {
    id: 'c2',
    number: 2,
    title: 'O que acontece em uma sinapse quando aprendemos?',
    keyIdea: 'Na sinapse, um neurônio libera neurotransmissor e o outro responde por meio de receptores. Na LTP, a atividade conjunta faz um sinal parecido gerar uma resposta maior depois.',
    minutes: 3,
    blocks: [
      {
        kind: 'p',
        id: 'c2p1',
        text: 'Um **neurônio** é uma célula que recebe, integra e transmite sinais. Uma **sinapse** é uma região de comunicação entre células. Em uma sinapse química, a chegada de um sinal elétrico à terminação do neurônio pré-sináptico favorece a liberação de moléculas chamadas **neurotransmissores**. Elas atravessam uma pequena fenda e se ligam a **receptores** na célula pós-sináptica.',
      },
      {
        kind: 'p',
        id: 'c2p2',
        text: 'O receptor é uma proteína cuja ativação modifica a resposta dessa célula. Assim, neurotransmissor e receptor têm funções diferentes: um leva o sinal químico, o outro responde a ele. [2]',
      },
      {
        kind: 'p',
        id: 'c2p3',
        text: 'Como isso se relaciona com a memória? A mesma entrada pode produzir uma resposta diferente depois de uma experiência. Se certos padrões de atividade aumentam de forma persistente a eficácia da comunicação entre dois neurônios, temos uma forma de **potenciação de longa duração**, conhecida pela sigla {{LTP|ltp}}. “Mais forte” tem um significado concreto: um estímulo posterior comparável produz uma resposta pós-sináptica maior. [2]',
      },
      {
        kind: 'p',
        id: 'c2p4',
        text: 'Uma das formas mais estudadas de LTP ocorre em sinapses excitatórias do **hipocampo**. Nelas, o **glutamato** pode atuar sobre dois tipos de receptor, {{AMPA|ampa}} e {{NMDA|nmda}}. A ativação de receptores AMPA contribui para a **despolarização**, uma mudança na diferença de carga elétrica através da membrana do neurônio.',
      },
      {
        kind: 'p',
        id: 'c2p5',
        text: 'Em condições próximas ao repouso, íons de magnésio dificultam a passagem pelo canal do receptor NMDA. Quando há glutamato e despolarização suficiente, esse bloqueio pode ser aliviado. O canal então permite a entrada de cálcio. [2]',
      },
      {
        kind: 'p',
        id: 'c2p6',
        text: 'Por que a entrada de cálcio importa? Dentro da célula, o cálcio também funciona como sinal químico. Ele pode ativar processos que aumentam o número ou a eficácia de receptores AMPA disponíveis naquela sinapse. Em uma estimulação futura, a resposta pode ser maior. Essa sequência oferece uma explicação biológica para uma propriedade da aprendizagem: a atividade conjunta de células pode modificar a influência futura de uma sobre a outra.',
      },
      { kind: 'figure', id: 'fig-sinapse', figure: 'synapse' },
      {
        kind: 'p',
        id: 'c2p7',
        text: 'Existem outras formas de plasticidade, inclusive reduções persistentes da eficácia sináptica. A LTP explica um mecanismo possível de fortalecimento. Uma lembrança autobiográfica inteira envolve muitos circuitos e processos adicionais. [2, 3]',
      },
    ],
  },
  {
    id: 'c3',
    number: 3,
    title: 'Como uma experiência vira uma lembrança que podemos recuperar?',
    keyIdea: 'Codificar, consolidar, armazenar e recuperar são etapas diferentes. Não conseguir responder não mostra, sozinho, em qual etapa houve dificuldade.',
    minutes: 2,
    blocks: [
      {
        kind: 'p',
        id: 'c3p1',
        text: '**Codificação** é o processamento inicial que permite formar uma representação da experiência. A atenção influencia quais informações recebem processamento suficiente. A organização também importa: registrar elementos separadamente e representar as relações entre eles são demandas diferentes. Uma pessoa pode guardar a identidade de dois elementos e ter dificuldade para recuperar como estavam ligados. [1, 5]',
      },
      {
        kind: 'p',
        id: 'c3p2',
        text: '**Consolidação** é o conjunto de processos pelos quais uma representação inicialmente vulnerável se estabiliza e se reorganiza. Na escala sináptica, certas mudanças desencadeadas pela aprendizagem são mantidas ao longo do tempo. Na escala dos sistemas cerebrais, muda a contribuição relativa das redes que sustentam uma memória.',
      },
      {
        kind: 'p',
        id: 'c3p3',
        text: 'Hipocampo e áreas corticais participam dessa dinâmica. Dizer que a lembrança simplesmente “sai do hipocampo e vai para o córtex” obscurece essa interação e sugere uma transferência física que não descreve bem o processo. [3]',
      },
      {
        kind: 'p',
        id: 'c3p4',
        text: '**Armazenamento** designa a retenção da informação ao longo do tempo. **Recuperação** é o acesso posterior ao que foi aprendido. Essa distinção tem uma consequência importante: o desempenho observado hoje depende tanto do que foi aprendido antes quanto das condições oferecidas para acessar aquela informação agora.',
      },
      {
        kind: 'p',
        id: 'c3p5',
        text: 'Uma dificuldade para responder não revela, por si só, se a representação se formou de maneira incompleta, se perdeu estabilidade ou se estava difícil de recuperar naquele momento. [1, 3]',
      },
    ],
  },
  {
    id: 'c4',
    number: 4,
    title: 'Que regiões e sistemas participam da memória?',
    keyIdea: 'O hipocampo participa da ligação entre os elementos de um episódio; o pré-frontal seleciona, organiza e orienta a busca. Cada tipo de memória é avaliado por tarefas diferentes.',
    minutes: 2,
    blocks: [
      {
        kind: 'p',
        id: 'c4p1',
        text: 'O **hipocampo**, localizado na porção medial do lobo temporal, participa da formação de memórias episódicas e da representação de relações entre os elementos de uma experiência. Uma memória episódica diz respeito a um acontecimento vivido e ao seu contexto.',
      },
      {
        kind: 'p',
        id: 'c4p2',
        text: 'A identidade de um objeto, o lugar em que apareceu e a pessoa que estava presente são informações distintas. Lembrar o acontecimento como episódio envolve recuperar como esses elementos se relacionavam. Essa função ajuda a entender por que reconhecer um elemento familiar pode ser mais fácil do que situá-lo em sua ocasião de origem. [1, 3, 5]',
      },
      {
        kind: 'p',
        id: 'c4p3',
        text: 'O **córtex pré-frontal** participa do controle da atividade mental conforme os objetivos da tarefa. Entre outras funções, contribui para selecionar o que é relevante, organizar informação durante a aprendizagem e orientar a busca durante a recuperação. A porção **dorsolateral** é especialmente estudada em tarefas que exigem organização, controle e manipulação da informação.',
      },
      {
        kind: 'p',
        id: 'c4p4',
        text: 'O hipocampo e o córtex pré-frontal trabalham em interação com outras regiões. Dividir as funções ajuda a estudá-las, mas nenhuma dessas estruturas executa sozinha toda a memória humana. [5, 6]',
      },
      { kind: 'figure', id: 'fig-episodica', figure: 'episodic' },
      {
        kind: 'p',
        id: 'c4p5',
        text: 'É importante distinguir os sistemas pelo que permitem fazer. A **memória de trabalho** mantém informações temporariamente disponíveis para orientar uma operação em andamento. A **memória episódica** permite recuperar acontecimentos e seus contextos. A **memória semântica** sustenta conhecimentos e significados que podem ser usados independentemente da ocasião em que foram aprendidos. A **memória procedural** participa da aquisição e execução de habilidades.',
      },
      {
        kind: 'p',
        id: 'c4p6',
        text: 'Portanto, perguntar “como está a memória?” exige uma segunda pergunta: qual dessas funções foi avaliada e por qual tarefa? [1, 6]',
      },
    ],
  },
  {
    id: 'c5',
    number: 5,
    title: 'O que muda na memória de pessoas com esquizofrenia?',
    keyIdea: 'Em média, as dificuldades aparecem sobretudo em manter informação em uso e em aprender relações entre itens. O formato da tarefa muda o tamanho da diferença, e as pessoas variam.',
    minutes: 4,
    blocks: [
      {
        kind: 'p',
        id: 'c5p1',
        text: 'A **esquizofrenia** é um transtorno mental que pode envolver sintomas psicóticos, como delírios e alucinações, além de sintomas negativos e dificuldades cognitivas. A cognição inclui atenção, aprendizagem, memória e outras funções. Uma alucinação diz respeito à percepção. Já uma dificuldade de memória diz respeito ao registro, à manutenção ou à recuperação de informação. São dimensões diferentes que podem coexistir e afetar o cotidiano de formas distintas. [4]',
      },
      {
        kind: 'p',
        id: 'c5p2',
        text: '**Na memória de trabalho**, estudos encontram, em média, dificuldades para manter e usar informação enquanto uma tarefa continua. A exigência aumenta quando é preciso conservar determinados elementos, ignorar interferências e manipular o conteúdo conforme uma regra. Isso ajuda a explicar por que compreender cada frase de uma orientação e conseguir utilizar todas as suas partes em sequência são capacidades relacionadas, mas separáveis. Os estudos relacionam esse tipo de desempenho ao funcionamento de circuitos pré-frontais. [4, 6]',
      },
      {
        kind: 'p',
        id: 'c5p3',
        text: '**Na memória episódica**, uma distinção central é entre aprender um item e aprender a relação entre itens. Ragland e colaboradores estudaram essa diferença em pessoas com esquizofrenia e participantes de comparação. Durante uma tarefa de memória acompanhada por {{ressonância magnética funcional|rmf}}, examinaram a aprendizagem das características de itens e a aprendizagem das relações entre eles.',
      },
      {
        kind: 'p',
        id: 'c5p4',
        text: 'O grupo com esquizofrenia apresentou dificuldade particularmente importante quando a tarefa exigia representar relações. Os resultados também apontaram diferenças no recrutamento pré-frontal durante a codificação relacional e no recrutamento do hipocampo durante a recuperação em condições específicas da tarefa. [5]',
      },
      {
        kind: 'p',
        id: 'c5p5',
        text: 'O significado desse achado vai além de dizer “a memória é pior”. Alguém pode conservar uma sensação de **familiaridade** e ainda ter dificuldade para recuperar a relação que dá contexto à lembrança. Familiaridade é a sensação de já ter encontrado algo. **Recordação contextual** envolve recuperar detalhes da experiência anterior. Essa distinção não é absoluta: até uma tarefa de reconhecimento pode exigir contexto quando a pessoa precisa identificar quais elementos apareceram juntos. [5]',
      },
      {
        kind: 'p',
        id: 'c5p6',
        text: '**Recordação livre**, **recordação com pista** e **reconhecimento** são maneiras de avaliar a memória. Na primeira, a pessoa precisa produzir o conteúdo sem opções. Na segunda, recebe uma ajuda para a busca. Na terceira, decide se algo apresentado corresponde ao que aprendeu.',
      },
      {
        kind: 'p',
        id: 'c5p7',
        text: 'Uma {{meta-análise|meta}} de Aleman e colaboradores reuniu 70 estudos e encontrou diferença média maior entre os grupos nas tarefas de recordação. O reconhecimento também apresentou diferença significativa, embora menor. Isso permite dizer que o formato da tarefa influencia o tamanho da dificuldade observada. Não autoriza afirmar que toda pessoa com esquizofrenia tem reconhecimento intacto. [7]',
      },
      {
        kind: 'p',
        id: 'c5p8',
        text: '**Qual é, então, a diferença em relação a pessoas sem esquizofrenia?** Os dois grupos usam os mesmos princípios gerais de memória. A pesquisa identifica diferenças médias na eficiência de certos processos e no recrutamento dos circuitos necessários sob determinadas condições. Entre os pontos importantes estão sustentar informações enquanto se trabalha com elas, organizar relações durante a aprendizagem e recuperar detalhes de um episódio.',
      },
      {
        kind: 'p',
        id: 'c5p9',
        text: 'A intensidade e o perfil variam entre indivíduos. Um diagnóstico, sozinho, não permite prever quais lembranças determinada pessoa conserva ou quanto apoio ela precisará. [4–7]',
      },
    ],
  },
  {
    id: 'c6',
    number: 6,
    title: 'O que sabemos sobre as sinapses na esquizofrenia?',
    keyIdea: 'Conhecer um mecanismo sináptico não prova que ele falhou numa pessoa. Alterações de circuito são investigadas como contribuição possível, e parte das dificuldades pode vir antes do tratamento.',
    minutes: 2,
    blocks: [
      {
        kind: 'p',
        id: 'c6p1',
        text: 'Agora conecte os capítulos anteriores com cuidado. Para manter informação disponível, os neurônios de um circuito precisam influenciar uns aos outros de maneira coordenada. No córtex pré-frontal, neurônios excitatórios que usam glutamato e interneurônios inibitórios que usam principalmente **GABA** participam dessa coordenação. A inibição ajuda a regular quando e quais células ficam ativas. Por isso, tanto a excitação quanto a inibição importam para a precisão do funcionamento da rede. [6]',
      },
      {
        kind: 'p',
        id: 'c6p2',
        text: 'Pesquisadores investigam se alterações em componentes desses circuitos contribuem para dificuldades de memória de trabalho na esquizofrenia. Estudos de tecido cerebral, estudos de atividade cerebral em pessoas e modelos experimentais oferecem informações complementares. Uma alteração molecular identificada em tecido pode sugerir um mecanismo. Um estudo de imagem pode relacionar atividade regional e desempenho. Um teste cognitivo pode mostrar em qual condição o desempenho muda. Cada método responde a uma pergunta diferente. [5, 6]',
      },
      {
        kind: 'p',
        id: 'c6p3',
        text: 'Aqui está o limite que você precisa saber defender: o fato de receptores NMDA participarem de uma forma de plasticidade no hipocampo não demonstra que uma pessoa esqueceu uma informação por causa de uma falha nesses receptores. E uma diferença na ressonância funcional não mede diretamente a quantidade de glutamato ou GABA em uma sinapse.',
      },
      {
        kind: 'p',
        id: 'c6p4',
        text: 'A formulação sustentada é que mudanças na função e na coordenação de circuitos são investigadas como mecanismos que podem contribuir para as dificuldades cognitivas observadas. [2, 5, 6]',
      },
      {
        kind: 'p',
        id: 'c6p5',
        text: 'Outra pergunta provável é se essas dificuldades são inteiramente consequência dos antipsicóticos. Uma meta-análise publicada em 2024 identificou diferenças cognitivas já no primeiro episódio psicótico em pessoas que ainda não haviam usado antipsicóticos. Portanto, ao menos parte das dificuldades observadas nessa população pode preceder o tratamento.',
      },
      {
        kind: 'p',
        id: 'c6p6',
        text: 'A população estudada foi a de **primeiro episódio psicótico**, categoria mais ampla do que esquizofrenia. O estudo tampouco estabelece o efeito de um medicamento específico em uma pessoa. [8]',
      },
    ],
  },
];

export const allParagraphs = chapters.flatMap((c) =>
  c.blocks.filter((b): b is Extract<typeof b, { kind: 'p' }> => b.kind === 'p').map((b) => ({ ...b, chapter: c })),
);
export const getParagraph = (pid: string) => allParagraphs.find((p) => p.id === pid);
export const chapterOf = (blockId: string) => chapters.find((c) => c.blocks.some((b) => b.id === blockId));
