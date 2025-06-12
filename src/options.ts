import { LogLevel } from './logger'
import type { Props } from './typescript-helpers'

export interface AlgoFile {
  sourceFile: string
  outDir: string
  fileContents?: string
}

export class CompileOptions {
  public readonly filePaths: AlgoFile[]
  public readonly logLevel: LogLevel
  public readonly outputAwst: boolean
  public readonly outputAwstJson: boolean
  public readonly skipVersionCheck: boolean
  /**
   * Don't generate artifacts for puya, or invoke puya
   */
  public readonly dryRun: boolean
  public readonly outputTeal: boolean
  public readonly outputArc32: boolean
  public readonly outputArc56: boolean
  public readonly outputSsaIr: boolean
  public readonly outputOptimizationIr: boolean
  public readonly outputDestructuredIr: boolean
  public readonly outputMemoryIr: boolean
  public readonly outputBytecode: boolean
  public readonly outputSourceMap: boolean
  public readonly debugLevel: number
  public readonly optimizationLevel: number
  public readonly targetAvmVersion: number
  public readonly cliTemplateDefinitions: Record<string, Uint8Array | bigint>
  public readonly templateVarsPrefix: string
  public readonly localsCoalescingStrategy: LocalsCoalescingStrategy
  public readonly customPuyaPath?: string

  constructor(options: Partial<Props<CompileOptions>> & { filePaths: AlgoFile[] }) {
    this.filePaths = options.filePaths
    this.logLevel = options.logLevel ?? LogLevel.Info
    this.outputAwst = options.outputAwst ?? false
    this.outputAwstJson = options.outputAwstJson ?? false
    this.skipVersionCheck = options.skipVersionCheck ?? false
    this.dryRun = options.dryRun ?? false
    this.outputTeal = options.outputTeal ?? false
    this.outputArc32 = options.outputArc32 ?? false
    this.outputArc56 = options.outputArc56 ?? false
    this.outputSsaIr = options.outputSsaIr ?? false
    this.outputOptimizationIr = options.outputOptimizationIr ?? false
    this.outputDestructuredIr = options.outputDestructuredIr ?? false
    this.outputMemoryIr = options.outputMemoryIr ?? false
    this.outputBytecode = options.outputBytecode ?? false
    this.outputSourceMap = options.outputSourceMap ?? false
    this.debugLevel = options.debugLevel ?? defaultPuyaOptions.debugLevel
    this.optimizationLevel = options.optimizationLevel ?? defaultPuyaOptions.optimizationLevel
    this.targetAvmVersion = options.targetAvmVersion ?? defaultPuyaOptions.targetAvmVersion
    this.cliTemplateDefinitions = options.cliTemplateDefinitions ?? defaultPuyaOptions.cliTemplateDefinitions
    this.templateVarsPrefix = options.templateVarsPrefix ?? defaultPuyaOptions.templateVarsPrefix
    this.localsCoalescingStrategy = options.localsCoalescingStrategy ?? defaultPuyaOptions.localsCoalescingStrategy
    this.customPuyaPath = options.customPuyaPath ?? process.env.PUYA_PATH
  }

  buildPuyaOptions(compilationSet: CompilationSetMapping) {
    return new PuyaOptions({ ...this, compilationSet })
  }
}

export enum LocalsCoalescingStrategy {
  root_operand = 'root_operand',
  root_operand_excluding_args = 'root_operand_excluding_args',
  aggressive = 'aggressive',
}
export type CompilationSetMapping = Record<string, string>

export const defaultPuyaOptions: PuyaPassThroughOptions = {
  outputTeal: true,
  outputArc32: true,
  outputArc56: true,
  outputSsaIr: false,
  outputSourceMap: true,
  outputOptimizationIr: false,
  outputDestructuredIr: false,
  outputMemoryIr: false,
  outputBytecode: false,
  debugLevel: 1,
  optimizationLevel: 1,
  targetAvmVersion: 10,
  cliTemplateDefinitions: {},
  templateVarsPrefix: 'TMPL_',
  localsCoalescingStrategy: LocalsCoalescingStrategy.root_operand,
}
export type PuyaPassThroughOptions = Omit<PuyaOptions, 'compilationSet'>

export class PuyaOptions {
  outputTeal: boolean
  outputArc32: boolean
  outputArc56: boolean
  outputSsaIr: boolean
  outputOptimizationIr: boolean
  outputDestructuredIr: boolean
  outputMemoryIr: boolean
  outputBytecode: boolean
  outputSourceMap: boolean
  debugLevel: number
  optimizationLevel: number
  targetAvmVersion: number
  cliTemplateDefinitions: Record<string, Uint8Array | bigint>
  templateVarsPrefix: string
  localsCoalescingStrategy: LocalsCoalescingStrategy

  compilationSet: CompilationSetMapping
  constructor(options: Props<PuyaOptions>) {
    this.compilationSet = options.compilationSet
    this.outputTeal = options.outputTeal
    this.outputArc32 = options.outputArc32
    this.outputArc56 = options.outputArc56
    this.outputSsaIr = options.outputSsaIr
    this.outputOptimizationIr = options.outputOptimizationIr
    this.outputDestructuredIr = options.outputDestructuredIr
    this.outputMemoryIr = options.outputMemoryIr
    this.outputBytecode = options.outputBytecode
    this.debugLevel = options.debugLevel
    this.optimizationLevel = options.optimizationLevel
    this.targetAvmVersion = options.targetAvmVersion
    this.cliTemplateDefinitions = options.cliTemplateDefinitions
    this.templateVarsPrefix = options.templateVarsPrefix
    this.localsCoalescingStrategy = options.localsCoalescingStrategy
    this.outputSourceMap = options.outputSourceMap
  }
}
