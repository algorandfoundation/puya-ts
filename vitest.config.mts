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
        lib: ['es2023'],
      },
    }),
  ],
  test: {
    globals: true,
    testTimeout: 20_000,
    exclude: ['packages/**', 'node_modules/**'],
  },
})
