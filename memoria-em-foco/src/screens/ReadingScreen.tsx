import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { chapters, chapterOf, getParagraph } from '../data/chapters';
import { RichText, Modal } from '../components/References';
import { EpisodicFigure, SynapseFigure } from '../components/Figures';
import { HL_COLORS, highlightAtPoint, paintHighlights, selectionToParts, type SelectionPart } from '../components/Highlighter';
import { NotesEditor } from '../components/NotesEditor';
import { useNotes, newId } from '../notes';
import {
  addHighlights,
  recolorHighlight,
  removeHighlight,
  toggleBookmark,
  useProgress,
  type Highlight,
  type HighlightColor,
  type Theme,
} from '../storage';
import { navigate } from '../utils';

export const FONT_SIZES = [16, 18, 20, 22, 25];
const WIDE = '(min-width: 900px)';

function topOffset() {
  const bar = document.querySelector('.reader-bar') as HTMLElement | null;
  return (bar?.offsetHeight ?? 56) + 8;
}

function scrollToBlock(id: string, offset = 0) {
  const el = document.querySelector(`[data-bid="${id}"]`) as HTMLElement | null;
  if (!el) return false;
  const y = el.getBoundingClientRect().top + window.scrollY - topOffset() + offset;
  window.scrollTo({ top: Math.max(0, y) });
  return true;
}

function currentBlock(): { pid: string; offset: number } | null {
  const top = topOffset();
  const els = document.querySelectorAll<HTMLElement>('[data-bid]');
  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (r.bottom > top + 4) return { pid: el.dataset.bid!, offset: Math.max(0, Math.round(top - r.top)) };
  }
  return null;
}

function useMedia(q: string) {
  const [m, setM] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [q]);
  return m;
}

const ONBOARDING = [
  { icon: '📖', title: 'Leia no seu ritmo', text: 'A matéria vem em 6 capítulos curtos. Cada um começa com a ideia-chave. O app lembra onde você parou.' },
  { icon: '👆', title: 'Toque para entender', text: 'Palavras sublinhadas mostram a definição. Números como [5] abrem a fonte. Você não sai do lugar.' },
  { icon: '🖍️', title: 'Marque o texto', text: 'Selecione um trecho com o dedo, o mouse ou a caneta e escolha uma cor. Toque numa marcação para mudar ou apagar.' },
  { icon: '✍️', title: 'Anote do seu jeito', text: 'No Caderno você digita ou escreve com caneta. No tablet ou computador, ele abre ao lado do texto.' },
];

function Onboarding({ onClose }: { onClose: () => void }) {
  const [i, setI] = useState(0);
  const s = ONBOARDING[i];
  return (
    <Modal title="Como usar" onClose={onClose}>
      <div className="onb">
        <div className="onb-icon" aria-hidden="true">
          {s.icon}
        </div>
        <h3>{s.title}</h3>
        <p>{s.text}</p>
        <div className="onb-dots" aria-hidden="true">
          {ONBOARDING.map((_, k) => (
            <span key={k} className={k === i ? 'on' : ''} />
          ))}
        </div>
        <p className="sr-only">
          Dica {i + 1} de {ONBOARDING.length}
        </p>
        <div className="onb-actions">
          {i > 0 && (
            <button className="btn ghost" onClick={() => setI(i - 1)}>
              Voltar
            </button>
          )}
          {i < ONBOARDING.length - 1 ? (
            <button className="btn primary" onClick={() => setI(i + 1)}>
              Próxima
            </button>
          ) : (
            <button className="btn primary" onClick={onClose}>
              Começar a ler
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

const THEMES: { id: Theme; label: string }[] = [
  { id: 'auto', label: 'Automático' },
  { id: 'light', label: 'Claro' },
  { id: 'warm', label: 'Suave' },
  { id: 'dark', label: 'Escuro' },
];

function Appearance({ onClose, onHelp, setFont }: { onClose: () => void; onHelp: () => void; setFont: (n: number) => void }) {
  const { progress, update } = useProgress();
  return (
    <Modal title="Aparência" onClose={onClose}>
      <h3>Tamanho da letra</h3>
      <div className="font-row">
        <button className="btn secondary" onClick={() => setFont(progress.fontStep - 1)} disabled={progress.fontStep === 0} aria-label="Diminuir letra">
          A−
        </button>
        <span className="font-sample" style={{ fontSize: FONT_SIZES[progress.fontStep] }}>
          Aa
        </span>
        <button className="btn secondary" onClick={() => setFont(progress.fontStep + 1)} disabled={progress.fontStep === FONT_SIZES.length - 1} aria-label="Aumentar letra">
          A+
        </button>
      </div>
      <h3>Cores</h3>
      <div className="theme-row" role="radiogroup" aria-label="Tema de cores">
        {THEMES.map((t) => (
          <button
            key={t.id}
            role="radio"
            aria-checked={progress.theme === t.id}
            className={`theme-btn theme-${t.id} ${progress.theme === t.id ? 'on' : ''}`}
            onClick={() => update((p) => ({ ...p, theme: t.id }))}
          >
            <span className="theme-preview" aria-hidden="true" />
            {t.label}
          </button>
        ))}
      </div>
      <p className="muted small">“Suave” usa um fundo levemente quente, que cansa menos em leituras longas. “Escuro” é bom à noite.</p>
      <button className="btn ghost block" onClick={onHelp}>
        Como usar o app
      </button>
    </Modal>
  );
}

function NotebookPanel({ onClose }: { onClose: () => void }) {
  const { pages, activeId, setActive, createPage } = useNotes();
  const active = pages.find((p) => p.id === activeId);
  return (
    <aside className="notebook-panel" aria-label="Caderno">
      <div className="panel-head">
        <strong>Caderno</strong>
        <select
          aria-label="Escolher página"
          value={active?.id ?? ''}
          onChange={(e) => (e.target.value === '__new' ? createPage() : setActive(e.target.value || null))}
        >
          <option value="">Escolha uma página…</option>
          {pages.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title || 'Sem título'}
            </option>
          ))}
          <option value="__new">+ Nova página</option>
        </select>
        <button className="btn ghost small" onClick={onClose} aria-label="Fechar caderno">
          ✕
        </button>
      </div>
      <div className="panel-body">
        {active ? (
          <NotesEditor key={active.id} pageId={active.id} compact />
        ) : (
          <div className="empty-editor">
            <p className="muted">Anote enquanto lê. Tudo fica salvo neste aparelho.</p>
            <button className="btn primary block" onClick={() => createPage()}>
              + Nova página
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

export function ReadingScreen({ jumpTo }: { jumpTo?: string }) {
  const { progress, update } = useProgress();
  const { createPage } = useNotes();
  const wide = useMedia(WIDE);
  const [current, setCurrent] = useState<string | null>(progress.readPos?.pid ?? null);
  const [pct, setPct] = useState(0);
  const [sheet, setSheet] = useState<null | 'toc' | 'look' | 'help'>(progress.onboardingSeen ? null : 'help');
  const [notebook, setNotebook] = useState(() => {
    try {
      return localStorage.getItem('mef:notebook') === '1';
    } catch {
      return false;
    }
  });
  const [flash, setFlash] = useState<string | null>(null);
  const [pending, setPending] = useState<SelectionPart[]>([]);
  const [selectedHl, setSelectedHl] = useState<Highlight | null>(null);
  const lastParts = useRef<{ parts: SelectionPart[]; at: number }>({ parts: [], at: 0 });
  const saveTimer = useRef<number>();
  const fontRestore = useRef<{ pid: string; offset: number } | null>(null);
  const restored = useRef(false);

  const showNotebook = notebook && wide;
  useEffect(() => {
    try {
      localStorage.setItem('mef:notebook', notebook ? '1' : '0');
    } catch {
      /* ignorado */
    }
  }, [notebook]);

  useLayoutEffect(() => {
    if (restored.current) return;
    restored.current = true;
    if (jumpTo && scrollToBlock(jumpTo)) {
      setFlash(jumpTo);
      setCurrent(jumpTo);
      window.setTimeout(() => setFlash(null), 2200);
      return;
    }
    const pos = progress.readPos;
    if (pos) scrollToBlock(pos.pid, pos.offset);
    else window.scrollTo(0, 0);
  }, [jumpTo, progress.readPos]);

  // Posição de leitura e progresso
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setPct(max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0);
        const pos = currentBlock();
        if (!pos) return;
        setCurrent(pos.pid);
        window.clearTimeout(saveTimer.current);
        saveTimer.current = window.setTimeout(() => update((p) => ({ ...p, readPos: pos })), 300);
        const end = document.getElementById('fim-da-materia');
        if (end && end.getBoundingClientRect().top < window.innerHeight) {
          update((p) => (p.finishedReading ? p : { ...p, finishedReading: true }));
        }
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
      window.clearTimeout(saveTimer.current);
    };
  }, [update]);

  // Pinta as marcações sempre que mudam (ou quando o texto é redesenhado)
  useEffect(() => {
    paintHighlights(progress.highlights);
  }, [progress.highlights, progress.fontStep, showNotebook]);
  useEffect(() => () => paintHighlights([]), []);

  // Acompanha a seleção de texto dentro da leitura
  useEffect(() => {
    let t = 0;
    const onSel = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        const parts = selectionToParts(document.getSelection());
        if (parts.length) {
          lastParts.current = { parts, at: Date.now() };
          setPending(parts);
          setSelectedHl(null);
        } else {
          setPending([]);
        }
      }, 120);
    };
    document.addEventListener('selectionchange', onSel);
    return () => {
      document.removeEventListener('selectionchange', onSel);
      window.clearTimeout(t);
    };
  }, []);

  const partsNow = () => (pending.length ? pending : Date.now() - lastParts.current.at < 2000 ? lastParts.current.parts : []);

  const applyColor = (color: HighlightColor) => {
    if (selectedHl) {
      update(recolorHighlight(selectedHl.id, color));
      setSelectedHl(null);
      return;
    }
    const parts = partsNow();
    if (!parts.length) return;
    const at = new Date().toISOString();
    update(addHighlights(parts.map((p) => ({ id: newId(), ...p, color, at }))));
    document.getSelection()?.removeAllRanges();
    setPending([]);
    lastParts.current = { parts: [], at: 0 };
  };

  const annotate = () => {
    const parts = selectedHl ? [selectedHl] : partsNow();
    if (!parts.length) return;
    if (!selectedHl) applyColor('yellow');
    const quote = parts.map((p) => p.text).join(' … ');
    const para = getParagraph(parts[0].pid);
    createPage({ title: `Cap. ${para?.chapter.number ?? ''} — anotação`, text: `“${quote}”\n\n`, pid: parts[0].pid, mode: 'text' });
    setSelectedHl(null);
    document.getSelection()?.removeAllRanges();
    if (wide) setNotebook(true);
    else navigate('/anotacoes');
  };

  const onReadingClick = (e: React.MouseEvent) => {
    if ((e.target as Element).closest('button, a, input, select, textarea')) return;
    const sel = document.getSelection();
    if (sel && !sel.isCollapsed) return;
    const h = highlightAtPoint(e.clientX, e.clientY, progress.highlights);
    setSelectedHl(h);
  };

  const setFont = (step: number) => {
    fontRestore.current = currentBlock();
    update((p) => ({ ...p, fontStep: Math.max(0, Math.min(FONT_SIZES.length - 1, step)) }));
  };
  useLayoutEffect(() => {
    if (fontRestore.current) {
      scrollToBlock(fontRestore.current.pid, 0);
      fontRestore.current = null;
    }
  }, [progress.fontStep]);

  const goTo = useCallback((id: string) => {
    setSheet(null);
    window.setTimeout(() => {
      scrollToBlock(id);
      setFlash(id);
      window.setTimeout(() => setFlash(null), 2200);
    }, 0);
  }, []);

  const closeHelp = () => {
    setSheet(null);
    if (!progress.onboardingSeen) update((p) => ({ ...p, onboardingSeen: true }));
  };

  const chapter = current ? chapterOf(current) ?? chapters.find((c) => c.id === current) : chapters[0];
  const bookmarkTarget = (() => {
    if (current && getParagraph(current)) return current;
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-bid]'));
    const i = els.findIndex((e) => e.dataset.bid === current);
    const next = els.slice(Math.max(0, i)).find((e) => getParagraph(e.dataset.bid!));
    return next?.dataset.bid ?? 'c1p1';
  })();
  const isBookmarked = progress.bookmarks.includes(bookmarkTarget);
  const barVisible = pending.length > 0 || selectedHl !== null;

  return (
    <div className={`reader ${showNotebook ? 'with-notebook' : ''}`} style={{ ['--read-size' as string]: `${FONT_SIZES[progress.fontStep]}px` }}>
      <div className="reader-col">
        <div className="reader-bar" role="toolbar" aria-label="Ferramentas de leitura">
          <button className="icon-text" onClick={() => setSheet('toc')} aria-label="Índice">
            <span aria-hidden="true">☰</span>
            <span className="it-label">Índice</span>
          </button>
          <div className="reader-where">
            <span className="rw-chapter">{chapter ? `Capítulo ${chapter.number} de 6` : ''}</span>
            <span className="rw-progress" aria-hidden="true">
              <span style={{ width: `${pct}%` }} />
            </span>
          </div>
          <button className="icon-text" onClick={() => setSheet('look')} aria-label="Aparência: letra e cores">
            <span aria-hidden="true" className="aa">
              Aa
            </span>
          </button>
          <button
            className={`icon-text ${isBookmarked ? 'on' : ''}`}
            aria-pressed={isBookmarked}
            onClick={() => update(toggleBookmark(bookmarkTarget))}
            aria-label={isBookmarked ? 'Remover marcador deste trecho' : 'Marcar este trecho'}
          >
            <span aria-hidden="true">{isBookmarked ? '★' : '☆'}</span>
          </button>
          <button
            className={`icon-text ${showNotebook ? 'on' : ''}`}
            aria-pressed={showNotebook}
            onClick={() => (wide ? setNotebook((n) => !n) : navigate('/anotacoes'))}
            aria-label="Caderno de anotações"
          >
            <span aria-hidden="true">✎</span>
            <span className="it-label">Caderno</span>
          </button>
        </div>

        <article className="reading" onClick={onReadingClick}>
          <header className="reading-head">
            <p className="kicker">Texto de estudo</p>
            <h1>Memória no cérebro e na esquizofrenia</h1>
            <p className="lead-muted">
              6 capítulos curtos · cerca de 15 minutos. Toque nas palavras sublinhadas para ver a definição. Selecione um trecho
              para marcar com cor.
            </p>
          </header>

          {chapters.map((c) => (
            <section key={c.id} className="chapter" aria-labelledby={`h-${c.id}`}>
              <h2 id={`h-${c.id}`} data-bid={c.id} className={flash === c.id ? 'flash' : ''}>
                <span className="chapter-num">
                  Capítulo {c.number} · {c.minutes} min
                </span>
                {c.title}
              </h2>
              <div className="key-idea">
                <span className="key-label">Ideia-chave</span>
                <p>{c.keyIdea}</p>
              </div>
              {c.blocks.map((b) =>
                b.kind === 'p' ? (
                  <p
                    key={b.id}
                    id={b.id}
                    data-bid={b.id}
                    className={`reading-p ${flash === b.id ? 'flash' : ''} ${progress.bookmarks.includes(b.id) ? 'marked' : ''}`}
                  >
                    <RichText text={b.text} />
                  </p>
                ) : (
                  <div key={b.id} data-bid={b.id} className={flash === b.id ? 'flash' : ''}>
                    {b.figure === 'synapse' ? <SynapseFigure /> : <EpisodicFigure />}
                  </div>
                ),
              )}
            </section>
          ))}

          <section id="fim-da-materia" data-bid="fim" className="end-card">
            <h2>Você chegou ao fim da matéria 🎉</h2>
            <p>Agora é hora de praticar: um caso que junta tudo, exercícios comentados, a banca oral e o ensaio da apresentação.</p>
            <button className="btn primary block" onClick={() => navigate('/praticar')}>
              Praticar
            </button>
            <button className="btn ghost block" onClick={() => navigate('/anotacoes')}>
              Ver minhas anotações e marcações
            </button>
          </section>
        </article>
      </div>

      {showNotebook && <NotebookPanel onClose={() => setNotebook(false)} />}

      {barVisible && (
        <div className="hl-bar" role="toolbar" aria-label="Marcar texto" onMouseDown={(e) => e.preventDefault()} onPointerDown={(e) => e.preventDefault()}>
          <span className="hl-bar-label">{selectedHl ? 'Marcação' : 'Marcar'}</span>
          {HL_COLORS.map((c) => (
            <button
              key={c.id}
              className={`hl-swatch hl-${c.id} ${selectedHl?.color === c.id ? 'on' : ''}`}
              onClick={() => applyColor(c.id)}
              aria-label={`${selectedHl ? 'Mudar para' : 'Marcar em'} ${c.label}`}
            />
          ))}
          <button className="hl-action" onClick={annotate}>
            ✎ Anotar
          </button>
          {selectedHl && (
            <button
              className="hl-action"
              onClick={() => {
                update(removeHighlight(selectedHl.id));
                setSelectedHl(null);
              }}
            >
              Apagar
            </button>
          )}
          <button
            className="hl-close"
            aria-label="Fechar"
            onClick={() => {
              setSelectedHl(null);
              setPending([]);
              document.getSelection()?.removeAllRanges();
            }}
          >
            ✕
          </button>
        </div>
      )}

      {sheet === 'help' && <Onboarding onClose={closeHelp} />}
      {sheet === 'look' && <Appearance onClose={() => setSheet(null)} onHelp={() => setSheet('help')} setFont={setFont} />}
      {sheet === 'toc' && (
        <Modal title="Índice" onClose={() => setSheet(null)}>
          <ol className="toc">
            {chapters.map((c) => (
              <li key={c.id}>
                <button className={`toc-item ${chapter?.id === c.id ? 'here' : ''}`} onClick={() => goTo(c.id)}>
                  <span className="muted small">
                    Capítulo {c.number} · {c.minutes} min
                  </span>
                  <span>{c.title}</span>
                </button>
                {c.blocks
                  .filter((b) => b.kind === 'figure')
                  .map((b) => (
                    <button key={b.id} className="toc-sub" onClick={() => goTo(b.id)}>
                      {b.kind === 'figure' && b.figure === 'synapse' ? 'Figura 1 · Sinapse química' : 'Figura 2 · Memória episódica'}
                    </button>
                  ))}
              </li>
            ))}
          </ol>
          <h3>Meus marcadores</h3>
          {progress.bookmarks.length === 0 ? (
            <p className="muted small">Toque em ☆ na barra de leitura para marcar o trecho em que está.</p>
          ) : (
            <ul className="toc-marks">
              {progress.bookmarks.map((pid) => {
                const p = getParagraph(pid);
                if (!p) return null;
                const plain = p.text.replace(/\*\*|\{\{|\}\}|\|[\w-]+(?=\}\})/g, '').replace(/\[[\d,\s–-]+\]/g, '');
                return (
                  <li key={pid}>
                    <button className="toc-sub" onClick={() => goTo(pid)}>
                      <strong>Cap. {p.chapter.number}:</strong> {plain.slice(0, 80)}…
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="stack">
            <button className="btn secondary block" onClick={() => navigate('/glossario')}>
              Glossário
            </button>
            <button className="btn ghost block" onClick={() => navigate('/anotacoes')}>
              Marcações e anotações
            </button>
            <button className="btn ghost block" onClick={() => goTo('fim')}>
              Ir para o fim da matéria
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
