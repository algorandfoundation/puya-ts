import { SourceFileVisitor } from './source-file-visitor'
import { ToCodeVisitor } from '../awst/to-code-visitor'
import { CompileOptions } from '../compile-options'
import { ArtifactKind, writeArtifact } from '../write-artifact'
import { ModuleStatement } from '../awst/nodes'
import { ToJsonVisitor } from '../awst/to-json-visitor'
import { CreateProgramResult } from '../parser'
import { AwstBuildFailureError } from '../errors'
import { logger } from '../logger'
import { SourceLocation } from '../awst/source-location'

export function buildAwst({ program, sourceFiles }: CreateProgramResult, options: CompileOptions) {
  const moduleAwst: Record<string, ModuleStatement[]> = {}
  for (const [path, sourceFile] of Object.entries(sourceFiles)) {
    try {
      const visitor = new SourceFileVisitor(sourceFile, program)

      const statements = Array.from(visitor.gatherStatements())

      if (options.outputAwst) {
        writeArtifact({
          sourceFile: sourceFile.fileName,
          outDir: options.outDir,
          kind: ArtifactKind.Awst,
          obj: statements,
          visitor: new ToCodeVisitor(),
        })
      }
      if (options.outputAwstJson) {
        writeArtifact({
          sourceFile: sourceFile.fileName,
          outDir: options.outDir,
          kind: ArtifactKind.AwstJson,
          obj: statements,
          visitor: new ToJsonVisitor(),
          joinArtifacts: (artifacts) => `[\n${artifacts.join(',\n')}\n]`,
        })
      }
      moduleAwst[path] = statements
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
