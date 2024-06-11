import { defineConfig } from 'vitest/config'
import typescript from "@rollup/plugin-typescript";
import {puyaTsTransformer} from "@algorandfoundation/algo-ts-testing/test-transformer";

export default defineConfig({
  resolve: {
    conditions: ['dev'],
  },
  esbuild: {},
  plugins: [
    typescript({
      target: 'ES2022',
      compilerOptions: {
        lib: ['es2023']
      },
      transformers: {
        before: [puyaTsTransformer]
      }
    })
  ],
  test: {
    globals: true,
  },
})
