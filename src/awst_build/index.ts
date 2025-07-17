import { jsonSerializeAwst } from '../awst/json-serialize-awst'
import type { AWST } from '../awst/nodes'
import { ToCodeVisitor } from '../awst/to-code-visitor'
import { logger } from '../logger'
import type { CompileOptions } from '../options'
import type { CreateProgramResult } from '../parser'
import { invariant } from '../util'
import { ArtifactKind, writeArtifact } from '../write-artifact'
import { SourceFileVisitor } from './ast-visitors/source-file-visitor'
import { AwstBuildContext } from './context/awst-build-context'
import type { SourceFileDiagnostics } from './context/diagnostics-context'
import { buildLibAwst } from './lib'
import type { CompilationSet } from './models/contract-class-model'

type BuildAwstOptions = Pick<CompileOptions, 'filePaths' | 'outputAwst' | 'outputAwstJson'>

type AwstBuildResult = {
  moduleAwst: AWST[]
  compilationSet: CompilationSet
  diagnostics: SourceFileDiagnostics
}

export function buildAwst({ program, sourceFiles }: CreateProgramResult, options: BuildAwstOptions): AwstBuildResult {
  return AwstBuildContext.run(program, () => {
    const moduleAwst: AWST[] = buildLibAwst()
    for (const [sourcePath, sourceFile] of Object.entries(sourceFiles)) {
      try {
        AwstBuildContext.current.runInChildContext(() => {
          const visitor = new SourceFileVisitor(sourceFile)
          const algoFile = options.filePaths.find((p) => p.sourceFile === sourcePath)

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
        })
      } catch (e) {
        invariant(e instanceof Error, 'Only errors should be thrown')
        logger.error(e)
      }
    }
    return {
      moduleAwst,
      compilationSet: AwstBuildContext.current.compilationSet,
      diagnostics: AwstBuildContext.current.diagnosticsCtx.export(),
    }
  })
}
