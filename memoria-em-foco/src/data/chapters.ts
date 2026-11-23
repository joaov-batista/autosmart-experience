import type { Block, Chapter, Layer } from './types';

/**
 * Texto de estudo: um único capítulo em dois modos.
 *  - Resumido: só os parágrafos `lead` (cerca de 2 minutos, explicação completa).
 *  - Completo: o mesmo `lead`, seguido de `more` (seções com subtítulo em forma de pergunta)
 *    e, quando necessário, `deep` (“Aprofundar”).
 * Cena única ao longo do capítulo: “Ana colocou a batata na sacola azul”.
 * IDs (m1, m2a…) são estáveis: marcações, anotações, revisão e exercícios apontam para eles.
 */
export const chapters: Chapter[] = [
  {
    id: 'c1',
    number: 1,
    title: 'Memória em pessoas com esquizofrenia',
    minutes: 9,
    sections: [
      {
        id: 'm1',
        title: 'Registrar, conservar, recuperar',
        lead: 'A memória permite registrar informações, conservá-las e recuperá-las. Registrar é **codificar**. Conservar é **armazenar**. Recuperar é conseguir acessar depois o que foi aprendido. Quando alguém diz ‘esqueci’, essa palavra sozinha não revela em qual desses momentos surgiu a dificuldade. [1]',
      },
      {
        id: 'm2',
        title: 'Manter uma informação ativa',
        lead: 'Na esquizofrenia, uma das funções que pode exigir mais esforço é a **memória de trabalho**. Ela mantém uma informação disponível enquanto a usamos. Na frase ‘Ana colocou a batata na sacola azul’, é preciso manter ‘Ana’ em mente até entender o que ela fez. [2, 3]',
        more: [
          { kind: 'h', id: 'm2-h', text: 'Como uma informação fica ativa?' },
          {
            kind: 'p',
            id: 'm2a',
            text: 'Quando alguém termina de dizer ‘Ana’, o som acaba. Mesmo assim, você consegue manter o nome disponível por alguns segundos. Uma das maneiras pelas quais o cérebro faz isso envolve grupos de neurônios que trocam sinais entre si. Essa troca ajuda a sustentar a atividade que representa a informação enquanto a frase continua. A comunicação ocorre nas **sinapses**, pontos de contato entre células. [3]',
          },
          {
            kind: 'p',
            id: 'm2b',
            text: 'Em estudos de tecido cerebral, pesquisadores encontraram menos **espinhas dendríticas** em certos neurônios do {{córtex pré-frontal|cortex-pre-frontal}} de pessoas com esquizofrenia, em média. Espinhas dendríticas são pequenas projeções que recebem muitos dos sinais de outras células. Uma hipótese é que alterações nesses pontos de contato tornem mais difícil sustentar a atividade do grupo. Isso ajuda a entender o sentido de ‘a informação ficou menos disponível’. A evidência não permite dizer que todo esquecimento ocorreu porque faltou uma sinapse. [3, 5]',
          },
        ],
      },
      {
        id: 'm3',
        title: 'Montar e recuperar um episódio',
        lead: 'Outra função importante é a **memória episódica**. Para contar amanhã o que aconteceu, precisamos ligar a pessoa, a ação e o lugar. Estudos mostram que pessoas com esquizofrenia podem ter dificuldade principalmente para aprender essas relações. Assim, alguém pode reconhecer a sacola azul, mas ter dúvida sobre quem colocou a batata nela. [4]',
        more: [
          { kind: 'h', id: 'm3-h', text: 'Como o cérebro monta um episódio?' },
          {
            kind: 'p',
            id: 'm3a',
            text: 'Para formar um episódio, o cérebro precisa representar tanto os elementos quanto a ligação entre eles. Saber quem é Ana e reconhecer uma sacola azul são duas informações. Lembrar que foi Ana quem usou aquela sacola naquela ocasião exige uma terceira coisa: ter aprendido a relação. O córtex pré-frontal participa da organização da informação durante a aprendizagem. O {{hipocampo|hipocampo}} participa de associar os elementos e recuperar seu contexto. [4]',
          },
          {
            kind: 'note',
            id: 'm3-nota',
            text: 'A pode ficar difícil de manter antes de B chegar. Também é possível ter A e B disponíveis e, mesmo assim, ter dificuldade para aprender a relação entre elas. São duas operações diferentes.',
          },
          { kind: 'figure', id: 'fig-episodica', figure: 'episodic' },
          {
            kind: 'p',
            id: 'm3b',
            text: 'Ragland e colaboradores compararam tarefas em que os participantes estudavam características de objetos e tarefas em que estudavam relações entre objetos; as tarefas foram feitas durante uma {{ressonância magnética funcional|rmf}}. O grupo com esquizofrenia teve dificuldade particularmente importante na condição relacional. Nessa condição, também houve menor ativação de uma região pré-frontal durante a aprendizagem. Durante um dos testes posteriores, os pesquisadores encontraram diferenças na resposta do hipocampo. A imagem mostra em qual condição a resposta cerebral diferiu. Ela não conta sinapses nem identifica sozinha a causa da diferença. [4]',
          },
          { kind: 'h', id: 'm3-h2', text: 'A pessoa esqueceu depressa ou já tinha aprendido menos?' },
          {
            kind: 'p',
            id: 'm3c',
            text: 'Gold e colaboradores compararam 76 pessoas com esquizofrenia e 51 participantes sem o transtorno. Os participantes aprenderam histórias e figuras e foram avaliados logo depois e após um intervalo. Quando os pesquisadores compararam pessoas que tinham lembrado a mesma quantidade no primeiro momento, o desempenho posterior foi praticamente igual. [6]',
          },
          {
            kind: 'p',
            id: 'm3d',
            text: 'Por que essa comparação importa? Imagine que uma pessoa lembre inicialmente seis detalhes e outra lembre três. Se, amanhã, a segunda lembrar menos, esse resultado sozinho não prova que esqueceu mais depressa. Para investigar a velocidade do esquecimento, é preciso considerar quanto cada pessoa aprendeu no início. Naquele estudo, boa parte da diferença surgiu na aprendizagem inicial. Outras tarefas e outras pessoas podem apresentar resultados diferentes. [6]',
          },
          { kind: 'figure', id: 'fig-gold', figure: 'gold' },
          { kind: 'h', id: 'm3-h3', text: 'Por que reconhecer pode ser mais fácil do que recordar?' },
          {
            kind: 'p',
            id: 'm3e',
            text: '‘Conte o que aconteceu’ exige **recordação livre**. ‘Havia uma sacola; quem a trouxe?’ oferece uma {{pista|recordacao-com-pista}}. ‘Você viu esta sacola?’ pede **reconhecimento**. Na terceira pergunta, a sensação de **familiaridade** pode ajudar. Já perguntar ‘qual destas pessoas trouxe a sacola?’ oferece opções, mas ainda exige lembrar uma relação. Por isso, vale observar tanto a ajuda oferecida quanto a informação que a pergunta exige. [1, 4]',
          },
          {
            kind: 'p',
            id: 'm3f',
            text: 'Uma {{meta-análise|meta}} de Aleman e colaboradores reuniu 70 estudos. A diferença média entre os grupos foi maior em tarefas de recordação. No reconhecimento, também houve diferença, mas ela foi menor. Portanto, pistas e opções podem ajudar em algumas situações. A necessidade de ajuda varia. [7]',
          },
        ],
      },
      {
        id: 'm4',
        title: 'Circuitos: o que se sabe e o que é hipótese',
        lead: 'O **córtex pré-frontal** ajuda a manter e organizar informações. O **hipocampo** participa da formação e recuperação das relações que compõem um episódio. Pesquisadores encontraram diferenças na atividade dessas regiões durante certas tarefas e diferenças nas conexões de alguns circuitos. Ainda se investiga quanto cada alteração contribui para a dificuldade de cada pessoa. [3, 4, 5]',
        more: [
          { kind: 'h', id: 'm4-h', text: 'Por que pode haver menos pontos de contato?' },
          {
            kind: 'p',
            id: 'm4a',
            text: 'Durante o desenvolvimento, o cérebro forma conexões e elimina parte delas. Esse processo é chamado de **poda sináptica**. Células chamadas **micróglias** participam da remoção de material de algumas sinapses. Em um experimento com células derivadas de pessoas com e sem esquizofrenia, os pesquisadores observaram mais material sináptico sendo englobado nos modelos do primeiro grupo. Fatores ligados a um sistema de marcação chamado **complemento** explicaram parte da diferença observada. [9]',
          },
          {
            kind: 'p',
            id: 'm4b',
            text: 'O que foi observado diretamente? Maior remoção de material no modelo de laboratório. O que também foi observado em humanos? Estudos de tecido cerebral encontraram menor densidade de estruturas pós-sinápticas, especialmente em algumas regiões do córtex. O que continua em investigação? Quanto a poda explica essas diferenças em pessoas vivas e quanto elas contribuem para cada dificuldade de memória. [5, 9]',
          },
        ],
      },
      {
        id: 'm5',
        title: 'Alucinações e memória',
        lead: 'Uma **alucinação** também pode interferir em uma conversa ao desviar a atenção. Isso pode dificultar o registro do que foi dito naquele momento. [8] As dificuldades de memória, porém, também podem aparecer sem alucinações e, em algumas pessoas, já são observadas antes do **primeiro episódio psicótico**. [2]',
        more: [
          { kind: 'h', id: 'm5-h', text: 'Qual é o papel das alucinações?' },
          {
            kind: 'p',
            id: 'm5a',
            text: 'Se uma voz chama a atenção da pessoa no instante em que alguém diz ‘sacola azul’, a cor pode ser registrada com pouca clareza. A pessoa nem precisa lembrar depois o que a voz dizia: a interferência pode ocorrer no momento em que a atenção é desviada. Isso explica uma maneira pela qual uma alucinação pode afetar aquela conversa. [8] A {{esquizofrenia|esquizofrenia}} também pode envolver dificuldades cognitivas em momentos sem alucinações. Estudos identificam dificuldades em parte das pessoas antes do primeiro episódio psicótico. [2]',
          },
        ],
        deep: {
          question: 'Memória da fonte, dopamina e receptores NMDA',
          blocks: [
            {
              kind: 'p',
              id: 'm5-d1',
              text: '**Memória da fonte** é lembrar de onde veio uma informação: eu vi, ouvi alguém contar ou imaginei? Dificuldades nessa identificação estão associadas a algumas experiências alucinatórias. A associação não estabelece uma explicação universal para ouvir vozes. [10]',
            },
            {
              kind: 'p',
              id: 'm5-d2',
              text: '**Dopamina**, **glutamato** e {{receptores NMDA|nmda}} são investigados como possíveis participantes das alterações cognitivas. Evite frases como ‘falta dopamina no pré-frontal, por isso a pessoa esquece’. A evidência não sustenta essa cadeia como explicação individual. [2, 11]',
            },
          ],
        },
      },
    ],
  },
];

/**
 * IDs de versões anteriores do texto → IDs atuais.
 * v1 (c1p1…) → v2 (s1-1…) → v3 (m1…). Preserva marcações, anotações, marcadores e posição.
 */
const v1ToV2: Record<string, string> = {
  c1p1: 's1-1', c1p2: 's1-2', c1p3: 's1-2a', c1p4: 's1-2b',
  c2p1: 's2-1b', c2p2: 's2-1b', c2p3: 's2-1a', c2p4: 's2-d1', c2p5: 's2-d2', c2p6: 's2-d3', c2p7: 's2-1c',
  c3p1: 's3-1', c3p2: 's3-2a', c3p3: 's3-d1', c3p4: 's3-2', c3p5: 's3-2',
  c4p1: 's4-2', c4p2: 's4-2a', c4p3: 's4-2', c4p4: 's4-2', c4p5: 's4-1', c4p6: 's4-1',
  c5p1: 's5-1', c5p2: 's5-2', c5p3: 's5-3', c5p4: 's5-3a', c5p5: 's5-3b', c5p6: 's5-4a', c5p7: 's5-4', c5p8: 's5-4', c5p9: 's5-4',
  c6p1: 's6-1', c6p2: 's6-1a', c6p3: 's6-2', c6p4: 's6-2', c6p5: 's6-3', c6p6: 's6-3',
};
const v2ToV3: Record<string, string> = {
  's1-1': 'm1', 's1-1a': 'm1', 's1-2': 'm2a', 's1-2a': 'm2a', 's1-2b': 'm2a',
  's2-1': 'm2a', 's2-1a': 'm2a', 's2-1b': 'm2a', 's2-1c': 'm4b', 's2-d1': 'm5-d2', 's2-d2': 'm5-d2', 's2-d3': 'm5-d2',
  's3-1': 'm3a', 's3-2': 'm1', 's3-2a': 'm1', 's3-d1': 'm1',
  's4-1': 'm2', 's4-1a': 'm1', 's4-2': 'm4', 's4-2a': 'm3a', 's4-2b': 'm4',
  's5-1': 'm5', 's5-2': 'm2', 's5-3': 'm3', 's5-3a': 'm3b', 's5-3b': 'm3e', 's5-4': 'm3f', 's5-4a': 'm3e', 's5-4b': 'm4',
  's6-1': 'm4', 's6-1a': 'm4', 's6-2': 'm4b', 's6-3': 'm5',
  c2: 'm2', c3: 'm1', c4: 'm3', c5: 'm3', c6: 'm4',
  'fig-comparar': 'm2a', 'fig-sinapse': 'm2a', 'fig-episodica': 'fig-episodica', fim: 'fim',
};
export const mapLegacyPid = (pid: string) => {
  const v2 = v1ToV2[pid] ?? pid;
  return v2ToV3[v2] ?? v2;
};

export interface ParagraphInfo {
  id: string;
  text: string;
  chapter: Chapter;
  sectionId: string;
  sectionTitle: string;
  layer: Layer;
}

export const allParagraphs: ParagraphInfo[] = chapters.flatMap((c) =>
  c.sections.flatMap((s) => {
    const base = { chapter: c, sectionId: s.id, sectionTitle: s.title };
    const out: ParagraphInfo[] = [{ id: s.id, text: s.lead, layer: 'lead', ...base }];
    const add = (blocks: Block[] | undefined, layer: Layer) =>
      blocks?.forEach((b) => b.kind === 'p' && out.push({ id: b.id, text: b.text, layer, ...base }));
    add(s.more, 'more');
    add(s.deep?.blocks, 'deep');
    return out;
  }),
);

export const getParagraph = (pid: string) => allParagraphs.find((p) => p.id === mapLegacyPid(pid));

/** Trecho (seção) e camada de qualquer bloco: parágrafo, subtítulo, nota, figura ou título. */
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
export const sectionOf = (id: string) => {
  const loc = locateBlock(id);
  return loc?.sectionId ? loc.chapter.sections.find((s) => s.id === loc.sectionId) : undefined;
};

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
