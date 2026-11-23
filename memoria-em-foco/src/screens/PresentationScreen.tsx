import { useEffect, useRef, useState } from 'react';
import { PRESENTATION_LIMIT_SECONDS, PRESENTATION_WARN_SECONDS, cueWords, scriptParagraphs, scriptRefs } from '../data/presentation';
import { oralQuestions } from '../data/oral';
import { RefButtons, useSheets } from '../components/References';
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
  const { openAll } = useSheets();
  const sw = useStopwatch();
  const [view, setView] = useState<'text' | 'cues'>('text');
  const [hint, setHint] = useState<number | null>(null);
  const [finished, setFinished] = useState<null | { seconds: number; qIndex: number }>(null);
  const [rated, setRated] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const warn = sw.seconds >= PRESENTATION_WARN_SECONDS;
  const over = sw.seconds >= PRESENTATION_LIMIT_SECONDS;

  const finish = () => {
    sw.pause();
    const seconds = sw.seconds;
    update(addSession('presentation', seconds));
    setFinished({ seconds, qIndex: Math.floor(Math.random() * oralQuestions.length) });
    window.scrollTo(0, 0);
    setTimeout(() => headingRef.current?.focus(), 0);
  };

  if (finished) {
    const q = oralQuestions[finished.qIndex];
    return (
      <div className="screen">
        <section className="card">
          <h1 ref={headingRef} tabIndex={-1}>
            Ensaio concluído
          </h1>
          <p>
            Tempo: <strong>{formatTime(finished.seconds)}</strong>
            {finished.seconds > PRESENTATION_LIMIT_SECONDS
              ? ' — passou de 5 minutos. Veja quais trechos dá para dizer de forma mais direta.'
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
      <h1 className="screen-title">Ensaiar apresentação</h1>
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
        <button role="tab" aria-selected={view === 'cues'} className={`tab ${view === 'cues' ? 'on' : ''}`} onClick={() => setView('cues')}>
          Só palavras de apoio
        </button>
      </div>

      {view === 'text' ? (
        <section className="card script" role="tabpanel">
          <h2 className="sr-only">Texto completo</h2>
          {scriptParagraphs.map((p, i) => (
            <p key={i}>
              {p} <RefButtons refs={scriptRefs[i]} />
            </p>
          ))}
          <p className="muted small">Os números entre colchetes abrem as fontes e não precisam ser lidos em voz alta.</p>
        </section>
      ) : (
        <section className="card cues" role="tabpanel">
          <h2 className="sr-only">Palavras de apoio</h2>
          <ol className="cue-words">
            {cueWords.map((c, i) => (
              <li key={c.word}>
                <button className="cue-word" aria-expanded={hint === i} onClick={() => setHint(hint === i ? null : i)}>
                  {c.word}
                </button>
                {hint === i && (
                  <p className="cue-hint">
                    {c.hint} <RefButtons refs={c.refs} />
                  </p>
                )}
              </li>
            ))}
          </ol>
          <p className="muted small">Toque numa palavra só se precisar de uma dica.</p>
        </section>
      )}

      <button className="btn primary block" onClick={finish} disabled={sw.seconds === 0 && !sw.running}>
        Terminei o ensaio
      </button>
    </div>
  );
}
