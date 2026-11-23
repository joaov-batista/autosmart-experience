import type { Reference } from './types';

/**
 * Fichas únicas usadas na leitura, nos exercícios, na banca e no ensaio.
 * Numeração da versão atual do texto ([1]–[11]). OpenStax, Ragland, Aleman e a revisão sobre
 * circuitos pré-frontais reaproveitam os registros que já existiam.
 */
export const references: Reference[] = [
  {
    id: 1,
    short: 'OpenStax, Psychology 2e, seção 8.1',
    citation: 'Spielman, R. M., Jenkins, W. J., & Lovett, M. D. (2020). Psychology 2e. OpenStax. Seção 8.1, “How Memory Functions”.',
    question: 'O que são codificação, armazenamento e recuperação? Como recordação e reconhecimento se diferenciam?',
    originalTitle: 'Psychology 2e — 8.1 How Memory Functions',
    detail: 'Livro-texto aberto de introdução à psicologia.',
    url: 'https://openstax.org/books/psychology-2e/pages/8-1-how-memory-functions',
    supports: [
      'Conceitos e processos de memória: codificar, armazenar e recuperar.',
      'Recordação livre, recordação com pista e reconhecimento.',
    ],
  },
  {
    id: 2,
    short: 'Comprometimento cognitivo na esquizofrenia (revisão)',
    citation: 'Cognitive impairment in schizophrenia: aetiology, pathophysiology, and treatment. Artigo de revisão (PMC10575791).',
    question: 'Quais dificuldades cognitivas aparecem na esquizofrenia, quando surgem e quais mecanismos são investigados?',
    originalTitle: 'Cognitive impairment in schizophrenia: aetiology, pathophysiology, and treatment',
    detail: 'Revisão sobre cognição, evolução ao longo do tempo e mecanismos.',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10575791/',
    supports: [
      'Memória de trabalho como uma das funções afetadas.',
      'Dificuldades cognitivas em parte das pessoas antes do primeiro episódio psicótico e em momentos sem sintomas psicóticos.',
      'Dopamina, glutamato e receptores NMDA como mecanismos investigados, não como explicação individual estabelecida.',
    ],
  },
  {
    id: 3,
    short: 'Circuitos pré-frontais e memória de trabalho (revisão)',
    citation: 'Cognitive Dysfunction and Prefrontal Cortical Circuit Alterations in Schizophrenia: Developmental Trajectories. Artigo de revisão (PubMed 35568522).',
    question: 'Como o córtex pré-frontal sustenta uma informação ativa, e que alterações de circuito são investigadas na esquizofrenia?',
    originalTitle: 'Cognitive Dysfunction and Prefrontal Cortical Circuit Alterations in Schizophrenia: Developmental Trajectories',
    detail: 'Revisão sobre memória de trabalho e circuitos pré-frontais.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/35568522/',
    supports: [
      'Grupos de neurônios pré-frontais trocam sinais para sustentar a atividade que representa uma informação.',
      'Menos espinhas dendríticas em certos neurônios pré-frontais, em média, em estudos de tecido.',
      'Hipótese: alterações nesses pontos de contato dificultam sustentar a atividade do grupo.',
    ],
  },
  {
    id: 4,
    short: 'Ragland et al. (2015), JAMA Psychiatry',
    citation:
      'Ragland, J. D., et al. (2015). Functional and Neuroanatomic Specificity of Episodic Memory Dysfunction in Schizophrenia: A Functional Magnetic Resonance Imaging Study of the Relational and Item-Specific Encoding Task. JAMA Psychiatry.',
    question: 'O que acontece quando a tarefa exige aprender relações entre objetos, e não só suas características?',
    originalTitle: 'Functional and Neuroanatomic Specificity of Episodic Memory Dysfunction in Schizophrenia',
    detail: 'Estudo em humanos com tarefa de memória e ressonância magnética funcional.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/26200928/',
    supports: [
      'Dificuldade particularmente importante do grupo com esquizofrenia na condição relacional.',
      'Menor ativação de uma região pré-frontal durante a aprendizagem relacional; diferenças na resposta do hipocampo em um teste posterior.',
      'Limite: a imagem mostra em que condição a resposta cerebral diferiu; não conta sinapses nem prova a causa.',
    ],
  },
  {
    id: 5,
    short: 'Patologia sináptica em tecido cerebral (meta-análise)',
    citation: 'Synapse Pathology in Schizophrenia: A Meta-analysis of Postsynaptic Elements in Postmortem Brain Studies. (PubMed 31192350).',
    question: 'O que estudos de tecido cerebral humano encontraram sobre estruturas pós-sinápticas na esquizofrenia?',
    originalTitle: 'Synapse Pathology in Schizophrenia: A Meta-analysis of Postsynaptic Elements in Postmortem Brain Studies',
    detail: 'Meta-análise de estudos post mortem.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/31192350/',
    supports: [
      'Menor densidade de estruturas pós-sinápticas, especialmente em algumas regiões do córtex.',
      'Achados em tecido humano, que não medem diretamente o desempenho de memória de cada pessoa.',
    ],
  },
  {
    id: 6,
    short: 'Gold et al. (2000), aprender e esquecer',
    citation: 'Gold, J. M., et al. (2000). Learning and forgetting in schizophrenia. (PubMed 11016123).',
    question: 'A diferença aparece na aprendizagem inicial ou num esquecimento mais rápido?',
    originalTitle: 'Learning and forgetting in schizophrenia',
    detail: 'Estudo com 76 pessoas com esquizofrenia e 51 participantes sem o transtorno.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/11016123/',
    supports: [
      'Histórias e figuras avaliadas logo depois e após um intervalo.',
      'Comparando pessoas com a mesma recordação inicial, o desempenho posterior foi praticamente igual.',
      'Naquele estudo, boa parte da diferença surgiu na aprendizagem inicial; outras tarefas podem dar resultados diferentes.',
    ],
  },
  {
    id: 7,
    short: 'Aleman et al. (1999), meta-análise',
    citation:
      'Aleman, A., Hijman, R., de Haan, E. H. F., & Kahn, R. S. (1999). Memory impairment in schizophrenia: a meta-analysis. American Journal of Psychiatry, 156(9), 1358–1366. DOI 10.1176/ajp.156.9.1358.',
    question: 'Nos 70 estudos reunidos, como variou a diferença entre os grupos em recordação e reconhecimento?',
    originalTitle: 'Memory impairment in schizophrenia: a meta-analysis',
    detail: 'Meta-análise publicada no American Journal of Psychiatry.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/10484945/',
    supports: ['Reuniu 70 estudos.', 'Diferença média maior na recordação; menor, mas presente, no reconhecimento.'],
  },
  {
    id: 8,
    short: 'Alucinações e processamento de sons externos',
    citation:
      'Change in the Neural Response to Auditory Deviance Following Cognitive Therapy for Hallucinations in Patients With Schizophrenia. (PMC7304235).',
    question: 'Experiências auditivas internas interagem com o processamento de sons externos?',
    originalTitle: 'Change in the Neural Response to Auditory Deviance Following Cognitive Therapy for Hallucinations in Patients With Schizophrenia',
    detail: 'Estudo sobre resposta cerebral a sons em pessoas com alucinações auditivas.',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7304235/',
    supports: ['Interação entre experiências auditivas internas e o processamento de sons externos, base para entender como uma voz pode desviar a atenção numa conversa.'],
  },
  {
    id: 9,
    short: 'Sellgren et al. (2019), poda sináptica em modelos celulares',
    citation:
      'Sellgren, C. M., et al. (2019). Increased synapse elimination by microglia in schizophrenia patient-derived models of synaptic pruning. (PubMed 30718903).',
    question: 'O que acontece com a remoção de material sináptico em modelos celulares derivados de pessoas com esquizofrenia?',
    originalTitle: 'Increased synapse elimination by microglia in schizophrenia patient-derived models of synaptic pruning',
    detail: 'Estudo experimental em modelos celulares (laboratório).',
    url: 'https://pubmed.ncbi.nlm.nih.gov/30718903/',
    supports: [
      'Mais material sináptico englobado por micróglias nos modelos derivados do grupo com esquizofrenia.',
      'Fatores do sistema complemento explicaram parte da diferença.',
      'Limite: não mostra quanto a poda explica diferenças em pessoas vivas nem uma dificuldade de memória específica.',
    ],
  },
  {
    id: 10,
    short: 'Monitoramento da fonte e psicose (meta-análise)',
    citation: 'Understanding source monitoring subtypes and their relation to psychosis: a systematic review and meta-analysis. (PubMed 35124869).',
    question: 'Dificuldades para identificar a origem de uma informação estão associadas a experiências psicóticas?',
    originalTitle: 'Understanding source monitoring subtypes and their relation to psychosis: a systematic review and meta-analysis',
    detail: 'Revisão sistemática com meta-análise.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/35124869/',
    supports: ['Associação entre dificuldades de memória da fonte e algumas experiências alucinatórias, sem explicação universal para ouvir vozes.'],
  },
  {
    id: 11,
    short: 'Subsistemas de dopamina na esquizofrenia (meta-análise de PET)',
    citation: 'Resolving the heterogeneity of dopamine subsystems dysfunction in schizophrenia: a PET meta-analysis. Schizophrenia (npj, Nature Portfolio), 2025.',
    question: 'O que a evidência permite, e não permite, afirmar sobre dopamina em regiões específicas do cérebro?',
    originalTitle: 'Resolving the heterogeneity of dopamine subsystems dysfunction in schizophrenia: a PET meta-analysis',
    detail: 'Meta-análise de estudos de tomografia por emissão de pósitrons (PET).',
    url: 'https://www.nature.com/articles/s41537-025-00684-0',
    supports: ['Evidências e limites das afirmações sobre dopamina regional; não sustenta “falta dopamina no pré-frontal, por isso a pessoa esquece” como explicação individual.'],
  },
];

export const getReference = (id: number) => references.find((r) => r.id === id);
