import { jsonSerializeAwst } from '../awst/json-serialize-awst'
import type { AWST } from '../awst/nodes'
import { ToCodeVisitor } from '../awst/to-code-visitor'
import type { AlgoFile, CompileOptions } from '../options'
import type { CreateProgramResult } from '../parser'
import { ArtifactKind, writeArtifact } from '../write-artifact'
import { SourceFileVisitor } from './ast-visitors/source-file-visitor'
import { AwstBuildContext } from './context/awst-build-context'
import type { SourceFileDiagnostics } from './context/diagnostics-context'
import { buildLibAwst } from './lib'
import type { CompilationSet } from './models/contract-class-model'

type DeferredModule = () => {
  awst: AWST[]
  algoFile: AlgoFile | undefined
}

type BuildAwstOptions = Pick<CompileOptions, 'filePaths' | 'outputAwst' | 'outputAwstJson'>

type AwstBuildResult = {
  moduleAwst: AWST[]
  compilationSet: CompilationSet
  diagnostics: SourceFileDiagnostics
}

export function buildAwst({ program, sourceFiles }: CreateProgramResult, options: BuildAwstOptions): AwstBuildResult {
  return AwstBuildContext.run(program, () => {
    const moduleAwst: AWST[] = buildLibAwst()
    const deferredModules: DeferredModule[] = []
    for (const [sourcePath, sourceFile] of Object.entries(sourceFiles)) {
      deferredModules.push(
        AwstBuildContext.current.runInChildContext((deferred) => {
          const visitor = new SourceFileVisitor(sourceFile)
          const algoFile = options.filePaths.find((p) => p.sourceFile === sourcePath)

          return deferred(() => ({ awst: visitor.buildModule(), algoFile }))
        }),
      )
    }
    for (const deferredModule of deferredModules) {
      const { awst, algoFile } = deferredModule()
      moduleAwst.push(...awst)
      if (options.outputAwst && algoFile) {
        writeArtifact({
          sourceFile: algoFile.sourceFile,
          outDir: algoFile.outDir,
          kind: ArtifactKind.Awst,
          obj: awst,
          buildArtifact(module): string {
            const toCode = new ToCodeVisitor()
            return module.flatMap((s) => s.accept(toCode)).join('\n')
          },
        })
      }
      if (options.outputAwstJson && algoFile) {
        writeArtifact({
          sourceFile: algoFile.sourceFile,
          outDir: algoFile.outDir,
          kind: ArtifactKind.AwstJson,
          obj: awst,
          buildArtifact(module): string {
            return jsonSerializeAwst(module)
          },
        })
      }
    }
    return {
      moduleAwst,
      compilationSet: AwstBuildContext.current.compilationSet,
      diagnostics: AwstBuildContext.current.diagnosticsCtx.export(),
    }
  })
}
