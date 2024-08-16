import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'vitest/config'
import { puyaTsTransformer } from '../../src/test-transformer'

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
      transformers: {
        before: [puyaTsTransformer],
      },
    }),
  ],
  test: {
    globals: true,
  },
})
