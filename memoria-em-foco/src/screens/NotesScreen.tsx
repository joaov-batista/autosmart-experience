import { useState } from 'react';
import { useNotes } from '../notes';
import { NotesEditor } from '../components/NotesEditor';
import { getParagraph } from '../data/chapters';
import { removeHighlight, useProgress, type HighlightColor } from '../storage';
import { navigate } from '../utils';

const COLOR_LABEL: Record<HighlightColor, string> = { yellow: 'Amarelo', green: 'Verde', blue: 'Azul', pink: 'Rosa' };

export function PageList({ onOpen }: { onOpen?: (id: string) => void }) {
  const { pages, activeId, setActive, createPage } = useNotes();
  const open = (id: string) => {
    setActive(id);
    onOpen?.(id);
  };
  return (
    <div className="page-list">
      <button className="btn primary block" onClick={() => open(createPage())}>
        + Nova página
      </button>
      {pages.length === 0 ? (
        <p className="muted small">Nenhuma página ainda. Crie uma para anotar digitando ou com caneta.</p>
      ) : (
        <ul>
          {pages.map((p) => (
            <li key={p.id}>
              <button className={`page-item ${activeId === p.id ? 'on' : ''}`} onClick={() => open(p.id)}>
                <span className="page-item-title">
                  {p.mode === 'ink' ? '✎ ' : '⌨ '}
                  {p.title || 'Sem título'}
                </span>
                <span className="muted small">
                  {p.text ? p.text.slice(0, 60) : p.strokes.length ? `${p.strokes.length} traço(s) à mão` : 'vazia'}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function HighlightList() {
  const { progress, update } = useProgress();
  const [filter, setFilter] = useState<HighlightColor | 'all'>('all');
  const items = progress.highlights
    .filter((h) => filter === 'all' || h.color === filter)
    .map((h) => ({ h, p: getParagraph(h.pid) }))
    .filter((x) => x.p)
    .sort((a, b) => a.p!.chapter.number - b.p!.chapter.number || a.h.pid.localeCompare(b.h.pid) || a.h.start - b.h.start);
  return (
    <div>
      <div className="filter-row" role="group" aria-label="Filtrar por cor">
        <button className={`chip-sm ${filter === 'all' ? 'on' : ''}`} onClick={() => setFilter('all')}>
          Todas ({progress.highlights.length})
        </button>
        {(Object.keys(COLOR_LABEL) as HighlightColor[]).map((c) => (
          <button key={c} className={`chip-sm ${filter === c ? 'on' : ''}`} onClick={() => setFilter(c)} aria-label={`Só ${COLOR_LABEL[c]}`}>
            <span className={`dot-color hl-${c}`} aria-hidden="true" /> {COLOR_LABEL[c]}
          </button>
        ))}
      </div>
      {items.length === 0 ? (
        <p className="muted">
          Nenhuma marcação {filter === 'all' ? 'ainda' : 'nesta cor'}. Na leitura, selecione um trecho com o dedo, o mouse ou a
          caneta e escolha uma cor.
        </p>
      ) : (
        <ul className="hl-list">
          {items.map(({ h, p }) => (
            <li key={h.id} className={`hl-item hl-border-${h.color}`}>
              <p className="hl-quote">“{h.text}”</p>
              <p className="muted small">
                Cap. {p!.chapter.number} · {COLOR_LABEL[h.color]}
              </p>
              <div className="row-btns">
                <button className="btn ghost small" onClick={() => navigate(`/estudar/${h.pid}`)}>
                  Ver no texto
                </button>
                <button className="btn ghost small" onClick={() => update(removeHighlight(h.id))}>
                  Remover
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function NotesScreen() {
  const { pages, activeId, setActive, saveError } = useNotes();
  const [tab, setTab] = useState<'pages' | 'highlights'>('pages');
  const active = pages.find((p) => p.id === activeId);
  // No celular, a lista e o editor alternam; em telas largas ficam lado a lado.
  const [mobileEditing, setMobileEditing] = useState(Boolean(active));

  return (
    <div className="screen notes-screen">
      <h1 className="screen-title">Anotações</h1>
      {saveError && <p className="notice small">O armazenamento do aparelho está cheio. Apague páginas antigas para continuar salvando.</p>}
      <div className="seg" role="tablist" aria-label="Seções">
        <button role="tab" aria-selected={tab === 'pages'} className={`seg-btn ${tab === 'pages' ? 'on' : ''}`} onClick={() => setTab('pages')}>
          Páginas ({pages.length})
        </button>
        <button role="tab" aria-selected={tab === 'highlights'} className={`seg-btn ${tab === 'highlights' ? 'on' : ''}`} onClick={() => setTab('highlights')}>
          Marcações no texto
        </button>
      </div>

      {tab === 'highlights' ? (
        <HighlightList />
      ) : (
        <div className={`notes-split ${mobileEditing && active ? 'editing' : ''}`}>
          <aside className="notes-side">
            <PageList onOpen={() => setMobileEditing(true)} />
          </aside>
          <section className="notes-main">
            {active ? (
              <>
                <button
                  className="btn ghost small back-to-list"
                  onClick={() => {
                    setMobileEditing(false);
                    setActive(null);
                  }}
                >
                  ← Todas as páginas
                </button>
                <NotesEditor key={active.id} pageId={active.id} />
              </>
            ) : (
              <div className="empty-editor muted">Escolha ou crie uma página.</div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
