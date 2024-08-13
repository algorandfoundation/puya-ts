import { SourceFileVisitor } from './source-file-visitor'
import { ToCodeVisitor } from '../awst/to-code-visitor'
import type { CompileOptions } from '../compile-options'
import { ArtifactKind, writeArtifact } from '../write-artifact'
import type { Module } from '../awst/nodes'
import type { CreateProgramResult } from '../parser'
import { AwstBuildFailureError } from '../errors'
import { logger } from '../logger'
import { SourceLocation } from '../awst/source-location'
import { jsonSerializeAwst } from '../awst/json-serialize-awst'

export function buildAwst({ program, sourceFiles }: CreateProgramResult, options: CompileOptions) {
  const moduleAwst: Record<string, Module> = {}
  for (const [path, sourceFile] of Object.entries(sourceFiles)) {
    try {
      const visitor = new SourceFileVisitor(sourceFile, program)

      const module = visitor.buildModule()

      if (options.outputAwst) {
        writeArtifact({
          sourceFile: sourceFile.fileName,
          outDir: options.outDir,
          kind: ArtifactKind.Awst,
          obj: module,
          buildArtifact(module): string {
            const toCode = new ToCodeVisitor()
            return module.body.flatMap((s) => s.accept(toCode)).join('\n')
          },
        })
      }
      if (options.outputAwstJson) {
        writeArtifact({
          sourceFile: sourceFile.fileName,
          outDir: options.outDir,
          kind: ArtifactKind.AwstJson,
          obj: module,
          buildArtifact(obj): string {
            return jsonSerializeAwst({ [path]: module })
          },
        })
      }
      moduleAwst[path] = module
    } catch (e) {
      if (e instanceof AwstBuildFailureError) {
        logger.error(SourceLocation.fromFile(sourceFile, program.getCurrentDirectory()), e.message)
      } else if (e instanceof Error) {
        logger.error(e)
      }
    }
  }
  return moduleAwst
}
