import { useEffect, useRef, useState } from 'react';
import { oralQuestions } from '../data/oral';
import type { OralQuestion } from '../data/types';
import { RefButtons, useSheets } from '../components/References';
import { SelfCheck } from '../components/SelfCheck';
import { addSession, setOralReview, useProgress } from '../storage';
import { navigate, shuffle } from '../utils';

const THINK_SECONDS = 10;

export function OralCard({ q, onRated }: { q: OralQuestion; onRated: () => void }) {
  const { update } = useProgress();
  const { openParagraph } = useSheets();
  return (
    <SelfCheck
      key={q.id}
      prompt={
        <>
          <p className="badge">A professora pergunta</p>
          <h2 className="q-prompt big">“{q.question}”</h2>
        </>
      }
      model={q.model}
      criteria={q.criteria}
      extra={
        <p className="small">
          Fonte: <RefButtons refs={q.refs} />{' '}
          <button className="linklike" onClick={() => openParagraph(q.pid)}>
            Ver o parágrafo no texto
          </button>
        </p>
      }
      onRate={(r) => {
        update(setOralReview(q.id, r === 'missing'));
        onRated();
      }}
    />
  );
}

function FollowUp({ q, onNext }: { q: OralQuestion; onNext: () => void }) {
  const [elapsed, setElapsed] = useState(0);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const ready = elapsed >= THINK_SECONDS;
  return (
    <div className="selfcheck">
      <p className="badge">Réplica da professora</p>
      <h2 className="q-prompt big">“{q.followUp.question}”</h2>
      <p className="muted">Pense e responda em voz alta. Nada aparece na tela enquanto você fala.</p>
      <p className="think">Tempo pensando: {elapsed}s</p>
      {!shown ? (
        <button className="btn primary block" disabled={!ready} onClick={() => setShown(true)}>
          {ready ? 'Ver orientação' : `Pense mais um pouco… (${THINK_SECONDS - elapsed}s)`}
        </button>
      ) : (
        <div className="reveal" aria-live="polite">
          <h3>Orientação</h3>
          <p>{q.followUp.guidance}</p>
          <button className="btn primary block" onClick={onNext}>
            Próxima pergunta
          </button>
        </div>
      )}
    </div>
  );
}

export function OralScreen({ onlyReview }: { onlyReview?: boolean }) {
  const { progress, update } = useProgress();
  const [order] = useState(() => shuffle(onlyReview ? oralQuestions.filter((q) => progress.reviewOral.includes(q.id)) : oralQuestions));
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<'ask' | 'reply'>('ask');
  const [answered, setAnswered] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const finished = index >= order.length;

  useEffect(() => {
    window.scrollTo(0, 0);
    headingRef.current?.focus({ preventScroll: true });
  }, [index, phase]);
  useEffect(() => {
    if (finished && answered > 0) update(addSession('oral'));
  }, [finished, answered, update]);

  if (!order.length || finished) {
    return (
      <div className="screen">
        <section className="card center">
          <h1 ref={headingRef} tabIndex={-1}>
            {order.length ? 'Banca concluída' : 'Nenhuma pergunta guardada'}
          </h1>
          <p>{progress.reviewOral.length} pergunta(s) guardada(s) para rever.</p>
          <div className="stack">
            <button className="btn primary block" onClick={() => navigate('/praticar/revisar')}>
              Para revisar
            </button>
            <button className="btn secondary block" onClick={() => navigate('/ensaiar')}>
              Ensaiar apresentação
            </button>
          </div>
        </section>
      </div>
    );
  }

  const q = order[index];
  return (
    <div className="screen">
      <p className="muted small step-count">
        Banca oral{onlyReview ? ' · revisão' : ''} · pergunta {index + 1} de {order.length}
      </p>
      <h1 className="sr-only" ref={headingRef} tabIndex={-1}>
        {phase === 'reply' ? 'Réplica' : `Pergunta ${index + 1}`}
      </h1>
      <section className="card" key={`${q.id}-${phase}`}>
        {phase === 'ask' ? (
          <OralCard
            q={q}
            onRated={() => {
              setAnswered((a) => a + 1);
              setPhase('reply');
            }}
          />
        ) : (
          <FollowUp
            q={q}
            onNext={() => {
              setPhase('ask');
              setIndex((i) => i + 1);
            }}
          />
        )}
      </section>
      <button className="btn ghost small" onClick={() => setIndex(order.length)}>
        Encerrar sessão
      </button>
    </div>
  );
}
