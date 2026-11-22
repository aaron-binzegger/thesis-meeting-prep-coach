import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { SessionProvider } from '../state/SessionProvider.tsx';

/** Renders a component inside a SessionProvider and a MemoryRouter starting at the given route. */
export function renderWithRouter(ui: ReactElement, { route = '/' }: { route?: string } = {}) {
  return render(
    <SessionProvider>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </SessionProvider>,
  );
}
