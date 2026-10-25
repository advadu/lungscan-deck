import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      // Pages: the deck, the user guide, the results and the lab's training.
      input: {
        main: resolve(__dirname, 'index.html'),
        guide: resolve(__dirname, 'guide.html'),
        results: resolve(__dirname, 'results.html'),
        training: resolve(__dirname, 'training.html'),
      },
    },
  },
  server: {
    port: 5173,
  },
});
