import type { CompileOptions } from '../compile-options'

enum LocalsCoalescingStrategy {
  root_operand = 'root_operand',
  root_operand_excluding_args = 'root_operand_excluding_args',
  aggressive = 'aggressive',
}
export type CompilationSet = Record<string, string>

export class PuyaOptions {
  outputTeal: boolean = true
  outputArc32: boolean = true
  outputSsaIr: boolean = false
  outputOptimizationIr: boolean = false
  outputDestructuredIr: boolean = false
  outputMemoryIr: boolean = false
  outputBytecode: boolean = false
  matchAlgodBytecode: boolean = false
  debugLevel: number = 1
  optimizationLevel: number = 1
  targetAvmVersion: number = 10 // todo: move to a constant
  cliTemplateDefinitions: string[] = []
  templateVarsPrefix: string = 'TMPL_'
  localsCoalescingStrategy: LocalsCoalescingStrategy = LocalsCoalescingStrategy.root_operand

  compilationSet: CompilationSet
  constructor({ compileOptions, compilationSet }: { compileOptions: CompileOptions; compilationSet: CompilationSet }) {
    this.compilationSet = compilationSet
  }
}
