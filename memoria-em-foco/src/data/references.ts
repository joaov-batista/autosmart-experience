import type { Reference } from './types';

/** Fichas únicas usadas na leitura, nos exercícios, na banca e no ensaio. */
export const references: Reference[] = [
  {
    id: 1,
    short: 'OpenStax, Psychology 2e, seção 8.1',
    citation:
      'Spielman, R. M., Jenkins, W. J., & Lovett, M. D. (2020). Psychology 2e. OpenStax. Seção 8.1, “How Memory Functions”.',
    question: 'O que são codificação, armazenamento e recuperação? Como se distinguem os tipos de memória?',
    originalTitle: 'Psychology 2e — 8.1 How Memory Functions',
    detail: 'Livro-texto aberto de introdução à psicologia.',
    url: 'https://openstax.org/books/psychology-2e/pages/8-1-how-memory-functions',
    supports: [
      'Memória como registrar, conservar e recuperar; codificação, armazenamento e recuperação.',
      'Papel da atenção e da organização na codificação.',
      'Tipos de memória: de trabalho, episódica, semântica e procedural.',
      'Recordação e reconhecimento como formas de avaliar a memória.',
    ],
  },
  {
    id: 2,
    short: 'LTP no hipocampo (Neuroscience, 2024)',
    citation: 'Long-term potentiation in the hippocampus: From magnesium to memory. Neuroscience. DOI 10.1016/j.neuroscience.2024.11.069.',
    question: 'O que muda em uma sinapse durante uma forma de potenciação de longa duração?',
    originalTitle: 'Long-term potentiation in the hippocampus: From magnesium to memory',
    detail: 'Artigo de revisão sobre mecanismos de potenciação de longa duração no hipocampo.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/39615648/',
    extraUrl: { label: 'Leitura complementar: “Activation Mechanisms of the NMDA Receptor” (NCBI Bookshelf)', url: 'https://www.ncbi.nlm.nih.gov/books/NBK5274/' },
    supports: [
      'Comunicação sináptica: neurotransmissor liberado e receptores na célula que recebe.',
      'LTP como aumento persistente da eficácia sináptica.',
      'Glutamato, receptores AMPA e NMDA, bloqueio por magnésio e entrada de cálcio.',
      'Mais receptores AMPA, ou receptores mais eficazes, ampliando a resposta futura.',
    ],
  },
  {
    id: 3,
    short: 'Neurônios de engrama (Molecular Psychiatry, 2023)',
    citation:
      'Engram neurons: Encoding, consolidation, retrieval, and forgetting of memory. Molecular Psychiatry (2023). DOI 10.1038/s41380-023-02137-5.',
    question:
      'Como conjuntos de neurônios participam da formação, estabilização e recuperação de uma memória? (A revisão discute principalmente evidências experimentais em animais.)',
    originalTitle: 'Engram neurons: Encoding, consolidation, retrieval, and forgetting of memory',
    detail: 'Revisão de evidências experimentais, principalmente em modelos animais.',
    url: 'https://doi.org/10.1038/s41380-023-02137-5',
    supports: [
      'Traço de memória (engrama) e reativação durante a recordação.',
      'Consolidação em escala sináptica e de sistemas; interação entre hipocampo e córtex.',
      'Limite: grande parte da evidência para identificar e manipular células de engrama vem de animais.',
    ],
  },
  {
    id: 4,
    short: 'NIMH, Schizophrenia',
    citation: 'National Institute of Mental Health. Schizophrenia. Material institucional.',
    question: 'Quais dificuldades cognitivas podem ocorrer na esquizofrenia e como podem afetar atividades cotidianas?',
    originalTitle: 'Schizophrenia (National Institute of Mental Health)',
    detail: 'Material institucional do Instituto Nacional de Saúde Mental dos EUA.',
    url: 'https://www.nimh.nih.gov/sites/default/files/documents/health/publications/schizophrenia/schizophrenia_1.pdf',
    supports: [
      'Sintomas psicóticos (delírios, alucinações), negativos e cognitivos.',
      'Dificuldades de atenção, aprendizagem e memória e seu impacto no cotidiano.',
      'Variação entre pessoas.',
    ],
  },
  {
    id: 5,
    short: 'Ragland et al. (2015), JAMA Psychiatry',
    citation:
      'Ragland, J. D., et al. (2015). Functional and Neuroanatomic Specificity of Episodic Memory Dysfunction in Schizophrenia: A Functional Magnetic Resonance Imaging Study of the Relational and Item-Specific Encoding Task. JAMA Psychiatry.',
    question: 'O que os pesquisadores observaram ao comparar a aprendizagem de itens e a aprendizagem de relações entre itens?',
    originalTitle:
      'Functional and Neuroanatomic Specificity of Episodic Memory Dysfunction in Schizophrenia: A Functional Magnetic Resonance Imaging Study of the Relational and Item-Specific Encoding Task',
    detail: 'Estudo em humanos (pessoas com esquizofrenia e participantes de comparação) com tarefa de memória e ressonância magnética funcional.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/26200928/',
    supports: [
      'Distinção entre aprender características de itens e aprender relações entre itens.',
      'Dificuldade especialmente grande do grupo com esquizofrenia na aprendizagem relacional.',
      'Diferenças no recrutamento pré-frontal na codificação relacional e do hipocampo na recuperação, em condições específicas.',
      'Limite: a ressonância funcional mede atividade regional, não a quantidade de neurotransmissor numa sinapse.',
    ],
  },
  {
    id: 6,
    short: 'Circuitos pré-frontais na esquizofrenia (revisão)',
    citation: 'Cognitive Dysfunction and Prefrontal Cortical Circuit Alterations in Schizophrenia: Developmental Trajectories. Artigo de revisão (PMC9420748).',
    question:
      'Por que os circuitos pré-frontais são investigados quando se estuda memória de trabalho na esquizofrenia? (A revisão discute mecanismos candidatos e seus limites.)',
    originalTitle: 'Cognitive Dysfunction and Prefrontal Cortical Circuit Alterations in Schizophrenia: Developmental Trajectories',
    detail: 'Artigo de revisão sobre memória de trabalho e mecanismos candidatos em circuitos pré-frontais.',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9420748/',
    supports: [
      'Papel do córtex pré-frontal, incluindo a porção dorsolateral, na memória de trabalho.',
      'Neurônios excitatórios (glutamato) e interneurônios inibitórios (GABA) na coordenação do circuito.',
      'Alterações de circuito como mecanismos candidatos, ainda em investigação.',
    ],
  },
  {
    id: 7,
    short: 'Aleman et al. (1999), meta-análise',
    citation:
      'Aleman, A., Hijman, R., de Haan, E. H. F., & Kahn, R. S. (1999). Memory impairment in schizophrenia: a meta-analysis. American Journal of Psychiatry, 156(9), 1358–1366. DOI 10.1176/ajp.156.9.1358.',
    question: 'Nos 70 estudos reunidos, como variou a diferença entre os grupos nas tarefas de recordação e reconhecimento?',
    originalTitle: 'Memory impairment in schizophrenia: a meta-analysis',
    detail: 'Meta-análise publicada no American Journal of Psychiatry.',
    url: 'https://doi.org/10.1176/ajp.156.9.1358',
    supports: [
      'Reuniu 70 estudos.',
      'Diferença média maior entre os grupos nas tarefas de recordação.',
      'Diferença também significativa, porém menor, no reconhecimento.',
    ],
  },
  {
    id: 8,
    short: 'Primeiro episódio psicótico sem antipsicóticos (JAMA Psychiatry, 2024)',
    citation:
      'Cognitive Function and Variability in Antipsychotic Drug-Naive Patients With First-Episode Psychosis: A Systematic Review and Meta-Analysis. JAMA Psychiatry (2024).',
    question: 'Há evidências de dificuldades cognitivas anteriores ao uso de antipsicóticos em pessoas no primeiro episódio psicótico?',
    originalTitle:
      'Cognitive Function and Variability in Antipsychotic Drug-Naive Patients With First-Episode Psychosis: A Systematic Review and Meta-Analysis',
    detail: 'Revisão sistemática com meta-análise.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/38416480/',
    supports: [
      'Diferenças cognitivas em pessoas no primeiro episódio psicótico que ainda não tinham usado antipsicóticos.',
      'Ao menos parte das dificuldades nessa população pode preceder o tratamento.',
      'Limites: primeiro episódio psicótico é mais amplo que esquizofrenia; não estabelece o efeito de um medicamento específico numa pessoa.',
    ],
  },
];

export const getReference = (id: number) => references.find((r) => r.id === id);
