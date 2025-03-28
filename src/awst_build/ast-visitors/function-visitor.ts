import ts from 'typescript'
import { isConstant } from '../../awst'
import { nodeFactory } from '../../awst/node-factory'
import type * as awst from '../../awst/nodes'
import type { Block } from '../../awst/nodes'
import { AssignmentExpression, Goto, ReturnStatement } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { CodeError, InternalError, NotSupported } from '../../errors'
import { logger } from '../../logger'
import { codeInvariant, enumerate, hasFlags, instanceOfAny, invariant } from '../../util'
import type { Statements } from '../../visitor/syntax-names'
import { getNodeName } from '../../visitor/syntax-names'
import type { Visitor } from '../../visitor/visitor'
import { accept } from '../../visitor/visitor'
import type { InstanceBuilder } from '../eb'
import { BuilderComparisonOp } from '../eb'
import { ArrayLiteralExpressionBuilder } from '../eb/literal/array-literal-expression-builder'
import { ObjectLiteralExpressionBuilder } from '../eb/literal/object-literal-expression-builder'
import { NativeArrayExpressionBuilder } from '../eb/native-array-expression-builder'
import { OmittedExpressionBuilder } from '../eb/omitted-expression-builder'
import { TupleExpressionBuilder } from '../eb/tuple-expression-builder'
import { requireExpressionOfType, requireInstanceBuilder } from '../eb/util'
import type { PType } from '../ptypes'
import { FunctionPType, ObjectPType } from '../ptypes'
import { getSequenceItemType } from '../ptypes/util'
import { typeRegistry } from '../type-registry'
import { BaseVisitor } from './base-visitor'
import { maybeNodes } from './util'

// noinspection JSUnusedGlobalSymbols
export abstract class FunctionVisitor
  extends BaseVisitor
  implements
    Visitor<ts.ParameterDeclaration, awst.SubroutineArgument>,
    Visitor<ts.Block | ts.ConciseBody, awst.Block>,
    Visitor<Statements, awst.Statement | awst.Statement[]>
{
  protected accept = <TNode extends ts.Node>(node: TNode) => accept<FunctionVisitor, TNode>(this, node)

  protected readonly _functionType: FunctionPType

  constructor(protected readonly node: ts.MethodDeclaration | ts.FunctionDeclaration | ts.ConstructorDeclaration | ts.ArrowFunction) {
    super()
    const type = this.context.getPTypeForNode(node)
    invariant(type instanceof FunctionPType, 'type of function must be FunctionPType')
    this._functionType = type
  }

  protected buildFunctionAwst(): {
    args: awst.SubroutineArgument[]
    documentation: awst.MethodDocumentation
    body: awst.Block
  } {
    const node = this.node
    const sourceLocation = this.sourceLocation(node)

    const args = node.parameters.map((p) => this.accept(p))
    const assignDestructuredParams = this.evaluateParameterBindingExpressions(node.parameters, sourceLocation)
    codeInvariant(node.body, 'Functions must have a body')
    const body = assignDestructuredParams.length
      ? nodeFactory.block({ sourceLocation }, assignDestructuredParams, this.accept(node.body))
      : this.accept(node.body)

    return {
      args,
      body,
      documentation: this.getMethodDocumentation(node),
    }
  }

  visitBindingName(bindingName: ts.BindingName, sourceLocation: SourceLocation): InstanceBuilder {
    switch (bindingName.kind) {
      case ts.SyntaxKind.ObjectBindingPattern: {
        const props = Array<[string, InstanceBuilder]>()
        for (const element of bindingName.elements) {
          const sourceLocation = this.sourceLocation(element)

          const propertyNameIdentifier = element.propertyName ?? element.name
          invariant(ts.isIdentifier(propertyNameIdentifier), 'propertyName must be an identifier')

          const propertyName = this.textVisitor.accept(propertyNameIdentifier)
          codeInvariant(!element.dotDotDotToken, 'Spread operator is not supported', sourceLocation)
          codeInvariant(!element.initializer, 'Initializer on object binding pattern is not supported', sourceLocation)

          props.push([propertyName, this.visitBindingName(element.name, sourceLocation)])
        }
        const ptype = ObjectPType.anonymous(props.map(([name, builder]): [string, PType] => [name, builder.ptype]))
        return new ObjectLiteralExpressionBuilder(sourceLocation, ptype, [{ type: 'properties', properties: Object.fromEntries(props) }])
      }
      case ts.SyntaxKind.ArrayBindingPattern: {
        const items: InstanceBuilder[] = []
        for (const element of bindingName.elements) {
          const sourceLocation = this.context.getSourceLocation(element)

          if (ts.isOmittedExpression(element)) {
            items.push(new OmittedExpressionBuilder(sourceLocation))
          } else {
            codeInvariant(!element.initializer, 'Initializer on array binding expression is not supported', sourceLocation)
            codeInvariant(!element.propertyName, 'Property name on array binding expression is not supported', sourceLocation)

            if (element.dotDotDotToken) {
              const spreadResult = this.visitBindingName(element.name, sourceLocation)
              if (spreadResult instanceof NativeArrayExpressionBuilder) {
                throw new CodeError(
                  'Spread operator is not supported in assignment expressions where the resulting type is a variadic array',
                  { sourceLocation },
                )
              } else if (spreadResult instanceof TupleExpressionBuilder) {
                throw new CodeError('Spread operator is not currently supported with tuple expressions', { sourceLocation })
              } else {
                throw InternalError.shouldBeUnreachable()
              }
            } else {
              items.push(this.visitBindingName(element.name, sourceLocation))
            }
          }
        }
        return new ArrayLiteralExpressionBuilder(sourceLocation, items)
      }

      case ts.SyntaxKind.Identifier: {
        return requireInstanceBuilder(this.accept(bindingName))
      }
      default:
        throw new InternalError('Unhandled binding name', { sourceLocation })
    }
  }
  evaluateParameterBindingExpressions(parameters: Iterable<ts.ParameterDeclaration>, sourceLocation: SourceLocation): awst.Statement[] {
    const assignments: awst.Statement[] = []
    for (const p of parameters) {
      const sourceLocation = this.sourceLocation(p)
      if (!ts.isIdentifier(p.name)) {
        const paramPType = this.context.getPTypeForNode(p)
        const paramName = this.context.resolveDestructuredParamName(p)
        const paramBuilder = typeRegistry.getInstanceEb(
          nodeFactory.varExpression({
            name: paramName,
            sourceLocation,
            wtype: paramPType.wtypeOrThrow,
          }),
          paramPType,
        )

        assignments.push(this.handleAssignmentStatement(this.visitBindingName(p.name, sourceLocation), paramBuilder, sourceLocation))
      }
    }

    if (assignments.length === 0) return []

    return [
      nodeFactory.block(
        {
          sourceLocation,
          comment: 'Destructured params',
        },
        ...assignments,
      ),
    ]
  }

  visitTypeAliasDeclaration(node: ts.TypeAliasDeclaration): awst.Statement[] {
    return []
  }

  visitClassDeclaration(node: ts.ClassDeclaration): awst.Statement | awst.Statement[] {
    throw new NotSupported('Nested classes', {
      sourceLocation: this.sourceLocation(node),
    })
  }

  visitVariableDeclarationList(node: ts.VariableDeclarationList): awst.Statement[] {
    const isConstDeclaration = hasFlags(node.flags, ts.NodeFlags.Const)
    return node.declarations.flatMap((d) => {
      const sourceLocation = this.sourceLocation(d)
      if (!d.initializer) {
        // Typescript will already error if a destructuring expression is used without an initializer
        if (ts.isIdentifier(d.name)) {
          const ptype = this.context.getPTypeForNode(d.name)
          codeInvariant(ptype.wtype, `${ptype.fullName} is not a valid variable type`)
        }
        return []
      }

      const source = requireInstanceBuilder(this.accept(d.initializer))

      /*
       If we encounter a simple const VAR = %VALUE% declaration, and the value is a compile time constant
       store this value as a constant in the context instead of processing the assignment.

       visitIdentifier will then resolve this constant instead of a VarExpression then the constant is referenced.

       NOTE: This only handles basic expressions for now. Constant values which are destructured from more complex expressions
       are not currently handled. eg. const [myConst] = ["constant value"]
       */
      storeConst: if (isConstDeclaration && ts.isIdentifier(d.name)) {
        const targetType = this.context.getPTypeForNode(d.name)
        if (!targetType.wtype) break storeConst
        const expr = source.resolveToPType(targetType).resolve()
        if (!isConstant(expr)) break storeConst
        this.context.addConstant(d.name, expr)
        return []
      }

      return this.handleAssignmentStatement(this.visitBindingName(d.name, sourceLocation), source, sourceLocation)
    })
  }

  visitVariableStatement(node: ts.VariableStatement): awst.Statement | awst.Statement[] {
    return this.accept(node.declarationList)
  }

  visitForStatement(node: ts.ForStatement): awst.Statement | awst.Statement[] {
    const sourceLocation = this.sourceLocation(node)
    let init: awst.Statement[] = []
    if (node.initializer) {
      if (ts.isExpression(node.initializer)) {
        init = [
          nodeFactory.expressionStatement({
            expr: requireInstanceBuilder(this.accept(node.initializer)).resolve(),
          }),
        ]
      } else {
        init = this.accept(node.initializer)
      }
    }
    let incrementor: awst.Statement[] = []
    if (node.incrementor) {
      incrementor = [
        nodeFactory.expressionStatement({
          expr: requireInstanceBuilder(this.accept(node.incrementor)).resolve(),
        }),
      ]
    }
    using ctx = this.context.switchLoopCtx.enterLoop(node, sourceLocation)
    return [
      ...init,
      nodeFactory.whileLoop({
        sourceLocation,
        condition: node.condition ? this.evaluateCondition(node.condition) : nodeFactory.boolConstant({ value: true, sourceLocation }),
        loopBody: nodeFactory.block(
          {
            sourceLocation,
          },
          this.accept(node.statement),
          ...maybeNodes(ctx.hasContinues, ctx.continueTarget),
          incrementor,
        ),
      }),
      ...maybeNodes(ctx.hasBreaks, ctx.breakTarget),
    ]
  }

  visitForOfStatement(node: ts.ForOfStatement): awst.Statement | awst.Statement[] {
    const sourceLocation = this.sourceLocation(node)
    const sequenceLocation = this.sourceLocation(node.expression)
    const initializerLocation = this.sourceLocation(node.initializer)
    const sequenceType = this.context.getPTypeForNode(node.expression)
    const itemType = getSequenceItemType(sequenceType, sequenceLocation)

    let items: awst.LValue
    if (ts.isExpression(node.initializer)) {
      items = requireInstanceBuilder(this.accept(node.initializer)).resolveLValue()
    } else {
      codeInvariant(node.initializer.declarations.length === 1, 'For of loops can only declare a single loop variable', initializerLocation)
      const [declaration] = node.initializer.declarations
      items = this.buildLValue(this.visitBindingName(declaration.name, initializerLocation), itemType, initializerLocation)
    }
    using ctx = this.context.switchLoopCtx.enterLoop(node, sourceLocation)
    return nodeFactory.block(
      { sourceLocation },
      nodeFactory.forInLoop({
        sourceLocation,
        sequence: requireInstanceBuilder(this.accept(node.expression)).iterate(sourceLocation),
        items,
        loopBody: nodeFactory.block({ sourceLocation }, this.accept(node.statement), ...maybeNodes(ctx.hasContinues, ctx.continueTarget)),
      }),
      ...maybeNodes(ctx.hasBreaks, ctx.breakTarget),
    )
  }
  visitForInStatement(node: ts.ForInStatement): awst.Statement | awst.Statement[] {
    throw new NotSupported('For in statements', {
      sourceLocation: this.sourceLocation(node),
    })
  }
  visitTryStatement(node: ts.TryStatement): awst.Statement | awst.Statement[] {
    throw new NotSupported('Try statements', {
      sourceLocation: this.sourceLocation(node),
    })
  }
  visitEmptyStatement(node: ts.EmptyStatement): awst.Statement | awst.Statement[] {
    return nodeFactory.block({ sourceLocation: this.sourceLocation(node), comment: 'Empty statement' })
  }
  visitExpressionStatement(node: ts.ExpressionStatement): awst.Statement | awst.Statement[] {
    const expr = requireInstanceBuilder(this.accept(node.expression)).resolve()
    if (expr instanceof AssignmentExpression) {
      return nodeFactory.assignmentStatement({
        ...expr,
      })
    }
    return nodeFactory.expressionStatement({
      expr,
    })
  }
  visitIfStatement(node: ts.IfStatement): awst.Statement | awst.Statement[] {
    const sourceLocation = this.sourceLocation(node)
    const condition = this.evaluateCondition(node.expression)

    const ifBranch = nodeFactory.block({ sourceLocation: this.sourceLocation(node.thenStatement) }, this.accept(node.thenStatement))
    const elseBranch =
      node.elseStatement && nodeFactory.block({ sourceLocation: this.sourceLocation(node.elseStatement) }, this.accept(node.elseStatement))

    return nodeFactory.ifElse({
      condition,
      ifBranch,
      elseBranch: elseBranch ?? null,
      sourceLocation,
    })
  }
  visitDoStatement(node: ts.DoStatement): awst.Statement | awst.Statement[] {
    const sourceLocation = this.sourceLocation(node)
    using ctx = this.context.switchLoopCtx.enterLoop(node, sourceLocation)
    invariant(ctx.breakTarget.label, 'Break target must have a label')
    return nodeFactory.block(
      { sourceLocation },
      nodeFactory.whileLoop({
        sourceLocation,
        condition: nodeFactory.boolConstant({ value: true, sourceLocation }),
        loopBody: nodeFactory.block(
          { sourceLocation },
          this.accept(node.statement),
          ...maybeNodes(ctx.hasContinues, ctx.continueTarget),
          nodeFactory.ifElse({
            condition: this.evaluateCondition(node.expression, true),
            sourceLocation,
            ifBranch: nodeFactory.block(
              { sourceLocation },
              nodeFactory.goto({ sourceLocation, target: this.context.switchLoopCtx.getBreakTarget(undefined, sourceLocation) }),
            ),
            elseBranch: null,
          }),
        ),
      }),
      ...maybeNodes(ctx.hasBreaks, ctx.breakTarget),
    )
  }
  visitWhileStatement(node: ts.WhileStatement): awst.Statement | awst.Statement[] {
    const sourceLocation = this.sourceLocation(node)
    using ctx = this.context.switchLoopCtx.enterLoop(node, sourceLocation)

    return nodeFactory.block(
      { sourceLocation },
      nodeFactory.whileLoop({
        sourceLocation,
        condition: this.evaluateCondition(node.expression),
        loopBody: nodeFactory.block({ sourceLocation }, this.accept(node.statement), ...maybeNodes(ctx.hasContinues, ctx.continueTarget)),
      }),
      ...maybeNodes(ctx.hasBreaks, ctx.breakTarget),
    )
  }
  visitContinueStatement(node: ts.ContinueStatement): awst.Statement | awst.Statement[] {
    const sourceLocation = this.sourceLocation(node)

    return nodeFactory.goto({
      sourceLocation,
      target: this.context.switchLoopCtx.getContinueTarget(node.label, sourceLocation),
    })
  }
  visitBreakStatement(node: ts.BreakStatement): awst.Statement | awst.Statement[] {
    const sourceLocation = this.sourceLocation(node)

    return nodeFactory.goto({
      sourceLocation,
      target: this.context.switchLoopCtx.getBreakTarget(node.label, sourceLocation),
    })
  }
  visitReturnStatement(node: ts.ReturnStatement): awst.Statement | awst.Statement[] {
    const sourceLocation = this.sourceLocation(node)
    if (!node.expression) {
      return nodeFactory.returnStatement({
        sourceLocation: sourceLocation,
        value: null,
      })
    }
    const returnValue = this.accept(node.expression)
    return nodeFactory.returnStatement({
      sourceLocation: sourceLocation,
      value: requireExpressionOfType(returnValue, this._functionType.returnType),
    })
  }
  visitWithStatement(node: ts.WithStatement): awst.Statement | awst.Statement[] {
    throw new NotSupported('with statements', { sourceLocation: this.sourceLocation(node) })
  }
  visitSwitchStatement(node: ts.SwitchStatement): awst.Statement | awst.Statement[] {
    const sourceLocation = this.sourceLocation(node)
    using ctx = this.context.switchLoopCtx.enterSwitch(node, sourceLocation)

    const subject = requireInstanceBuilder(this.accept(node.expression)).singleEvaluation()

    let defaultCase: Block | null = null

    const clauses: awst.Statement[] = []
    for (const [index, clause] of enumerate(node.caseBlock.clauses)) {
      const sourceLocation = this.sourceLocation(clause)

      const statements = clause.statements.flatMap((s) => this.accept(s))
      const isNotLastCase = index + 1 < node.caseBlock.clauses.length
      const isObviouslyTerminated = instanceOfAny(statements.at(-1), Goto, ReturnStatement)
      const caseBlock = nodeFactory.block(
        {
          sourceLocation,
        },
        ctx.caseTarget(index, sourceLocation),
        statements,
        ...(isNotLastCase && !isObviouslyTerminated ? [ctx.gotoCase(index + 1, sourceLocation)] : []),
      )
      if (clause.kind === ts.SyntaxKind.DefaultClause) {
        defaultCase = caseBlock
      } else {
        const clauseExpr = requireInstanceBuilder(this.accept(clause.expression))
        clauses.push(
          nodeFactory.ifElse({
            condition: subject.compare(clauseExpr, BuilderComparisonOp.eq, clauseExpr.sourceLocation).boolEval(clauseExpr.sourceLocation),
            ifBranch: caseBlock,
            elseBranch: null,
            sourceLocation,
          }),
        )
      }
    }
    if (defaultCase !== null) clauses.push(defaultCase)

    return nodeFactory.block(
      {
        sourceLocation,
      },
      ...clauses,
      ...maybeNodes(ctx.hasBreaks, ctx.breakTarget),
    )
  }

  visitLabeledStatement(node: ts.LabeledStatement): awst.Statement | awst.Statement[] {
    return this.accept(node.statement)
  }
  visitThrowStatement(node: ts.ThrowStatement): awst.Statement | awst.Statement[] {
    throw new NotSupported('Throw statements', {
      sourceLocation: this.sourceLocation(node),
    })
  }
  visitDebuggerStatement(node: ts.DebuggerStatement): awst.Statement | awst.Statement[] {
    logger.warn(this.sourceLocation(node), 'Ignoring debugger statement')
    return []
  }
  visitImportDeclaration(node: ts.ImportDeclaration): awst.Statement | awst.Statement[] {
    throw new NotSupported('Non-top-level import declarations')
  }

  visitBlock(node: ts.Block): awst.Block {
    return nodeFactory.block(
      {
        sourceLocation: this.sourceLocation(node),
      },
      node.statements.flatMap((s) => {
        try {
          return this.accept(s)
        } catch (e) {
          invariant(e instanceof Error, 'Only errors should be thrown')
          logger.error(e)
          return []
        }
      }),
    )
  }

  visitConciseBody(node: ts.ConciseBody): awst.Block {
    if (ts.isExpression(node)) {
      return nodeFactory.block(
        {
          sourceLocation: this.sourceLocation(node),
        },
        nodeFactory.expressionStatement({ expr: this.accept(node) }),
      )
    }

    return nodeFactory.block(
      {
        sourceLocation: this.sourceLocation(node),
      },
      node.statements.flatMap((s) => {
        try {
          return this.accept(s)
        } catch (e) {
          invariant(e instanceof Error, 'Only errors should be thrown')
          logger.error(e)
          return []
        }
      }),
    )
  }

  visitParameter(node: ts.ParameterDeclaration): awst.SubroutineArgument {
    const sourceLocation = this.sourceLocation(node)
    codeInvariant(node.type, 'Parameters must have type annotation', sourceLocation)
    codeInvariant(!node.dotDotDotToken, 'Rest parameters are not supported', sourceLocation)
    codeInvariant(!node.questionToken, 'Optional parameters are not supported', sourceLocation)
    if (node.initializer) {
      logger.warn(sourceLocation, 'TODO: Default parameter values')
    }
    const paramPType = this.context.getPTypeForNode(node.type)

    if (ts.isIdentifier(node.name)) {
      return nodeFactory.subroutineArgument({
        sourceLocation: sourceLocation,
        name: this.context.resolveVariableName(node.name),
        wtype: paramPType.wtypeOrThrow,
      })
    } else if (ts.isObjectBindingPattern(node.name)) {
      codeInvariant(paramPType instanceof ObjectPType, 'Param type must be object if it is being destructured', sourceLocation)
      return nodeFactory.subroutineArgument({
        sourceLocation,
        name: this.context.resolveDestructuredParamName(node),
        wtype: paramPType.wtype,
      })
    } else {
      throw new CodeError(`Unsupported parameter declaration type ${getNodeName(node)}`, { sourceLocation })
    }
  }
}
