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
    },
    bin: {
      'puya-ts': 'bin/run-cli.ts',
      puyats: 'bin/run-cli.ts',
      'run-language-server': 'bin/run-language-server.ts',
      'download-puya-binary': 'bin/download-puya-binary.ts',
    },
    customSections: ['bundledDependencies'],
  },
}
export default config
