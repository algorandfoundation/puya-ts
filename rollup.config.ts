import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import type { RollupOptions } from 'rollup'

const config: RollupOptions = {
  input: {
    index: 'src/index.ts',
    cli: 'src/cli.ts',
    internal: 'src/internal.ts',
    'bin/run-cli': 'src/bin/run-cli.ts',
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
    moduleSideEffects: true,
    propertyReadSideEffects: false,
  },
  external: [/node_modules/, /tslib/],
  plugins: [
    typescript({
      tsconfig: './tsconfig.build.json',
    }),
    commonjs(),
    nodeResolve(),
    json(),
  ],
}

export default config
