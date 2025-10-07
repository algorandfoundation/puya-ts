import { LogLevel } from './logger'
import type { Props } from './typescript-helpers'
import type { AbsolutePath } from './util/absolute-path'

export interface AlgoFile {
  sourceFile: AbsolutePath
  outDir: AbsolutePath
}

export type FileExistsMethod = (fileName: string) => boolean
export type ReadFileMethod = (fileName: string) => string | undefined
export type SourceFileProvider = { fileExists: FileExistsMethod; readFile: ReadFileMethod }

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
  public readonly validateAbiArgs: boolean
  public readonly validateAbiReturn: boolean

  public readonly sourceFileProvider?: (defaultProvider: SourceFileProvider) => SourceFileProvider

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
    this.sourceFileProvider = options.sourceFileProvider
    this.validateAbiArgs = options.validateAbiArgs ?? defaultPuyaOptions.validateAbiArgs
    this.validateAbiReturn = options.validateAbiReturn ?? defaultPuyaOptions.validateAbiReturn
  }

  buildPuyaOptions(compilationSet: CompilationSetMapping) {
    return new PuyaOptions({
      ...this,
      compilationSet,
      resourceEncoding: 'value',
    })
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
  targetAvmVersion: 11,
  cliTemplateDefinitions: {},
  templateVarsPrefix: 'TMPL_',
  localsCoalescingStrategy: LocalsCoalescingStrategy.root_operand,
  validateAbiArgs: true,
  validateAbiReturn: true,
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
  validateAbiArgs: boolean
  validateAbiReturn: boolean

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
    this.validateAbiArgs = options.validateAbiArgs
    this.validateAbiReturn = options.validateAbiReturn
  }
}
