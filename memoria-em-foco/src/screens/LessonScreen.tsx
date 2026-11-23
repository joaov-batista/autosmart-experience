import { useEffect, useRef, useState } from 'react';
import { getLesson, lessons } from '../data/lessons';
import { getQuestion } from '../data/questions';
import type { Lesson, LessonStep } from '../data/types';
import { FictionalTag, RichText } from '../components/References';
import { QuestionView } from '../components/QuestionView';
import { SelfCheck } from '../components/SelfCheck';
import { WordListDemo } from '../components/WordListDemo';
import { addSession, markWrong, setExplainReview, useProgress } from '../storage';
import { navigate } from '../utils';
import { TopBar } from '../components/TopBar';

const stepLabel: Record<LessonStep['kind'], string> = {
  situation: 'Situação',
  concept: 'Conceito',
  example: 'Outro exemplo',
  quiz: 'Pergunta',
  demo: 'Experimente',
  explain: 'Agora explique sem olhar',
};

export function LessonScreen({ lessonId }: { lessonId: string }) {
  const lesson = getLesson(lessonId);
  if (!lesson) return <p className="screen">Lição não encontrada.</p>;
  return <LessonRunner lesson={lesson} key={lesson.id} />;
}

function LessonRunner({ lesson }: { lesson: Lesson }) {
  const { progress, update } = useProgress();
  const saved = progress.lessonSteps[lesson.id] ?? 0;
  const [step, setStepState] = useState(Math.min(saved, lesson.steps.length - 1));
  const [retryId, setRetryId] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Registra a lição como “em andamento” para o botão Continuar.
  useEffect(() => {
    update((p) => ({ ...p, current: { lessonId: lesson.id, step }, lessonSteps: { ...p.lessonSteps, [lesson.id]: step } }));
  }, [lesson.id, step, update]);

  useEffect(() => {
    window.scrollTo(0, 0);
    headingRef.current?.focus();
  }, [step, retryId, done]);

  const next = () => {
    setRetryId(null);
    if (step + 1 >= lesson.steps.length) {
      setDone(true);
      update((p) => ({
        ...addSession('lesson', lesson.id)(p),
        current: null,
        lessonSteps: { ...p.lessonSteps, [lesson.id]: 0 },
        completedLessons: p.completedLessons.includes(lesson.id) ? p.completedLessons : [...p.completedLessons, lesson.id],
      }));
    } else {
      setStepState(step + 1);
    }
  };

  if (done) {
    const nextLesson = lessons.find((l) => l.number === lesson.number + 1);
    return (
      <div className="screen">
        <TopBar title={`Lição ${lesson.number}`} />
        <section className="card center">
          <h1 ref={headingRef} tabIndex={-1}>
            Lição concluída
          </h1>
          <p>{lesson.title}</p>
          <p className="muted">Os erros desta lição ficaram guardados em “Revisar meus erros”.</p>
          <div className="stack">
            {nextLesson ? (
              <button className="btn primary block" onClick={() => navigate(`/licao/${nextLesson.id}`)}>
                Próxima: Lição {nextLesson.number}
              </button>
            ) : (
              <button className="btn primary block" onClick={() => navigate('/mista')}>
                Rodada final misturada
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

  const current = lesson.steps[step];
  const pct = Math.round((step / lesson.steps.length) * 100);

  return (
    <div className="screen">
      <TopBar title={`Lição ${lesson.number} · ${stepLabel[current.kind]}`} />
      <div
        className="progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={lesson.steps.length}
        aria-valuenow={step}
        aria-label="Progresso da lição"
      >
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="muted small step-count">
        Etapa {step + 1} de {lesson.steps.length} — {lesson.title}
      </p>
      <h1 className="sr-only" ref={headingRef} tabIndex={-1}>
        {stepLabel[current.kind]}
      </h1>
      <section className="card" key={`${step}-${retryId ?? ''}`}>
        <StepView
          lessonId={lesson.id}
          step={current}
          retryId={retryId}
          onNext={next}
          onWrong={(questionId) => {
            update(markWrong(questionId));
            const twin = getQuestion(questionId)?.retryId;
            if (twin) setRetryId(twin);
            else next();
          }}
        />
      </section>
      {step > 0 && (
        <button className="btn ghost small" onClick={() => { setRetryId(null); setStepState(step - 1); }}>
          ← Etapa anterior
        </button>
      )}
    </div>
  );
}

function StepView({
  lessonId,
  step,
  retryId,
  onNext,
  onWrong,
}: {
  lessonId: string;
  step: LessonStep;
  retryId: string | null;
  onNext: () => void;
  onWrong: (questionId: string) => void;
}) {
  const { update } = useProgress();
  switch (step.kind) {
    case 'situation':
      return <Situation step={step} onNext={onNext} />;
    case 'concept':
      return (
        <div className="prose">
          <p className="badge">Conceito</p>
          {step.paragraphs.map((t, i) => (
            <p key={i}>
              <RichText text={t} />
            </p>
          ))}
          {step.bullets && (
            <dl className="terms">
              {step.bullets.map((b) => (
                <div key={b.term}>
                  <dt>{b.term}</dt>
                  <dd>
                    <RichText text={b.text} />
                  </dd>
                </div>
              ))}
            </dl>
          )}
          {step.keyPhrase && <blockquote className="key">{step.keyPhrase}</blockquote>}
          <button className="btn primary block" onClick={onNext}>
            Entendi
          </button>
        </div>
      );
    case 'example':
      return (
        <div className="prose">
          <p className="badge">Outro exemplo</p>
          {step.fictional && <FictionalTag />}
          {step.paragraphs.map((t, i) => (
            <p key={i}>
              <RichText text={t} />
            </p>
          ))}
          <button className="btn primary block" onClick={onNext}>
            Continuar
          </button>
        </div>
      );
    case 'quiz': {
      if (retryId) {
        const twin = getQuestion(retryId)!;
        return (
          <QuestionView
            question={twin}
            badge="Mesmo conceito, outro exemplo"
            onDone={() => onNext()}
          />
        );
      }
      const q = getQuestion(step.questionId)!;
      return <QuestionView question={q} badge="Pergunta" onDone={(ok) => (ok ? onNext() : onWrong(q.id))} />;
    }
    case 'demo':
      return <WordListDemo onDone={onNext} />;
    case 'explain':
      return (
        <>
          <p className="badge">Agora explique sem olhar</p>
          <SelfCheck
            prompt={<h2 className="q-prompt">{step.prompt}</h2>}
            model={step.model}
            criteria={step.criteria}
            onRate={(r) => {
              update(setExplainReview(lessonId, r === 'missing'));
              onNext();
            }}
          />
        </>
      );
  }
}

function Situation({ step, onNext }: { step: Extract<LessonStep, { kind: 'situation' }>; onNext: () => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const option = step.options.find((o) => o.id === picked);
  return (
    <div className="prose">
      <p className="badge">Situação</p>
      {step.fictional && <FictionalTag />}
      <p className="lead">{step.text}</p>
      <h2 className="q-prompt" id="pred">
        Sua previsão: {step.prompt}
      </h2>
      <div className="choices" role="radiogroup" aria-labelledby="pred">
        {step.options.map((o) => (
          <button
            key={o.id}
            role="radio"
            aria-checked={picked === o.id}
            className={`choice ${picked === o.id ? 'selected' : ''}`}
            onClick={() => setPicked(o.id)}
          >
            <span className="choice-text">{o.text}</span>
          </button>
        ))}
      </div>
      {option && (
        <div className="feedback" aria-live="polite">
          <p>{option.feedback}</p>
        </div>
      )}
      <button className="btn primary block" disabled={!picked} onClick={onNext}>
        Ver a explicação
      </button>
    </div>
  );
}
