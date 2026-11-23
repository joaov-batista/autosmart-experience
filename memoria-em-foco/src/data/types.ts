// Tipos do conteúdo editorial. O conteúdo fica em arquivos de dados, separado dos componentes.
//
// Marcações aceitas nos textos:
//   **termo**            → negrito; se existir no glossário, vira termo tocável
//   {{texto|chave}}      → termo técnico tocável sem negrito (chave do glossário)
//   [1] · [2, 3] · [4–7] → citações tocáveis que abrem a ficha da fonte

export type RefId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface Reference {
  id: RefId;
  short: string;
  originalTitle: string;
  detail: string;
  url: string;
  extraUrl?: { label: string; url: string };
  supports: string[];
}

export type Block =
  | { kind: 'p'; id: string; text: string }
  | { kind: 'figure'; id: string; figure: 'synapse' | 'episodic' };

export interface Chapter {
  id: string;
  number: number;
  title: string;
  /** Resumo de 1–2 frases mostrado no início do capítulo (a explicação completa vem nos parágrafos). */
  keyIdea: string;
  minutes: number;
  blocks: Block[];
}

export interface GlossaryEntry {
  key: string;
  term: string;
  definition: string;
  /** Parágrafo onde o termo é apresentado. */
  pid: string;
  aliases?: string[];
}

export interface Choice {
  id: string;
  text: string;
  /** Explica por que a alternativa faz sentido ou onde o raciocínio falhou. */
  feedback: string;
}

interface BaseExercise {
  id: string;
  number: number;
  prompt: string;
  /** Raciocínio do gabarito, mostrado depois da tentativa. */
  explanation: string;
  /** Parágrafo do texto que sustenta a resposta. */
  pid: string;
}

export interface SingleExercise extends BaseExercise {
  type: 'single';
  choices: Choice[];
  correctId: string;
}

export interface OrderExercise extends BaseExercise {
  type: 'order';
  /** Itens já na ordem correta; o app embaralha na exibição. */
  items: { id: string; text: string }[];
}

export interface OpenExercise extends BaseExercise {
  type: 'open';
  model: string;
  criteria: [string, string];
}

export type Exercise = SingleExercise | OrderExercise | OpenExercise;

export interface OralQuestion {
  id: string;
  /** Número do exercício correspondente na lista de prática. */
  number: number;
  question: string;
  model: string;
  /** Dois critérios visíveis: precisão do conceito e justificativa. */
  criteria: [string, string];
  followUp: { question: string; guidance: string };
  pid: string;
  refs: RefId[];
}
