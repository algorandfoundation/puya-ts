import ts from 'typescript'
import { SourceLocation } from '../awst/source-location'
import { awst } from '../awst'
import { nodeFactory } from '../awst/node-factory'
import { codeInvariant, invariant } from '../util'
import { PType } from './ptypes'
import { NodeBuilder } from './eb'
import { typeRegistry } from './type-registry'
import { TypeResolver } from './type-resolver'
import { UniqueNameResolver } from './context/unique-name-resolver'
import { BaseContext } from './context/base-context'

export class SourceFileContext extends BaseContext {
  readonly constants: Map<string, awst.Constant> = new Map()
  private readonly resolver: TypeResolver

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

  resolveVariableName(node: ts.Identifier) {
    codeInvariant(ts.isIdentifier(node), 'Only basic identifiers supported for now')
    const symbol = this.checker.resolveName(node.text, node, ts.SymbolFlags.All, false)
    invariant(symbol, 'There must be a symbol for an identifier node')
    return this.nameResolver.resolveUniqueName(node.text, symbol)
  }

  getPTypeForNode(node: ts.Node): PType {
    const sourceLocation = this.getSourceLocation(node)
    if (ts.isTypeNode(node)) {
      return this.resolver.resolveTypeNode(node, sourceLocation)
    }
    return this.resolver.resolve(node, sourceLocation)
  }

  getBuilderForNode(node: ts.Identifier): NodeBuilder {
    const sourceLocation = this.getSourceLocation(node)
    const ptype = this.resolver.resolve(node, sourceLocation)

    if (ptype.singleton) {
      return typeRegistry.getSingletonEb(ptype, sourceLocation)
    }
    const variableName = this.resolveVariableName(node)
    const constantValue = this.constants.get(variableName)
    if (constantValue) {
      return typeRegistry.getInstanceEb(constantValue, ptype)
    }
    return typeRegistry.getInstanceEb(
      nodeFactory.varExpression({
        sourceLocation,
        name: variableName,
        wtype: ptype.wtypeOrThrow,
      }),
      ptype,
    )
  }

  getSourceLocation(node: ts.Node) {
    return SourceLocation.fromNode(this.sourceFile, node, this.program.getCurrentDirectory())
  }
}
