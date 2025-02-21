import typescript from '@rollup/plugin-typescript'
import os from 'os'
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
    }),
  ],
  test: {
    setupFiles: 'test.setup.ts',
    maxConcurrency: os.cpus().length,
    globals: true,
    testTimeout: 20_000,
    exclude: ['packages/**', 'node_modules/**'],
  },
})
