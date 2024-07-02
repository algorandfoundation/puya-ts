import ts from 'typescript'
import { SourceLocation } from '../awst/source-location'
import { awst } from '../awst'
import { nodeFactory } from '../awst/node-factory'
import { codeInvariant, invariant } from '../util'
import { ConstantDeclaration } from '../awst/nodes'
import { PType } from './ptypes'
import { NodeBuilder } from './eb'
import { typeRegistry } from './type-registry'
import { TypeResolver } from './type-resolver'
import { FunctionType } from './ptypes/ptype-classes'

export abstract class BaseContext {
  abstract getSourceLocation(node: ts.Node): SourceLocation
  abstract tryResolveConstant(node: ts.Identifier): awst.ConstantDeclaration | undefined
  abstract readonly moduleName: string
  abstract getBuilderForNode(node: ts.Identifier): NodeBuilder
  // abstract getPTypeForNode(node: ts.Node): PType
  // abstract getImplicitReturnType(node: ts.FunctionDeclaration | ts.MethodDeclaration): PType
  abstract get resolver(): TypeResolver
}

export class UniqueNameResolver {
  readonly symbolToName: Map<ts.Symbol, string>
  readonly nameToCount: Map<string, number>

  constructor(parent?: UniqueNameResolver) {
    if (parent) {
      this.symbolToName = new Map(parent.symbolToName.entries())
      this.nameToCount = new Map(parent.nameToCount.entries())
    } else {
      this.symbolToName = new Map()
      this.nameToCount = new Map()
    }
  }

  resolveUniqueName(rawName: string, symbol: ts.Symbol): string {
    const name = this.symbolToName.get(symbol)
    if (name) {
      return name
    }
    const nameCount = this.nameToCount.get(rawName) ?? 0
    let uniqueName
    if (nameCount === 0) {
      uniqueName = rawName
    } else {
      uniqueName = `${rawName}${this.toSubNumber(nameCount)}`
    }
    this.nameToCount.set(rawName, nameCount + 1)
    this.symbolToName.set(symbol, uniqueName)
    return uniqueName
  }

  private toSubNumber(num: number) {
    const subNumbers = ['\u2080', '\u2081', '\u2082', '\u2083', '\u2084', '\u2085', '\u2086', '\u2087', '\u2088', '\u2089']
    return num
      .toFixed(0)
      .split('')
      .map((x) => subNumbers[parseInt(x)])
      .join('')
  }

  createChild(): UniqueNameResolver {
    return new UniqueNameResolver(this)
  }
}

export class SourceFileContext extends BaseContext {
  readonly constants: Map<string, awst.ConstantDeclaration> = new Map()
  public readonly resolver: TypeResolver

  private readonly checker: ts.TypeChecker
  constructor(
    public readonly sourceFile: ts.SourceFile,
    public readonly program: ts.Program,
    public readonly nameResolver: UniqueNameResolver,
  ) {
    super()
    this.checker = program.getTypeChecker()
    this.resolver = new TypeResolver(this.checker)
  }

  tryResolveConstant(node: ts.Identifier): ConstantDeclaration | undefined {
    const constantName = this.resolveVariable(node)
    return this.constants.get(constantName)
  }

  resolveVariable(node: ts.BindingName) {
    codeInvariant(ts.isIdentifier(node), 'Only basic identifiers supported for now')
    const symbol = this.checker.getSymbolAtLocation(node)
    invariant(symbol, 'There must be a symbol for an identifier node')
    return this.nameResolver.resolveUniqueName(node.text, symbol)
  }

  getPTypeForNode(node: ts.Node): PType {
    const sourceLocation = this.getSourceLocation(node)
    return this.resolver.resolve(node, sourceLocation)
  }

  getImplicitReturnType(node: ts.FunctionDeclaration | ts.MethodDeclaration): PType {
    const sourceLocation = this.getSourceLocation(node)

    const ptype = this.resolver.resolve(node, sourceLocation)
    invariant(ptype instanceof FunctionType, 'ptype of function declaration must be FunctionType')
    return ptype.returnType
  }

  getBuilderForNode(node: ts.Identifier): NodeBuilder {
    const sourceLocation = this.getSourceLocation(node)
    const ptype = this.resolver.resolve(node, sourceLocation)

    if (ptype.singleton) {
      return typeRegistry.getSingletonEb(ptype, sourceLocation)
    }
    return typeRegistry.getInstanceEb(
      nodeFactory.varExpression({
        sourceLocation,
        name: this.resolveVariable(node),
        wtype: ptype.wtypeOrThrow,
      }),
      ptype,
    )
  }

  getSourceLocation(node: ts.Node) {
    return SourceLocation.fromNode(this.sourceFile, node)
  }

  get moduleName() {
    return this.sourceFile.fileName
  }
}
