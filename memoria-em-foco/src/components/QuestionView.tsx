import { useMemo, useState } from 'react';
import type { MatchQuestion, OrderQuestion, Question, ShortQuestion, SingleQuestion } from '../data/types';
import { normalize, shuffle } from '../utils';
import { FictionalTag, RichText } from './References';
import { SelfCheck } from './SelfCheck';

interface Props {
  question: Question;
  /** Chamado quando a estudante segue adiante depois da correção. */
  onDone: (correct: boolean) => void;
  badge?: string;
}

export function QuestionView({ question, onDone, badge }: Props) {
  // key garante estado novo a cada questão
  return (
    <div className="question" key={question.id}>
      {badge && <p className="badge">{badge}</p>}
      {question.fictional && <FictionalTag />}
      {question.context && <p>{question.context}</p>}
      <Body question={question} onDone={onDone} />
    </div>
  );
}

function Body({ question, onDone }: Props) {
  switch (question.type) {
    case 'single':
      return <Single q={question} onDone={onDone} />;
    case 'match':
      return <Match q={question} onDone={onDone} />;
    case 'order':
      return <Order q={question} onDone={onDone} />;
    case 'short':
      return <Short q={question} onDone={onDone} />;
    case 'open':
      return (
        <SelfCheck
          prompt={<h2 className="q-prompt">{question.prompt}</h2>}
          model={question.model}
          criteria={question.criteria}
          onRate={(r) => onDone(r === 'ok')}
        />
      );
  }
}

function Result({ correct, explanation, onNext }: { correct: boolean; explanation: string; onNext: () => void }) {
  return (
    <div className={`result ${correct ? 'is-correct' : 'is-wrong'}`} role="status" aria-live="polite">
      <p className="result-title">
        <span aria-hidden="true">{correct ? '✓' : '↻'}</span> {correct ? 'Certo!' : 'Ainda não — veja o raciocínio'}
      </p>
      <p>
        <RichText text={explanation} />
      </p>
      <button className="btn primary block" onClick={onNext} autoFocus>
        Continuar
      </button>
    </div>
  );
}

function Single({ q, onDone }: { q: SingleQuestion; onDone: Props['onDone'] }) {
  const choices = useMemo(() => shuffle(q.choices), [q]);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const correct = selected === q.correctId; // correção pelo ID, nunca pela posição
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
            <button
              key={c.id}
              role="radio"
              aria-checked={isSel}
              className={`choice ${state}`}
              disabled={checked}
              onClick={() => setSelected(c.id)}
            >
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
          <Result correct={correct} explanation={q.explanation} onNext={() => onDone(correct)} />
        </>
      )}
    </>
  );
}

function Match({ q, onDone }: { q: MatchQuestion; onDone: Props['onDone'] }) {
  const lefts = useMemo(() => shuffle(q.pairs), [q]);
  const rights = useMemo(() => shuffle(q.pairs.map((p) => ({ id: p.id, text: p.right }))), [q]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const complete = q.pairs.every((p) => answers[p.id]);
  const allCorrect = q.pairs.every((p) => answers[p.id] === p.id);

  return (
    <>
      <h2 className="q-prompt">{q.prompt}</h2>
      <div className="match">
        {lefts.map((p) => {
          const ok = answers[p.id] === p.id;
          return (
            <div key={p.id} className={`match-row ${checked ? (ok ? 'correct' : 'wrong') : ''}`}>
              <label htmlFor={`m-${q.id}-${p.id}`} className="match-left">
                {p.left}
              </label>
              <select
                id={`m-${q.id}-${p.id}`}
                value={answers[p.id] ?? ''}
                disabled={checked}
                onChange={(e) => setAnswers((a) => ({ ...a, [p.id]: e.target.value }))}
              >
                <option value="">Escolha…</option>
                {rights.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.text}
                  </option>
                ))}
              </select>
              {checked && (
                <p className="match-fb">
                  <strong>{ok ? '✓ Certo.' : `✗ Era: ${p.right}.`}</strong> {p.feedback}
                </p>
              )}
            </div>
          );
        })}
      </div>
      {!checked ? (
        <button className="btn primary block" disabled={!complete} onClick={() => setChecked(true)}>
          Verificar
        </button>
      ) : (
        <Result correct={allCorrect} explanation={q.explanation} onNext={() => onDone(allCorrect)} />
      )}
    </>
  );
}

function Order({ q, onDone }: { q: OrderQuestion; onDone: Props['onDone'] }) {
  const [items, setItems] = useState(() => {
    let s = shuffle(q.items);
    // evita começar já na ordem certa
    while (s.length > 1 && s.every((it, i) => it.id === q.items[i].id)) s = shuffle(q.items);
    return s;
  });
  const [checked, setChecked] = useState(false);
  const allCorrect = items.every((it, i) => it.id === q.items[i].id);
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
          const ok = it.id === q.items[i].id;
          return (
            <li key={it.id} className={`order-item ${checked ? (ok ? 'correct' : 'wrong') : ''}`}>
              <span className="order-num">{i + 1}</span>
              <span className="order-text">
                {it.text}
                {checked && <strong className="mark">{ok ? ' ✓' : ' ✗ fora de lugar'}</strong>}
              </span>
              {!checked && (
                <span className="order-btns">
                  <button className="icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Subir: ${it.text}`}>
                    ↑
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => move(i, 1)}
                    disabled={i === items.length - 1}
                    aria-label={`Descer: ${it.text}`}
                  >
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
          {!allCorrect && (
            <div className="feedback">
              <p className="small muted">Ordem esperada:</p>
              <ol>
                {q.items.map((it) => (
                  <li key={it.id}>{it.text}</li>
                ))}
              </ol>
            </div>
          )}
          <Result correct={allCorrect} explanation={q.explanation} onNext={() => onDone(allCorrect)} />
        </>
      )}
    </>
  );
}

function Short({ q, onDone }: { q: ShortQuestion; onDone: Props['onDone'] }) {
  const [value, setValue] = useState('');
  const [checked, setChecked] = useState(false);
  const correct = q.accept.includes(normalize(value));
  return (
    <>
      <h2 className="q-prompt">{q.prompt}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim()) setChecked(true);
        }}
      >
        <label className="field">
          <span className="label">Sua resposta</span>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={q.placeholder}
            disabled={checked}
            inputMode="text"
            autoComplete="off"
          />
        </label>
        {!checked && (
          <button className="btn primary block" disabled={!value.trim()} type="submit">
            Verificar
          </button>
        )}
      </form>
      {checked && (
        <>
          <div className="feedback">
            <p>
              Você escreveu <strong>{value}</strong>. Resposta esperada: <strong>{q.correctAnswer}</strong>.
            </p>
            {!correct && <p>Confira se inverteu a sequência inteira, do último para o primeiro.</p>}
          </div>
          <Result correct={correct} explanation={q.explanation} onNext={() => onDone(correct)} />
        </>
      )}
    </>
  );
}
