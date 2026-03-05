import typescript from '@rollup/plugin-typescript'
import { puyaTsTransformer } from '@algorandfoundation/algorand-typescript-testing/vitest-transformer'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
      transformers: {
        before: [puyaTsTransformer],
      },
    }),
  ],
  test: {
    setupFiles: 'vitest.setup.ts',
    globals: true,
  },
})
