import type { RefId } from './types';

export const scriptParagraphs: string[] = [
  'Como uma experiência que dura poucos segundos pode influenciar o que lembramos amanhã? Essa pergunta ajuda a entender o conceito de memória. Em psicologia, memória é a capacidade de registrar, conservar e recuperar informações. No cérebro, isso depende da atividade de redes de neurônios e das mudanças que a experiência produz nessas redes.',
  'Uma dessas mudanças acontece nas sinapses, regiões em que os neurônios se comunicam. Em certas conexões do hipocampo, a atividade conjunta de células pode fortalecer a resposta da sinapse. Esse fenômeno é chamado de potenciação de longa duração. O que muda concretamente? Depois daquela atividade, um sinal semelhante pode produzir uma resposta maior. Essa é uma das formas pelas quais o cérebro conserva efeitos de uma experiência depois que ela termina.',
  'Para compreender uma lembrança inteira, precisamos olhar também para os circuitos. O hipocampo participa da formação de relações entre os elementos de um episódio: o que aconteceu, em que contexto e com quem. O córtex pré-frontal ajuda a selecionar e organizar informações e a orientar sua recuperação. Também participa da memória de trabalho, que mantém informação disponível enquanto a utilizamos.',
  'Na esquizofrenia, estudos identificam, em média, dificuldades tanto na memória de trabalho quanto em certas tarefas de aprendizagem e memória episódica. Um estudo de Ragland e colaboradores ajuda a entender a natureza dessa diferença. Os pesquisadores distinguiram duas demandas: aprender as características dos itens e aprender as relações entre eles. O grupo com esquizofrenia teve dificuldade particularmente importante na aprendizagem das relações, acompanhada de diferenças no recrutamento de regiões cerebrais durante a tarefa.',
  'Outro achado vem de uma meta-análise de Aleman e colaboradores. Ao reunir 70 estudos, os autores observaram que a diferença entre os grupos era maior quando as pessoas precisavam recordar o material. Quando podiam reconhecê-lo entre opções, a diferença diminuía, embora continuasse presente. Portanto, para dizer que alguém teve dificuldade de memória, precisamos explicar o que essa pessoa precisou aprender e como a lembrança foi avaliada.',
  'Por fim, os pesquisadores investigam como alterações na comunicação dos circuitos podem contribuir para essas dificuldades. Temos evidências de diferenças no desempenho e no recrutamento cerebral, mas isso não permite apontar uma sinapse como causa do esquecimento de uma pessoa. A comparação científica descreve tendências entre grupos. Compreender uma pessoa exige considerar o perfil dela e as condições em que a memória foi avaliada.',
];

/** Fontes de cada parágrafo, para consulta durante o ensaio (não são lidas em voz alta). */
export const scriptRefs: RefId[][] = [[1, 3], [2], [1, 5, 6], [4, 5, 6], [7], [5, 6]];

/** Cinco palavras de apoio, na ordem da fala. */
export const cueWords: { word: string; hint: string; refs: RefId[] }[] = [
  { word: 'experiência', hint: 'Poucos segundos → amanhã. Registrar, conservar, recuperar. Redes que mudam.', refs: [1, 3] },
  { word: 'sinapse', hint: 'Hipocampo · LTP · sinal semelhante, resposta maior.', refs: [2] },
  { word: 'circuitos', hint: 'Hipocampo: relações do episódio. Pré-frontal: selecionar, organizar, memória de trabalho.', refs: [1, 5, 6] },
  { word: 'esquizofrenia', hint: 'Memória de trabalho e episódica. Ragland: itens × relações. Aleman: recordar × reconhecer.', refs: [5, 7] },
  { word: 'evidência', hint: 'Circuitos investigados; não aponta uma sinapse. Grupos × pessoa.', refs: [5, 6] },
];

export const PRESENTATION_WARN_SECONDS = 270; // 4min30s
export const PRESENTATION_LIMIT_SECONDS = 300; // 5min
