import type { GlossaryEntry } from './types';
import { normalize } from '../utils';

/** Definições curtas, fiéis ao texto de estudo. `pid` aponta o parágrafo onde o termo é apresentado. */
export const glossary: GlossaryEntry[] = [
  { key: 'plasticidade-neural', term: 'Plasticidade neural', pid: 's1-2', definition: 'Capacidade do sistema nervoso de se modificar com a atividade e com a experiência.' },
  { key: 'engrama', term: 'Traço de memória (engrama)', pid: 's1-2a', aliases: ['traço de memória', 'engrama'], definition: 'Modificações físicas duradouras associadas a uma experiência que contribuem para sua recuperação posterior. Pode envolver conjuntos de células e mudanças nas conexões entre elas.' },
  { key: 'neuronio', term: 'Neurônio', pid: 's2-1b', definition: 'Célula do sistema nervoso que recebe, integra e transmite sinais.' },
  { key: 'sinapse', term: 'Sinapse', pid: 's2-1', aliases: ['sinapses'], definition: 'Região de comunicação entre células. Na sinapse química, o neurônio pré-sináptico libera neurotransmissores que se ligam a receptores da célula pós-sináptica.' },
  { key: 'neurotransmissor', term: 'Neurotransmissor', pid: 's2-1b', aliases: ['neurotransmissores'], definition: 'Molécula liberada pela terminação pré-sináptica que atravessa a fenda e leva o sinal químico até a célula pós-sináptica. Exemplos: glutamato, GABA.' },
  { key: 'receptor', term: 'Receptor', pid: 's2-1b', aliases: ['receptores'], definition: 'Proteína na célula pós-sináptica cuja ativação modifica a resposta dessa célula. O neurotransmissor leva o sinal; o receptor responde a ele.' },
  { key: 'ltp', term: 'Potenciação de longa duração (LTP)', pid: 's2-1', aliases: ['potenciação de longa duração', 'LTP'], definition: 'Aumento persistente da eficácia da comunicação entre dois neurônios: depois de certos padrões de atividade, um estímulo comparável produz uma resposta pós-sináptica maior.' },
  { key: 'hipocampo', term: 'Hipocampo', pid: 's4-2', definition: 'Estrutura na porção medial do lobo temporal. Participa da formação de memórias episódicas e da representação de relações entre os elementos de uma experiência; também é um local clássico de estudo da LTP.' },
  { key: 'glutamato', term: 'Glutamato', pid: 's2-d1', definition: 'Neurotransmissor das sinapses excitatórias. Pode atuar sobre receptores AMPA e NMDA.' },
  { key: 'ampa', term: 'Receptor AMPA', pid: 's2-d1', aliases: ['AMPA'], definition: 'Tipo de receptor de glutamato. Sua ativação contribui para a despolarização. Mais receptores AMPA, ou receptores mais eficazes, podem ampliar a resposta futura da sinapse.' },
  { key: 'nmda', term: 'Receptor NMDA', pid: 's2-d2', aliases: ['NMDA'], definition: 'Tipo de receptor de glutamato cujo canal fica bloqueado por magnésio perto do repouso. Com glutamato e despolarização suficiente, o bloqueio pode ser aliviado e o canal permite a entrada de cálcio.' },
  { key: 'despolarizacao', term: 'Despolarização', pid: 's2-d1', definition: 'Mudança na diferença de carga elétrica através da membrana do neurônio.' },
  { key: 'codificacao', term: 'Codificação', pid: 's3-1', definition: 'Processamento inicial que permite formar uma representação da experiência. Influenciada pela atenção e pela organização da informação.' },
  { key: 'consolidacao', term: 'Consolidação', pid: 's3-2a', definition: 'Processos pelos quais uma representação inicialmente vulnerável se estabiliza e se reorganiza, em escala sináptica e de sistemas cerebrais.' },
  { key: 'armazenamento', term: 'Armazenamento', pid: 's3-2', definition: 'Retenção da informação ao longo do tempo.' },
  { key: 'recuperacao', term: 'Recuperação', pid: 's3-2', definition: 'Acesso posterior ao que foi aprendido. Depende também das condições oferecidas no momento de lembrar.' },
  { key: 'cortex-pre-frontal', term: 'Córtex pré-frontal', pid: 's4-2', definition: 'Região que participa do controle da atividade mental conforme os objetivos da tarefa: selecionar o relevante, organizar a informação na aprendizagem e orientar a busca na recuperação.' },
  { key: 'dorsolateral', term: 'Dorsolateral (córtex pré-frontal)', pid: 's4-2b', aliases: ['dorsolateral'], definition: 'Porção do córtex pré-frontal especialmente estudada em tarefas que exigem organização, controle e manipulação da informação.' },
  { key: 'memoria-de-trabalho', term: 'Memória de trabalho', pid: 's4-1', aliases: ['na memória de trabalho'], definition: 'Mantém informações temporariamente disponíveis para orientar uma operação em andamento.' },
  { key: 'memoria-episodica', term: 'Memória episódica', pid: 's4-1', aliases: ['na memória episódica'], definition: 'Permite recuperar acontecimentos vividos e seus contextos.' },
  { key: 'memoria-semantica', term: 'Memória semântica', pid: 's4-1a', definition: 'Sustenta conhecimentos e significados que podem ser usados independentemente da ocasião em que foram aprendidos.' },
  { key: 'memoria-procedural', term: 'Memória procedural', pid: 's4-1a', definition: 'Participa da aquisição e execução de habilidades.' },
  { key: 'esquizofrenia', term: 'Esquizofrenia', pid: 's5-1', definition: 'Transtorno mental que pode envolver sintomas psicóticos (como delírios e alucinações), sintomas negativos e dificuldades cognitivas.' },
  { key: 'rmf', term: 'Ressonância magnética funcional', pid: 's5-3a', definition: 'Técnica de imagem que examina a atividade de regiões cerebrais associada a uma tarefa. Não mede diretamente a quantidade de neurotransmissor em uma sinapse.' },
  { key: 'familiaridade', term: 'Familiaridade', pid: 's5-3b', definition: 'Sensação de já ter encontrado algo, sem necessariamente recuperar o contexto.' },
  { key: 'recordacao-contextual', term: 'Recordação contextual', pid: 's5-3b', definition: 'Recuperação de detalhes da experiência anterior, como onde, quando e com quais outros elementos algo apareceu.' },
  { key: 'recordacao-livre', term: 'Recordação livre', pid: 's5-4a', definition: 'Forma de avaliação em que a pessoa precisa produzir o conteúdo aprendido sem receber opções.' },
  { key: 'recordacao-com-pista', term: 'Recordação com pista', pid: 's5-4a', definition: 'Forma de avaliação em que a pessoa recebe uma ajuda para orientar a busca, mas ainda precisa produzir a resposta.' },
  { key: 'reconhecimento', term: 'Reconhecimento', pid: 's5-4a', definition: 'Forma de avaliação em que a pessoa decide se algo apresentado corresponde ao que aprendeu.' },
  { key: 'meta', term: 'Meta-análise', pid: 's5-4', definition: 'Método que combina estatisticamente os resultados de vários estudos sobre a mesma questão.' },
  { key: 'gaba', term: 'GABA', pid: 's6-1', definition: 'Principal neurotransmissor usado pelos interneurônios inibitórios. A inibição ajuda a regular quando e quais células ficam ativas.' },
  { key: 'pep', term: 'Primeiro episódio psicótico', pid: 's6-3', definition: 'Primeira ocorrência de sintomas psicóticos. É uma categoria mais ampla do que esquizofrenia.' },
];

const index = new Map<string, GlossaryEntry>();
for (const g of glossary) {
  index.set(normalize(g.key), g);
  index.set(normalize(g.term), g);
  g.aliases?.forEach((a) => index.set(normalize(a), g));
}

/** Procura pelo key, pelo termo ou por um alias (sem acento, sem maiúsculas). */
export const findTerm = (s: string) => index.get(normalize(s));
