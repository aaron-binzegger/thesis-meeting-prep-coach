import { Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell/AppShell.tsx';
import NotFound from './pages/NotFound/NotFound.tsx';
import Welcome from './pages/Welcome/Welcome.tsx';

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Welcome />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
