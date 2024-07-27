import { accept, Visitor } from '../visitor/visitor'
import { SourceFileContext } from './context'
import { ContractContext } from './contract-visitor'
import * as awst from '../awst/nodes'
import ts from 'typescript'
import { codeInvariant, enumerate, instanceOfAny, invariant } from '../util'
import { getNodeName, Statements } from '../visitor/syntax-names'
import { AwstBuildFailureError, CodeError, InternalError, NotSupported, TodoError } from '../errors'
import { logger } from '../logger'
import { nodeFactory } from '../awst/node-factory'
import { requireExpressionOfType, requireInstanceBuilder } from './eb/util'
import { PType, voidPType } from './ptypes'
import { BaseVisitor } from './base-visitor'
import { ObjectPType, LiteralOnlyType } from './ptypes/ptype-classes'
import { SwitchLoopContext } from './switch-loop-context'
import { Block, Goto, ReturnStatement } from '../awst/nodes'
import { SourceLocation } from '../awst/source-location'
import { typeRegistry } from './type-registry'
import { InstanceBuilder } from './eb'

export type ContractMethodInfo = {
  className: string
  arc4MethodConfig?: awst.ContractMethod['arc4MethodConfig']
}

export class FunctionContext extends SourceFileContext {
  readonly switchLoopContext: SwitchLoopContext
  constructor(parent: ContractContext | SourceFileContext) {
    super(parent.sourceFile, parent.program, parent.nameResolver.createChild())
    this.switchLoopContext = new SwitchLoopContext(this.checker)
  }

  getDestructuredParamName(node: ts.ParameterDeclaration) {
    const symbol = (node as { symbol?: ts.Symbol }).symbol
    invariant(symbol, 'Param node must have symbol')
    return this.nameResolver.resolveUniqueName('p', symbol)
  }
}

// noinspection JSUnusedGlobalSymbols
export class FunctionVisitor
  extends BaseVisitor<FunctionContext>
  implements
    Visitor<ts.ParameterDeclaration, awst.SubroutineArgument>,
    Visitor<ts.Block, awst.Block>,
    Visitor<Statements, awst.Statement | awst.Statement[]>
{
  private accept = <TNode extends ts.Node>(node: TNode) => accept<FunctionVisitor, TNode>(this, node)

  private readonly _result: awst.Subroutine | awst.ContractMethod
  private readonly _returnType: PType
  private readonly _functionName: string
  constructor(
    ctx: FunctionContext,
    node: ts.MethodDeclaration | ts.FunctionDeclaration | ts.ConstructorDeclaration,
    contractInfo: ContractMethodInfo | undefined,
  ) {
    super(ctx)
    const sourceLocation = this.sourceLocation(node)

    if (ts.isConstructorDeclaration(node)) {
      this._functionName = '~ctor~'
      this._returnType = voidPType
    } else {
      codeInvariant(node.name, 'Anonymous functions are not supported', sourceLocation)
      this._functionName = this.textVisitor.accept(node.name)
      this._returnType = node.type ? ctx.getPTypeForNode(node.type) : ctx.getImplicitReturnType(node)
      if (this._returnType instanceof LiteralOnlyType) {
        logger.error(
          sourceLocation,
          `${this._returnType} cannot be used as a return type. Consider annotating the return type explicitly as ${this._returnType.resolvableTo.length > 1 ? 'one of ' : ' '}${this._returnType.resolvableTo.join(', ')}`,
        )
      }
    }
    const type = ctx.getPTypeForNode(node)

    const args = node.parameters.map((p) => this.accept(p))
    const assignDestructuredParams = this.evaluateParameterBindingExpressions(node.parameters, sourceLocation)
    codeInvariant(node.body, 'Functions must have a body')
    const body = assignDestructuredParams.length
      ? nodeFactory.block({ sourceLocation }, assignDestructuredParams, this.accept(node.body))
      : this.accept(node.body)
    if (contractInfo) {
      this._result = new awst.ContractMethod({
        className: contractInfo.className,
        arc4MethodConfig: contractInfo.arc4MethodConfig,
        name: this._functionName,
        sourceLocation,
        moduleName: type.module,
        args,
        returnType: this._returnType.wtypeOrThrow,
        body,
        docstring: undefined,
      })
    } else {
      this._result = new awst.Subroutine({
        name: this._functionName,
        sourceLocation,
        moduleName: type.module,
        args,
        returnType: this._returnType.wtypeOrThrow,
        body,
        docstring: undefined,
      })
    }
  }

  *bindingNameAssignment(bindingName: ts.BindingName, source: InstanceBuilder, sourceLocation: SourceLocation): Iterable<awst.Statement> {
    switch (bindingName.kind) {
      case ts.SyntaxKind.ObjectBindingPattern: {
        for (const element of bindingName.elements) {
          const sourceLocation = this.sourceLocation(element)
          if (!ts.isIdentifier(element.name)) {
            element.propertyName
          }

          const propertyNameIdentifier = element.propertyName ?? element.name
          invariant(ts.isIdentifier(propertyNameIdentifier), 'propertyName must be an identifier')

          const propertyName = this.textVisitor.accept(propertyNameIdentifier)
          codeInvariant(!element.dotDotDotToken, 'Spread operator is not supported', sourceLocation)

          yield* this.bindingNameAssignment(
            element.name,
            requireInstanceBuilder(source.memberAccess(propertyName, sourceLocation), sourceLocation),
            sourceLocation,
          )
        }
        break
      }
      case ts.SyntaxKind.ArrayBindingPattern: {
        logger.warn(sourceLocation, 'TODO: Array binding patterns')
        break
      }

      case ts.SyntaxKind.Identifier: {
        const target = requireInstanceBuilder(this.accept(bindingName), sourceLocation)
        invariant(target.ptype, 'Target of assignment must have ptype')
        const value = requireExpressionOfType(source, target.ptype, sourceLocation)
        yield nodeFactory.assignmentStatement({
          target: target.resolveLValue(),
          sourceLocation,
          value,
        })
        break
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
        const paramPType = this.context.resolver.resolve(p, sourceLocation)
        const paramName = this.context.getDestructuredParamName(p)
        const paramBuilder = typeRegistry.getInstanceEb(
          nodeFactory.varExpression({
            name: paramName,
            sourceLocation,
            wtype: paramPType.wtypeOrThrow,
          }),
          paramPType,
        )
        assignments.push(...this.bindingNameAssignment(p.name, paramBuilder, sourceLocation))
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
        logger.debug(sourceLocation, 'Ignoring variable statement with no initializer')
        return []
      }

      const source = requireInstanceBuilder(this.accept(d.initializer), sourceLocation)
      return Array.from(this.bindingNameAssignment(d.name, source, sourceLocation))
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
    using ctx = this.context.switchLoopContext.enterLoop(node, sourceLocation)
    return [
      ...init,
      nodeFactory.whileLoop({
        sourceLocation,
        condition: node.condition
          ? requireInstanceBuilder(this.accept(node.condition), sourceLocation).boolEval(sourceLocation)
          : nodeFactory.boolConstant({ value: true, sourceLocation }),
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
    using ctx = this.context.switchLoopContext.enterLoop(node, sourceLocation)
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
    const condition = this.accept(node.expression).boolEval(sourceLocation)

    const ifBranch = nodeFactory.block({ sourceLocation: this.sourceLocation(node.thenStatement) }, this.accept(node.thenStatement))
    const elseBranch =
      node.elseStatement && nodeFactory.block({ sourceLocation: this.sourceLocation(node.elseStatement) }, this.accept(node.elseStatement))

    return nodeFactory.ifElse({
      condition,
      ifBranch,
      elseBranch,
      sourceLocation,
    })
  }
  visitDoStatement(node: ts.DoStatement): awst.Statement | awst.Statement[] {
    throw new TodoError('DoStatement')
  }
  visitWhileStatement(node: ts.WhileStatement): awst.Statement | awst.Statement[] {
    const sourceLocation = this.sourceLocation(node)
    using ctx = this.context.switchLoopContext.enterLoop(node, sourceLocation)

    return nodeFactory.block(
      { sourceLocation },
      nodeFactory.whileLoop({
        sourceLocation,
        condition: this.accept(node.expression).boolEval(sourceLocation),
        loopBody: nodeFactory.block({ sourceLocation }, this.accept(node.statement), ctx.continueTarget),
      }),
      ctx.breakTarget,
    )
  }
  visitContinueStatement(node: ts.ContinueStatement): awst.Statement | awst.Statement[] {
    const sourceLocation = this.sourceLocation(node)

    return nodeFactory.goto({
      sourceLocation,
      target: this.context.switchLoopContext.getContinueTarget(node.label, sourceLocation),
    })
  }
  visitBreakStatement(node: ts.BreakStatement): awst.Statement | awst.Statement[] {
    const sourceLocation = this.sourceLocation(node)

    return nodeFactory.goto({
      sourceLocation,
      target: this.context.switchLoopContext.getBreakTarget(node.label, sourceLocation),
    })
  }
  visitReturnStatement(node: ts.ReturnStatement): awst.Statement | awst.Statement[] {
    const sourceLocation = this.sourceLocation(node)
    if (!node.expression) {
      return nodeFactory.returnStatement({
        sourceLocation: sourceLocation,
        value: undefined,
      })
    }
    const returnValue = this.accept(node.expression)
    return nodeFactory.returnStatement({
      sourceLocation: sourceLocation,
      value: requireExpressionOfType(returnValue, this._returnType, sourceLocation),
    })
  }
  visitWithStatement(node: ts.WithStatement): awst.Statement | awst.Statement[] {
    throw new NotSupported('with statements', { sourceLocation: this.sourceLocation(node) })
  }
  visitSwitchStatement(node: ts.SwitchStatement): awst.Statement | awst.Statement[] {
    const sourceLocation = this.sourceLocation(node)
    using ctx = this.context.switchLoopContext.enterSwitch(node, sourceLocation)

    const subject = requireInstanceBuilder(this.accept(node.expression), sourceLocation)
    codeInvariant(subject.ptype, 'The subject of a switch statement must have a resolvable ptype', this.sourceLocation(node.expression))

    let defaultCase: Block | undefined = undefined
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
    return nodeFactory.block(
      {
        sourceLocation,
      },
      nodeFactory.switch({
        value: subject.resolve(),
        sourceLocation,
        cases,
        defaultCase,
      }),
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
        name: this.context.resolveVariable(node.name),
        wtype: paramPType.wtypeOrThrow,
      })
    } else if (ts.isObjectBindingPattern(node.name)) {
      codeInvariant(paramPType instanceof ObjectPType, 'Param type must be object if it is being destructured', sourceLocation)
      return nodeFactory.subroutineArgument({
        sourceLocation,
        name: this.context.getDestructuredParamName(node),
        wtype: paramPType.wtype,
      })

      // return node.name.elements.map((e): awst.SubroutineArgument => {
      //   const sourceLocation = this.sourceLocation(e)
      //   codeInvariant(ts.isIdentifier(e.name), 'Nested object destructuring is not supported', sourceLocation)
      //
      //   return nodeFactory.subroutineArgument({
      //     sourceLocation: sourceLocation,
      //     name: this.context.resolveVariable(e.name),
      //     wtype: paramPType.getPropertyType(e.name.text).wtypeOrThrow,
      //   })
      // })
    } else {
      throw new CodeError(`Unsupported parameter declaration type ${getNodeName(node)}`, { sourceLocation })
    }
  }

  get result() {
    return this._result
  }

  public static buildSubroutine(ctx: SourceFileContext, node: ts.FunctionDeclaration): awst.Subroutine {
    const result = new FunctionVisitor(new FunctionContext(ctx), node, undefined).result
    invariant(result instanceof awst.Subroutine, "result must be Subroutine'")
    return result
  }
  public static buildContractMethod(
    ctx: ContractContext,
    node: ts.MethodDeclaration,
    contractMethodInfo: ContractMethodInfo,
  ): awst.ContractMethod {
    const result = new FunctionVisitor(new FunctionContext(ctx), node, contractMethodInfo).result
    invariant(result instanceof awst.ContractMethod, "result must be ContractMethod'")
    return result
  }
  public static buildConstructor(ctx: ContractContext, node: ts.ConstructorDeclaration, contractMethodInfo: ContractMethodInfo) {
    const result = new FunctionVisitor(new FunctionContext(ctx), node, contractMethodInfo).result
    invariant(result instanceof awst.ContractMethod, "result must be ContractMethod'")
    return result
  }
}
