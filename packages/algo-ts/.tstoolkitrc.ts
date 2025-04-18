import type { TsToolkitConfig } from '@makerx/ts-toolkit'

const config: TsToolkitConfig = {
  packageConfig: {
    srcDir: 'src',
    outDir: 'dist',
    moduleType: 'module',
    main: 'index.ts',
    exports: {
      '.': 'index.ts',
      './arc4': 'arc4/index.ts',
      './op': 'op.ts',
      './itxn': 'itxn.ts',
      './gtnx': 'gtxn.ts',
    },
  },
}
export default config
