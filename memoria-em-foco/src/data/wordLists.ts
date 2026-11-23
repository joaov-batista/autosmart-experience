/**
 * Listas da demonstração da Lição 4. A primeira é a do roteiro; as seguintes são usadas ao repetir.
 * Esta atividade demonstra formatos de tarefa e não é um teste clínico.
 */
export const wordLists: { words: string[]; distractors: string[]; cue: { category: string; answer: string } }[] = [
  {
    words: ['cedro', 'fita', 'manga', 'ponte', 'vidro'],
    distractors: ['barco', 'pedra', 'sino'],
    cue: { category: 'uma fruta', answer: 'manga' },
  },
  {
    words: ['lápis', 'cravo', 'nuvem', 'trilho', 'caju'],
    distractors: ['telha', 'rio', 'bota'],
    cue: { category: 'uma fruta', answer: 'caju' },
  },
  {
    words: ['cobre', 'janela', 'pera', 'sapo', 'linho'],
    distractors: ['farol', 'mesa', 'lua'],
    cue: { category: 'um animal', answer: 'sapo' },
  },
  {
    words: ['árvore', 'pincel', 'limão', 'túnel', 'gaveta'],
    distractors: ['remo', 'chave', 'nariz'],
    cue: { category: 'uma fruta', answer: 'limão' },
  },
];
