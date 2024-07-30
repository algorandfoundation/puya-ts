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
import { FunctionPType } from './ptypes/ptype-classes'
import { UniqueNameResolver } from './context/unique-name-resolver'
import { BaseContext } from './context/base-context'
import { EvaluationContext } from './context/evaluation-context'

export class SourceFileContext extends BaseContext {
  readonly constants: Map<string, awst.ConstantDeclaration> = new Map()
  public readonly resolver: TypeResolver
  public readonly evaluationCtx: EvaluationContext

  protected readonly checker: ts.TypeChecker
  constructor(
    public readonly sourceFile: ts.SourceFile,
    public readonly program: ts.Program,
    public readonly nameResolver: UniqueNameResolver,
  ) {
    super()
    this.checker = program.getTypeChecker()
    this.resolver = new TypeResolver(this.checker, this.program.getCurrentDirectory())
    this.evaluationCtx = new EvaluationContext()
  }

  tryResolveConstant(node: ts.Identifier): ConstantDeclaration | undefined {
    const constantName = this.resolveVariable(node)
    return this.constants.get(constantName)
  }

  resolveVariable(node: ts.Identifier) {
    codeInvariant(ts.isIdentifier(node), 'Only basic identifiers supported for now')
    const symbol = this.checker.resolveName(node.text, node, ts.SymbolFlags.All, false)
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
