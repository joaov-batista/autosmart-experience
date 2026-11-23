import { useEffect, useState } from 'react';
import { ReferencesProvider } from './components/References';
import { ProgressProvider } from './storage';
import { HomeScreen, LessonList } from './screens/HomeScreen';
import { LessonScreen } from './screens/LessonScreen';
import { MixedScreen, ReviewQuizScreen } from './screens/QuizSession';
import { OralScreen } from './screens/OralScreen';
import { PresentationScreen } from './screens/PresentationScreen';
import { ReviewHub } from './screens/ReviewHub';
import { TopBar } from './components/TopBar';

function useHashRoute() {
  const get = () => window.location.hash.replace(/^#/, '') || '/';
  const [route, setRoute] = useState(get);
  useEffect(() => {
    const on = () => setRoute(get());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

function Router({ route }: { route: string }) {
  const lesson = route.match(/^\/licao\/([\w-]+)/);
  if (lesson) return <LessonScreen lessonId={lesson[1]} />;
  switch (route) {
    case '/licoes':
      return (
        <div className="screen">
          <TopBar title="Aprender" />
          <LessonList standalone />
        </div>
      );
    case '/revisar':
      return <ReviewHub />;
    case '/revisar/questoes':
      return <ReviewQuizScreen />;
    case '/mista':
      return <MixedScreen />;
    case '/banca':
      return <OralScreen />;
    case '/banca/dificeis':
      return <OralScreen onlyDifficult />;
    case '/apresentacao':
      return <PresentationScreen />;
    default:
      return <HomeScreen />;
  }
}

export default function App() {
  const route = useHashRoute();
  return (
    <ProgressProvider>
      <ReferencesProvider>
        <main className="app">
          {/* key: cada rota começa com estado novo */}
          <Router route={route} key={route} />
        </main>
      </ReferencesProvider>
    </ProgressProvider>
  );
}
