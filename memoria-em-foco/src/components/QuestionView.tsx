import { useMemo, useState } from 'react';
import type { Exercise, OrderExercise, SingleExercise } from '../data/types';
import { shuffle } from '../utils';
import { RichText, useSheets } from './References';
import { SelfCheck } from './SelfCheck';

interface Props {
  exercise: Exercise;
  /** Chamado quando a estudante segue adiante; `ok=false` guarda o item para revisão. */
  onDone: (ok: boolean) => void;
}

function RereadButton({ pid }: { pid: string }) {
  const { openParagraph } = useSheets();
  return (
    <button className="btn ghost small" onClick={() => openParagraph(pid)}>
      Rever explicação
    </button>
  );
}

export function QuestionView({ exercise, onDone }: Props) {
  return (
    <div className="question">
      <p className="badge">Exercício {exercise.number}</p>
      {exercise.type === 'single' && <Single q={exercise} onDone={onDone} />}
      {exercise.type === 'order' && <Order q={exercise} onDone={onDone} />}
      {exercise.type === 'open' && (
        <SelfCheck
          prompt={<h2 className="q-prompt">{exercise.prompt}</h2>}
          model={exercise.model}
          criteria={exercise.criteria}
          compareLabel="Ver o gabarito"
          extra={
            <>
              <p className="small">
                <RichText text={exercise.explanation} />
              </p>
              <RereadButton pid={exercise.pid} />
            </>
          }
          onRate={(r) => onDone(r === 'ok')}
        />
      )}
    </div>
  );
}

function Result({ ok, q, onNext }: { ok: boolean; q: Exercise; onNext: () => void }) {
  return (
    <div className={`result ${ok ? 'is-correct' : 'is-wrong'}`} role="status" aria-live="polite">
      <p className="result-title">
        <span aria-hidden="true">{ok ? '✓' : '↻'}</span> {ok ? 'Certo!' : 'Ainda não — veja o raciocínio'}
      </p>
      <p>
        <RichText text={q.explanation} />
      </p>
      <RereadButton pid={q.pid} />
      {!ok && <p className="small muted">Este exercício foi guardado em “Para revisar”.</p>}
      <button className="btn primary block" onClick={onNext} autoFocus>
        Continuar
      </button>
    </div>
  );
}

function Single({ q, onDone }: { q: SingleExercise; onDone: Props['onDone'] }) {
  const choices = useMemo(() => shuffle(q.choices), [q]);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const ok = selected === q.correctId; // correção pelo ID, nunca pela posição
  const chosen = q.choices.find((c) => c.id === selected);

  return (
    <>
      <h2 className="q-prompt" id={`p-${q.id}`}>
        {q.prompt}
      </h2>
      <div className="choices" role="radiogroup" aria-labelledby={`p-${q.id}`}>
        {choices.map((c) => {
          const isSel = selected === c.id;
          const state = checked ? (c.id === q.correctId ? 'correct' : isSel ? 'wrong' : 'idle') : isSel ? 'selected' : 'idle';
          return (
            <button key={c.id} role="radio" aria-checked={isSel} className={`choice ${state}`} disabled={checked} onClick={() => setSelected(c.id)}>
              <span className="choice-text">{c.text}</span>
              {checked && c.id === q.correctId && <span className="mark">✓ Correta</span>}
              {checked && isSel && c.id !== q.correctId && <span className="mark">✗ Sua escolha</span>}
            </button>
          );
        })}
      </div>
      {!checked ? (
        <button className="btn primary block" disabled={!selected} onClick={() => setChecked(true)}>
          Verificar
        </button>
      ) : (
        <>
          {chosen && (
            <div className="feedback">
              <p className="small muted">Sobre a sua escolha:</p>
              <p>{chosen.feedback}</p>
            </div>
          )}
          <Result ok={ok} q={q} onNext={() => onDone(ok)} />
        </>
      )}
    </>
  );
}

function Order({ q, onDone }: { q: OrderExercise; onDone: Props['onDone'] }) {
  const [items, setItems] = useState(() => {
    let s = shuffle(q.items);
    while (s.every((it, i) => it.id === q.items[i].id)) s = shuffle(q.items);
    return s;
  });
  const [checked, setChecked] = useState(false);
  const ok = items.every((it, i) => it.id === q.items[i].id);
  const move = (i: number, d: -1 | 1) =>
    setItems((arr) => {
      const j = i + d;
      if (j < 0 || j >= arr.length) return arr;
      const next = arr.slice();
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <>
      <h2 className="q-prompt">{q.prompt}</h2>
      <p className="muted small">Use as setas para mover cada etapa.</p>
      <ol className="order">
        {items.map((it, i) => {
          const right = it.id === q.items[i].id;
          return (
            <li key={it.id} className={`order-item ${checked ? (right ? 'correct' : 'wrong') : ''}`}>
              <span className="order-num">{i + 1}</span>
              <span className="order-text">
                {it.text}
                {checked && <strong className="mark">{right ? ' ✓' : ' ✗ fora de lugar'}</strong>}
              </span>
              {!checked && (
                <span className="order-btns">
                  <button className="icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Subir: ${it.text}`}>
                    ↑
                  </button>
                  <button className="icon-btn" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label={`Descer: ${it.text}`}>
                    ↓
                  </button>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {!checked ? (
        <button className="btn primary block" onClick={() => setChecked(true)}>
          Verificar
        </button>
      ) : (
        <>
          {!ok && (
            <div className="feedback">
              <p className="small muted">Ordem esperada:</p>
              <ol>
                {q.items.map((it) => (
                  <li key={it.id}>{it.text}</li>
                ))}
              </ol>
              <p className="small">Repare na lógica: o canal NMDA só deixa entrar cálcio depois que há glutamato e despolarização suficiente para aliviar o bloqueio por magnésio.</p>
            </div>
          )}
          <Result ok={ok} q={q} onNext={() => onDone(ok)} />
        </>
      )}
    </>
  );
}
