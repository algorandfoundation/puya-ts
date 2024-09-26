import type { TsToolkitConfig } from '@makerx/ts-toolkit'

const config: TsToolkitConfig = {
  packageConfig: {
    srcDir: 'src',
    exportTypes: 'module',
    outDir: 'dist',
    moduleType: 'module',
    exports: {
      '.': 'index.ts',
      './cli': 'cli.ts',
      './internal': 'internal.ts',
    },
    bin: {
      'puya-ts': 'bin/run-cli.ts',
      puyats: 'bin/run-cli.ts',
    },
  },
}
export default config
