import typescript from '@rollup/plugin-typescript'
import type { RollupOptions } from 'rollup'
import { puyaTsTransformer } from '../src/test-transformer'

const config: RollupOptions = {
  input: [
    'examples/hello-world-abi/contract.algo.ts',
    'examples/hello-world/contract.algo.ts',
    'examples/auction/contract.algo.ts',
    'examples/voting/contract.algo.ts',
  ],
  output: [
    {
      dir: 'examples/debug-out',
      format: 'es',
      exports: 'named',
      entryFileNames: '[name].mjs',
      preserveModules: true,
      sourcemap: true,
    },
  ],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
  },
  external: [/node_modules/],
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
}

export default config
