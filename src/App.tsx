import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell/AppShell.tsx';
import AfterMeeting from './pages/AfterMeeting/AfterMeeting.tsx';
import HowItWorks from './pages/HowItWorks/HowItWorks.tsx';
import Journey from './pages/Journey/Journey.tsx';
import MeetingOneSetup from './pages/MeetingSetup/MeetingOneSetup.tsx';
import MeetingTwoSetup from './pages/MeetingSetup/MeetingTwoSetup.tsx';
import NotFound from './pages/NotFound/NotFound.tsx';
import PrepSheetPage from './pages/PrepSheet/PrepSheetPage.tsx';
import UseIt from './pages/UseIt/UseIt.tsx';
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
        <Route path="journey" element={<Journey />} />
        <Route path="meeting/1/setup" element={<MeetingOneSetup />} />
        <Route path="meeting/1/after" element={<AfterMeeting />} />
        <Route path="meeting/2/setup" element={<MeetingTwoSetup />} />
        <Route path="meeting/:n/sheet" element={<PrepSheetPage />} />
        <Route path="how-it-works" element={<HowItWorks />} />
        <Route path="use-it" element={<UseIt />} />
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
