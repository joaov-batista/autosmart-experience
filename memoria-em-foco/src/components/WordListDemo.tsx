import { useMemo, useState } from 'react';
import { wordLists } from '../data/wordLists';
import { useProgress } from '../storage';
import { normalize, shuffle, splitWords } from '../utils';

type Phase = 'study' | 'recall' | 'cue' | 'recognize' | 'summary';

export function WordListDemo({ onDone }: { onDone: () => void }) {
  const { progress, update } = useProgress();
  const [listIndex] = useState(() => progress.wordListIndex % wordLists.length);
  const list = wordLists[listIndex];
  const [phase, setPhase] = useState<Phase>('study');
  const [recallText, setRecallText] = useState('');
  const [cueText, setCueText] = useState('');
  const [picked, setPicked] = useState<string[]>([]);
  const options = useMemo(() => shuffle([...list.words, ...list.distractors]), [list]);

  const targets = list.words.map(normalize);
  const recalled = Array.from(new Set(splitWords(recallText))).filter((w) => targets.includes(w));
  const cueOk = splitWords(cueText).includes(normalize(list.cue.answer));
  const hits = picked.filter((w) => list.words.includes(w));
  const falseAlarms = picked.filter((w) => list.distractors.includes(w));

  const finish = () => {
    update((p) => ({ ...p, wordListIndex: (listIndex + 1) % wordLists.length }));
    onDone();
  };

  return (
    <div className="demo">
      <p className="badge">Demonstração</p>
      <p className="muted small">
        Esta atividade demonstra formatos de tarefa. Ela não serve como teste clínico e não mede a memória de ninguém.
      </p>

      {phase === 'study' && (
        <>
          <h2 className="q-prompt">Leia com calma as cinco palavras.</h2>
          <ul className="word-list" aria-label="Lista de palavras">
            {list.words.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
          <button className="btn primary block" onClick={() => setPhase('recall')}>
            Esconder a lista
          </button>
        </>
      )}

      {phase === 'recall' && (
        <>
          <h2 className="q-prompt">1. Escreva todas as palavras que você lembra.</h2>
          <p className="muted small">Sem ajuda nenhuma. Maiúsculas e acentos não importam.</p>
          <label className="field">
            <span className="label">Palavras (separe por espaço ou vírgula)</span>
            <textarea value={recallText} onChange={(e) => setRecallText(e.target.value)} rows={3} autoCapitalize="none" />
          </label>
          <button className="btn primary block" onClick={() => setPhase('cue')}>
            Pronto
          </button>
        </>
      )}

      {phase === 'cue' && (
        <>
          <p className="feedback">
            Na recordação livre você produziu <strong>{recalled.length}</strong> de 5 palavras.
          </p>
          <h2 className="q-prompt">2. Pista: havia {list.cue.category} na lista. Qual?</h2>
          <label className="field">
            <span className="label">Sua resposta</span>
            <input value={cueText} onChange={(e) => setCueText(e.target.value)} autoCapitalize="none" autoComplete="off" />
          </label>
          <button className="btn primary block" onClick={() => setPhase('recognize')}>
            Pronto
          </button>
        </>
      )}

      {phase === 'recognize' && (
        <>
          <p className="feedback">
            {cueOk ? 'Com a pista, você chegou à palavra.' : `A palavra era “${list.cue.answer}”.`}
          </p>
          <h2 className="q-prompt" id="rec-label">
            3. Quais destas palavras estavam na lista original?
          </h2>
          <div className="word-grid" role="group" aria-labelledby="rec-label">
            {options.map((w) => {
              const on = picked.includes(w);
              return (
                <button
                  key={w}
                  className={`chip ${on ? 'on' : ''}`}
                  aria-pressed={on}
                  onClick={() => setPicked((p) => (on ? p.filter((x) => x !== w) : [...p, w]))}
                >
                  {on ? '✓ ' : ''}
                  {w}
                </button>
              );
            })}
          </div>
          <button className="btn primary block" onClick={() => setPhase('summary')}>
            Verificar
          </button>
        </>
      )}

      {phase === 'summary' && (
        <>
          <h2 className="q-prompt">Compare os três formatos</h2>
          <ul className="summary-list">
            <li>
              <strong>Recordação livre:</strong> {recalled.length} de 5 palavras, sem ajuda.
            </li>
            <li>
              <strong>Recordação com pista:</strong> {cueOk ? 'acertou' : 'não chegou à palavra'} com a dica “{list.cue.category}”.
            </li>
            <li>
              <strong>Reconhecimento:</strong> marcou {hits.length} de 5 palavras da lista
              {falseAlarms.length > 0 ? ` e ${falseAlarms.length} que não estavam (${falseAlarms.join(', ')})` : ''}.
            </li>
          </ul>
          <p>
            Lista original: <strong>{list.words.join(', ')}</strong>. Palavras novas: {list.distractors.join(', ')}.
          </p>
          <p>
            Repare no tipo de ajuda: nenhuma, uma pista de categoria e, por fim, as próprias opções. Para muitas pessoas, o
            resultado melhora conforme a ajuda aumenta — mas isso varia, e uma única tentativa não diz qual processo foi
            responsável.
          </p>
          <p className="muted small">Ao repetir a lição, a demonstração usa outra lista.</p>
          <button className="btn primary block" onClick={finish}>
            Continuar
          </button>
        </>
      )}
    </div>
  );
}
