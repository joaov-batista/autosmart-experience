import { useEffect, useState } from 'react';
import { SheetsProvider } from './components/References';
import { ProgressProvider, useProgress } from './storage';
import { NotesProvider } from './notes';
import { NotesScreen } from './screens/NotesScreen';
import { ReadingScreen } from './screens/ReadingScreen';
import { CaseScreen, ExerciseRunner, GlossaryScreen, PracticeHub, ReviewScreen } from './screens/PracticeScreens';
import { OralScreen } from './screens/OralScreen';
import { PresentationScreen } from './screens/PresentationScreen';

function useHashRoute() {
  const get = () => window.location.hash.replace(/^#/, '') || '/estudar';
  const [route, setRoute] = useState(get);
  useEffect(() => {
    const on = () => setRoute(get());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

function Router({ route }: { route: string }) {
  const jump = route.match(/^\/estudar\/([\w-]+)/);
  if (jump) return <ReadingScreen jumpTo={jump[1]} />;
  switch (route) {
    case '/anotacoes':
      return <NotesScreen />;
    case '/glossario':
      return <GlossaryScreen />;
    case '/praticar':
      return <PracticeHub />;
    case '/praticar/caso':
      return <CaseScreen />;
    case '/praticar/exercicios':
      return <ExerciseRunner mode="all" />;
    case '/praticar/revisar':
      return <ReviewScreen />;
    case '/praticar/revisar/exercicios':
      return <ExerciseRunner mode="review" />;
    case '/banca':
      return <OralScreen />;
    case '/banca/revisar':
      return <OralScreen onlyReview />;
    case '/ensaiar':
      return <PresentationScreen />;
    default:
      return <ReadingScreen />;
  }
}

const TABS = [
  { path: '/estudar', label: 'Estudar', icon: '📖', match: ['/estudar', '/glossario'] },
  { path: '/anotacoes', label: 'Anotações', icon: '✍', match: ['/anotacoes'] },
  { path: '/praticar', label: 'Praticar', icon: '◎', match: ['/praticar'] },
  { path: '/banca', label: 'Banca', icon: '💬', match: ['/banca'] },
  { path: '/ensaiar', label: 'Ensaiar', icon: '⏱', match: ['/ensaiar'] },
];

function BottomNav({ route }: { route: string }) {
  return (
    <nav className="bottom-nav" aria-label="Seções">
      <span className="nav-brand" aria-hidden="true">
        <span className="brand-dot" /> Memória em Foco
      </span>
      {TABS.map((t) => {
        const active = t.match.some((m) => route === m || route.startsWith(m + '/'));
        return (
          <a key={t.path} href={`#${t.path}`} className={`tab-link ${active ? 'on' : ''}`} aria-current={active ? 'page' : undefined}>
            <span aria-hidden="true" className="tab-icon">{t.icon}</span>
            <span>{t.label}</span>
          </a>
        );
      })}
    </nav>
  );
}

const THEME_COLORS: Record<string, string> = { light: '#f6f5f1', warm: '#f3ede3', dark: '#1c1f25' };

/** Aplica o tema escolhido (ou o do sistema) ao documento. */
function ThemeSync() {
  const { progress } = useProgress();
  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const t = progress.theme === 'auto' ? (sysDark ? 'dark' : 'light') : progress.theme;
      root.dataset.theme = t;
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[t]);
      window.dispatchEvent(new Event('mef-theme'));
    };
    apply();
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [progress.theme]);
  return null;
}

export default function App() {
  const route = useHashRoute();
  return (
    <ProgressProvider>
      <NotesProvider>
        <SheetsProvider>
          <ThemeSync />
          <div className="shell">
            <BottomNav route={route} />
            <main className={`app ${route.startsWith('/estudar') || route === '/' ? 'is-reading' : ''}`}>
              {/* key: cada rota começa com estado novo */}
              <Router route={route} key={route} />
            </main>
          </div>
        </SheetsProvider>
      </NotesProvider>
    </ProgressProvider>
  );
}
