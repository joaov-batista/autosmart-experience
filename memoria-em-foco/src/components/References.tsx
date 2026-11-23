import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { getReference, references } from '../data/references';
import type { RefId } from '../data/types';

interface RefCtx {
  openRef: (id: number) => void;
  openAll: () => void;
}
const Ctx = createContext<RefCtx>({ openRef: () => {}, openAll: () => {} });
export const useRefs = () => useContext(Ctx);

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [onClose]);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <h2>{title}</h2>
          <button ref={closeRef} className="btn ghost small" onClick={onClose}>
            Fechar
          </button>
        </div>
        <div className="sheet-body">{children}</div>
      </div>
    </div>
  );
}

export function ReferenceCard({ id }: { id: number }) {
  const r = getReference(id);
  if (!r) return null;
  return (
    <article className="ref-card" id={`ref-${r.id}`}>
      <h3>
        <span className="ref-num">[{r.id}]</span> {r.short}
      </h3>
      <p className="ref-citation">{r.citation}</p>
      <p className="muted small">
        Título original: <em>{r.originalTitle}</em>
      </p>
      <h4>O que esta fonte sustenta</h4>
      <ul>
        {r.supports.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <a className="ext-link" href={r.url} target="_blank" rel="noopener noreferrer">
        Abrir fonte original ↗
      </a>
      <p className="muted small">Abrir o artigo externo exige internet. Esta ficha funciona offline.</p>
    </article>
  );
}

export function ReferencesProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<number | 'all' | null>(null);
  const openRef = useCallback((id: number) => setOpen(id), []);
  const openAll = useCallback(() => setOpen('all'), []);
  const close = useCallback(() => setOpen(null), []);
  return (
    <Ctx.Provider value={{ openRef, openAll }}>
      {children}
      {open !== null && (
        <Modal title={open === 'all' ? 'Fontes' : `Fonte [${open}]`} onClose={close}>
          {open === 'all' ? references.map((r) => <ReferenceCard key={r.id} id={r.id} />) : <ReferenceCard id={open} />}
        </Modal>
      )}
    </Ctx.Provider>
  );
}

/** Renderiza texto convertendo [1] ou [2, 3] em botões que abrem a ficha da fonte. */
export function RichText({ text }: { text: string }) {
  const { openRef } = useRefs();
  const parts = text.split(/(\[\d+(?:\s*,\s*\d+)*\])/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[(\d+(?:\s*,\s*\d+)*)\]$/);
        if (!m) return <span key={i}>{part}</span>;
        const ids = m[1].split(',').map((n) => parseInt(n.trim(), 10));
        return (
          <span key={i} className="cite-group">
            {ids.map((id) => (
              <button key={id} className="cite" onClick={() => openRef(id)} aria-label={`Abrir fonte ${id}`}>
                [{id}]
              </button>
            ))}
          </span>
        );
      })}
    </>
  );
}

export function RefButtons({ refs }: { refs: RefId[] }) {
  const { openRef } = useRefs();
  if (!refs.length) return null;
  return (
    <span className="cite-group">
      {refs.map((id) => (
        <button key={id} className="cite" onClick={() => openRef(id)} aria-label={`Abrir fonte ${id}`}>
          [{id}]
        </button>
      ))}
    </span>
  );
}

export function FictionalTag() {
  return <span className="tag">Exemplo didático fictício</span>;
}
