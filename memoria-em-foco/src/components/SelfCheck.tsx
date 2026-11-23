import { useState, type ReactNode } from 'react';
import { RichText } from './References';

export type SelfRating = 'ok' | 'missing';

/**
 * Fluxo de autoavaliação: mostra só a pergunta; a estudante responde em voz alta ou digita
 * tópicos; ao tocar em “Comparar minha resposta”, revela o modelo e dois critérios.
 * O app não avalia a fala nem a compreensão automaticamente.
 */
export function SelfCheck({
  prompt,
  model,
  criteria,
  extra,
  note,
  onRate,
  compareLabel = 'Comparar minha resposta',
}: {
  prompt: ReactNode;
  model: string;
  criteria: [string, string];
  extra?: ReactNode;
  note?: string;
  onRate: (rating: SelfRating) => void;
  compareLabel?: string;
}) {
  const [revealed, setRevealed] = useState(false);
  const [notes, setNotes] = useState('');
  const [checks, setChecks] = useState([false, false]);

  const retry = () => {
    setRevealed(false);
    setChecks([false, false]);
  };

  return (
    <div className="selfcheck">
      <div className="prompt">{prompt}</div>
      <p className="muted small">Responda em voz alta ou anote tópicos. Nada é gravado.</p>
      <label className="field">
        <span className="label">Meus tópicos (opcional)</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Ex.: codificação, recuperação, exemplo do aviso…"
        />
      </label>
      {!revealed ? (
        <button className="btn primary block" onClick={() => setRevealed(true)}>
          {compareLabel}
        </button>
      ) : (
        <div className="reveal" aria-live="polite">
          <h3>Resposta-modelo</h3>
          <p>
            <RichText text={model} />
          </p>
          {note && <p className="muted small">{note}</p>}
          {extra}
          <h3>Confira na sua resposta</h3>
          <div className="criteria">
            {criteria.map((c, i) => (
              <label key={i} className="check">
                <input
                  type="checkbox"
                  checked={checks[i]}
                  onChange={(e) => setChecks((prev) => prev.map((v, j) => (j === i ? e.target.checked : v)))}
                />
                <span>{c}</span>
              </label>
            ))}
          </div>
          <div className="rate-row">
            <button className="btn primary" onClick={() => onRate('ok')}>
              Consegui explicar
            </button>
            <button className="btn secondary" onClick={() => onRate('missing')}>
              Faltou um ponto
            </button>
            <button className="btn ghost" onClick={retry}>
              Quero tentar de novo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
