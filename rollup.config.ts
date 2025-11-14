import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import type { RollupOptions } from 'rollup'

const config: RollupOptions = {
  input: {
    index: 'src/index.ts',
    cli: 'src/cli.ts',
    'bin/run-cli': 'src/bin/run-cli.ts',
    'bin/puyats-ls': 'src/bin/puyats-ls.ts',
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
  external: (module) => {
    if (/tslib/.test(module)) return true
    if (/node_modules/.test(module)) {
      return !/vscode-/.test(module)
    }
    return false
  },

  plugins: [
    typescript({
      tsconfig: './tsconfig.build.json',
    }),
    commonjs(),
    nodeResolve(),
    json(),
  ],
  onwarn(log, defaultHandler) {
    if (log.code === 'CIRCULAR_DEPENDENCY') {
      throw new Error(log.message)
    } else {
      defaultHandler(log)
    }
  },
}

export default config
