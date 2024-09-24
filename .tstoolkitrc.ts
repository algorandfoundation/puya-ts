import type {TsToolkitConfig} from "@makerx/ts-toolkit";

const config: TsToolkitConfig = {
  packageConfig: {
    srcDir: 'src',
    outDir: 'dist',
    moduleType: 'module',
    exports: {
      '.': 'index',
      './cli': 'cli',
      './test-transformer': 'test-transformer'
    }
  }
}
export default config
