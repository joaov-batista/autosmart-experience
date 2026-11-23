import type { Highlight, HighlightColor } from '../storage';

export const HL_COLORS: { id: HighlightColor; label: string }[] = [
  { id: 'yellow', label: 'Amarelo' },
  { id: 'green', label: 'Verde' },
  { id: 'blue', label: 'Azul' },
  { id: 'pink', label: 'Rosa' },
];

type HighlightRegistry = { set: (k: string, v: unknown) => void; delete: (k: string) => void };
type CSSWithHighlights = typeof CSS & { highlights?: HighlightRegistry };
declare const Highlight: { new (...ranges: Range[]): unknown } | undefined;

export const highlightApiSupported = () =>
  typeof CSS !== 'undefined' && Boolean((CSS as CSSWithHighlights).highlights) && typeof Highlight !== 'undefined';

/** Posição de caractere de (node, offset) dentro de root. */
export function textOffset(root: Node, node: Node, offset: number): number {
  const r = document.createRange();
  r.setStart(root, 0);
  r.setEnd(node, offset);
  return r.toString().length;
}

/** Constrói um Range a partir de posições de caractere dentro de root. */
export function rangeFromOffsets(root: HTMLElement, start: number, end: number): Range | null {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let pos = 0;
  let startNode: Text | null = null;
  let startOff = 0;
  let node: Text | null;
  const range = document.createRange();
  while ((node = walker.nextNode() as Text | null)) {
    const len = node.data.length;
    if (!startNode && start < pos + len) {
      startNode = node;
      startOff = start - pos;
      range.setStart(node, startOff);
    }
    if (startNode && end <= pos + len) {
      range.setEnd(node, end - pos);
      return range;
    }
    pos += len;
  }
  return null;
}

export interface SelectionPart {
  pid: string;
  start: number;
  end: number;
  text: string;
}

/** Converte a seleção atual em trechos por parágrafo do texto de estudo. */
export function selectionToParts(sel: Selection | null): SelectionPart[] {
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return [];
  const range = sel.getRangeAt(0);
  const out: SelectionPart[] = [];
  document.querySelectorAll<HTMLElement>('.reading-p[data-bid]').forEach((p) => {
    if (!range.intersectsNode(p)) return;
    const pr = document.createRange();
    pr.selectNodeContents(p);
    const full = p.textContent ?? '';
    let start = range.compareBoundaryPoints(Range.START_TO_START, pr) > 0 ? textOffset(p, range.startContainer, range.startOffset) : 0;
    let end = range.compareBoundaryPoints(Range.END_TO_END, pr) < 0 ? textOffset(p, range.endContainer, range.endOffset) : full.length;
    while (start < end && /\s/.test(full[start])) start++;
    while (end > start && /\s/.test(full[end - 1])) end--;
    if (end - start >= 2) out.push({ pid: p.dataset.bid!, start, end, text: full.slice(start, end) });
  });
  return out;
}

/** Pinta as marcações. Com a API de realce, o DOM do React não é alterado. */
export function paintHighlights(highlights: Highlight[]) {
  document.querySelectorAll('.reading-p.has-hl').forEach((el) => el.classList.remove('has-hl'));
  const byColor: Record<string, Range[]> = { yellow: [], green: [], blue: [], pink: [] };
  for (const h of highlights) {
    if (h.orphan) continue;
    const p = document.querySelector<HTMLElement>(`.reading-p[data-bid="${h.pid}"]`);
    if (!p) continue;
    p.classList.add('has-hl');
    const r = rangeFromOffsets(p, h.start, h.end);
    if (r) byColor[h.color].push(r);
  }
  if (!highlightApiSupported()) return;
  const reg = (CSS as CSSWithHighlights).highlights!;
  for (const c of Object.keys(byColor)) {
    if (byColor[c].length) reg.set(`hl-${c}`, new Highlight!(...byColor[c]));
    else reg.delete(`hl-${c}`);
  }
}

/** Marcação existente no ponto tocado, se houver. */
export function highlightAtPoint(x: number, y: number, highlights: Highlight[]): Highlight | null {
  const doc = document as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
  };
  let node: Node | null = null;
  let off = 0;
  const pos = doc.caretPositionFromPoint?.(x, y);
  if (pos) {
    node = pos.offsetNode;
    off = pos.offset;
  } else {
    const r = doc.caretRangeFromPoint?.(x, y);
    if (r) {
      node = r.startContainer;
      off = r.startOffset;
    }
  }
  if (!node) return null;
  const p = (node.nodeType === 1 ? (node as Element) : node.parentElement)?.closest<HTMLElement>('.reading-p[data-bid]');
  if (!p) return null;
  const o = textOffset(p, node, off);
  return highlights.find((h) => !h.orphan && h.pid === p.dataset.bid && o >= h.start && o <= h.end) ?? null;
}
