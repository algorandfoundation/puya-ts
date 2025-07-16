import type { Position } from '../../text-edit'

export class ImportContext {
  readonly sourceFiles: Record<string, SourceFileImports> = {}

  forSourceFile(file: string) {
    if (file in this.sourceFiles) {
      return this.sourceFiles[file]
    }
    return (this.sourceFiles[file] = new SourceFileImports())
  }
}

export class SourceFileImports {
  readonly statements: ImportStatement[] = []

  addStatement(statement: ImportStatement) {
    this.statements.push(statement)
  }
}

export type ImportStatement = {
  modulePath: string
  typeOnly: boolean
  symbols: ImportedSymbol[]
  insertLocation?: Position
}

export type ImportedSymbol = {
  name: string
  alias?: string
}
