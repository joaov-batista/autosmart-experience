import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Stroke } from '../notes';

export const PAGE_W = 1000;
export const PAGE_H = 1400;

export type InkTool = 'pen' | 'marker' | 'eraser';

interface Props {
  strokes: Stroke[];
  onChange: (strokes: Stroke[]) => void;
  tool: InkTool;
  color: string;
  penOnly: boolean;
}

function cssVar(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function drawStroke(ctx: CanvasRenderingContext2D, s: Stroke, scale: number) {
  const p = s.pts;
  if (p.length < 2) return;
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = s.color.startsWith('#') ? s.color : cssVar(`--pen-${s.color}`, '#333');
  ctx.globalAlpha = s.tool === 'marker' ? 0.32 : 1;
  ctx.lineWidth = s.width * scale;
  ctx.beginPath();
  ctx.moveTo(p[0] * scale, p[1] * scale);
  if (p.length === 2) {
    ctx.lineTo(p[0] * scale + 0.1, p[1] * scale + 0.1);
  } else {
    for (let i = 2; i < p.length - 2; i += 2) {
      const mx = ((p[i] + p[i + 2]) / 2) * scale;
      const my = ((p[i + 1] + p[i + 3]) / 2) * scale;
      ctx.quadraticCurveTo(p[i] * scale, p[i + 1] * scale, mx, my);
    }
    ctx.lineTo(p[p.length - 2] * scale, p[p.length - 1] * scale);
  }
  ctx.stroke();
  ctx.restore();
}

/** Folha para escrever com caneta (ou dedo). Guarda traços vetoriais; desenha em canvas. */
export function InkCanvas({ strokes, onChange, tool, color, penOnly }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cssWidth, setCssWidth] = useState(600);
  const drawing = useRef<{ stroke: Stroke | null; pointerId: number | null; erased: boolean }>({ stroke: null, pointerId: null, erased: false });
  const strokesRef = useRef(strokes);
  strokesRef.current = strokes;

  // Acompanha a largura do contêiner (celular, tablet, desktop).
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setCssWidth(el.clientWidth));
    ro.observe(el);
    setCssWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const scale = cssWidth / PAGE_W;

  const redraw = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const w = cssWidth;
    const h = PAGE_H * scale;
    if (c.width !== Math.round(w * dpr)) {
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
    }
    const ctx = c.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    // pauta suave
    ctx.strokeStyle = cssVar('--paper-line', '#e6e3dc');
    ctx.lineWidth = 1;
    for (let y = 70; y < PAGE_H; y += 56) {
      ctx.beginPath();
      ctx.moveTo(0, y * scale);
      ctx.lineTo(w, y * scale);
      ctx.stroke();
    }
    for (const s of strokesRef.current) drawStroke(ctx, s, scale);
    if (drawing.current.stroke) drawStroke(ctx, drawing.current.stroke, scale);
  }, [cssWidth, scale]);

  useEffect(() => {
    redraw();
  }, [strokes, redraw]);

  // Redesenha ao trocar o tema (as cores da caneta acompanham o tema).
  useEffect(() => {
    window.addEventListener('mef-theme', redraw);
    return () => window.removeEventListener('mef-theme', redraw);
  }, [redraw]);

  // No iPad, impede que a Apple Pencil role a página no modo “só caneta” (o dedo continua rolando).
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const block = (e: TouchEvent) => {
      const stylus = Array.from(e.touches).some((t) => (t as Touch & { touchType?: string }).touchType === 'stylus');
      if (!penOnly || stylus) e.preventDefault();
    };
    c.addEventListener('touchstart', block, { passive: false });
    c.addEventListener('touchmove', block, { passive: false });
    return () => {
      c.removeEventListener('touchstart', block);
      c.removeEventListener('touchmove', block);
    };
  }, [penOnly]);

  const toLogical = (e: PointerEvent | React.PointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return [Math.round(((e.clientX - r.left) / r.width) * PAGE_W), Math.round(((e.clientY - r.top) / r.height) * PAGE_H)];
  };

  const eraseAt = (x: number, y: number) => {
    const R = 18;
    // distância do ponto da borracha até cada segmento do traço
    const segDist2 = (ax: number, ay: number, bx: number, by: number) => {
      const vx = bx - ax;
      const vy = by - ay;
      const len2 = vx * vx + vy * vy;
      const t = len2 ? Math.max(0, Math.min(1, ((x - ax) * vx + (y - ay) * vy) / len2)) : 0;
      const dx = ax + t * vx - x;
      const dy = ay + t * vy - y;
      return dx * dx + dy * dy;
    };
    const keep = strokesRef.current.filter((s) => {
      const lim = (R + s.width / 2) ** 2;
      const p = s.pts;
      if (p.length === 2) return segDist2(p[0], p[1], p[0], p[1]) >= lim;
      for (let i = 0; i < p.length - 2; i += 2) {
        if (segDist2(p[i], p[i + 1], p[i + 2], p[i + 3]) < lim) return false;
      }
      return true;
    });
    if (keep.length !== strokesRef.current.length) {
      strokesRef.current = keep;
      drawing.current.erased = true;
      redraw();
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (penOnly && e.pointerType === 'touch') return;
    if (e.button > 0) return;
    e.preventDefault();
    canvasRef.current!.setPointerCapture(e.pointerId);
    const [x, y] = toLogical(e);
    drawing.current.pointerId = e.pointerId;
    if (tool === 'eraser') {
      drawing.current.erased = false;
      eraseAt(x, y);
      return;
    }
    drawing.current.stroke = {
      tool: tool === 'marker' ? 'marker' : 'pen',
      color,
      width: tool === 'marker' ? 26 : 4,
      pts: [x, y],
    };
    redraw();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (drawing.current.pointerId !== e.pointerId) return;
    const events = (e.nativeEvent.getCoalescedEvents?.() ?? [e.nativeEvent]) as PointerEvent[];
    for (const ev of events) {
      const [x, y] = toLogical(ev);
      if (tool === 'eraser') {
        eraseAt(x, y);
        continue;
      }
      const s = drawing.current.stroke;
      if (!s) continue;
      const lx = s.pts[s.pts.length - 2];
      const ly = s.pts[s.pts.length - 1];
      if (Math.abs(x - lx) + Math.abs(y - ly) >= 2) s.pts.push(x, y);
    }
    redraw();
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (drawing.current.pointerId !== e.pointerId) return;
    drawing.current.pointerId = null;
    if (tool === 'eraser') {
      if (drawing.current.erased) onChange(strokesRef.current);
      return;
    }
    const s = drawing.current.stroke;
    drawing.current.stroke = null;
    if (s) onChange([...strokesRef.current, s]);
  };

  return (
    <div ref={wrapRef} className="ink-wrap">
      <canvas
        ref={canvasRef}
        className={`ink-canvas ${penOnly ? 'pen-only' : ''} tool-${tool}`}
        style={{ width: '100%', height: PAGE_H * scale }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        aria-label="Folha para escrever à mão"
        role="img"
      />
    </div>
  );
}

/** Reconhecimento de escrita do próprio navegador, quando existe (hoje, principalmente Chrome em alguns sistemas). */
interface HWRecognizer {
  startDrawing: (o: object) => {
    addStroke: (s: unknown) => void;
    getPrediction: () => Promise<{ text: string }[]>;
  };
  finish?: () => void;
}
type HWNavigator = Navigator & {
  createHandwritingRecognizer?: (o: object) => Promise<HWRecognizer>;
  queryHandwritingRecognizer?: (o: object) => Promise<unknown>;
};
declare const HandwritingStroke: { new (): { addPoint: (p: { x: number; y: number; t: number }) => void } } | undefined;

export function handwritingSupported() {
  return typeof navigator !== 'undefined' && 'createHandwritingRecognizer' in navigator && typeof HandwritingStroke !== 'undefined';
}

export async function recognizeHandwriting(strokes: Stroke[]): Promise<string> {
  const nav = navigator as HWNavigator;
  const rec = await nav.createHandwritingRecognizer!({ languages: ['pt-BR'] });
  const drawing = rec.startDrawing({ recognitionType: 'text', inputType: 'stylus' });
  let t = 0;
  for (const s of strokes.filter((x) => x.tool === 'pen')) {
    const hs = new HandwritingStroke!();
    for (let i = 0; i < s.pts.length; i += 2) hs.addPoint({ x: s.pts[i], y: s.pts[i + 1], t: (t += 8) });
    drawing.addStroke(hs);
  }
  const pred = await drawing.getPrediction();
  rec.finish?.();
  return pred?.[0]?.text ?? '';
}
