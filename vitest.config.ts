import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths({
      projects: ['./tsconfig.vitest.json'],
    }),
  ],
  esbuild: {
    target: 'es2022',
    tsconfigRaw: {
      compilerOptions: {
        verbatimModuleSyntax: false,
      },
    },
  },
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup/test-setup.ts'],
    include: ['**/*.{test,spec}.ts'],
    exclude: ['node_modules', 'dist', 'docs'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'docs/',
        'src/database/migrations/',
        'src/database/migration-template.ts',
        'src/utils/openapi-generator.ts',
        '**/*.{test,spec}.ts',
        'tests/',
        'vitest.config.ts',
        'scripts/',
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
  },
});
