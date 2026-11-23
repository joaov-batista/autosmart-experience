import type { Reference } from './types';

export const references: Reference[] = [
  {
    id: 1,
    short: 'OpenStax, Psychology 2e (2020), seção 8.1',
    citation:
      'Spielman, R. M., Jenkins, W. J., & Lovett, M. D. (2020). Psychology 2e. OpenStax. Seção 8.1, “How Memory Functions”.',
    originalTitle: 'Psychology 2e — 8.1 How Memory Functions',
    url: 'https://openstax.org/books/psychology-2e/pages/8-1-how-memory-functions',
    supports: [
      'Definição de memória e dos processos de codificação, armazenamento e recuperação.',
      'Papel da atenção no que conseguimos codificar.',
      'Sistemas de memória: de trabalho, episódica, semântica e procedural.',
      'Formas de recuperação: recordação, reconhecimento e uso de pistas.',
    ],
  },
  {
    id: 2,
    short: 'NIMH, Schizophrenia',
    citation: 'National Institute of Mental Health. Schizophrenia. Material institucional (NIH).',
    originalTitle: 'Schizophrenia (National Institute of Mental Health)',
    url: 'https://www.nimh.nih.gov/sites/default/files/documents/health/publications/schizophrenia/schizophrenia_1.pdf',
    supports: [
      'Sintomas psicóticos (como delírios e alucinações), negativos e cognitivos.',
      'Dificuldades cognitivas, como atenção, aprendizagem e memória, e possíveis impactos no cotidiano.',
      'Variação da experiência e da intensidade entre pessoas.',
    ],
  },
  {
    id: 3,
    short: 'Diretriz clínica sobre comprometimento cognitivo na esquizofrenia',
    citation:
      'Clinical practice guidelines for assessment and management of cognitive impairment in schizophrenia. Disponível no PubMed Central (PMC11878460).',
    originalTitle: 'Clinical practice guidelines for assessment and management of cognitive impairment in schizophrenia',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11878460/',
    supports: [
      'Domínios cognitivos que podem ser afetados na esquizofrenia e como são avaliados.',
      'Contexto para memória de trabalho e aprendizagem verbal.',
      'Diferenças de perfil entre pessoas: avaliar a pessoa, não apenas o diagnóstico.',
    ],
  },
  {
    id: 4,
    short: 'Aleman et al. (1999), meta-análise',
    citation:
      'Aleman, A., Hijman, R., de Haan, E. H. F., & Kahn, R. S. (1999). Memory impairment in schizophrenia: a meta-analysis. American Journal of Psychiatry, 156(9), 1358–1366.',
    originalTitle: 'Memory impairment in schizophrenia: a meta-analysis',
    url: 'https://doi.org/10.1176/ajp.156.9.1358',
    supports: [
      'Meta-análise que reuniu 70 estudos.',
      'Em média, diferença maior entre pessoas com esquizofrenia e grupos de comparação na recordação.',
      'No reconhecimento, diferença menor, mas ainda significativa.',
    ],
  },
  {
    id: 5,
    short: 'JAMA Psychiatry (2024), primeiro episódio psicótico sem antipsicóticos',
    citation:
      'Cognitive Function and Variability in Antipsychotic Drug-Naive Patients With First-Episode Psychosis: A Systematic Review and Meta-Analysis. JAMA Psychiatry (2024).',
    originalTitle:
      'Cognitive Function and Variability in Antipsychotic Drug-Naive Patients With First-Episode Psychosis: A Systematic Review and Meta-Analysis',
    url: 'https://pubmed.ncbi.nlm.nih.gov/38416480/',
    supports: [
      'Diferenças cognitivas em pessoas no primeiro episódio psicótico que ainda não tinham usado antipsicóticos.',
      'Indica que dificuldades cognitivas podem existir antes desse tratamento, nessa população.',
      'Limite: primeiro episódio psicótico é uma categoria mais ampla que esquizofrenia; o estudo não determina a causa da dificuldade de uma pessoa nem o efeito de um medicamento específico.',
    ],
  },
];

export const getReference = (id: number) => references.find((r) => r.id === id);
