import { SourceFileVisitor } from './source-file-visitor'
import type { CompileOptions } from '../compile-options'
import type { AWST } from '../awst/nodes'
import type { CreateProgramResult } from '../parser'
import { AwstBuildFailureError } from '../errors'
import { logger } from '../logger'
import { SourceLocation } from '../awst/source-location'
import { ArtifactKind, writeArtifact } from '../write-artifact'
import { ToCodeVisitor } from '../awst/to-code-visitor'
import { jsonSerializeAwst } from '../awst/json-serialize-awst'
import { buildLibAwst } from './lib'
import { buildContextForProgram } from './context/awst-build-context'
import type { CompilationSet } from '../awst/models'

export function buildAwst({ program, sourceFiles }: CreateProgramResult, options: CompileOptions): [AWST[], CompilationSet] {
  const awstBuildContext = buildContextForProgram(program)
  const moduleAwst: AWST[] = [...buildLibAwst()]
  for (const sourceFile of Object.values(sourceFiles)) {
    try {
      const visitor = new SourceFileVisitor(awstBuildContext.createChildContext(), sourceFile)

      const module = visitor.buildModule()

      if (options.outputAwst) {
        writeArtifact({
          sourceFile: sourceFile.fileName,
          outDir: options.outDir,
          kind: ArtifactKind.Awst,
          obj: module,
          buildArtifact(module): string {
            const toCode = new ToCodeVisitor()
            return module.flatMap((s) => s.accept(toCode)).join('\n')
          },
        })
      }
      if (options.outputAwstJson) {
        writeArtifact({
          sourceFile: sourceFile.fileName,
          outDir: options.outDir,
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
      }
    }
  }
  return [moduleAwst, awstBuildContext.compilationSet]
}
