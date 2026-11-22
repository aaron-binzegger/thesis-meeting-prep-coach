import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './styles/fonts.css';
import './styles/tokens.css';
import './styles/global.css';
import './styles/print.css';
import App from './App.tsx';
import { SessionProvider } from './state/SessionProvider.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <SessionProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </SessionProvider>
  </StrictMode>,
);
