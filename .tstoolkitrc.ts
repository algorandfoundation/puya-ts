import type { TsToolkitConfig } from "@makerx/ts-toolkit";

const config: TsToolkitConfig = {
  packageConfig: {
    srcDir: 'src',
    outDir: 'dist',
    moduleType: 'module',
    exports: {
      '.': 'index.ts',
      './cli': 'cli.ts',
      './internal': 'internal.ts'
    }
  }
}
export default config
