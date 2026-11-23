import { useEffect, useState } from 'react';
import { SheetsProvider } from './components/References';
import { ProgressProvider } from './storage';
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
  { path: '/estudar', label: 'Estudar', icon: '❡', match: ['/estudar', '/glossario'] },
  { path: '/praticar', label: 'Praticar', icon: '✎', match: ['/praticar'] },
  { path: '/banca', label: 'Banca oral', icon: '❝', match: ['/banca'] },
  { path: '/ensaiar', label: 'Ensaiar', icon: '◷', match: ['/ensaiar'] },
];

function BottomNav({ route }: { route: string }) {
  return (
    <nav className="bottom-nav" aria-label="Seções">
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

export default function App() {
  const route = useHashRoute();
  return (
    <ProgressProvider>
      <SheetsProvider>
        <main className="app">
          {/* key: cada rota começa com estado novo */}
          <Router route={route} key={route} />
        </main>
        <BottomNav route={route} />
      </SheetsProvider>
    </ProgressProvider>
  );
}
