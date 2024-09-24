import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import type { RollupOptions } from 'rollup'

const config: RollupOptions = {
  input: {
    index: 'src/index.ts',
    cli: 'src/cli.ts',
    'test-transformer': 'src/test-transformer/index.ts',
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
  plugins: [
    typescript({
      tsconfig: './tsconfig.build.json',
    }),
    commonjs({ extensions: ['.js'] }),
    nodeResolve(),
    json(),
  ],
}

export default config
