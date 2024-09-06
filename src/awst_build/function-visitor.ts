import type { Visitor } from '../visitor/visitor'
import { accept } from '../visitor/visitor'
import * as awst from '../awst/nodes'
import ts from 'typescript'
import { codeInvariant, enumerate, instanceOfAny, invariant } from '../util'
import type { Statements } from '../visitor/syntax-names'
import { getNodeName } from '../visitor/syntax-names'
import { AwstBuildFailureError, CodeError, InternalError, NotSupported, TodoError } from '../errors'
import { logger } from '../logger'
import { nodeFactory } from '../awst/node-factory'
import { requireExpressionOfType, requireInstanceBuilder } from './eb/util'
import { BaseVisitor } from './base-visitor'
import type { PType } from './ptypes'
import { FunctionPType, ObjectPType, TransientType } from './ptypes'
import type { Block } from '../awst/nodes'
import { Goto, ReturnStatement } from '../awst/nodes'
import type { SourceLocation } from '../awst/source-location'
import { typeRegistry } from './type-registry'
import type { InstanceBuilder } from './eb'
import type { VisitorContext } from './context/base-context'
import { OmittedExpressionBuilder } from './eb/omitted-expression-builder'
import { ArrayLiteralExpressionBuilder } from './eb/array-literal-expression-builder'
import { ObjectLiteralExpressionBuilder } from './eb/literal/object-literal-expression-builder'
import { SymbolName } from './symbol-name'
import type { ContractReference } from '../awst/models'

export type ContractMethodInfo = {
  cref: ContractReference
  arc4MethodConfig?: awst.ContractMethod['arc4MethodConfig']
}

// noinspection JSUnusedGlobalSymbols
export class FunctionVisitor
  extends BaseVisitor
  implements
    Visitor<ts.ParameterDeclaration, awst.SubroutineArgument>,
    Visitor<ts.Block, awst.Block>,
    Visitor<Statements, awst.Statement | awst.Statement[]>
{
  private accept = <TNode extends ts.Node>(node: TNode) => accept<FunctionVisitor, TNode>(this, node)

  private readonly _result: awst.Subroutine | awst.ContractMethod
  private readonly _functionType: FunctionPType
  private readonly _functionName: string
  constructor(
    ctx: VisitorContext,
    node: ts.MethodDeclaration | ts.FunctionDeclaration | ts.ConstructorDeclaration,
    contractInfo: ContractMethodInfo | undefined,
  ) {
    super(ctx)
    const sourceLocation = this.sourceLocation(node)

    const type = ctx.getPTypeForNode(node)
    invariant(type instanceof FunctionPType, 'type of function must be FunctionPType')
    this._functionType = type
    if (this._functionType.returnType instanceof TransientType) {
      logger.error(sourceLocation, this._functionType.returnType.typeMessage)
    }
    if (ts.isConstructorDeclaration(node)) {
      this._functionName = '~ctor~'
    } else {
      codeInvariant(node.name, 'Anonymous functions are not supported', sourceLocation)
      this._functionName = this.textVisitor.accept(node.name)
    }

    const args = node.parameters.map((p) => this.accept(p))
    const assignDestructuredParams = this.evaluateParameterBindingExpressions(node.parameters, sourceLocation)
    codeInvariant(node.body, 'Functions must have a body')
    const body = assignDestructuredParams.length
      ? nodeFactory.block({ sourceLocation }, assignDestructuredParams, this.accept(node.body))
      : this.accept(node.body)
    const documentation = nodeFactory.methodDocumentation({
      args: new Map(),
      description: null,
      returns: null,
    })
    if (contractInfo) {
      this._result = new awst.ContractMethod({
        arc4MethodConfig: contractInfo.arc4MethodConfig ?? null,
        memberName: this._functionName,
        sourceLocation,
        args,
        returnType: this._functionType.returnType.wtypeOrThrow,
        body,
        inheritable: true,
        synthetic: false,
        cref: contractInfo.cref,
        documentation,
      })
    } else {
      this._result = new awst.Subroutine({
        id: new SymbolName({ name: this._functionName, module: type.module }).fullName,
        name: this._functionName,
        sourceLocation,
        args,
        returnType: this._functionType.returnType.wtypeOrThrow,
        body,
        documentation,
      })
    }
  }

  buildAssignmentTarget(bindingName: ts.BindingName, sourceLocation: SourceLocation): InstanceBuilder {
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

          props.push([propertyName, this.buildAssignmentTarget(element.name, sourceLocation)])
        }
        const ptype = ObjectPType.literal(props.map(([name, builder]): [string, PType] => [name, builder.ptype]))
        return new ObjectLiteralExpressionBuilder(
          sourceLocation,
          ptype,
          [{ type: 'properties', properties: Object.fromEntries(props) }],
          () => this.context.generateDiscardedVarName(),
        )
      }
      case ts.SyntaxKind.ArrayBindingPattern: {
        const items: InstanceBuilder[] = []
        for (const element of bindingName.elements) {
          const sourceLocation = this.context.getSourceLocation(element)

          if (ts.isOmittedExpression(element)) {
            items.push(new OmittedExpressionBuilder(sourceLocation))
          } else {
            codeInvariant(!element.dotDotDotToken, 'Spread operator is not supported', sourceLocation)
            codeInvariant(!element.initializer, 'Initializer on array binding expression is not supported', sourceLocation)
            codeInvariant(!element.propertyName, 'Property name on array binding expression is not supported', sourceLocation)
            items.push(this.buildAssignmentTarget(element.name, sourceLocation))
          }
        }
        return new ArrayLiteralExpressionBuilder(sourceLocation, items)
      }

      case ts.SyntaxKind.Identifier: {
        return requireInstanceBuilder(this.accept(bindingName), sourceLocation)
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

        assignments.push(this.handleAssignmentStatement(this.buildAssignmentTarget(p.name, sourceLocation), paramBuilder, sourceLocation))
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
    return node.declarations.flatMap((d) => {
      const sourceLocation = this.sourceLocation(d)
      if (!d.initializer) {
        return []
      }

      const source = requireInstanceBuilder(this.accept(d.initializer), sourceLocation)

      return this.handleAssignmentStatement(this.buildAssignmentTarget(d.name, sourceLocation), source, sourceLocation)
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
            expr: requireInstanceBuilder(this.accept(node.initializer), sourceLocation).resolve(),
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
          expr: requireInstanceBuilder(this.accept(node.incrementor), sourceLocation).resolve(),
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
          ctx.continueTarget,
          incrementor,
        ),
      }),
      ctx.breakTarget,
    ]
  }
  visitForOfStatement(node: ts.ForOfStatement): awst.Statement | awst.Statement[] {
    const sourceLocation = this.sourceLocation(node)

    let items: awst.LValue
    if (ts.isExpression(node.initializer)) {
      items = requireInstanceBuilder(this.accept(node.initializer), sourceLocation).resolveLValue()
    } else {
      codeInvariant(
        node.initializer.declarations.length === 1,
        'For of loops can only declare a single loop variable',
        this.sourceLocation(node.initializer),
      )
      const [declaration] = node.initializer.declarations
      items = requireInstanceBuilder(this.accept(declaration.name), sourceLocation).resolveLValue()
    }
    using ctx = this.context.switchLoopCtx.enterLoop(node, sourceLocation)
    return nodeFactory.block(
      { sourceLocation },
      nodeFactory.forInLoop({
        sourceLocation,
        sequence: requireInstanceBuilder(this.accept(node.expression), sourceLocation).iterate(sourceLocation),
        items,
        loopBody: nodeFactory.block({ sourceLocation }, this.accept(node.statement), ctx.continueTarget),
      }),
      ctx.breakTarget,
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
    throw new TodoError('EmptyStatement')
  }
  visitExpressionStatement(node: ts.ExpressionStatement): awst.Statement | awst.Statement[] {
    const sourceLocation = this.sourceLocation(node)
    const expr = this.accept(node.expression)
    return new awst.ExpressionStatement({
      sourceLocation: sourceLocation,
      expr: requireInstanceBuilder(expr, sourceLocation).resolve(),
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
          ctx.continueTarget,
          nodeFactory.ifElse({
            condition: this.evaluateCondition(node.expression, true),
            sourceLocation,
            ifBranch: nodeFactory.block({ sourceLocation }, nodeFactory.goto({ sourceLocation, target: ctx.breakTarget.label })),
            elseBranch: null,
          }),
        ),
      }),
      ctx.breakTarget,
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
        loopBody: nodeFactory.block({ sourceLocation }, this.accept(node.statement), ctx.continueTarget),
      }),
      ctx.breakTarget,
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
      value: requireExpressionOfType(returnValue, this._functionType.returnType, sourceLocation),
    })
  }
  visitWithStatement(node: ts.WithStatement): awst.Statement | awst.Statement[] {
    throw new NotSupported('with statements', { sourceLocation: this.sourceLocation(node) })
  }
  visitSwitchStatement(node: ts.SwitchStatement): awst.Statement | awst.Statement[] {
    const sourceLocation = this.sourceLocation(node)
    using ctx = this.context.switchLoopCtx.enterSwitch(node, sourceLocation)

    const subject = requireInstanceBuilder(this.accept(node.expression), sourceLocation)
    codeInvariant(subject.ptype, 'The subject of a switch statement must have a resolvable ptype', this.sourceLocation(node.expression))

    let defaultCase: Block | null = null
    const cases = new Map<awst.Expression, awst.Block>()
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
        const clauseExpr = requireExpressionOfType(this.accept(clause.expression), subject.ptype, sourceLocation)
        cases.set(clauseExpr, caseBlock)
      }
    }
    const switchStatement = nodeFactory.switch({
      value: subject.resolve(),
      sourceLocation,
      cases,
      defaultCase,
    })
    if (!ctx.hasBreaks) {
      return switchStatement
    }
    return nodeFactory.block(
      {
        sourceLocation,
      },
      switchStatement,
      ctx.breakTarget,
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
          if (e instanceof AwstBuildFailureError) return []
          throw e
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

  get result() {
    return this._result
  }

  public static buildSubroutine(parentCtx: VisitorContext, node: ts.FunctionDeclaration): awst.Subroutine {
    const result = new FunctionVisitor(parentCtx.createChildContext(), node, undefined).result
    invariant(result instanceof awst.Subroutine, "result must be Subroutine'")
    return result
  }
  public static buildContractMethod(
    parentCtx: VisitorContext,
    node: ts.MethodDeclaration,
    contractMethodInfo: ContractMethodInfo,
  ): awst.ContractMethod {
    const result = new FunctionVisitor(parentCtx.createChildContext(), node, contractMethodInfo).result
    invariant(result instanceof awst.ContractMethod, "result must be ContractMethod'")
    return result
  }
  public static buildConstructor(parentCtx: VisitorContext, node: ts.ConstructorDeclaration, contractMethodInfo: ContractMethodInfo) {
    const result = new FunctionVisitor(parentCtx.createChildContext(), node, contractMethodInfo).result
    invariant(result instanceof awst.ContractMethod, "result must be ContractMethod'")
    return result
  }
}
