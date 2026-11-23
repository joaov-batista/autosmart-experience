import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { getReference, references } from '../data/references';
import { findTerm, glossary } from '../data/glossary';
import { getParagraph } from '../data/chapters';
import type { RefId } from '../data/types';
import { navigate } from '../utils';

type Open = { type: 'ref'; id: number } | { type: 'refs' } | { type: 'term'; key: string } | { type: 'para'; pid: string } | null;

interface SheetCtx {
  openRef: (id: number) => void;
  openAll: () => void;
  openTerm: (key: string) => void;
  openParagraph: (pid: string) => void;
}
const Ctx = createContext<SheetCtx>({ openRef: () => {}, openAll: () => {}, openTerm: () => {}, openParagraph: () => {} });
export const useSheets = () => useContext(Ctx);

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      prev?.focus?.({ preventScroll: true });
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
    <article className="ref-card">
      <h3>
        <span className="ref-num">[{r.id}]</span> {r.short}
      </h3>
      <p className="ref-title">
        <em>{r.originalTitle}</em>
      </p>
      <p className="muted small">{r.detail}</p>
      <h4>O que esta fonte sustenta no app</h4>
      <ul>
        {r.supports.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <a className="ext-link" href={r.url} target="_blank" rel="noopener noreferrer">
        Abrir fonte original ↗
      </a>
      {r.extraUrl && (
        <a className="ext-link" href={r.extraUrl.url} target="_blank" rel="noopener noreferrer">
          {r.extraUrl.label} ↗
        </a>
      )}
      <p className="muted small">
        Abrir o artigo externo exige internet. Esta ficha funciona offline. O texto do app usa citações indiretas; as
        frases não são citações literais dos autores.
      </p>
    </article>
  );
}

export function SheetsProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<Open>(null);
  const close = useCallback(() => setOpen(null), []);
  const value: SheetCtx = {
    openRef: useCallback((id: number) => setOpen({ type: 'ref', id }), []),
    openAll: useCallback(() => setOpen({ type: 'refs' }), []),
    openTerm: useCallback((key: string) => setOpen({ type: 'term', key }), []),
    openParagraph: useCallback((pid: string) => setOpen({ type: 'para', pid }), []),
  };

  let sheet: ReactNode = null;
  if (open?.type === 'ref') sheet = <Modal title={`Fonte [${open.id}]`} onClose={close}><ReferenceCard id={open.id} /></Modal>;
  if (open?.type === 'refs')
    sheet = (
      <Modal title="Fontes" onClose={close}>
        {references.map((r) => (
          <ReferenceCard key={r.id} id={r.id} />
        ))}
      </Modal>
    );
  if (open?.type === 'term') {
    const g = glossary.find((x) => x.key === open.key);
    if (g)
      sheet = (
        <Modal title={g.term} onClose={close}>
          <p className="def">{g.definition}</p>
          <p className="muted small">Você continua no mesmo ponto da leitura.</p>
        </Modal>
      );
  }
  if (open?.type === 'para') {
    const p = getParagraph(open.pid);
    if (p)
      sheet = (
        <Modal title={`Capítulo ${p.chapter.number}`} onClose={close}>
          <p className="muted small">{p.chapter.title}</p>
          <p className="reading-p">
            <RichText text={p.text} />
          </p>
          <button
            className="btn secondary block"
            onClick={() => {
              close();
              navigate(`/estudar/${p.id}`);
            }}
          >
            Abrir este trecho no texto
          </button>
        </Modal>
      );
  }

  return (
    <Ctx.Provider value={value}>
      {children}
      {sheet}
    </Ctx.Provider>
  );
}

function expandIds(s: string): number[] {
  return s.split(',').flatMap((part) => {
    const range = part.trim().match(/^(\d+)\s*[–-]\s*(\d+)$/);
    if (range) {
      const out: number[] = [];
      for (let i = +range[1]; i <= +range[2]; i++) out.push(i);
      return out;
    }
    return [parseInt(part.trim(), 10)];
  });
}

const TOKEN = /(\*\*[^*]+\*\*|\{\{[^}]+\}\}|\[\d+(?:\s*[,–-]\s*\d+)*\])/g;

/** Converte a marcação do texto: **termo**, {{texto|chave}} e [n]. */
export function RichText({ text }: { text: string }) {
  const { openTerm } = useSheets();
  const parts = text.split(TOKEN);
  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;
        if (part.startsWith('**')) {
          const inner = part.slice(2, -2);
          const g = findTerm(inner.replace(/[?,.]$/, ''));
          return g ? (
            <button key={i} className="term strong" onClick={() => openTerm(g.key)} aria-label={`${inner} — ver definição`}>
              {inner}
            </button>
          ) : (
            <strong key={i}>{inner}</strong>
          );
        }
        if (part.startsWith('{{')) {
          const [label, key] = part.slice(2, -2).split('|');
          const g = findTerm(key ?? label);
          return g ? (
            <button key={i} className="term" onClick={() => openTerm(g.key)} aria-label={`${label} — ver definição`}>
              {label}
            </button>
          ) : (
            <span key={i}>{label}</span>
          );
        }
        const m = part.match(/^\[([\d\s,–-]+)\]$/);
        if (m) return <RefButtons key={i} refs={expandIds(m[1]) as RefId[]} />;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export function RefButtons({ refs }: { refs: RefId[] }) {
  const { openRef } = useSheets();
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
