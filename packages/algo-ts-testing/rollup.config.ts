import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import type { RollupOptions } from 'rollup'

const config: RollupOptions = {
  input: {
    index: 'src/index.ts',
    'runtime-helpers': 'src/runtime-helpers.ts',
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
