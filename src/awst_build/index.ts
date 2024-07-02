import ts from 'typescript'
import { SourceFileVisitor } from './source-file-visitor'
import { ToCodeVisitor } from '../awst/to-code-visitor'
import { CompileOptions } from '../compile-options'
import { ArtifactKind, writeArtifact } from '../write-artifact'
import { ModuleStatement } from '../awst/nodes'
import { resolveModuleMetadata } from '../parser/resolve-module-metadata'
import { ToJsonVisitor } from '../awst/to-json-visitor'

export function buildAwst(program: ts.Program, options: CompileOptions) {
  const moduleAwst: Record<string, ModuleStatement[]> = {}
  for (const sourceFile of program.getSourceFiles()) {
    if (sourceFile.isDeclarationFile) continue
    const metadata = resolveModuleMetadata(sourceFile, program)
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
    moduleAwst[metadata.moduleName] = statements
  }
  return moduleAwst
}
