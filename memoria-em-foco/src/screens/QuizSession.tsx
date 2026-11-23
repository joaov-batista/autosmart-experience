import { useEffect, useRef, useState } from 'react';
import { getQuestion, questions } from '../data/questions';
import { QuestionView } from '../components/QuestionView';
import { TopBar } from '../components/TopBar';
import { addSession, clearWrong, markWrong, useProgress, type SessionKind } from '../storage';
import { navigate, shuffle } from '../utils';
import type { Question } from '../data/types';

interface Item {
  /** ID da questão principal (é ele que entra/sai da lista de erros). */
  sourceId: string;
  question: Question;
  isRetry: boolean;
}

function twinOf(sourceId: string, current: Question): Question | undefined {
  const main = getQuestion(sourceId);
  if (!main) return undefined;
  if (current.id === main.id) return main.retryId ? getQuestion(main.retryId) : undefined;
  return main; // se errou a gêmea, volta à versão original
}

function QuizSession({ title, initial, kind }: { title: string; initial: Item[]; kind: SessionKind }) {
  const { update } = useProgress();
  const [queue, setQueue] = useState<Item[]>(initial);
  const [index, setIndex] = useState(0);
  const [stats, setStats] = useState({ right: 0, wrong: 0 });
  const headingRef = useRef<HTMLHeadingElement>(null);
  const finished = index >= queue.length;

  useEffect(() => {
    window.scrollTo(0, 0);
    headingRef.current?.focus();
  }, [index]);

  useEffect(() => {
    if (finished && queue.length > 0) update(addSession(kind));
  }, [finished, queue.length, kind, update]);

  if (queue.length === 0) {
    return (
      <div className="screen">
        <TopBar title={title} />
        <section className="card center">
          <h1 ref={headingRef} tabIndex={-1}>
            Nada para revisar
          </h1>
          <p>Quando você errar uma questão, ela aparece aqui com outro exemplo.</p>
          <button className="btn primary block" onClick={() => navigate('/')}>
            Voltar ao início
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
            Sessão concluída
          </h1>
          <p>
            {stats.right} {stats.right === 1 ? 'acerto' : 'acertos'} · {stats.wrong} para rever
          </p>
          <p className="muted">Questões erradas continuam em “Revisar meus erros” até você acertá-las lá.</p>
          <div className="stack">
            <button className="btn primary block" onClick={() => navigate('/revisar')}>
              Revisar meus erros
            </button>
            <button className="btn ghost block" onClick={() => navigate('/')}>
              Voltar ao início
            </button>
          </div>
        </section>
      </div>
    );
  }

  const item = queue[index];
  const onDone = (correct: boolean) => {
    setStats((s) => (correct ? { ...s, right: s.right + 1 } : { ...s, wrong: s.wrong + 1 }));
    if (correct) {
      if (kind === 'review') update(clearWrong(item.sourceId));
    } else {
      update(markWrong(item.sourceId));
      const twin = !item.isRetry ? twinOf(item.sourceId, item.question) : undefined;
      if (twin) {
        setQueue((q) => [...q.slice(0, index + 1), { sourceId: item.sourceId, question: twin, isRetry: true }, ...q.slice(index + 1)]);
      }
    }
    setIndex((i) => i + 1);
  };

  return (
    <div className="screen">
      <TopBar title={title} />
      <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={queue.length} aria-valuenow={index} aria-label="Progresso da sessão">
        <div className="progress-fill" style={{ width: `${(index / queue.length) * 100}%` }} />
      </div>
      <p className="muted small step-count">
        Questão {index + 1} de {queue.length}
      </p>
      <h1 className="sr-only" ref={headingRef} tabIndex={-1}>
        Questão {index + 1}
      </h1>
      <section className="card" key={`${index}-${item.question.id}`}>
        <QuestionView question={item.question} onDone={onDone} badge={item.isRetry ? 'Mesmo conceito, outro exemplo' : undefined} />
      </section>
    </div>
  );
}

export function MixedScreen() {
  const [initial] = useState<Item[]>(() =>
    shuffle(questions)
      .slice(0, 10)
      .map((q) => ({ sourceId: q.id, question: q, isRetry: false })),
  );
  return <QuizSession title="Rodada misturada" initial={initial} kind="mixed" />;
}

export function ReviewQuizScreen() {
  const { progress } = useProgress();
  const [initial] = useState<Item[]>(() =>
    shuffle(Object.keys(progress.wrong))
      .map((id) => {
        const main = getQuestion(id);
        if (!main) return null;
        // alterna entre a versão gêmea e a original para trazer um exemplo diferente
        const useTwin = (progress.wrong[id] ?? 1) % 2 === 1 && main.retryId;
        const q = useTwin ? getQuestion(main.retryId!)! : main;
        return { sourceId: id, question: q, isRetry: false };
      })
      .filter((x): x is Item => x !== null),
  );
  return <QuizSession title="Revisar meus erros" initial={initial} kind="review" />;
}
