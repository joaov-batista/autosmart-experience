import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { chapters, chapterOf, getParagraph } from '../data/chapters';
import { RichText, Modal } from '../components/References';
import { EpisodicFigure, SynapseFigure } from '../components/Figures';
import { toggleBookmark, useProgress } from '../storage';
import { navigate } from '../utils';

export const FONT_SIZES = [16, 18, 20, 22, 25];

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

/** Bloco que está no topo da área de leitura, com o deslocamento dentro dele. */
function currentBlock(): { pid: string; offset: number } | null {
  const top = topOffset();
  const els = document.querySelectorAll<HTMLElement>('[data-bid]');
  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (r.bottom > top + 4) return { pid: el.dataset.bid!, offset: Math.max(0, Math.round(top - r.top)) };
  }
  return null;
}

export function ReadingScreen({ jumpTo }: { jumpTo?: string }) {
  const { progress, update } = useProgress();
  const [current, setCurrent] = useState<string | null>(progress.readPos?.pid ?? null);
  const [tocOpen, setTocOpen] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const saveTimer = useRef<number>();
  const fontRestore = useRef<{ pid: string; offset: number } | null>(null);
  const restored = useRef(false);

  // Restaura o ponto de leitura (ou vai ao trecho pedido por um link).
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

  // Salva a posição enquanto a estudante rola.
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const pos = currentBlock();
        if (!pos) return;
        setCurrent(pos.pid);
        window.clearTimeout(saveTimer.current);
        saveTimer.current = window.setTimeout(() => {
          update((p) => ({ ...p, readPos: pos }));
        }, 300);
        const end = document.getElementById('fim-da-materia');
        if (end && end.getBoundingClientRect().top < window.innerHeight) {
          update((p) => (p.finishedReading ? p : { ...p, finishedReading: true }));
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
      window.clearTimeout(saveTimer.current);
    };
  }, [update]);

  // Mantém o mesmo ponto ao mudar o tamanho da letra.
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
    setTocOpen(false);
    window.setTimeout(() => {
      scrollToBlock(id);
      setFlash(id);
      window.setTimeout(() => setFlash(null), 2200);
    }, 0);
  }, []);

  const chapter = current ? chapterOf(current) ?? chapters.find((c) => c.id === current) : chapters[0];
  // Marcador: o parágrafo atual (ou o próximo, se o topo for título/figura).
  const bookmarkTarget = (() => {
    if (current && getParagraph(current)) return current;
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-bid]'));
    const i = els.findIndex((e) => e.dataset.bid === current);
    const next = els.slice(Math.max(0, i)).find((e) => getParagraph(e.dataset.bid!));
    return next?.dataset.bid ?? 'c1p1';
  })();
  const isBookmarked = progress.bookmarks.includes(bookmarkTarget);

  return (
    <div className="reader" style={{ ['--read-size' as string]: `${FONT_SIZES[progress.fontStep]}px` }}>
      <div className="reader-bar" role="toolbar" aria-label="Ferramentas de leitura">
        <button className="btn ghost small" onClick={() => setTocOpen(true)}>
          Índice
        </button>
        <span className="reader-where" aria-live="off">
          {chapter ? `Cap. ${chapter.number}` : ''}
        </span>
        <button className="btn ghost small" onClick={() => setFont(progress.fontStep - 1)} disabled={progress.fontStep === 0} aria-label="Diminuir letra">
          A−
        </button>
        <button className="btn ghost small" onClick={() => setFont(progress.fontStep + 1)} disabled={progress.fontStep === FONT_SIZES.length - 1} aria-label="Aumentar letra">
          A+
        </button>
        <button
          className={`btn ghost small ${isBookmarked ? 'on' : ''}`}
          aria-pressed={isBookmarked}
          onClick={() => update(toggleBookmark(bookmarkTarget))}
          aria-label={isBookmarked ? 'Remover marcador deste trecho' : 'Marcar este trecho'}
        >
          {isBookmarked ? '★' : '☆'}
        </button>
      </div>

      <article className="reading">
        <header className="reading-head">
          <p className="kicker">Memória em Foco · Texto de estudo</p>
          <h1>Memória no cérebro e na esquizofrenia</h1>
          <p className="muted">
            Seis capítulos curtos, para ler em sequência. Toque nos termos sublinhados para rever a definição e nos números
            entre colchetes para ver a fonte. Leitura de cerca de 15 minutos.
          </p>
        </header>

        {chapters.map((c) => (
          <section key={c.id} className="chapter" aria-labelledby={`h-${c.id}`}>
            <h2 id={`h-${c.id}`} data-bid={c.id} className={flash === c.id ? 'flash' : ''}>
              <span className="chapter-num">Capítulo {c.number}</span>
              {c.title}
            </h2>
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

        <section id="fim-da-materia" data-bid="fim" className="card end-card">
          <h2>Fim da matéria</h2>
          <p>
            Agora vem a prática: um caso que junta os capítulos, exercícios com correção comentada, a banca oral e o ensaio
            da apresentação.
          </p>
          <button className="btn primary block" onClick={() => navigate('/praticar')}>
            Praticar
          </button>
          <button className="btn ghost block" onClick={() => navigate('/glossario')}>
            Glossário
          </button>
        </section>
      </article>

      {tocOpen && (
        <Modal title="Índice" onClose={() => setTocOpen(false)}>
          <ol className="toc">
            {chapters.map((c) => (
              <li key={c.id}>
                <button className={`toc-item ${chapter?.id === c.id ? 'here' : ''}`} onClick={() => goTo(c.id)}>
                  <span className="muted small">Capítulo {c.number}</span>
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
            <button className="btn ghost block" onClick={() => goTo("fim")}>
              Ir para o fim da matéria
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
