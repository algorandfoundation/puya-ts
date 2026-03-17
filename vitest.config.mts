import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    conditions: ['dev'],
  },
  esbuild: {},
  plugins: [
    typescript({
      target: 'ES2022',
      compilerOptions: {
        lib: ['ESNext'],
      },
      exclude: ['tests/**/*.client.ts'],
    }),
  ],
  test: {
    setupFiles: 'test.setup.ts',
    globals: true,
    testTimeout: 30_000,
    exclude: ['packages/**', 'node_modules/**'],
  },
})
