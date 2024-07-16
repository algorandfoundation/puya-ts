import ts from 'typescript'
import { SourceLocation } from '../awst/source-location'
import { awst } from '../awst'
import { nodeFactory } from '../awst/node-factory'
import { codeInvariant, invariant, toSubScript } from '../util'
import { ConstantDeclaration } from '../awst/nodes'
import { PType } from './ptypes'
import { NodeBuilder } from './eb'
import { typeRegistry } from './type-registry'
import { TypeResolver } from './type-resolver'
import { FunctionPType } from './ptypes/ptype-classes'

export abstract class BaseContext {
  abstract getSourceLocation(node: ts.Node): SourceLocation
  abstract tryResolveConstant(node: ts.Identifier): awst.ConstantDeclaration | undefined
  abstract getBuilderForNode(node: ts.Identifier): NodeBuilder
  abstract get resolver(): TypeResolver
}

export class UniqueNameResolver {
  protected readonly symbolToName: Map<ts.Symbol, string>
  protected readonly nameToCount: Map<string, number>

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
      uniqueName = `${rawName}${toSubScript(nameCount)}`
    }
    this.nameToCount.set(rawName, nameCount + 1)
    this.symbolToName.set(symbol, uniqueName)
    return uniqueName
  }

  createChild(): UniqueNameResolver {
    return new UniqueNameResolver(this)
  }
}

export class SourceFileContext extends BaseContext {
  readonly constants: Map<string, awst.ConstantDeclaration> = new Map()
  public readonly resolver: TypeResolver

  protected readonly checker: ts.TypeChecker
  constructor(
    public readonly sourceFile: ts.SourceFile,
    public readonly program: ts.Program,
    public readonly nameResolver: UniqueNameResolver,
  ) {
    super()
    this.checker = program.getTypeChecker()
    this.resolver = new TypeResolver(this.checker, this.program.getCurrentDirectory())
  }

  tryResolveConstant(node: ts.Identifier): ConstantDeclaration | undefined {
    const constantName = this.resolveVariable(node)
    return this.constants.get(constantName)
  }

  resolveVariable(node: ts.Identifier) {
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
    invariant(ptype instanceof FunctionPType, 'ptype of function declaration must be FunctionType')
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
    return SourceLocation.fromNode(this.sourceFile, node, this.program.getCurrentDirectory())
  }
}
