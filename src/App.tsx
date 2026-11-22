import { Route, Routes } from 'react-router-dom';
import Welcome from './pages/Welcome/Welcome.tsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
    </Routes>
  );
}
