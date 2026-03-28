import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import swc from 'unplugin-swc';

export default defineConfig({
  plugins: [tsconfigPaths(), swc.vite()],
  test: {
    globals: true, // Para usar 'describe' e 'it' sin importarlos
    environment: 'node',
    include: [
      'apps/catalogo/**/*.spec.ts',
      'apps/catalogo/test/**/*.integration-spec.ts',
      'libs/**/*.spec.ts',
      'test/**/*.spec.ts',
      'test/**/*.e2e-spec.ts',
    ],
    // Esto evita que vitest intente ejecutar archivos compilados en dist/
    exclude: ['**/node_modules/**', '**/dist/**', '**/*.js'],
  },
});
