import type { Block, Chapter, Layer } from './types';

/**
 * Texto de estudo em dois modos.
 *  - Resumido: só os parágrafos `lead` de cada trecho (leitura contínua de 3–4 minutos).
 *  - Completo: o mesmo `lead`, seguido de `more` e, quando interromperia o raciocínio, `deep` (“Aprofundar”).
 * Regra editorial: primeiro a pergunta e o fenômeno, depois o nome técnico.
 * IDs (s2-1, s2-1a, s2-d1…) são estáveis: marcações, anotações, revisão e exercícios apontam para eles.
 */
export const chapters: Chapter[] = [
  {
    id: 'c1',
    number: 1,
    title: 'O que é memória?',
    minutes: 1,
    sections: [
      {
        id: 's1-1',
        lead: 'Quando alguém diz “esqueci”, vemos apenas o resultado. A psicologia separa a memória em processos: registrar uma experiência, conservá-la ao longo do tempo e acessá-la depois. Uma dificuldade pode surgir em qualquer um deles, e o “esqueci”, sozinho, não diz em qual. [1]',
        more: [
          {
            kind: 'p',
            id: 's1-1a',
            text: 'A neurociência faz a mesma pergunta em outra escala: o que uma experiência modifica no sistema nervoso para influenciar o que a pessoa faz ou recorda depois? As duas descrições tratam do mesmo fenômeno. Uma descreve uma capacidade que observamos; a outra procura os mecanismos que a sustentam. [1, 3]',
          },
        ],
      },
      {
        id: 's1-2',
        lead: 'Como uma experiência que já terminou continua tendo efeito? Durante a experiência, grupos de neurônios ficam ativos, mas essa atividade passa. O que permanece é uma mudança na maneira como esses neurônios respondem e se comunicam. Essa capacidade do cérebro de se modificar com a experiência se chama **plasticidade neural**. [2, 3]',
        more: [
          {
            kind: 'p',
            id: 's1-2a',
            text: 'O conjunto de mudanças físicas duradouras ligadas a uma experiência, que contribuem para que ela seja recuperada depois, é chamado de **traço de memória**, ou **engrama**. Ele pode envolver grupos de células e as conexões entre elas. Quando lembramos, parte da atividade daquele momento pode ser reativada. Isso não acontece porque os neurônios ficaram ativos desde então, e sim porque o circuito foi alterado e passou a responder de outro jeito. [3]',
          },
          {
            kind: 'p',
            id: 's1-2b',
            text: 'Uma ressalva sobre a evidência: grande parte dos experimentos que identificam e manipulam células de um engrama foi feita em animais. Em pessoas, o conceito ajuda a organizar o que sabemos, mas não é medido célula a célula. [3]',
          },
        ],
      },
    ],
  },
  {
    id: 'c2',
    number: 2,
    title: 'O que muda numa sinapse quando aprendemos?',
    minutes: 3,
    sections: [
      {
        id: 's2-1',
        lead: 'Como uma experiência breve pode deixar um efeito duradouro? Os neurônios se comunicam em pontos de contato chamados **sinapses**. Quando certos neurônios se ativam juntos, a comunicação entre eles pode mudar. Em algumas conexões do hipocampo, o mesmo sinal passa a produzir uma resposta maior no neurônio que o recebe. Esse fortalecimento persistente é uma forma de **potenciação de longa duração**, ou {{LTP|ltp}}. [2]',
        more: [
          {
            kind: 'p',
            id: 's2-1a',
            text: '“Mais forte”, aqui, tem um sentido preciso: depois daquela atividade, um estímulo comparável produz uma resposta maior na célula que recebe o sinal. É assim que uma experiência de poucos segundos pode alterar a maneira como o circuito vai responder amanhã. Use o controle da figura para comparar. [2]',
          },
          { kind: 'figure', id: 'fig-comparar', figure: 'synapse-compare' },
          {
            kind: 'p',
            id: 's2-1b',
            text: 'Para entender o que muda, vale olhar a sinapse por dentro. O {{neurônio|neuronio}} que envia o sinal libera moléculas chamadas **neurotransmissores**. Elas atravessam uma fenda estreita e se ligam a **receptores**, proteínas na membrana da célula que recebe. Os dois têm papéis diferentes: o neurotransmissor leva a mensagem; o receptor responde a ela e altera a atividade da célula. [2]',
          },
          {
            kind: 'p',
            id: 's2-1c',
            text: 'Dois limites evitam exageros. Existem outras formas de plasticidade, inclusive enfraquecimentos persistentes das conexões. E uma lembrança inteira envolve muitas células e circuitos, não uma única sinapse. [2, 3]',
          },
        ],
        deep: {
          question: 'Como esse fortalecimento acontece?',
          blocks: [
            {
              kind: 'p',
              id: 's2-d1',
              text: 'Nas sinapses do hipocampo mais estudadas, o neurotransmissor é o **glutamato**, que atua sobre dois tipos de receptor com funções complementares. O {{receptor AMPA|ampa}} é a via rápida: quando o glutamato se liga a ele, cargas positivas entram na célula e provocam uma **despolarização**, isto é, o interior da célula fica menos negativo. [2]',
            },
            {
              kind: 'p',
              id: 's2-d2',
              text: 'O {{receptor NMDA|nmda}} funciona como um detector de coincidência. Perto do repouso, um íon de magnésio fica preso no seu canal e o mantém bloqueado, mesmo com glutamato presente. O bloqueio só é aliviado quando há glutamato e, ao mesmo tempo, despolarização suficiente. Em outras palavras, quando a célula que envia e a que recebe estão ativas juntas. [2]',
            },
            {
              kind: 'p',
              id: 's2-d3',
              text: 'Com o canal NMDA aberto, entra cálcio. Dentro da célula, o cálcio funciona como um sinal químico: ativa processos que aumentam o número ou a eficácia dos receptores AMPA naquela sinapse. Com mais receptores AMPA disponíveis, o mesmo glutamato liberado no futuro gera uma resposta maior. É essa mudança que torna o fortalecimento duradouro. [2]',
            },
            { kind: 'figure', id: 'fig-sinapse', figure: 'synapse-steps' },
          ],
        },
      },
    ],
  },
  {
    id: 'c3',
    number: 3,
    title: 'Como uma experiência vira uma lembrança?',
    minutes: 2,
    sections: [
      {
        id: 's3-1',
        lead: 'Nem tudo o que vivemos é registrado da mesma forma. A **codificação**, o processamento que forma a representação de uma experiência, depende da atenção e da organização. E há uma distinção que será central para a esquizofrenia: registrar os elementos de uma experiência e registrar como eles se relacionam são tarefas diferentes. Dá para guardar dois rostos e não lembrar que estavam juntos. [1, 5]',
      },
      {
        id: 's3-2',
        lead: 'Depois do registro, a lembrança precisa se manter e ser encontrada. **Armazenamento** é a retenção ao longo do tempo; **recuperação** é o acesso posterior. O desempenho de hoje depende do que foi aprendido e das condições oferecidas agora para lembrar. Por isso, errar uma resposta não revela, sozinho, se a lembrança se formou incompleta, se perdeu estabilidade ou se apenas estava difícil de acessar naquele momento. [1, 3]',
        more: [
          {
            kind: 'p',
            id: 's3-2a',
            text: 'Entre o registro e o uso posterior acontece a **consolidação**: processos que estabilizam e reorganizam uma representação que, no início, é frágil. Na escala da sinapse, certas mudanças desencadeadas pela aprendizagem se mantêm. Na escala dos sistemas cerebrais, muda a participação relativa das redes que sustentam aquela memória. [3]',
          },
        ],
        deep: {
          question: 'A lembrança “sai do hipocampo e vai para o córtex”?',
          blocks: [
            {
              kind: 'p',
              id: 's3-d1',
              text: 'Essa imagem é comum, mas engana. Hipocampo e áreas corticais interagem durante a consolidação. Falar em transferência física sugere que a lembrança é um objeto que muda de lugar, e isso não descreve bem o processo. [3]',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'c4',
    number: 4,
    title: 'Que tipos de memória e regiões entram em jogo?',
    minutes: 2,
    sections: [
      {
        id: 's4-1',
        lead: 'Perguntar “como está a memória?” é vago, porque existem vários tipos. A **memória de trabalho** mantém uma informação disponível enquanto fazemos algo com ela, como guardar um número enquanto o digitamos. A **memória episódica** recupera um acontecimento com seu contexto: o que aconteceu, onde e com quem. Cada tipo é avaliado por tarefas diferentes. [1, 6]',
        more: [
          {
            kind: 'p',
            id: 's4-1a',
            text: 'Outros dois tipos completam o quadro: a **memória semântica** sustenta conhecimentos e significados que usamos sem lembrar quando os aprendemos, e a **memória procedural** participa da aquisição e execução de habilidades, como andar de bicicleta. [1]',
          },
        ],
      },
      {
        id: 's4-2',
        lead: 'Duas regiões aparecem muito nos estudos. O **hipocampo** participa da formação de memórias episódicas e, em especial, das relações entre os elementos de uma experiência. O **córtex pré-frontal** ajuda a selecionar o que é relevante, a organizar a informação ao aprender e a orientar a busca ao lembrar; também participa da {{memória de trabalho|memoria-de-trabalho}}. Nenhuma das duas faz a memória sozinha: elas trabalham em interação com outras regiões. [1, 3, 5, 6]',
        more: [
          {
            kind: 'p',
            id: 's4-2a',
            text: 'Por que separar elementos de relações? Reconhecer um rosto como familiar pode se apoiar apenas na identidade do rosto. Lembrar que você viu essa pessoa na biblioteca, ontem, exige recuperar a ligação entre o rosto, o lugar e o momento. Essa ligação é justamente o tipo de informação em que o hipocampo é mais estudado. [1, 3, 5]',
          },
          { kind: 'figure', id: 'fig-episodica', figure: 'episodic' },
          {
            kind: 'p',
            id: 's4-2b',
            text: 'Dentro do pré-frontal, a porção **dorsolateral** é especialmente estudada em tarefas que exigem organizar, controlar e manipular informação, o que inclui a memória de trabalho. [6]',
          },
        ],
      },
    ],
  },
  {
    id: 'c5',
    number: 5,
    title: 'O que pode mudar na memória de uma pessoa com esquizofrenia?',
    minutes: 3,
    sections: [
      {
        id: 's5-1',
        lead: 'A **esquizofrenia** pode envolver sintomas psicóticos, como delírios e alucinações, sintomas negativos e dificuldades cognitivas, como as de atenção, aprendizagem e memória. São dimensões diferentes: uma alucinação é uma alteração da percepção; uma dificuldade de memória diz respeito a registrar, manter ou recuperar informação. Elas podem coexistir e afetar o dia a dia de formas distintas. [4]',
      },
      {
        id: 's5-2',
        lead: 'O que pode mudar na {{memória de trabalho|memoria-de-trabalho}}? Em média, os estudos encontram mais dificuldade para manter uma informação disponível enquanto se faz algo com ela. Pense numa orientação com várias etapas: é preciso guardar o começo enquanto se escuta o fim e, depois, usar cada parte na ordem certa. Entender cada frase não garante isso, e a exigência cresce com interferências. Os pesquisadores relacionam esse desempenho ao funcionamento de circuitos do {{córtex pré-frontal|cortex-pre-frontal}}. [4, 6]',
      },
      {
        id: 's5-3',
        lead: 'E na {{memória episódica|memoria-episodica}}? A pessoa pode reconhecer os elementos de uma experiência e ter mais dificuldade para recuperar a relação entre eles: sentir que um rosto é familiar, mas não lembrar onde o viu. Reconhecer o rosto depende da informação sobre o próprio rosto; lembrar onde o encontrou depende da ligação entre rosto e lugar. Ragland e colaboradores testaram essa diferença comparando a aprendizagem de itens isolados com a aprendizagem das relações entre itens. O grupo com esquizofrenia teve dificuldade especialmente grande quando precisava aprender as relações. [5]',
        more: [
          {
            kind: 'p',
            id: 's5-3a',
            text: 'O estudo usou {{ressonância magnética funcional|rmf}} durante a tarefa. Além do desempenho, encontrou diferenças no recrutamento do pré-frontal enquanto as relações eram codificadas e no recrutamento do hipocampo durante a recuperação, em condições específicas. Isso sugere que parte da dificuldade pode surgir já no registro das relações, e não apenas no armazenamento. [5]',
          },
          {
            kind: 'p',
            id: 's5-3b',
            text: 'Duas noções ajudam a falar disso com precisão. **Familiaridade** é a sensação de já ter encontrado algo. **Recordação contextual** é recuperar detalhes da experiência anterior, como o lugar e o que estava junto. A separação não é absoluta: até um teste de reconhecimento exige contexto quando a pergunta é quais elementos apareceram juntos. [5]',
          },
        ],
      },
      {
        id: 's5-4',
        lead: 'O que a comparação entre grupos permite concluir? Que existe uma tendência média, e não um padrão igual para todos. Uma {{meta-análise|meta}} de Aleman e colaboradores reuniu 70 estudos e mostrou que a diferença entre os grupos era maior quando as pessoas precisavam recordar sozinhas e menor, mas ainda presente, quando podiam reconhecer o material entre opções. Ou seja, a maneira de perguntar muda o desempenho observado. E o perfil varia entre pessoas: o diagnóstico, sozinho, não diz o que alguém lembra nem de quanta ajuda precisa. [4, 7]',
        more: [
          {
            kind: 'p',
            id: 's5-4a',
            text: 'Os formatos de tarefa têm nomes. Na **recordação livre**, a pessoa produz o conteúdo sem ajuda. Na **recordação com pista**, recebe uma dica, como “era uma fruta”. No **reconhecimento**, decide se algo apresentado estava entre o que aprendeu, como em “era manga ou uva?”. O achado de Aleman compara sobretudo recordar e reconhecer, e não autoriza dizer que o reconhecimento de pessoas com esquizofrenia é intacto. [1, 7]',
          },
          {
            kind: 'p',
            id: 's5-4b',
            text: 'Uma última distinção: encontrar uma diferença numa tarefa é uma coisa; explicar sua causa biológica é outra. Os estudos descrevem em quais tarefas e condições o desempenho muda. Por que isso acontece ainda está sendo investigado, e esse é o assunto do próximo capítulo. [5, 7]',
          },
        ],
      },
    ],
  },
  {
    id: 'c6',
    number: 6,
    title: 'O que se sabe sobre a causa biológica?',
    minutes: 2,
    sections: [
      {
        id: 's6-1',
        lead: 'Os pesquisadores sabem por que essas dificuldades aparecem? Ainda não completamente. Uma linha de investigação olha para os circuitos do pré-frontal, onde neurônios excitatórios, que usam {{glutamato|glutamato}}, e interneurônios inibitórios, que usam principalmente **GABA**, regulam juntos quais células ficam ativas e quando. Alterações nesse equilíbrio são investigadas como possíveis contribuições para as dificuldades de memória de trabalho. [6]',
        more: [
          {
            kind: 'p',
            id: 's6-1a',
            text: 'Cada tipo de estudo responde a uma pergunta diferente. Uma análise de tecido cerebral pode sugerir um mecanismo molecular. Um estudo de imagem pode relacionar a atividade de uma região a um desempenho. Um teste cognitivo mostra em quais condições o desempenho muda. Nenhum deles, sozinho, liga a molécula ao comportamento de uma pessoa. [5, 6]',
          },
        ],
      },
      {
        id: 's6-2',
        lead: 'Por isso, é preciso cuidado ao passar do mecanismo para a pessoa. Saber que {{receptores NMDA|nmda}} participam de uma forma de plasticidade no hipocampo não demonstra que alguém esqueceu algo por uma falha nesses receptores, e a {{ressonância funcional|rmf}} mostra atividade regional, não a quantidade de glutamato numa sinapse. O que se pode afirmar é que mudanças na função e na coordenação de circuitos são investigadas como mecanismos que podem contribuir para as dificuldades observadas. [2, 5, 6]',
      },
      {
        id: 's6-3',
        lead: 'E os remédios? Uma {{meta-análise|meta}} publicada em 2024 encontrou diferenças cognitivas em pessoas no **primeiro episódio psicótico** que ainda não tinham usado antipsicóticos. Isso indica que ao menos parte das dificuldades pode existir antes do tratamento. Há dois limites: o estudo avaliou primeiro episódio psicótico, uma categoria mais ampla que esquizofrenia, e não mede o efeito de um medicamento específico numa pessoa. [8]',
      },
    ],
  },
];

/** Mapa de IDs da versão anterior do texto → IDs atuais (preserva marcações, anotações e marcadores). */
export const legacyPidMap: Record<string, string> = {
  c1p1: 's1-1', c1p2: 's1-2', c1p3: 's1-2a', c1p4: 's1-2b',
  c2p1: 's2-1b', c2p2: 's2-1b', c2p3: 's2-1a', c2p4: 's2-d1', c2p5: 's2-d2', c2p6: 's2-d3', c2p7: 's2-1c',
  c3p1: 's3-1', c3p2: 's3-2a', c3p3: 's3-d1', c3p4: 's3-2', c3p5: 's3-2',
  c4p1: 's4-2', c4p2: 's4-2a', c4p3: 's4-2', c4p4: 's4-2', c4p5: 's4-1', c4p6: 's4-1',
  c5p1: 's5-1', c5p2: 's5-2', c5p3: 's5-3', c5p4: 's5-3a', c5p5: 's5-3b', c5p6: 's5-4a', c5p7: 's5-4', c5p8: 's5-4', c5p9: 's5-4',
  c6p1: 's6-1', c6p2: 's6-1a', c6p3: 's6-2', c6p4: 's6-2', c6p5: 's6-3', c6p6: 's6-3',
  'fig-sinapse': 'fig-sinapse', 'fig-episodica': 'fig-episodica',
};
export const mapLegacyPid = (pid: string) => legacyPidMap[pid] ?? pid;

export interface ParagraphInfo {
  id: string;
  text: string;
  chapter: Chapter;
  sectionId: string;
  layer: Layer;
}

export const allParagraphs: ParagraphInfo[] = chapters.flatMap((c) =>
  c.sections.flatMap((s) => {
    const out: ParagraphInfo[] = [{ id: s.id, text: s.lead, chapter: c, sectionId: s.id, layer: 'lead' }];
    const add = (blocks: Block[] | undefined, layer: Layer) =>
      blocks?.forEach((b) => b.kind === 'p' && out.push({ id: b.id, text: b.text, chapter: c, sectionId: s.id, layer }));
    add(s.more, 'more');
    add(s.deep?.blocks, 'deep');
    return out;
  }),
);

export const getParagraph = (pid: string) => allParagraphs.find((p) => p.id === mapLegacyPid(pid));

/** Trecho (seção) e camada de qualquer bloco: parágrafo, figura ou título de capítulo. */
export function locateBlock(id: string): { chapter: Chapter; sectionId: string | null; layer: Layer | 'heading' } | null {
  const mid = mapLegacyPid(id);
  for (const c of chapters) {
    if (c.id === mid) return { chapter: c, sectionId: c.sections[0].id, layer: 'heading' };
    for (const s of c.sections) {
      if (s.id === mid) return { chapter: c, sectionId: s.id, layer: 'lead' };
      if (s.more?.some((b) => b.id === mid)) return { chapter: c, sectionId: s.id, layer: 'more' };
      if (s.deep?.blocks.some((b) => b.id === mid)) return { chapter: c, sectionId: s.id, layer: 'deep' };
    }
  }
  return null;
}

export const chapterOf = (id: string) => locateBlock(id)?.chapter;

/** Texto como aparece na tela (igual ao textContent renderizado por RichText). */
export function plainText(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\{\{([^|}]+)(\|[^}]*)?\}\}/g, '$1')
    .replace(/\[([\d\s,–-]+)\]/g, (_, ids: string) =>
      ids
        .split(',')
        .flatMap((part) => {
          const r = part.trim().match(/^(\d+)\s*[–-]\s*(\d+)$/);
          if (!r) return [part.trim()];
          const out: string[] = [];
          for (let i = +r[1]; i <= +r[2]; i++) out.push(String(i));
          return out;
        })
        .map((n) => `[${n}]`)
        .join(''),
    );
}
