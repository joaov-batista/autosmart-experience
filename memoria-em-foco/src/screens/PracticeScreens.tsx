import { useEffect, useMemo, useRef, useState } from 'react';
import { exercises, getExercise } from '../data/exercises';
import { glossary } from '../data/glossary';
import { getOral } from '../data/oral';
import { getParagraph } from '../data/chapters';
import { QuestionView } from '../components/QuestionView';
import { RefButtons, useSheets } from '../components/References';
import { addSession, setExerciseReview, useProgress } from '../storage';
import { navigate, normalize, shuffle } from '../utils';

function useFocusTop(dep: unknown) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    ref.current?.focus({ preventScroll: true });
  }, [dep]);
  return ref;
}

export function PracticeHub() {
  const { progress } = useProgress();
  const h = useFocusTop(0);
  const done = Object.keys(progress.exerciseResults).length;
  const reviewCount = progress.reviewExercises.length + progress.reviewOral.length;
  return (
    <div className="screen">
      <h1 ref={h} tabIndex={-1}>
        Praticar
      </h1>
      {!progress.finishedReading && (
        <div className="notice">
          <p>
            A prática foi pensada para depois da leitura. Se ainda não leu os seis capítulos,{' '}
            <button className="linklike" onClick={() => navigate('/estudar')}>
              volte ao texto
            </button>
            .
          </p>
        </div>
      )}
      <nav className="practice-list" aria-label="Atividades">
        <button className="action" onClick={() => navigate('/praticar/caso')}>
          <span className="action-step">1</span>
          <span className="action-title">Caso integrado</span>
          <span className="action-sub">Itens e relações: duas pessoas, os mesmos pares de palavras.</span>
        </button>
        <button className="action" onClick={() => navigate('/praticar/exercicios')}>
          <span className="action-step">2</span>
          <span className="action-title">Exercícios comentados</span>
          <span className="action-sub">
            9 exercícios · {done} feito(s){progress.exerciseIndex > 0 && progress.exerciseIndex < exercises.length ? ` · continuar do ${progress.exerciseIndex + 1}` : ''}
          </span>
        </button>
        <button className="action" onClick={() => navigate('/praticar/revisar')}>
          <span className="action-step">↻</span>
          <span className="action-title">Para revisar</span>
          <span className="action-sub">{reviewCount ? `${reviewCount} item(ns) guardado(s)` : 'Nada guardado ainda'}</span>
        </button>
        <button className="action" onClick={() => navigate('/banca')}>
          <span className="action-step">3</span>
          <span className="action-title">Banca oral</span>
          <span className="action-sub">Perguntas da professora, réplica e autoavaliação.</span>
        </button>
        <button className="action" onClick={() => navigate('/ensaiar')}>
          <span className="action-step">4</span>
          <span className="action-title">Ensaiar apresentação</span>
          <span className="action-sub">Cronômetro, texto completo ou cinco palavras de apoio.</span>
        </button>
      </nav>
    </div>
  );
}

const PAIRS: [string, string][] = [
  ['lápis', 'janela'],
  ['vela', 'cachorro'],
  ['sapato', 'nuvem'],
  ['garfo', 'rio'],
];
const NEW_WORDS = ['mesa', 'livro', 'pássaro', 'copo'];
const PAIR_OPTIONS: { a: string; b: string; real: boolean }[] = [
  { a: 'lápis', b: 'janela', real: true },
  { a: 'vela', b: 'nuvem', real: false },
  { a: 'garfo', b: 'rio', real: true },
  { a: 'sapato', b: 'cachorro', real: false },
];

export function CaseScreen() {
  const { update } = useProgress();
  const [phase, setPhase] = useState<'read' | 'study' | 'items' | 'pairs' | 'summary'>('read');
  const h = useFocusTop(phase);
  const words = useMemo(() => shuffle([...PAIRS.map((p) => p[0]), 'cachorro', 'nuvem', 'rio', ...NEW_WORDS].slice(0, 12)), []);
  const pairOpts = useMemo(() => shuffle(PAIR_OPTIONS), []);
  const [pickedWords, setPickedWords] = useState<string[]>([]);
  const [pickedPairs, setPickedPairs] = useState<string[]>([]);
  const studied = PAIRS.flat();
  const wordHits = pickedWords.filter((w) => studied.includes(w)).length;
  const wordFalse = pickedWords.filter((w) => !studied.includes(w));
  const pairKey = (o: { a: string; b: string }) => `${o.a}-${o.b}`;
  const pairHits = PAIR_OPTIONS.filter((o) => o.real && pickedPairs.includes(pairKey(o))).length;
  const pairFalse = PAIR_OPTIONS.filter((o) => !o.real && pickedPairs.includes(pairKey(o)));
  const totalStudiedShown = words.filter((w) => studied.includes(w)).length;

  return (
    <div className="screen">
      <button className="btn ghost small" onClick={() => navigate('/praticar')}>
        ← Praticar
      </button>
      {phase === 'read' && (
        <article className="card prose">
          <p className="badge">Caso integrado</p>
          <h1 ref={h} tabIndex={-1}>
            Reconhecer as palavras, lembrar os pares
          </h1>
          <p>
            Duas pessoas aprendem os mesmos pares de palavras, como <em>lápis–janela</em> e <em>vela–cachorro</em>. Mais
            tarde, ambas reconhecem diversas palavras isoladas: “sim, lápis estava na lista”. Mas uma delas tem dificuldade
            para identificar quais palavras formavam pares.
          </p>
          <p>
            Reconhecer os elementos e recuperar a ligação entre eles impõem demandas diferentes. Reconhecer “lápis” pode
            apoiar-se na familiaridade com o item. Saber que “lápis” estava com “janela”, e não com “nuvem”, exige ter
            codificado e conseguir recuperar a relação entre os dois.
          </p>
          <p>
            É essa a distinção estudada por Ragland e colaboradores: aprender as características dos itens versus aprender
            as relações entre eles. Em média, o grupo com esquizofrenia teve dificuldade particularmente importante nas
            relações, com menor ativação de uma região pré-frontal durante a aprendizagem relacional e diferenças na resposta do
            hipocampo num teste posterior. <RefButtons refs={[4]} />
          </p>
          <p className="notice small">
            Um resultado individual nessa atividade não identifica um diagnóstico. O estudo compara médias de grupos; a
            demonstração abaixo serve só para sentir a diferença entre as duas demandas.
          </p>
          <button className="btn primary block" onClick={() => setPhase('study')}>
            Experimentar a tarefa
          </button>
        </article>
      )}

      {phase === 'study' && (
        <section className="card">
          <h1 ref={h} tabIndex={-1} className="q-prompt">
            Leia os quatro pares com atenção.
          </h1>
          <ul className="pair-list">
            {PAIRS.map(([a, b]) => (
              <li key={a}>
                {a} <span aria-hidden="true">—</span>
                <span className="sr-only">com</span> {b}
              </li>
            ))}
          </ul>
          <button className="btn primary block" onClick={() => setPhase('items')}>
            Esconder os pares
          </button>
        </section>
      )}

      {phase === 'items' && (
        <section className="card">
          <h1 ref={h} tabIndex={-1} className="q-prompt" id="items-h">
            1. Itens: quais destas palavras você viu?
          </h1>
          <div className="word-grid" role="group" aria-labelledby="items-h">
            {words.map((w) => {
              const on = pickedWords.includes(w);
              return (
                <button key={w} className={`chip ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => setPickedWords((p) => (on ? p.filter((x) => x !== w) : [...p, w]))}>
                  {on ? '✓ ' : ''}
                  {w}
                </button>
              );
            })}
          </div>
          <button className="btn primary block" onClick={() => setPhase('pairs')}>
            Próximo
          </button>
        </section>
      )}

      {phase === 'pairs' && (
        <section className="card">
          <h1 ref={h} tabIndex={-1} className="q-prompt" id="pairs-h">
            2. Relações: quais destes pares foram apresentados juntos?
          </h1>
          <p className="muted small">Todas as palavras abaixo estavam na lista. A pergunta é sobre a ligação.</p>
          <div className="choices" role="group" aria-labelledby="pairs-h">
            {pairOpts.map((o) => {
              const k = pairKey(o);
              const on = pickedPairs.includes(k);
              return (
                <button key={k} className={`choice ${on ? 'selected' : ''}`} aria-pressed={on} onClick={() => setPickedPairs((p) => (on ? p.filter((x) => x !== k) : [...p, k]))}>
                  <span className="choice-text">
                    {o.a} — {o.b}
                  </span>
                  {on && <span className="mark">✓ marcado</span>}
                </button>
              );
            })}
          </div>
          <button className="btn primary block" onClick={() => { setPhase('summary'); update(addSession('case')); }}>
            Ver resultado
          </button>
        </section>
      )}

      {phase === 'summary' && (
        <section className="card prose">
          <h1 ref={h} tabIndex={-1}>
            Duas demandas diferentes
          </h1>
          <ul className="summary-list">
            <li>
              <strong>Itens:</strong> você marcou {wordHits} de {totalStudiedShown} palavras vistas
              {wordFalse.length ? ` e ${wordFalse.length} que não estavam (${wordFalse.join(', ')})` : ''}.
            </li>
            <li>
              <strong>Relações:</strong> identificou {pairHits} de 2 pares verdadeiros
              {pairFalse.length ? ` e marcou ${pairFalse.length} par(es) recombinado(s) (${pairFalse.map((o) => `${o.a}–${o.b}`).join(', ')})` : ''}.
            </li>
          </ul>
          <p>
            Pares verdadeiros: lápis–janela e garfo–rio. Vela–nuvem e sapato–cachorro misturavam palavras de pares
            diferentes: cada palavra era familiar, mas a combinação não. Por isso o reconhecimento de pares exige memória
            relacional, mesmo oferecendo opções.
          </p>
          <p className="muted small">Uma única tentativa não diz qual processo foi responsável, nem identifica diagnóstico.</p>
          <button className="btn primary block" onClick={() => navigate('/praticar/exercicios')}>
            Ir para os exercícios
          </button>
        </section>
      )}
    </div>
  );
}

export function ExerciseRunner({ mode }: { mode: 'all' | 'review' }) {
  const { progress, update } = useProgress();
  const [queue] = useState(() =>
    mode === 'all' ? exercises.map((e) => e.id) : progress.reviewExercises.filter((id) => getExercise(id)),
  );
  const [index, setIndex] = useState(() => (mode === 'all' && progress.exerciseIndex < exercises.length ? progress.exerciseIndex : 0));
  const [stats, setStats] = useState({ ok: 0, review: 0 });
  const h = useFocusTop(index);
  const finished = index >= queue.length;

  useEffect(() => {
    if (mode === 'all') update((p) => ({ ...p, exerciseIndex: finished ? 0 : index }));
  }, [index, finished, mode, update]);
  useEffect(() => {
    if (finished && queue.length) update(addSession(mode === 'all' ? 'exercises' : 'review'));
  }, [finished, queue.length, mode, update]);

  if (!queue.length || finished) {
    return (
      <div className="screen">
        <section className="card center">
          <h1 ref={h} tabIndex={-1}>
            {queue.length ? 'Sessão concluída' : 'Nada para revisar'}
          </h1>
          {queue.length > 0 && (
            <p>
              {stats.ok} certo(s) · {stats.review} guardado(s) para revisar
            </p>
          )}
          <div className="stack">
            <button className="btn primary block" onClick={() => navigate('/praticar/revisar')}>
              Para revisar
            </button>
            <button className="btn secondary block" onClick={() => navigate('/banca')}>
              Banca oral
            </button>
            <button className="btn ghost block" onClick={() => navigate('/praticar')}>
              Voltar a Praticar
            </button>
          </div>
        </section>
      </div>
    );
  }

  const ex = getExercise(queue[index])!;
  return (
    <div className="screen">
      <button className="btn ghost small" onClick={() => navigate('/praticar')}>
        ← Praticar
      </button>
      <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={queue.length} aria-valuenow={index} aria-label="Progresso">
        <div className="progress-fill" style={{ width: `${(index / queue.length) * 100}%` }} />
      </div>
      <p className="muted small step-count">
        {mode === 'review' ? 'Revisão' : 'Exercícios'} · {index + 1} de {queue.length}
      </p>
      <h1 className="sr-only" ref={h} tabIndex={-1}>
        Exercício {ex.number}
      </h1>
      <section className="card" key={ex.id}>
        <QuestionView
          exercise={ex}
          onDone={(ok) => {
            update(setExerciseReview(ex.id, !ok));
            setStats((s) => (ok ? { ...s, ok: s.ok + 1 } : { ...s, review: s.review + 1 }));
            setIndex((i) => i + 1);
          }}
        />
      </section>
    </div>
  );
}

export function ReviewScreen() {
  const { progress, update } = useProgress();
  const { openParagraph } = useSheets();
  const h = useFocusTop(0);
  const exs = progress.reviewExercises.map(getExercise).filter(Boolean);
  const orals = progress.reviewOral.map(getOral).filter(Boolean);
  const where = (pid: string) => {
    const p = getParagraph(pid);
    return p ? p.sectionTitle : '';
  };
  return (
    <div className="screen">
      <button className="btn ghost small" onClick={() => navigate('/praticar')}>
        ← Praticar
      </button>
      <h1 ref={h} tabIndex={-1}>
        Para revisar
      </h1>
      <p className="muted">Cada item leva direto ao parágrafo que sustenta a resposta.</p>

      <section className="card">
        <h2 className="small-h">Exercícios ({exs.length})</h2>
        {exs.length ? (
          <>
            <ul className="review-list">
              {exs.map((e) => (
                <li key={e!.id}>
                  <p>
                    <strong>{e!.number}.</strong> {e!.prompt}
                  </p>
                  <div className="row-btns">
                    <button className="btn ghost small" onClick={() => openParagraph(e!.pid)}>
                      Ver trecho ({where(e!.pid)})
                    </button>
                    <button className="btn ghost small" onClick={() => navigate(`/estudar/${e!.pid}`)}>
                      Abrir no texto
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <button className="btn primary block" onClick={() => navigate('/praticar/revisar/exercicios')}>
              Refazer estes exercícios
            </button>
          </>
        ) : (
          <p>Nenhum exercício guardado.</p>
        )}
      </section>

      <section className="card">
        <h2 className="small-h">Banca oral ({orals.length})</h2>
        {orals.length ? (
          <>
            <ul className="review-list">
              {orals.map((q) => (
                <li key={q!.id}>
                  <p>“{q!.question}”</p>
                  <div className="row-btns">
                    <button className="btn ghost small" onClick={() => openParagraph(q!.pid)}>
                      Ver trecho ({where(q!.pid)})
                    </button>
                    <button className="btn ghost small" onClick={() => navigate(`/estudar/${q!.pid}`)}>
                      Abrir no texto
                    </button>
                    <button className="btn ghost small" onClick={() => update((p) => ({ ...p, reviewOral: p.reviewOral.filter((x) => x !== q!.id) }))}>
                      Já revisei
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <button className="btn primary block" onClick={() => navigate('/banca/revisar')}>
              Treinar estas perguntas
            </button>
          </>
        ) : (
          <p>Nenhuma pergunta guardada.</p>
        )}
      </section>
    </div>
  );
}

export function GlossaryScreen() {
  const [q, setQ] = useState('');
  const h = useFocusTop(0);
  const list = glossary
    .filter((g) => !q || normalize(g.term + ' ' + g.definition + ' ' + (g.aliases ?? []).join(' ')).includes(normalize(q)))
    .sort((a, b) => a.term.localeCompare(b.term, 'pt-BR'));
  return (
    <div className="screen">
      <button className="btn ghost small" onClick={() => navigate('/estudar')}>
        ← Voltar ao texto
      </button>
      <h1 ref={h} tabIndex={-1}>
        Glossário
      </h1>
      <label className="field">
        <span className="label">Buscar termo</span>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ex.: sinapse, NMDA, consolidação" />
      </label>
      <p className="muted small" aria-live="polite">
        {list.length} termo(s)
      </p>
      <dl className="glossary">
        {list.map((g) => (
          <div key={g.key} className="gloss-item">
            <dt>{g.term}</dt>
            <dd>
              {g.definition}{' '}
              <button className="linklike" onClick={() => navigate(`/estudar/${g.pid}`)}>
                Ler no texto
              </button>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
