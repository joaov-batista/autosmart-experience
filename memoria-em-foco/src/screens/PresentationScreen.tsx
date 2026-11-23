import { useEffect, useRef, useState } from 'react';
import { PRESENTATION_LIMIT_SECONDS, PRESENTATION_WARN_SECONDS, reminders, speech, teacherQuestions } from '../data/presentation';
import { references } from '../data/references';
import { oralQuestions } from '../data/oral';
import { RefButtons, useSheets } from '../components/References';

const SPEECH_SIZES = [17, 19, 21, 24, 28];
function readPref(k: string, d: number) {
  try {
    const v = localStorage.getItem(k);
    return v === null ? d : Number(v);
  } catch {
    return d;
  }
}
function writePref(k: string, v: number | boolean) {
  try {
    localStorage.setItem(k, String(v));
  } catch {
    /* ignorado */
  }
}
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
  const { openParagraph } = useSheets();
  const sw = useStopwatch();
  const [view, setView] = useState<'speech' | 'reminders' | 'questions' | 'refs'>('speech');
  const [openReminder, setOpenReminder] = useState<number | null>(null);
  const [openAnswers, setOpenAnswers] = useState<number[]>([]);
  const [fontStep, setFontStep] = useState(() => readPref('mef:speechFont', 1));
  const [showRefs, setShowRefs] = useState(() => readPref('mef:speechRefs', 0) === 1);
  useEffect(() => writePref('mef:speechFont', fontStep), [fontStep]);
  useEffect(() => writePref('mef:speechRefs', showRefs ? 1 : 0), [showRefs]);
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
              ? ' — passou de 5 minutos. Veja nos lembretes quais trechos dá para dizer de forma mais direta.'
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

  const tabs = [
    { id: 'speech', label: 'Fala completa' },
    { id: 'reminders', label: 'Só os lembretes' },
    { id: 'questions', label: 'Se a professora perguntar' },
    { id: 'refs', label: 'Referências' },
  ] as const;

  return (
    <div className="screen">
      <h1 className="screen-title">Ensaiar apresentação</h1>
      <div className={`timer ${warn ? 'warn' : ''} ${over ? 'over' : ''}`} role="timer" aria-live="off">
        <div className="timer-row">
          <span className="timer-value" aria-label={`Tempo decorrido ${formatTime(sw.seconds)}`}>
            {formatTime(sw.seconds)}
          </span>
          <span className="timer-status">
            {over ? '● passou de 5:00 — conclua com calma' : warn ? '◐ 4:30 — hora de fechar' : 'Limite: 5:00'}
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
          <button className="btn ghost small" onClick={finish} disabled={sw.seconds === 0 && !sw.running}>
            Terminei
          </button>
        </div>
      </div>

      <div className="tabs4" role="tablist" aria-label="Visualização do ensaio">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={view === t.id} className={`tab ${view === t.id ? 'on' : ''}`} onClick={() => setView(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {view === 'speech' && (
        <section className="card script" role="tabpanel" style={{ fontSize: SPEECH_SIZES[fontStep] }}>
          <h2 className="sr-only">Fala completa</h2>
          <div className="speech-tools">
            <button className="btn ghost small" onClick={() => setFontStep((f) => Math.max(0, f - 1))} disabled={fontStep === 0} aria-label="Diminuir letra da fala">
              A−
            </button>
            <button className="btn ghost small" onClick={() => setFontStep((f) => Math.min(SPEECH_SIZES.length - 1, f + 1))} disabled={fontStep === SPEECH_SIZES.length - 1} aria-label="Aumentar letra da fala">
              A+
            </button>
            <label className="check inline">
              <input type="checkbox" checked={showRefs} onChange={(e) => setShowRefs(e.target.checked)} />
              <span>Mostrar fontes</span>
            </label>
          </div>
          {speech.map((p, i) => (
            <p key={i} className="speech-p">
              {p.text} {showRefs && <RefButtons refs={p.refs} />}
            </p>
          ))}
          {!showRefs && <p className="muted small">As fontes estão ocultas para a leitura em voz alta. Marque “Mostrar fontes” para consultar.</p>}
        </section>
      )}

      {view === 'reminders' && (
        <section className="card" role="tabpanel">
          <h2 className="sr-only">Só os lembretes</h2>
          <ol className="reminders">
            {reminders.map((r, i) => (
              <li key={r.label}>
                <button className={`reminder ${openReminder === i ? 'on' : ''}`} aria-expanded={openReminder === i} onClick={() => setOpenReminder(openReminder === i ? null : i)}>
                  <span className="reminder-n">{i + 1}</span>
                  {r.label}
                </button>
                {openReminder === i && (
                  <div className="reminder-body">
                    {r.paragraphs.map((k) => (
                      <p key={k}>
                        {speech[k].text} <RefButtons refs={speech[k].refs} />
                      </p>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ol>
          <p className="muted small">Toque num lembrete só se precisar ver o parágrafo correspondente.</p>
        </section>
      )}

      {view === 'questions' && (
        <section className="card" role="tabpanel">
          <h2 className="sr-only">Se a professora perguntar</h2>
          <ul className="qa-list">
            {teacherQuestions.map((q, i) => {
              const open = openAnswers.includes(i);
              return (
                <li key={i} className="qa">
                  <p className="qa-q">“{q.question}”</p>
                  {!open ? (
                    <button className="btn secondary small" onClick={() => setOpenAnswers((a) => [...a, i])}>
                      Pensei na resposta — mostrar
                    </button>
                  ) : (
                    <div className="qa-a" aria-live="polite">
                      <p>
                        {q.answer} <RefButtons refs={q.refs} />
                      </p>
                      <div className="row-btns">
                        <button className="btn ghost small" onClick={() => openParagraph(q.pid)}>
                          Rever explicação
                        </button>
                        <button className="btn ghost small" onClick={() => setOpenAnswers((a) => a.filter((x) => x !== i))}>
                          Esconder
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          <button className="btn ghost block" onClick={() => navigate('/banca')}>
            Treinar mais perguntas na Banca oral
          </button>
        </section>
      )}

      {view === 'refs' && (
        <section className="card" role="tabpanel">
          <h2 className="sr-only">Referências</h2>
          <ol className="ref-sheet-list">
            {references.map((r) => (
              <li key={r.id} className="ref-item">
                <p className="ref-citation">
                  <span className="ref-num">[{r.id}]</span> {r.citation}
                </p>
                <p className="ref-question">
                  <strong>Para consultar:</strong> {r.question}
                </p>
                <a className="ext-link" href={r.url} target="_blank" rel="noopener noreferrer">
                  Abrir fonte original ↗
                </a>
                {r.extraUrl && (
                  <a className="ext-link" href={r.extraUrl.url} target="_blank" rel="noopener noreferrer">
                    {r.extraUrl.label} ↗
                  </a>
                )}
              </li>
            ))}
          </ol>
          <p className="muted small">As fichas funcionam offline. Abrir o artigo original exige internet.</p>
        </section>
      )}
    </div>
  );
}
