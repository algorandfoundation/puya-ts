import { createTsProgram } from './parser'
import type { CompileOptions } from './compile-options'
import { buildAwst } from './awst_build'
import type { LogEvent } from './logger'
import { logger } from './logger'
import { AwstBuildFailureError } from './errors'
import type ts from 'typescript'
import { registerPTypes } from './awst_build/ptypes/register'
import { typeRegistry } from './awst_build/type-registry'
import { generateTempFile } from './util/generate-temp-file'
import { jsonSerializeAwst, SnakeCaseSerializer } from './awst/json-serialize-awst'
import { jsonSerializeSourceFiles } from './parser/json-serialize-source-files'
import type { AWST } from './awst/nodes'
import { ContractFragment } from './awst/nodes'
import path from 'node:path'
import { LogicSigReference } from './awst/models'

export type CompileResult = {
  logs: LogEvent[]
  programDirectory: string
  awst?: AWST[]
  ast?: Record<string, ts.SourceFile>
}
type CompilationSet = Record<string, string>
function buildCompilationSet({
  awst,
  inputPaths,
  programDirectory,
  outDir,
}: {
  awst: AWST[]
  inputPaths: string[]
  programDirectory: string
  outDir: string
}): CompilationSet {
  return awst.reduce((acc, cur) => {
    if (cur instanceof ContractFragment || cur instanceof LogicSigReference) {
      if (inputPaths.includes(cur.sourceLocation.file)) {
        acc[cur.id.toString()] = path.join(programDirectory, path.dirname(cur.sourceLocation.file), outDir)
      }
    }
    return acc
  }, {} as CompilationSet)
}

export function compile(options: CompileOptions): CompileResult {
  registerPTypes(typeRegistry)
  // logger.info(undefined, `Compiling source file: ${src}`)
  const programResult = createTsProgram(options)
  const programDirectory = programResult.program.getCurrentDirectory()

  let moduleAwst: AWST[] = []
  try {
    moduleAwst = buildAwst(programResult, options)
  } catch (e) {
    if (e instanceof AwstBuildFailureError) {
      return {
        programDirectory,
        logs: logger.export(),
        ast: programResult.sourceFiles,
      }
    }
    throw e
  }
  if (!options.dryRun) {
    const moduleAwstFile = generateTempFile()
    logger.info(undefined, `Writing awst to ${moduleAwstFile.filePath}`)
    moduleAwstFile.writeFileSync(jsonSerializeAwst(moduleAwst), 'utf-8')
    const moduleSourceFile = generateTempFile()
    logger.info(undefined, `Write source to ${moduleSourceFile.filePath}`)
    moduleSourceFile.writeFileSync(jsonSerializeSourceFiles(programResult.sourceFiles), 'utf-8')
    const puyaOptions = new PuyaOptions({
      compileOptions: options,
      compilationSet: buildCompilationSet({
        awst: moduleAwst,
        inputPaths: options.filePaths,
        outDir: options.outDir,
        programDirectory,
      }),
    })
    const optionsFile = generateTempFile()
    logger.info(undefined, `Write options to ${optionsFile.filePath}`)

    logger.info(
      undefined,
      `puya --options ${optionsFile.filePath} --awst ${moduleAwstFile.filePath} --source-annotations ${moduleSourceFile.filePath}`,
    )

    optionsFile.writeFileSync(new SnakeCaseSerializer().serialize(puyaOptions))
  }

  return {
    programDirectory,
    awst: moduleAwst,
    logs: logger.export(),
    ast: programResult.sourceFiles,
  }
}
enum LocalsCoalescingStrategy {
  root_operand = 'root_operand',
  root_operand_excluding_args = 'root_operand_excluding_args',
  aggressive = 'aggressive',
}

class PuyaOptions {
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
