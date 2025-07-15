import type { CodeFix, RequiredSymbol } from '../../code-fix/code-fix'
import { logger } from '../../logger'
import type { Position, TextEdit } from '../../text-edit'
import { distinct, invariant, sortBy } from '../../util'

export type SourceFileDiagnostics = {
  [sourceFile: string]: {
    imports: SourceFileImports
    codeFixes: CodeFix[]
  }
}

export class DiagnosticsContext {
  readonly sourceFiles: Record<string, SourceFileImports> = {}
  readonly codeFixes: Record<string, CodeFix[]> = {}

  importsForSourceFile(file: string) {
    if (file in this.sourceFiles) {
      return this.sourceFiles[file]
    }
    return (this.sourceFiles[file] = new SourceFileImports())
  }

  addCodeFix(codeFix: CodeFix) {
    invariant(codeFix.sourceLocation.file, 'Code fix cannot be added without a well-formed source location')
    const sourceFile = codeFix.sourceLocation.file
    const codeFixes = this.codeFixes[sourceFile] ?? (this.codeFixes[sourceFile] = [])
    codeFixes.push(codeFix)
    logger.addLog(...codeFix.logData)
  }

  export(): SourceFileDiagnostics {
    const result: SourceFileDiagnostics = {}

    for (const [file, imports] of Object.entries(this.sourceFiles)) {
      result[file] = {
        imports,
        codeFixes: [],
      }
    }
    for (const [file, fixes] of Object.entries(this.codeFixes)) {
      if (!(file in result)) {
        result[file] = {
          imports: new SourceFileImports(),
          codeFixes: fixes,
        }
      } else {
        result[file].codeFixes = fixes
      }
    }
    return result
  }
}

export class SourceFileImports {
  readonly statements: ImportStatement[] = []

  addStatement(statement: ImportStatement) {
    this.statements.push(statement)
  }

  generateEdits(requiredSymbols: RequiredSymbol[]): TextEdit[] {
    // Filter to distinct symbols
    // Prioritise keeping !typeOnly imports
    requiredSymbols = requiredSymbols.toSorted(sortBy((x) => Number(x.typeOnly))).filter(distinct((x) => `${x.module}::${x.name}`))

    const textEdits: TextEdit[] = []
    const newImports: Record<string, string[]> = {}

    ptypeLoop: for (const requiredSymbol of requiredSymbols) {
      for (const statement of this.statements) {
        if (!statement.insertLocation) continue
        if (requiredSymbol.module !== statement.modulePath) continue
        if (!requiredSymbol.typeOnly && statement.typeOnly) continue
        textEdits.push({
          newText: `${requiredSymbol.name}, `,
          range: {
            start: statement.insertLocation,
            end: statement.insertLocation,
          },
        })
        continue ptypeLoop
      }
      if (requiredSymbol.module in newImports) {
        newImports[requiredSymbol.module].push(requiredSymbol.name)
      } else {
        newImports[requiredSymbol.module] = [requiredSymbol.name]
      }
    }
    for (const [module, names] of Object.entries(newImports)) {
      textEdits.push({
        newText: `import { ${names.join(', ')} } from '${module}'\n`,
        range: {
          start: { line: 0, col: 0 },
          end: { line: 0, col: 0 },
        },
      })
    }

    return textEdits
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
