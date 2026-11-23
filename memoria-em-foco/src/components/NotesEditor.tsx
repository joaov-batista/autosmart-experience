import { useEffect, useRef, useState } from 'react';
import { useNotes, type Stroke } from '../notes';
import { getParagraph } from '../data/chapters';
import { InkCanvas, handwritingSupported, recognizeHandwriting, type InkTool } from './InkCanvas';
import { navigate } from '../utils';

const PENS = [
  { id: 'ink', label: 'Grafite' },
  { id: 'blue', label: 'Azul' },
  { id: 'red', label: 'Vermelho' },
  { id: 'green', label: 'Verde' },
];
const MARKERS = [
  { id: 'm-yellow', label: 'Amarelo' },
  { id: 'm-green', label: 'Verde' },
  { id: 'm-pink', label: 'Rosa' },
];

function readPref<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : (JSON.parse(v) as T);
  } catch {
    return fallback;
  }
}
function writePref(key: string, v: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {
    /* ignorado */
  }
}

export function NotesEditor({ pageId, compact }: { pageId: string; compact?: boolean }) {
  const { pages, updatePage, deletePage } = useNotes();
  const page = pages.find((p) => p.id === pageId);
  const [tool, setTool] = useState<InkTool>('pen');
  const [penColor, setPenColor] = useState('ink');
  const [markerColor, setMarkerColor] = useState('m-yellow');
  const [penOnly, setPenOnly] = useState(() => readPref('mef:penOnly', false));
  const [history, setHistory] = useState<Stroke[][]>([]);
  const [converting, setConverting] = useState<'idle' | 'busy' | 'error'>('idle');
  const [copied, setCopied] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => writePref('mef:penOnly', penOnly), [penOnly]);

  // textarea cresce com o conteúdo
  useEffect(() => {
    const t = textRef.current;
    if (t) {
      t.style.height = 'auto';
      t.style.height = Math.max(compact ? 220 : 320, t.scrollHeight) + 'px';
    }
  }, [page?.text, page?.mode, compact]);

  if (!page) return <p className="muted">Página não encontrada.</p>;
  const para = page.pid ? getParagraph(page.pid) : undefined;

  const setStrokes = (next: Stroke[]) => {
    setHistory((h) => [...h.slice(-29), page.strokes]);
    updatePage(page.id, { strokes: next });
  };
  const undo = () => {
    const prev = history[history.length - 1];
    if (!prev) return;
    setHistory((h) => h.slice(0, -1));
    updatePage(page.id, { strokes: prev });
  };

  const convert = async () => {
    setConverting('busy');
    try {
      const txt = await recognizeHandwriting(page.strokes);
      if (!txt.trim()) throw new Error('vazio');
      updatePage(page.id, { text: (page.text ? page.text.trimEnd() + '\n\n' : '') + txt.trim(), mode: 'text' });
      setConverting('idle');
    } catch {
      setConverting('error');
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${page.title}\n\n${page.text}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* sem permissão de área de transferência */
    }
  };

  return (
    <div className={`notes-editor ${compact ? 'compact' : ''}`}>
      <input
        className="note-title"
        value={page.title}
        onChange={(e) => updatePage(page.id, { title: e.target.value })}
        aria-label="Título da página"
      />
      {para && (
        <p className="note-link small">
          Sobre: {para.sectionTitle} ·{' '}
          <button className="linklike" onClick={() => navigate(`/estudar/${para.id}`)}>
            ver o trecho no texto
          </button>
        </p>
      )}

      <div className="seg" role="tablist" aria-label="Como anotar">
        <button role="tab" aria-selected={page.mode === 'text'} className={`seg-btn ${page.mode === 'text' ? 'on' : ''}`} onClick={() => updatePage(page.id, { mode: 'text' })}>
          ⌨ Digitar
        </button>
        <button role="tab" aria-selected={page.mode === 'ink'} className={`seg-btn ${page.mode === 'ink' ? 'on' : ''}`} onClick={() => updatePage(page.id, { mode: 'ink' })}>
          ✎ Caneta
        </button>
      </div>

      {page.mode === 'text' ? (
        <>
          <textarea
            ref={textRef}
            className="note-text"
            value={page.text}
            onChange={(e) => updatePage(page.id, { text: e.target.value })}
            placeholder="Escreva aqui suas ideias, dúvidas e palavras-chave…"
            aria-label="Texto da anotação"
          />
          <details className="tip">
            <summary>Escrever à mão e virar texto</summary>
            <p>
              No <strong>iPad com Apple Pencil</strong>, escreva com a caneta direto neste campo: o próprio iPad transforma sua
              letra em texto (recurso Rabisco/Scribble, ative em Ajustes › Apple Pencil). No <strong>Android</strong>, escolha a
              escrita à mão no teclado (Gboard). No <strong>Windows</strong>, use o painel de escrita da caneta.
            </p>
            <p>Se preferir guardar sua letra como desenho, use o modo Caneta.</p>
          </details>
        </>
      ) : (
        <>
          <div className="ink-toolbar" role="toolbar" aria-label="Ferramentas da caneta">
            <div className="tool-group">
              {PENS.map((p) => (
                <button
                  key={p.id}
                  className={`swatch pen-${p.id} ${tool === 'pen' && penColor === p.id ? 'on' : ''}`}
                  aria-label={`Caneta ${p.label}`}
                  aria-pressed={tool === 'pen' && penColor === p.id}
                  onClick={() => {
                    setTool('pen');
                    setPenColor(p.id);
                  }}
                />
              ))}
            </div>
            <div className="tool-group">
              {MARKERS.map((m) => (
                <button
                  key={m.id}
                  className={`swatch marker ${m.id} ${tool === 'marker' && markerColor === m.id ? 'on' : ''}`}
                  aria-label={`Marca-texto ${m.label}`}
                  aria-pressed={tool === 'marker' && markerColor === m.id}
                  onClick={() => {
                    setTool('marker');
                    setMarkerColor(m.id);
                  }}
                />
              ))}
            </div>
            <div className="tool-group">
              <button className={`tool-btn ${tool === 'eraser' ? 'on' : ''}`} aria-pressed={tool === 'eraser'} onClick={() => setTool('eraser')}>
                Borracha
              </button>
              <button className="tool-btn" onClick={undo} disabled={!history.length}>
                Desfazer
              </button>
              <button
                className="tool-btn"
                onClick={() => {
                  if (page.strokes.length && confirm('Apagar toda a escrita desta página?')) setStrokes([]);
                }}
                disabled={!page.strokes.length}
              >
                Limpar
              </button>
            </div>
          </div>
          <label className="check inline">
            <input type="checkbox" checked={penOnly} onChange={(e) => setPenOnly(e.target.checked)} />
            <span>Só caneta: o dedo rola a página e não risca (bom para tablet com caneta)</span>
          </label>
          <InkCanvas strokes={page.strokes} onChange={setStrokes} tool={tool} color={tool === 'marker' ? markerColor : penColor} penOnly={penOnly} />
          {handwritingSupported() ? (
            <div className="convert-row">
              <button className="btn secondary block" onClick={convert} disabled={!page.strokes.length || converting === 'busy'}>
                {converting === 'busy' ? 'Reconhecendo…' : 'Transformar escrita em texto'}
              </button>
              {converting === 'error' && <p className="small muted">Não consegui reconhecer. Tente escrever um pouco maior, ou use o modo Digitar.</p>}
            </div>
          ) : (
            <p className="small muted">
              Para transformar a letra em texto, use o modo <strong>Digitar</strong> e escreva com a caneta no campo (iPad: Rabisco;
              Android: Gboard). Aqui a escrita fica guardada como desenho.
            </p>
          )}
        </>
      )}

      <div className="note-actions">
        {page.text && (
          <button className="btn ghost small" onClick={copy}>
            {copied ? 'Copiado ✓' : 'Copiar texto'}
          </button>
        )}
        <button
          className="btn ghost small danger"
          onClick={() => {
            if (confirm('Excluir esta página de anotação?')) deletePage(page.id);
          }}
        >
          Excluir página
        </button>
      </div>
    </div>
  );
}
