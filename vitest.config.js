// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    setupFiles: './src/app/tests/vitest.setup.js', // Caminho correto do arquivo de setup
  },
});
