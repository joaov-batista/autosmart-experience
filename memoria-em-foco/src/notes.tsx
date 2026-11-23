import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

const KEY = 'memoria-em-foco:notes:v1';

/** Traço de caneta em coordenadas lógicas (página com 1000 de largura), achatado: [x, y, x, y…]. */
export interface Stroke {
  tool: 'pen' | 'marker';
  color: string;
  width: number;
  pts: number[];
}

export interface NotePage {
  id: string;
  title: string;
  text: string;
  strokes: Stroke[];
  mode: 'text' | 'ink';
  /** Parágrafo do texto de estudo a que a anotação se refere. */
  pid?: string;
  updatedAt: string;
}

interface NotesState {
  pages: NotePage[];
  activeId: string | null;
}

interface Ctx extends NotesState {
  saveError: boolean;
  createPage: (init?: Partial<NotePage>) => string;
  updatePage: (id: string, patch: Partial<NotePage>) => void;
  deletePage: (id: string) => void;
  setActive: (id: string | null) => void;
}

const NotesContext = createContext<Ctx | null>(null);

function load(): NotesState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (Array.isArray(s.pages)) return { pages: s.pages, activeId: s.activeId ?? null };
    }
  } catch {
    /* sem armazenamento: começa vazio */
  }
  return { pages: [], activeId: null };
}

export const newId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NotesState>(load);
  const [saveError, setSaveError] = useState(false);
  const timer = useRef<number>();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify(state));
        setSaveError(false);
      } catch {
        setSaveError(true);
      }
    }, 300);
  }, [state]);

  // Garante que nada se perca ao fechar o app no meio da escrita.
  useEffect(() => {
    const flush = () => {
      try {
        localStorage.setItem(KEY, JSON.stringify(stateRef.current));
      } catch {
        /* ignorado */
      }
    };
    window.addEventListener('pagehide', flush);
    return () => window.removeEventListener('pagehide', flush);
  }, []);
  const stateRef = useRef(state);
  stateRef.current = state;

  const createPage = useCallback((init?: Partial<NotePage>) => {
    const id = newId();
    setState((s) => {
      const page: NotePage = {
        id,
        title: init?.title ?? `Página ${s.pages.length + 1}`,
        text: init?.text ?? '',
        strokes: init?.strokes ?? [],
        mode: init?.mode ?? 'text',
        pid: init?.pid,
        updatedAt: new Date().toISOString(),
      };
      return { pages: [page, ...s.pages], activeId: id };
    });
    return id;
  }, []);

  const updatePage = useCallback((id: string, patch: Partial<NotePage>) => {
    setState((s) => ({
      ...s,
      pages: s.pages.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p)),
    }));
  }, []);

  const deletePage = useCallback((id: string) => {
    setState((s) => ({ pages: s.pages.filter((p) => p.id !== id), activeId: s.activeId === id ? null : s.activeId }));
  }, []);

  const setActive = useCallback((id: string | null) => setState((s) => ({ ...s, activeId: id })), []);

  return (
    <NotesContext.Provider value={{ ...state, saveError, createPage, updatePage, deletePage, setActive }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes fora do provider');
  return ctx;
}
