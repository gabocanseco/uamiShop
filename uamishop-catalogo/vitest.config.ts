import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import swc from 'unplugin-swc';

export default defineConfig({
  plugins: [tsconfigPaths(), swc.vite()],
  test: {
    globals: true,
    environment: 'node',
    include: [
      'src/**/*.spec.ts',
      'test/**/*.e2e-spec.ts',
    ],
    exclude: ['**/node_modules/**', '**/dist/**', '**/*.js'],
    setupFiles: ['./test/setup-e2e.ts'],
  },
});
  