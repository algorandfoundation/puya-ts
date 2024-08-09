import ts from 'typescript'
import { SourceLocation } from '../../awst/source-location'
import type { NodeBuilder } from '../eb'
import { EvaluationContext } from './evaluation-context'
import { UniqueNameResolver } from './unique-name-resolver'
import type { PType } from '../ptypes'
import { SwitchLoopContext } from './switch-loop-context'
import { TypeResolver } from '../type-resolver'
import { codeInvariant, invariant } from '../../util'
import { typeRegistry } from '../type-registry'
import { nodeFactory } from '../../awst/node-factory'
import type { awst } from '../../awst'
import type { Constant } from '../../awst/nodes'
import { logger } from '../../logger'
import { CodeError } from '../../errors'

export interface VisitorContext {
  getSourceLocation(node: ts.Node): SourceLocation
  getBuilderForNode(node: ts.Identifier): NodeBuilder
  getPTypeForNode(node: ts.Node): PType
  getGenericTypeArgsForNode(node: ts.Node): PType[]
  resolveVariableName(node: ts.Identifier): string
  resolveDestructuredParamName(node: ts.ParameterDeclaration): string
  generateDiscardedVarName(): string
  addConstant(name: string, value: awst.Constant): void
  get evaluationCtx(): EvaluationContext
  get switchLoopCtx(): SwitchLoopContext

  createChildContext(): VisitorContext
}

export function buildContextForSourceFile(sourceFile: ts.SourceFile, program: ts.Program): VisitorContext {
  return VisitorContextImpl.forFile(sourceFile, program)
}

class VisitorContextImpl implements VisitorContext {
  readonly evaluationCtx = new EvaluationContext()
  readonly switchLoopCtx = new SwitchLoopContext()
  readonly typeResolver: TypeResolver
  readonly typeChecker: ts.TypeChecker
  private constructor(
    public readonly sourceFile: ts.SourceFile,
    public readonly program: ts.Program,
    private readonly constants: Map<string, awst.Constant>,
    private readonly nameResolver: UniqueNameResolver,
  ) {
    this.typeChecker = program.getTypeChecker()
    this.typeResolver = new TypeResolver(this.typeChecker, this.program.getCurrentDirectory())
  }

  static forFile(sourceFile: ts.SourceFile, program: ts.Program): VisitorContext {
    return new VisitorContextImpl(sourceFile, program, new Map(), new UniqueNameResolver())
  }

  addConstant(name: string, value: Constant) {
    if (this.constants.has(name)) {
      logger.error(new CodeError(`Duplicate definitions found for constant ${name}`, { sourceLocation: value.sourceLocation }))
      return
    }
    this.constants.set(name, value)
  }

  createChildContext(): VisitorContext {
    return new VisitorContextImpl(this.sourceFile, this.program, this.constants, this.nameResolver.createChild())
  }

  resolveDestructuredParamName(node: ts.ParameterDeclaration) {
    const symbol = (node as { symbol?: ts.Symbol }).symbol
    invariant(symbol, 'Param node must have symbol')
    return this.nameResolver.resolveUniqueName('p', symbol)
  }
  generateDiscardedVarName() {
    return this.nameResolver.resolveUniqueName('_', undefined)
  }
  resolveVariableName(node: ts.Identifier) {
    codeInvariant(ts.isIdentifier(node), 'Only basic identifiers supported for now')
    const symbol = this.typeChecker.resolveName(node.text, node, ts.SymbolFlags.All, false)
    invariant(symbol, 'There must be a symbol for an identifier node')
    return this.nameResolver.resolveUniqueName(node.text, symbol)
  }

  getPTypeForNode(node: ts.Node): PType {
    const sourceLocation = this.getSourceLocation(node)
    if (ts.isTypeNode(node)) {
      return this.typeResolver.resolveTypeNode(node, sourceLocation)
    }
    return this.typeResolver.resolve(node, sourceLocation)
  }

  getGenericTypeArgsForNode(node: ts.Node): PType[] {
    const sourceLocation = this.getSourceLocation(node)
    return this.typeResolver.resolveGenericTypeArgumentsOfNode(node, sourceLocation)
  }

  getBuilderForNode(node: ts.Identifier): NodeBuilder {
    const sourceLocation = this.getSourceLocation(node)
    const ptype = this.typeResolver.resolve(node, sourceLocation)

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
