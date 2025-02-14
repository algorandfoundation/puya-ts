import { jsonSerializeAwst } from '../awst/json-serialize-awst'
import type { AWST } from '../awst/nodes'
import { SourceLocation } from '../awst/source-location'
import { ToCodeVisitor } from '../awst/to-code-visitor'
import type { AlgoFile, PuyaTsCompileOptions } from '../compile-options'
import { AwstBuildFailureError } from '../errors'
import { logger } from '../logger'
import type { CreateProgramResult } from '../parser'
import { ArtifactKind, writeArtifact } from '../write-artifact'
import { SourceFileVisitor } from './ast-visitors/source-file-visitor'
import { buildContextForProgram } from './context/awst-build-context'
import { buildLibAwst } from './lib'
import type { CompilationSet } from './models/contract-class-model'

function getFileFromSource(options: PuyaTsCompileOptions, sourceFile: string): AlgoFile | undefined {
  return options.filePaths.find((p) => p.sourceFile === sourceFile)
}

export function buildAwst({ program, sourceFiles }: CreateProgramResult, options: PuyaTsCompileOptions): [AWST[], CompilationSet] {
  const awstBuildContext = buildContextForProgram(program)
  buildLibAwst(awstBuildContext)
  const moduleAwst: AWST[] = []
  for (const [sourcePath, sourceFile] of Object.entries(sourceFiles)) {
    try {
      const visitor = new SourceFileVisitor(awstBuildContext.createChildContext(), sourceFile)
      const algoFile = getFileFromSource(options, sourcePath)

      const module = visitor.buildModule()

      if (options.outputAwst && algoFile) {
        writeArtifact({
          sourceFile: sourceFile.fileName,
          outDir: algoFile.outDir,
          kind: ArtifactKind.Awst,
          obj: module,
          buildArtifact(module): string {
            const toCode = new ToCodeVisitor()
            return module.flatMap((s) => s.accept(toCode)).join('\n')
          },
        })
      }
      if (options.outputAwstJson && algoFile) {
        writeArtifact({
          sourceFile: sourceFile.fileName,
          outDir: algoFile.outDir,
          kind: ArtifactKind.AwstJson,
          obj: module,
          buildArtifact(module): string {
            return jsonSerializeAwst(module)
          },
        })
      }
      moduleAwst.push(...module)
    } catch (e) {
      if (e instanceof AwstBuildFailureError) {
        logger.error(SourceLocation.fromFile(sourceFile, program.getCurrentDirectory()), e.message)
      } else if (e instanceof Error) {
        logger.error(e)
      } else {
        logger.error(undefined, `Unknown error: ${e}`)
      }
    }
  }
  return [moduleAwst, awstBuildContext.compilationSet]
}
