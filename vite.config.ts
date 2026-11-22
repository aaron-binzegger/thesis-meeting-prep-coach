import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the app from https://<user>.github.io/thesis-meeting-prep-coach/
export default defineConfig({
  base: '/thesis-meeting-prep-coach/',
  plugins: [react()],
});
