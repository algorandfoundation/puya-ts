import type { CompileOptions } from '../compile-options'

export enum LocalsCoalescingStrategy {
  root_operand = 'root_operand',
  root_operand_excluding_args = 'root_operand_excluding_args',
  aggressive = 'aggressive',
}
export type CompilationSet = Record<string, string>

export type PuyaPassThroughOptions = Omit<PuyaOptions, 'compilationSet'>

export class PuyaOptions {
  outputTeal: boolean
  outputArc32: boolean
  outputSsaIr: boolean
  outputOptimizationIr: boolean
  outputDestructuredIr: boolean
  outputMemoryIr: boolean
  outputBytecode: boolean
  matchAlgodBytecode: boolean
  debugLevel: number
  optimizationLevel: number
  targetAvmVersion: number
  cliTemplateDefinitions: string[]
  templateVarsPrefix: string
  localsCoalescingStrategy: LocalsCoalescingStrategy

  compilationSet: CompilationSet
  constructor({ passThroughOptions, compilationSet }: { passThroughOptions: PuyaPassThroughOptions; compilationSet: CompilationSet }) {
    this.compilationSet = compilationSet
    this.outputTeal = passThroughOptions.outputTeal
    this.outputArc32 = passThroughOptions.outputArc32
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
  }
}
