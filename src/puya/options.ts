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
  matchAlgodBytecode: false,
  debugLevel: 1,
  optimizationLevel: 1,
  targetAvmVersion: 10,
  cliTemplateDefinitions: [],
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
  matchAlgodBytecode: boolean
  debugLevel: number
  optimizationLevel: number
  targetAvmVersion: number
  cliTemplateDefinitions: string[]
  templateVarsPrefix: string
  localsCoalescingStrategy: LocalsCoalescingStrategy

  compilationSet: CompilationSetMapping
  constructor({
    passThroughOptions,
    compilationSet,
  }: {
    passThroughOptions: PuyaPassThroughOptions
    compilationSet: CompilationSetMapping
  }) {
    this.compilationSet = compilationSet
    this.outputTeal = passThroughOptions.outputTeal
    this.outputArc32 = passThroughOptions.outputArc32
    this.outputArc56 = passThroughOptions.outputArc56
    this.outputSsaIr = passThroughOptions.outputSsaIr
    this.outputOptimizationIr = passThroughOptions.outputOptimizationIr
    this.outputDestructuredIr = passThroughOptions.outputDestructuredIr
    this.outputMemoryIr = passThroughOptions.outputMemoryIr
    this.outputBytecode = passThroughOptions.outputBytecode
    this.matchAlgodBytecode = passThroughOptions.matchAlgodBytecode
    this.debugLevel = passThroughOptions.debugLevel
    this.optimizationLevel = passThroughOptions.optimizationLevel
    this.targetAvmVersion = passThroughOptions.targetAvmVersion
    this.cliTemplateDefinitions = passThroughOptions.cliTemplateDefinitions
    this.templateVarsPrefix = passThroughOptions.templateVarsPrefix
    this.localsCoalescingStrategy = passThroughOptions.localsCoalescingStrategy
    this.outputSourceMap = passThroughOptions.outputSourceMap
  }
}
