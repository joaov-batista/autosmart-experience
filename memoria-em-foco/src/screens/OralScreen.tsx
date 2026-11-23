import { useEffect, useRef, useState } from 'react';
import { followUps, oralQuestions } from '../data/oral';
import type { OralQuestion } from '../data/types';
import { RefButtons } from '../components/References';
import { SelfCheck, type SelfRating } from '../components/SelfCheck';
import { TopBar } from '../components/TopBar';
import { addSession, markOral, useProgress } from '../storage';
import { navigate, shuffle } from '../utils';

export function OralCard({ q, onRated }: { q: OralQuestion; onRated: (r: SelfRating) => void }) {
  const { update } = useProgress();
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
      note={q.note}
      extra={
        <p className="small">
          Fonte correspondente: <RefButtons refs={q.refs} />
        </p>
      }
      onRate={(r) => {
        update(markOral(q.id, r));
        onRated(r);
      }}
    />
  );
}

const THINK_SECONDS = 10;

function FollowUp({ onNext }: { onNext: () => void }) {
  const [f] = useState(() => followUps[Math.floor(Math.random() * followUps.length)]);
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
      <h2 className="q-prompt big">“{f.question}”</h2>
      <p className="muted">Pense e responda em voz alta. Não há resposta na tela enquanto você fala.</p>
      <p className="think" aria-live="off">
        Tempo pensando: {elapsed}s
      </p>
      {!shown ? (
        <button className="btn primary block" disabled={!ready} onClick={() => setShown(true)}>
          {ready ? 'Ver orientação' : `Pense mais um pouco… (${THINK_SECONDS - elapsed}s)`}
        </button>
      ) : (
        <div className="reveal" aria-live="polite">
          <h3>Orientação</h3>
          <p>{f.guidance}</p>
          <button className="btn primary block" onClick={onNext}>
            Próxima pergunta
          </button>
        </div>
      )}
    </div>
  );
}

export function OralScreen({ onlyDifficult }: { onlyDifficult?: boolean }) {
  const { progress, update } = useProgress();
  const [order] = useState(() =>
    shuffle(onlyDifficult ? oralQuestions.filter((q) => progress.oralDifficult.includes(q.id)) : oralQuestions),
  );
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const finished = index >= order.length;

  useEffect(() => {
    window.scrollTo(0, 0);
    headingRef.current?.focus();
  }, [index, showFollowUp]);

  useEffect(() => {
    if (finished && answered > 0) update(addSession('oral'));
  }, [finished, answered, update]);

  const title = onlyDifficult ? 'Banca · tópicos difíceis' : 'Treinar com a professora';

  if (order.length === 0) {
    return (
      <div className="screen">
        <TopBar title={title} />
        <section className="card center">
          <h1 ref={headingRef} tabIndex={-1}>
            Nenhum tópico marcado
          </h1>
          <p>Quando você marcar “Faltou um ponto” na banca, a pergunta aparece aqui.</p>
          <button className="btn primary block" onClick={() => navigate('/banca')}>
            Treinar todas as perguntas
          </button>
        </section>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="screen">
        <TopBar title={title} />
        <section className="card center">
          <h1 ref={headingRef} tabIndex={-1}>
            Banca concluída
          </h1>
          <p>{progress.oralDifficult.length} tópico(s) marcado(s) para revisar.</p>
          <div className="stack">
            {progress.oralDifficult.length > 0 && (
              <button className="btn primary block" onClick={() => navigate('/banca/dificeis')}>
                Treinar tópicos difíceis
              </button>
            )}
            <button className="btn ghost block" onClick={() => navigate('/')}>
              Voltar ao início
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="screen">
      <TopBar title={title} />
      <p className="muted small step-count">
        Pergunta {index + 1} de {order.length}
      </p>
      <h1 className="sr-only" ref={headingRef} tabIndex={-1}>
        {showFollowUp ? 'Réplica' : `Pergunta ${index + 1}`}
      </h1>
      <section className="card" key={showFollowUp ? 'f' : order[index].id}>
        {showFollowUp ? (
          <FollowUp
            onNext={() => {
              setShowFollowUp(false);
              setIndex((i) => i + 1);
            }}
          />
        ) : (
          <OralCard
            q={order[index]}
            onRated={() => {
              const first = answered === 0;
              setAnswered((a) => a + 1);
              if (first) setShowFollowUp(true);
              else setIndex((i) => i + 1);
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
