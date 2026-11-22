import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell/AppShell.tsx';
import NotFound from './pages/NotFound/NotFound.tsx';
import Welcome from './pages/Welcome/Welcome.tsx';

// Dev only: the branch is removed from production builds, so no styleguide chunk ships.
const Styleguide = import.meta.env.DEV
  ? lazy(() => import('./pages/Styleguide/Styleguide.tsx'))
  : null;

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Welcome />} />
        {Styleguide && (
          <Route
            path="styleguide"
            element={
              <Suspense fallback={null}>
                <Styleguide />
              </Suspense>
            }
          />
        )}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
