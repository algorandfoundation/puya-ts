import { logger } from '../../logger'
import type { QuickFix } from '../../quick-fix/quick-fix'
import type { Position, TextEdit } from '../../text-edit'
import { invariant } from '../../util'
import type { PType } from '../ptypes'

export type SourceFileDiagnostics = {
  [sourceFile: string]: {
    imports: SourceFileImports
    quickFixes: QuickFix[]
  }
}

export class DiagnosticsContext {
  readonly sourceFiles: Record<string, SourceFileImports> = {}
  readonly quickFixes: Record<string, QuickFix[]> = {}

  importsForSourceFile(file: string) {
    if (file in this.sourceFiles) {
      return this.sourceFiles[file]
    }
    return (this.sourceFiles[file] = new SourceFileImports())
  }

  addQuickFix(quickFix: QuickFix) {
    invariant(quickFix.sourceLocation.file, 'Quick fix cannot be added without a well-formed source location')
    const sourceFile = quickFix.sourceLocation.file
    const quickFixes = this.quickFixes[sourceFile] ?? (this.quickFixes[sourceFile] = [])
    quickFixes.push(quickFix)
    logger.addLog(...quickFix.logData)
  }

  export(): SourceFileDiagnostics {
    return {}
  }
}

export class SourceFileImports {
  readonly statements: ImportStatement[] = []

  addStatement(statement: ImportStatement) {
    this.statements.push(statement)
  }

  generateEdits(ptypes: PType[]): TextEdit[] {
    const textEdits: TextEdit[] = []

    const newImports: Record<string, string[]> = {}

    ptypeLoop: for (const ptype of ptypes) {
      for (const statement of this.statements) {
        if (!statement.insertLocation) continue
        if (ptype.module !== statement.modulePath) continue
        if (ptype.singleton && statement.typeOnly) continue
        textEdits.push({
          newText: `${ptype.name} ,`,
          range: {
            start: statement.insertLocation,
            end: statement.insertLocation,
          },
        })
        continue ptypeLoop
      }
      if (ptype.module in newImports) {
        newImports[ptype.module].push(ptype.name)
      } else {
        newImports[ptype.module] = [ptype.name]
      }
    }
    for (const [module, names] of Object.entries(newImports)) {
      textEdits.push({
        newText: `import { ${names.join(', ')} } from '${module}'`,
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
