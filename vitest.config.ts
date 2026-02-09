import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true, // Para usar 'describe' e 'it' sin importarlos
    environment: 'node',
    include: ['test/**/*.spec.ts'], // Fuerza a que solo use archivos .ts
    exclude: ['**/node_modules/**', '**/dist/**', '**/*.js'],
  },
});