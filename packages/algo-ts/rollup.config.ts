import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import type { RollupOptions } from 'rollup'

const config: RollupOptions = {
  input: {
    index: 'src/index.ts',
    'arc4/index': 'src/arc4/index.ts',
    op: 'src/op.ts',
    itxn: 'src/itxn.ts',
    gtxn: 'src/gtxn.ts',
  },
  output: [
    {
      dir: 'dist',
      format: 'es',
      exports: 'named',
      entryFileNames: '[name].mjs',
      preserveModules: false,
      sourcemap: true,
    },
  ],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
  },
  external: [/node_modules/, /tslib/],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.build.json',
    }),
    commonjs(),
    nodeResolve(),
    json(),
  ],
}

export default config
