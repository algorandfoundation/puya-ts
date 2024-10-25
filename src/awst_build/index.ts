import { jsonSerializeAwst } from '../awst/json-serialize-awst'
import type { CompilationSet } from '../awst/models'
import type { AWST } from '../awst/nodes'
import { SourceLocation } from '../awst/source-location'
import { ToCodeVisitor } from '../awst/to-code-visitor'
import type { CompileOptions } from '../compile-options'
import { AwstBuildFailureError } from '../errors'
import { logger } from '../logger'
import type { CreateProgramResult } from '../parser'
import { ArtifactKind, writeArtifact } from '../write-artifact'
import { buildContextForProgram } from './context/awst-build-context'
import { buildLibAwst } from './lib'
import { SourceFileVisitor } from './source-file-visitor'

export function buildAwst({ program, sourceFiles }: CreateProgramResult, options: CompileOptions): [AWST[], CompilationSet] {
  const awstBuildContext = buildContextForProgram(program)
  const moduleAwst: AWST[] = [...buildLibAwst(awstBuildContext)]
  for (const [sourcePath, sourceFile] of Object.entries(sourceFiles)) {
    try {
      const visitor = new SourceFileVisitor(awstBuildContext.createChildContext(), sourceFile)
      const algoFile = options.getFileFromSource(sourcePath)

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
