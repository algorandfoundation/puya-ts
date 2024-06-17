import ts from 'typescript'
import { TransformerError } from './errors'

const { SyntaxKind } = ts

export class TypeReflector {
  private minimalContractTypes = [
    '@algorandfoundation/algo-ts/base-contract.d.ts::BaseContract',
    '/algo-ts/dist/base-contract.d.ts::BaseContract',
  ]
  private arc4ContractTypes = ['@algorandfoundation/algo-ts/arc4/index.d.ts::Contract', '/algo-ts/dist/arc4/index.d.ts::Contract']

  private checker: ts.TypeChecker
  constructor(private program: ts.Program) {
    this.checker = program.getTypeChecker()
  }

  reflectType(node: ts.ParameterDeclaration): string {
    const type = this.checker.getTypeAtLocation(node)

    if (type.aliasSymbol) {
      return type.aliasSymbol.name
    }
    return type.symbol.name
  }

  isArc4Contract(node: ts.ClassDeclaration): boolean {
    const baseClass = node.heritageClauses
      ?.filter((c) => c.token === SyntaxKind.ExtendsKeyword)
      .flatMap((c) => c.types)
      .at(0)
    if (!baseClass) return false
    const baseClassType = this.checker.getTypeAtLocation(baseClass)
    const baseClassName = this.getTypeName(baseClassType)

    if (this.arc4ContractTypes.some((t) => baseClassName.endsWith(t))) {
      return true
    }
    if (this.minimalContractTypes.some((t) => baseClassName.endsWith(t))) {
      return false
    }

    const baseDeclaration = baseClassType.symbol.valueDeclaration
    if (baseDeclaration && ts.isClassDeclaration(baseDeclaration)) {
      return this.isArc4Contract(baseDeclaration)
    }

    return false
  }

  private getTypeName(typeNode: ts.Type): string {
    if (typeNode.aliasSymbol) {
      return this.getSymbolFullName(typeNode.aliasSymbol).join('::')
    }
    return this.getSymbolFullName(typeNode.symbol).join('::')
  }

  private getModuleName(declaration: ts.Declaration): string {
    const sourceFileName = declaration.getSourceFile().fileName
    const nodeModuleName = /node_modules\/(.*)$/.exec(sourceFileName)

    if (nodeModuleName) {
      return nodeModuleName[1]
    }
    return sourceFileName
  }

  private getSymbolFullName(symbol: ts.Symbol): [string, string] {
    const declaration = symbol.declarations?.[0]
    if (declaration) {
      if (symbol.flags & ts.SymbolFlags.Namespace) {
        return [this.getModuleName(declaration), '*']
      }
      return [this.getModuleName(declaration), symbol.name]
    }
    throw new TransformerError(`Symbol does not have a declaration`)
  }
}
