import { getLesson } from '../data/lessons';
import { getQuestion } from '../data/questions';
import { oralQuestions } from '../data/oral';
import { TopBar } from '../components/TopBar';
import { useProgress } from '../storage';
import { navigate } from '../utils';

export function ReviewHub() {
  const { progress, update } = useProgress();
  const wrongIds = Object.keys(progress.wrong).filter((id) => getQuestion(id));
  const oral = oralQuestions.filter((q) => progress.oralDifficult.includes(q.id));

  const openExplain = (lessonId: string) => {
    const lesson = getLesson(lessonId);
    if (!lesson) return;
    const idx = lesson.steps.findIndex((s) => s.kind === 'explain');
    update((p) => ({ ...p, lessonSteps: { ...p.lessonSteps, [lessonId]: idx } }));
    navigate(`/licao/${lessonId}`);
  };

  return (
    <div className="screen">
      <TopBar title="Revisar meus erros" />
      <h1>Revisar meus erros</h1>
      <p className="muted">Cada questão volta com outro exemplo do mesmo conceito. Sem pontos perdidos, sem pressa.</p>

      <section className="card">
        <h2 className="small-h">Questões ({wrongIds.length})</h2>
        {wrongIds.length ? (
          <>
            <ul className="plain-list">
              {wrongIds.map((id) => {
                const q = getQuestion(id)!;
                const l = getLesson(q.lessonId);
                return (
                  <li key={id}>
                    <span className="muted small">Lição {l?.number}</span> {q.prompt.length > 90 ? q.prompt.slice(0, 90) + '…' : q.prompt}
                  </li>
                );
              })}
            </ul>
            <button className="btn primary block" onClick={() => navigate('/revisar/questoes')}>
              Revisar questões
            </button>
          </>
        ) : (
          <p>Nenhuma questão pendente.</p>
        )}
      </section>

      <section className="card">
        <h2 className="small-h">Explicações com “Faltou um ponto” ({progress.explainReview.length})</h2>
        {progress.explainReview.length ? (
          <div className="stack">
            {progress.explainReview.map((id) => {
              const l = getLesson(id);
              return l ? (
                <button key={id} className="btn secondary block" onClick={() => openExplain(id)}>
                  Lição {l.number}: explicar de novo
                </button>
              ) : null;
            })}
          </div>
        ) : (
          <p>Nenhuma explicação pendente.</p>
        )}
      </section>

      <section className="card">
        <h2 className="small-h">Perguntas da banca marcadas ({oral.length})</h2>
        {oral.length ? (
          <>
            <ul className="plain-list">
              {oral.map((q) => (
                <li key={q.id}>“{q.question}”</li>
              ))}
            </ul>
            <button className="btn primary block" onClick={() => navigate('/banca/dificeis')}>
              Treinar tópicos difíceis
            </button>
          </>
        ) : (
          <p>Nenhuma pergunta marcada.</p>
        )}
      </section>
    </div>
  );
}
