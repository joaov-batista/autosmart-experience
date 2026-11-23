import type { Reference } from './types';

export const references: Reference[] = [
  {
    id: 1,
    short: 'OpenStax, Psychology 2e, seção 8.1',
    originalTitle: 'Psychology 2e — 8.1 How Memory Functions',
    detail: 'Livro-texto aberto de introdução à psicologia (OpenStax).',
    url: 'https://openstax.org/books/psychology-2e/pages/8-1-how-memory-functions',
    supports: [
      'Definição psicológica de memória: registrar, conservar e recuperar informação.',
      'Codificação, armazenamento e recuperação; papel da atenção na codificação.',
      'Sistemas de memória: de trabalho, episódica, semântica e procedural.',
      'Recordação e reconhecimento como formas de avaliar a memória.',
    ],
  },
  {
    id: 2,
    short: 'Revisão sobre LTP no hipocampo',
    originalTitle: 'Long-term potentiation in the hippocampus: From magnesium to memory',
    detail: 'Artigo de revisão sobre mecanismos de potenciação de longa duração no hipocampo.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/39615648/',
    extraUrl: { label: 'Leitura complementar sobre o canal NMDA (NCBI Bookshelf)', url: 'https://www.ncbi.nlm.nih.gov/books/NBK5274/' },
    supports: [
      'Comunicação sináptica: neurotransmissor liberado e receptores na célula pós-sináptica.',
      'Definição de LTP como aumento persistente da eficácia sináptica.',
      'Papel do glutamato, dos receptores AMPA e NMDA, do bloqueio por magnésio e da entrada de cálcio.',
      'Aumento do número ou da eficácia de receptores AMPA como forma de ampliar a resposta futura.',
    ],
  },
  {
    id: 3,
    short: 'Revisão sobre neurônios de engrama (Molecular Psychiatry, 2023)',
    originalTitle: 'Engram neurons: Encoding, consolidation, retrieval, and forgetting of memory',
    detail: 'Molecular Psychiatry, 2023. Revisão de evidências experimentais, principalmente em modelos animais.',
    url: 'https://doi.org/10.1038/s41380-023-02137-5',
    supports: [
      'Conceito de traço de memória (engrama) e reativação durante a recordação.',
      'Consolidação em escala sináptica e de sistemas; interação entre hipocampo e córtex.',
      'Grande parte da evidência para identificar e manipular células de engrama vem de estudos em animais.',
    ],
  },
  {
    id: 4,
    short: 'NIMH, Schizophrenia',
    originalTitle: 'Schizophrenia (National Institute of Mental Health)',
    detail: 'Material institucional do Instituto Nacional de Saúde Mental dos EUA.',
    url: 'https://www.nimh.nih.gov/sites/default/files/documents/health/publications/schizophrenia/schizophrenia_1.pdf',
    supports: [
      'Sintomas psicóticos (delírios, alucinações), negativos e cognitivos.',
      'Dificuldades cognitivas, como atenção, aprendizagem e memória, e impacto no cotidiano.',
      'Variação entre pessoas.',
    ],
  },
  {
    id: 5,
    short: 'Ragland et al. (2015), JAMA Psychiatry — tarefa RiSE com ressonância funcional',
    originalTitle:
      'Functional and Neuroanatomic Specificity of Episodic Memory Dysfunction in Schizophrenia: A Functional Magnetic Resonance Imaging Study of the Relational and Item-Specific Encoding Task',
    detail: 'Estudo em humanos (pessoas com esquizofrenia e participantes de comparação) com tarefa de memória e ressonância magnética funcional.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/26200928/',
    supports: [
      'Distinção entre aprender características de itens e aprender relações entre itens.',
      'Dificuldade particularmente importante do grupo com esquizofrenia na aprendizagem relacional.',
      'Diferenças no recrutamento pré-frontal durante a codificação relacional e do hipocampo durante a recuperação, em condições específicas da tarefa.',
      'Limite: a ressonância funcional mede atividade regional associada à tarefa, não a quantidade de neurotransmissor numa sinapse.',
    ],
  },
  {
    id: 6,
    short: 'Revisão sobre circuitos pré-frontais na esquizofrenia',
    originalTitle: 'Cognitive Dysfunction and Prefrontal Cortical Circuit Alterations in Schizophrenia: Developmental Trajectories',
    detail: 'Artigo de revisão sobre memória de trabalho e mecanismos candidatos em circuitos pré-frontais.',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9420748/',
    supports: [
      'Papel do córtex pré-frontal (incluindo a porção dorsolateral) na memória de trabalho.',
      'Neurônios excitatórios (glutamato) e interneurônios inibitórios (GABA) na coordenação do circuito.',
      'Alterações de circuito investigadas como mecanismos candidatos das dificuldades cognitivas.',
    ],
  },
  {
    id: 7,
    short: 'Aleman et al. (1999), meta-análise',
    originalTitle: 'Memory impairment in schizophrenia: a meta-analysis',
    detail: 'Aleman, A., Hijman, R., de Haan, E. H. F., & Kahn, R. S. American Journal of Psychiatry, 156(9), 1358–1366.',
    url: 'https://doi.org/10.1176/ajp.156.9.1358',
    supports: [
      'Meta-análise que reuniu 70 estudos.',
      'Diferença média maior entre os grupos nas tarefas de recordação.',
      'Diferença também significativa, porém menor, no reconhecimento.',
    ],
  },
  {
    id: 8,
    short: 'JAMA Psychiatry (2024), primeiro episódio psicótico sem antipsicóticos',
    originalTitle:
      'Cognitive Function and Variability in Antipsychotic Drug-Naive Patients With First-Episode Psychosis: A Systematic Review and Meta-Analysis',
    detail: 'Revisão sistemática com meta-análise, JAMA Psychiatry, 2024.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/38416480/',
    supports: [
      'Diferenças cognitivas em pessoas no primeiro episódio psicótico que ainda não tinham usado antipsicóticos.',
      'Ao menos parte das dificuldades nessa população pode preceder o tratamento.',
      'Limites: primeiro episódio psicótico é mais amplo que esquizofrenia; não estabelece o efeito de um medicamento específico em uma pessoa.',
    ],
  },
];

export const getReference = (id: number) => references.find((r) => r.id === id);
