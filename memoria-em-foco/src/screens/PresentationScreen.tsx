import { useEffect, useRef, useState } from 'react';
import {
  PRESENTATION_LIMIT_SECONDS,
  PRESENTATION_WARN_SECONDS,
  scriptParagraphs,
  scriptRefs,
  supportCards,
} from '../data/presentation';
import { oralQuestions } from '../data/oral';
import { RefButtons, useRefs } from '../components/References';
import { TopBar } from '../components/TopBar';
import { OralCard } from './OralScreen';
import { addSession, useProgress } from '../storage';
import { formatTime, navigate } from '../utils';

function useStopwatch() {
  const [running, setRunning] = useState(false);
  const [accumulated, setAccumulated] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setTick((n) => n + 1), 250);
    return () => clearInterval(t);
  }, [running]);
  const elapsedMs = accumulated + (running && startedAt ? Date.now() - startedAt : 0);
  return {
    seconds: Math.floor(elapsedMs / 1000),
    running,
    start: () => {
      setStartedAt(Date.now());
      setRunning(true);
    },
    pause: () => {
      if (startedAt) setAccumulated((a) => a + Date.now() - startedAt);
      setStartedAt(null);
      setRunning(false);
    },
    reset: () => {
      setAccumulated(0);
      setStartedAt(running ? Date.now() : null);
    },
  };
}

export function PresentationScreen() {
  const { update } = useProgress();
  const { openAll } = useRefs();
  const sw = useStopwatch();
  const [view, setView] = useState<'text' | 'cards'>('text');
  const [card, setCard] = useState(0);
  const [finished, setFinished] = useState<null | { seconds: number; qIndex: number }>(null);
  const [rated, setRated] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const warn = sw.seconds >= PRESENTATION_WARN_SECONDS;
  const over = sw.seconds >= PRESENTATION_LIMIT_SECONDS;

  const finish = () => {
    sw.pause();
    const seconds = sw.seconds;
    update(addSession('presentation', undefined, seconds));
    setFinished({ seconds, qIndex: Math.floor(Math.random() * oralQuestions.length) });
    window.scrollTo(0, 0);
    setTimeout(() => headingRef.current?.focus(), 0);
  };

  if (finished) {
    const q = oralQuestions[finished.qIndex];
    return (
      <div className="screen">
        <TopBar title="Ensaiar apresentação" />
        <section className="card">
          <h1 ref={headingRef} tabIndex={-1}>
            Ensaio concluído
          </h1>
          <p>
            Tempo: <strong>{formatTime(finished.seconds)}</strong>
            {finished.seconds > PRESENTATION_LIMIT_SECONDS
              ? ' — passou de 5 minutos. Veja quais trechos dá para encurtar nos cartões.'
              : ' — dentro dos 5 minutos.'}
          </p>
          <p className="muted small">A duração real depende do seu ritmo e das pausas.</p>
        </section>
        <section className="card">
          <p className="muted small">Pergunta sorteada da banca:</p>
          {!rated ? (
            <OralCard q={q} onRated={() => setRated(true)} />
          ) : (
            <div className="stack">
              <p>Resposta registrada.</p>
              <button className="btn primary block" onClick={() => navigate('/banca')}>
                Continuar na banca
              </button>
              <button
                className="btn ghost block"
                onClick={() => {
                  setFinished(null);
                  setRated(false);
                  sw.reset();
                }}
              >
                Ensaiar de novo
              </button>
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="screen">
      <TopBar title="Ensaiar apresentação" />
      <div className={`timer ${warn ? 'warn' : ''} ${over ? 'over' : ''}`} role="timer" aria-live="off">
        <div className="timer-row">
          <span className="timer-value" aria-label={`Tempo decorrido ${formatTime(sw.seconds)}`}>
            {formatTime(sw.seconds)}
          </span>
          <span className="timer-status">
            {over ? '● 5:00 atingido' : warn ? '◐ 4:30 — hora de fechar' : 'Limite: 5:00'}
          </span>
        </div>
        <div className="timer-btns">
          {sw.running ? (
            <button className="btn secondary small" onClick={sw.pause}>
              Pausar
            </button>
          ) : (
            <button className="btn primary small" onClick={sw.start}>
              {sw.seconds > 0 ? 'Retomar' : 'Iniciar'}
            </button>
          )}
          <button className="btn ghost small" onClick={sw.reset}>
            Reiniciar
          </button>
          <button className="btn ghost small" onClick={openAll}>
            Fontes
          </button>
        </div>
      </div>

      <div className="tabs" role="tablist" aria-label="Visualização">
        <button role="tab" aria-selected={view === 'text'} className={`tab ${view === 'text' ? 'on' : ''}`} onClick={() => setView('text')}>
          Texto completo
        </button>
        <button role="tab" aria-selected={view === 'cards'} className={`tab ${view === 'cards' ? 'on' : ''}`} onClick={() => setView('cards')}>
          Cartões de apoio
        </button>
      </div>

      {view === 'text' ? (
        <section className="card script" role="tabpanel">
          <h1 className="sr-only">Texto completo</h1>
          {scriptParagraphs.map((p, i) => (
            <p key={i}>
              {p} <RefButtons refs={scriptRefs[i]} />
            </p>
          ))}
          <p className="muted small">
            O caso da aluna é um exemplo didático fictício. Os números entre colchetes abrem as fontes e não precisam ser
            lidos em voz alta.
          </p>
        </section>
      ) : (
        <section className="card cue-card" role="tabpanel" aria-roledescription="cartão">
          <p className="muted small">
            Cartão {card + 1} de {supportCards.length}
          </p>
          <h1 className="cue-title">{supportCards[card].title}</h1>
          <ul className="cue-points">
            {supportCards[card].points.map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>
          <p className="small">
            <RefButtons refs={supportCards[card].refs} />
          </p>
          <div className="cue-nav">
            <button className="btn secondary" disabled={card === 0} onClick={() => setCard((c) => c - 1)}>
              ← Anterior
            </button>
            <div className="dots" aria-hidden="true">
              {supportCards.map((_, i) => (
                <span key={i} className={`dot ${i === card ? 'on' : ''}`} />
              ))}
            </div>
            <button
              className="btn secondary"
              disabled={card === supportCards.length - 1}
              onClick={() => setCard((c) => c + 1)}
            >
              Próximo →
            </button>
          </div>
        </section>
      )}

      <button className="btn primary block" onClick={finish} disabled={sw.seconds === 0 && !sw.running}>
        Terminei o ensaio
      </button>
    </div>
  );
}
