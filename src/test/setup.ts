import '@testing-library/jest-dom/vitest';
import { cleanup, configure } from '@testing-library/react';
import { afterEach } from 'vitest';

// findBy* waits up to 5 s instead of 1 s: lazy routes and async renders can be slow
// when the whole suite runs in parallel (CI, Windows).
configure({ asyncUtilTimeout: 5000 });

afterEach(() => {
  cleanup();
});
