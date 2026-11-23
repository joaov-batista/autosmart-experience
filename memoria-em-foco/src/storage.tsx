import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

const KEY = 'memoria-em-foco:v1';

export type SessionKind = 'lesson' | 'review' | 'mixed' | 'oral' | 'presentation';

export interface Progress {
  version: 1;
  /** Lição em andamento e passo atual, para o botão Continuar. */
  current: { lessonId: string; step: number } | null;
  /** Último passo visto em cada lição. */
  lessonSteps: Record<string, number>;
  completedLessons: string[];
  /** Questões erradas aguardando revisão: id → quantas vezes errou. */
  wrong: Record<string, number>;
  /** Explicações das lições marcadas como “Faltou um ponto”. */
  explainReview: string[];
  /** Marcações da banca oral. */
  oralMarks: Record<string, 'ok' | 'missing'>;
  oralDifficult: string[];
  sessions: { kind: SessionKind; ref?: string; at: string; seconds?: number }[];
  wordListIndex: number;
}

const empty: Progress = {
  version: 1,
  current: null,
  lessonSteps: {},
  completedLessons: [],
  wrong: {},
  explainReview: [],
  oralMarks: {},
  oralDifficult: [],
  sessions: [],
  wordListIndex: 0,
};

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.version === 1) return { ...empty, ...parsed };
  } catch {
    /* armazenamento indisponível: segue com progresso vazio */
  }
  return empty;
}

function save(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* modo privado ou cota cheia: o app continua funcionando sem salvar */
  }
}

type Updater = (p: Progress) => Progress;
interface Ctx {
  progress: Progress;
  update: (fn: Updater) => void;
}

const ProgressContext = createContext<Ctx | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(load);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    save(progress);
  }, [progress]);
  const update = useCallback((fn: Updater) => setProgress((p) => fn(p)), []);
  return <ProgressContext.Provider value={{ progress, update }}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress fora do provider');
  return ctx;
}

// Helpers de atualização (puros)
export const markWrong = (id: string): Updater => (p) => ({ ...p, wrong: { ...p.wrong, [id]: (p.wrong[id] ?? 0) + 1 } });
export const clearWrong = (id: string): Updater => (p) => {
  const wrong = { ...p.wrong };
  delete wrong[id];
  return { ...p, wrong };
};
export const addSession = (kind: SessionKind, ref?: string, seconds?: number): Updater => (p) => ({
  ...p,
  sessions: [...p.sessions, { kind, ref, at: new Date().toISOString(), seconds }].slice(-200),
});
const toggleIn = (list: string[], id: string, on: boolean) =>
  on ? (list.includes(id) ? list : [...list, id]) : list.filter((x) => x !== id);
export const setExplainReview = (lessonId: string, on: boolean): Updater => (p) => ({
  ...p,
  explainReview: toggleIn(p.explainReview, lessonId, on),
});
export const markOral = (id: string, mark: 'ok' | 'missing'): Updater => (p) => ({
  ...p,
  oralMarks: { ...p.oralMarks, [id]: mark },
  oralDifficult: toggleIn(p.oralDifficult, id, mark === 'missing'),
});
