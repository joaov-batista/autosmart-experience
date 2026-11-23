import { navigate } from '../utils';
import { useRefs } from './References';

export function TopBar({ title, onBack }: { title: string; onBack?: () => void }) {
  const { openAll } = useRefs();
  return (
    <header className="topbar">
      <button className="btn ghost small" onClick={onBack ?? (() => navigate('/'))} aria-label="Voltar ao início">
        ← Início
      </button>
      <span className="topbar-title">{title}</span>
      <button className="btn ghost small" onClick={openAll}>
        Fontes
      </button>
    </header>
  );
}
