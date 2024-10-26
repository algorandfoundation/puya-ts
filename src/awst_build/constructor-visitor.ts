import ts from 'typescript'
import type { ContractReference } from '../awst/models'
import { nodeFactory } from '../awst/node-factory'
import * as awst from '../awst/nodes'
import { AwstBuildFailureError } from '../errors'
import { codeInvariant, invariant } from '../util'
import type { AwstBuildContext } from './context/awst-build-context'
import { ContractMethodBaseVisitor } from './contract-method-visitor'
import { voidPType } from './ptypes'

export interface ConstructorInfo {
  propertyInitializerStatements: awst.Statement[]
  cref: ContractReference
}

export class ConstructorVisitor extends ContractMethodBaseVisitor {
  private readonly _result: awst.ContractMethod
  private _foundSuperCall = false
  private readonly _propertyInitializerStatements: awst.Statement[]
  constructor(ctx: AwstBuildContext, node: ts.ConstructorDeclaration, contractInfo: ConstructorInfo) {
    super(ctx, node)
    this._propertyInitializerStatements = contractInfo.propertyInitializerStatements
    const sourceLocation = this.sourceLocation(node)

    const { args, body, documentation } = this.buildFunctionAwst(node)

    this._result = new awst.ContractMethod({
      arc4MethodConfig: null,
      memberName: this._functionType.name,
      sourceLocation,
      args,
      returnType: voidPType.wtype,
      body,
      cref: contractInfo.cref,
      documentation,
    })
  }

  get result() {
    return this._result
  }

  public static buildConstructor(parentCtx: AwstBuildContext, node: ts.ConstructorDeclaration, constructorMethodInfo: ConstructorInfo) {
    const result = new ConstructorVisitor(parentCtx.createChildContext(), node, constructorMethodInfo).result
    invariant(result instanceof awst.ContractMethod, "result must be ContractMethod'")
    return result
  }

  visitBlock(node: ts.Block): awst.Block {
    return nodeFactory.block(
      {
        sourceLocation: this.sourceLocation(node),
      },
      node.statements.flatMap((s) => {
        try {
          const statement = this.accept(s)
          if (isSuperCall(s)) {
            // Property initializer statements should be injected immediately after the super() call
            codeInvariant(!this._foundSuperCall, 'A constructor can only contain one call to super()')
            this._foundSuperCall = true
            return nodeFactory.block(
              {
                sourceLocation: this.sourceLocation(s),
              },
              ...(Array.isArray(statement) ? statement : [statement]),
              ...this._propertyInitializerStatements,
            )
          }
          return statement
        } catch (e) {
          if (e instanceof AwstBuildFailureError) return []
          throw e
        }
      }),
    )
  }
}

function isSuperCall(node: ts.Statement) {
  return (
    ts.isExpressionStatement(node) && ts.isCallExpression(node.expression) && node.expression.expression.kind === ts.SyntaxKind.SuperKeyword
  )
}
