import pathe from 'pathe'
import ts from 'typescript'
import { AbsolutePath } from '../util/absolute-path'

export type ImportedModule =
  | {
      type: 'external'
      name: string
    }
  | {
      type: 'internal'
      path: AbsolutePath
    }

export function extractImports(sourceFile: ts.SourceFile) {
  const filePath = AbsolutePath.resolve({ path: pathe.dirname(sourceFile.fileName) })
  const importedModules: ImportedModule[] = []

  const seenPaths = new Set<string>()
  for (const statement of sourceFile.statements) {
    if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
      const importPath = statement.moduleSpecifier.text
      if (seenPaths.has(importPath)) continue
      seenPaths.add(importPath)
      if (importPath.startsWith('.')) {
        importedModules.push({ type: 'internal', path: filePath.resolve(`${importPath}.ts`) })
      } else {
        // Absolute import (probably node module)
        importedModules.push({ type: 'external', name: importPath })
      }
    }
  }
  return importedModules
}
