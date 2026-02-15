import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true, // Para usar 'describe' e 'it' sin importarlos
    environment: 'node',
    include: [
      'src/**/*.spec.ts',
      //   'test/**/*.e2e-spec.ts', // Para pruebas e2e en la carpeta test
    ],
    // Esto evita que vitest intente ejecutar archivos compilados en dist/
    exclude: ['**/node_modules/**', '**/dist/**', '**/*.js'],
  },
});
