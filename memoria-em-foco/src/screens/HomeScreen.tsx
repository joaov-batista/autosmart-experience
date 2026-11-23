import { lessons, getLesson } from '../data/lessons';
import { oralQuestions } from '../data/oral';
import { useRefs } from '../components/References';
import { useProgress } from '../storage';
import { navigate } from '../utils';

export function HomeScreen() {
  const { progress } = useProgress();
  const { openAll } = useRefs();
  const current = progress.current ? getLesson(progress.current.lessonId) : undefined;
  const nextNew = lessons.find((l) => !progress.completedLessons.includes(l.id));
  const pendingErrors = Object.keys(progress.wrong).length + progress.explainReview.length + progress.oralDifficult.length;
  const lastSession = progress.sessions[progress.sessions.length - 1];

  const sessionLabel: Record<string, string> = {
    lesson: 'lição',
    review: 'revisão',
    mixed: 'rodada misturada',
    oral: 'banca',
    presentation: 'ensaio',
  };

  return (
    <div className="screen home">
      <header className="hero">
        <div className="logo" aria-hidden="true">
          <span />
        </div>
        <div>
          <h1>Memória em Foco</h1>
          <p className="muted">Memória em pessoas com esquizofrenia — estudo em sessões curtas.</p>
        </div>
      </header>

      <section className="card continue" aria-labelledby="cont-h">
        <h2 id="cont-h" className="small-h">
          Onde você parou
        </h2>
        {current && progress.current ? (
          <>
            <p>
              <strong>Lição {current.number}:</strong> {current.title}
            </p>
            <p className="muted small">
              Etapa {progress.current.step + 1} de {current.steps.length}
            </p>
            <button className="btn primary block" onClick={() => navigate(`/licao/${current.id}`)}>
              Continuar
            </button>
          </>
        ) : nextNew ? (
          <>
            <p>
              {progress.completedLessons.length === 0 ? 'Comece pela ' : 'Próxima: '}
              <strong>Lição {nextNew.number}</strong> — {nextNew.title}
            </p>
            <button className="btn primary block" onClick={() => navigate(`/licao/${nextNew.id}`)}>
              {progress.completedLessons.length === 0 ? 'Começar' : 'Continuar'}
            </button>
          </>
        ) : (
          <>
            <p>Você concluiu as seis lições. Faça a rodada misturada ou treine com a professora.</p>
            <button className="btn primary block" onClick={() => navigate('/mista')}>
              Rodada misturada
            </button>
          </>
        )}
        {lastSession && (
          <p className="muted small">
            Última sessão: {sessionLabel[lastSession.kind]} em{' '}
            {new Date(lastSession.at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
          </p>
        )}
      </section>

      <nav className="actions" aria-label="Ações principais">
        <button className="action a-learn" onClick={() => navigate('/licoes')}>
          <span className="action-icon" aria-hidden="true">◎</span>
          <span className="action-title">Aprender</span>
          <span className="action-sub">
            {progress.completedLessons.length} de {lessons.length} lições
          </span>
        </button>
        <button className="action a-review" onClick={() => navigate('/revisar')}>
          <span className="action-icon" aria-hidden="true">↻</span>
          <span className="action-title">Revisar meus erros</span>
          <span className="action-sub">{pendingErrors ? `${pendingErrors} pendente(s)` : 'Nada pendente'}</span>
        </button>
        <button className="action a-oral" onClick={() => navigate('/banca')}>
          <span className="action-icon" aria-hidden="true">❝</span>
          <span className="action-title">Treinar com a professora</span>
          <span className="action-sub">{oralQuestions.length} perguntas da banca</span>
        </button>
        <button className="action a-present" onClick={() => navigate('/apresentacao')}>
          <span className="action-icon" aria-hidden="true">◷</span>
          <span className="action-title">Ensaiar apresentação</span>
          <span className="action-sub">Até 5 minutos</span>
        </button>
      </nav>

      <LessonList />

      <section className="card">
        <h2 className="small-h">Mais</h2>
        <div className="stack">
          <button className="btn secondary block" onClick={() => navigate('/mista')}>
            Rodada final misturada
          </button>
          <button className="btn ghost block" onClick={openAll}>
            Fontes [1]–[5]
          </button>
        </div>
        <p className="muted small">
          {progress.sessions.length} sessão(ões) concluída(s). Seu progresso fica salvo só neste aparelho.
        </p>
      </section>
    </div>
  );
}

export function LessonList({ standalone }: { standalone?: boolean }) {
  const { progress } = useProgress();
  return (
    <section className="card" aria-labelledby="lessons-h">
      {standalone ? (
        <h1 id="lessons-h">Lições</h1>
      ) : (
        <h2 id="lessons-h" className="small-h">
          Lições (todas liberadas)
        </h2>
      )}
      <ol className="lesson-list">
        {lessons.map((l) => {
          const done = progress.completedLessons.includes(l.id);
          const inProgress = progress.current?.lessonId === l.id;
          return (
            <li key={l.id}>
              <button className="lesson-item" onClick={() => navigate(`/licao/${l.id}`)}>
                <span className={`lesson-num ${done ? 'done' : ''}`} aria-hidden="true">
                  {done ? '✓' : l.number}
                </span>
                <span className="lesson-text">
                  <span className="lesson-title">
                    Lição {l.number} · {l.title}
                  </span>
                  <span className="muted small">
                    {l.summary} {done ? '· Concluída' : inProgress ? '· Em andamento' : ''}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
