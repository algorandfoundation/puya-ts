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
  /**
   * Get the source location of a node in the current source file
   * @param node
   */
  getSourceLocation(node: ts.Node): SourceLocation

  /**
   * Get NodeBuilder instance for the given identifier.
   * @param node
   */
  getBuilderForNode(node: ts.Identifier): NodeBuilder

  /**
   * Reflect the PType of the given node
   * @param node
   */
  getPTypeForNode(node: ts.Node): PType

  /**
   * Resolve the given identifier to a unique variable name that accounts
   * for shadowed variable names.
   * @param node
   */
  resolveVariableName(node: ts.Identifier): string

  /**
   * Resolve the given parameter declaration to a unique parameter name to be used
   * in destructuring assignments where no explicit parameter name is available.
   * @param node
   */
  resolveDestructuredParamName(node: ts.ParameterDeclaration): string

  /**
   * Generate a unique variable name for a discarded value.
   */
  generateDiscardedVarName(): string

  /**
   * Add a named constant to the current context
   * @param name The unique name of the constant declaration in this source file
   * @param value The compile time constant value
   */
  addConstant(name: string, value: awst.Constant): void

  /**
   * Retrieve the evaluation context
   */
  get evaluationCtx(): EvaluationContext

  /**
   * Retrieve the switch loop context
   */
  get switchLoopCtx(): SwitchLoopContext

  /**
   * Create a child context from this context. Used when entering a child parsing context such as a class or function.
   */
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
