import type { LogLevel } from './logger'

export interface AlgoFile {
  matchedInput: string
  sourceFile: string
  outDir: string
}

export interface PuyaTsCompileOptions {
  filePaths: AlgoFile[]
  logLevel: LogLevel
  outputAwst: boolean
  outputAwstJson: boolean
  skipVersionCheck: boolean
  /*
  Don't generate artifacts for puya, or invoke puya
   */
  dryRun: boolean
}
