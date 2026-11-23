// Tipos do conteúdo editorial. O conteúdo fica em arquivos de dados separados dos componentes.
// Textos podem conter marcadores de citação como [1] ou [2, 3], que viram botões para as fichas.

export type RefId = 1 | 2 | 3 | 4 | 5;

export interface Reference {
  id: RefId;
  short: string;
  citation: string;
  originalTitle: string;
  url: string;
  supports: string[];
}

export interface Choice {
  id: string;
  text: string;
  /** Explica por que a alternativa faz sentido ou onde o raciocínio falhou. */
  feedback: string;
}

interface BaseQuestion {
  id: string;
  lessonId: string;
  prompt: string;
  /** Contexto opcional exibido acima do enunciado. */
  context?: string;
  /** Marca casos inventados para fins didáticos. */
  fictional?: boolean;
  /** Questão gêmea: mesmo conceito, outro exemplo. Usada quando a estudante erra. */
  retryId?: string;
  /** Explicação geral mostrada depois da correção. */
  explanation: string;
}

export interface SingleQuestion extends BaseQuestion {
  type: 'single';
  choices: Choice[];
  correctId: string;
}

export interface MatchQuestion extends BaseQuestion {
  type: 'match';
  pairs: { id: string; left: string; right: string; feedback: string }[];
}

export interface OrderQuestion extends BaseQuestion {
  type: 'order';
  /** Itens já na ordem correta. O app embaralha na exibição. */
  items: { id: string; text: string }[];
}

export interface ShortQuestion extends BaseQuestion {
  type: 'short';
  placeholder: string;
  /** Respostas aceitas, comparadas após normalização (minúsculas, sem acento, só letras/números). */
  accept: string[];
  correctAnswer: string;
}

/** Resposta aberta: não há correção automática. A estudante compara com o modelo e marca critérios. */
export interface OpenQuestion extends BaseQuestion {
  type: 'open';
  model: string;
  criteria: [string, string];
}

export type Question = SingleQuestion | MatchQuestion | OrderQuestion | ShortQuestion | OpenQuestion;

export type LessonStep =
  | {
      kind: 'situation';
      text: string;
      fictional?: boolean;
      prompt: string;
      options: Choice[];
    }
  | { kind: 'concept'; paragraphs: string[]; bullets?: { term: string; text: string }[]; keyPhrase?: string }
  | { kind: 'example'; paragraphs: string[]; fictional?: boolean }
  | { kind: 'quiz'; questionId: string }
  | { kind: 'demo'; demo: 'word-lists' }
  | { kind: 'explain'; prompt: string; model: string; criteria: [string, string] };

export interface Lesson {
  id: string;
  number: number;
  title: string;
  summary: string;
  steps: LessonStep[];
}

export interface OralQuestion {
  id: string;
  question: string;
  model: string;
  criteria: [string, string];
  note?: string;
  refs: RefId[];
}
