import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { allParagraphs, getParagraph, mapLegacyPid, plainText } from './data/chapters';

const KEY = 'memoria-em-foco:v2';

export type SessionKind = 'exercises' | 'review' | 'oral' | 'presentation' | 'case';

export type Theme = 'auto' | 'light' | 'warm' | 'dark';
export type HighlightColor = 'yellow' | 'green' | 'blue' | 'pink';

/** Marcação no texto: trecho de um parágrafo por posição de caractere. */
export interface Highlight {
  id: string;
  pid: string;
  start: number;
  end: number;
  color: HighlightColor;
  text: string;
  at: string;
  /** Trecho de uma versão anterior do texto que não foi reencontrado; fica na lista, mas não é pintado. */
  orphan?: boolean;
}

export type ReadMode = 'summary' | 'full';
/** Versão da estrutura dos capítulos. Mudou de 1 (c1p1…) para 2 (s1-1…). */
const CONTENT_VERSION = 2;

export interface Progress {
  version: 2;
  contentVersion?: number;
  readMode: ReadMode;
  theme: Theme;
  highlights: Highlight[];
  onboardingSeen: boolean;
  /** Ponto exato da leitura: parágrafo no topo da tela e deslocamento dentro dele. */
  readPos: { pid: string; offset: number } | null;
  /** Marcadores colocados pela estudante. */
  bookmarks: string[];
  /** Índice do tamanho da letra (0–4). */
  fontStep: number;
  /** Já chegou ao fim da matéria. */
  finishedReading: boolean;
  /** Exercícios para revisar (IDs). */
  reviewExercises: string[];
  /** Perguntas da banca para revisar (IDs). */
  reviewOral: string[];
  /** Último resultado por exercício. */
  exerciseResults: Record<string, 'ok' | 'review'>;
  /** Exercício em que parou na sequência. */
  exerciseIndex: number;
  sessions: { kind: SessionKind; at: string; seconds?: number }[];
}

const empty: Progress = {
  version: 2,
  contentVersion: CONTENT_VERSION,
  readMode: 'full',
  theme: 'auto',
  highlights: [],
  onboardingSeen: false,
  readPos: null,
  bookmarks: [],
  fontStep: 1,
  finishedReading: false,
  reviewExercises: [],
  reviewOral: [],
  exerciseResults: {},
  exerciseIndex: 0,
  sessions: [],
};

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 2) return migrate({ ...empty, ...parsed, contentVersion: parsed.contentVersion ?? 1 });
    }
  } catch {
    /* armazenamento indisponível: segue com progresso vazio */
  }
  return empty;
}

/** Reencontra uma marcação antiga pelo texto marcado, primeiro no trecho correspondente e depois no texto todo. */
function reanchor(h: Highlight): Highlight {
  const pid = mapLegacyPid(h.pid);
  const candidates = [getParagraph(pid), ...allParagraphs].filter(Boolean) as typeof allParagraphs;
  for (const p of candidates) {
    const idx = plainText(p.text).indexOf(h.text);
    if (idx >= 0) return { ...h, pid: p.id, start: idx, end: idx + h.text.length, orphan: false };
  }
  return { ...h, pid, orphan: true };
}

function migrate(p: Progress): Progress {
  if ((p.contentVersion ?? 1) >= CONTENT_VERSION) return p;
  return {
    ...p,
    contentVersion: CONTENT_VERSION,
    bookmarks: Array.from(new Set(p.bookmarks.map(mapLegacyPid))),
    readPos: p.readPos ? { pid: mapLegacyPid(p.readPos.pid), offset: 0 } : null,
    highlights: p.highlights.map(reanchor),
  };
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

const toggleIn = (list: string[], id: string, on: boolean) =>
  on ? (list.includes(id) ? list : [...list, id]) : list.filter((x) => x !== id);

export const setExerciseReview = (id: string, needsReview: boolean): Updater => (p) => ({
  ...p,
  reviewExercises: toggleIn(p.reviewExercises, id, needsReview),
  exerciseResults: { ...p.exerciseResults, [id]: needsReview ? 'review' : 'ok' },
});
export const setOralReview = (id: string, needsReview: boolean): Updater => (p) => ({
  ...p,
  reviewOral: toggleIn(p.reviewOral, id, needsReview),
});
export const toggleBookmark = (pid: string): Updater => (p) => ({
  ...p,
  bookmarks: toggleIn(p.bookmarks, pid, !p.bookmarks.includes(pid)),
});
export const addSession = (kind: SessionKind, seconds?: number): Updater => (p) => ({
  ...p,
  sessions: [...p.sessions, { kind, at: new Date().toISOString(), seconds }].slice(-200),
});

export const addHighlights = (items: Highlight[]): Updater => (p) => {
  // substitui marcações que se sobrepõem no mesmo parágrafo
  const overlaps = (a: Highlight, b: Highlight) => a.pid === b.pid && a.start < b.end && b.start < a.end;
  const kept = p.highlights.filter((h) => !items.some((n) => overlaps(h, n)));
  return { ...p, highlights: [...kept, ...items] };
};
export const removeHighlight = (id: string): Updater => (p) => ({ ...p, highlights: p.highlights.filter((h) => h.id !== id) });
export const recolorHighlight = (id: string, color: HighlightColor): Updater => (p) => ({
  ...p,
  highlights: p.highlights.map((h) => (h.id === id ? { ...h, color } : h)),
});
