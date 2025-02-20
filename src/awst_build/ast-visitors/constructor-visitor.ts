import ts from 'typescript'
import type { ContractReference } from '../../awst/models'
import { nodeFactory } from '../../awst/node-factory'
import * as awst from '../../awst/nodes'
import { logger } from '../../logger'
import { codeInvariant, invariant } from '../../util'
import type { ContractClassPType } from '../ptypes'
import { voidPType } from '../ptypes'
import { ContractMethodBaseVisitor } from './contract-method-visitor'
import { visitInChildContext } from './util'

export interface ConstructorInfo {
  propertyInitializerStatements: awst.Statement[]
  cref: ContractReference
}

export class ConstructorVisitor extends ContractMethodBaseVisitor {
  private _foundSuperCall = false
  constructor(
    node: ts.ConstructorDeclaration,
    contractType: ContractClassPType,
    private readonly contractInfo: ConstructorInfo,
  ) {
    super(node, contractType)
  }

  get result() {
    const sourceLocation = this.sourceLocation(this.node)
    const { args, body, documentation } = this.buildFunctionAwst()
    return new awst.ContractMethod({
      arc4MethodConfig: null,
      memberName: this._functionType.name,
      sourceLocation,
      args,
      returnType: voidPType.wtype,
      body,
      cref: this.contractInfo.cref,
      documentation,
      inline: null,
    })
  }

  public static buildConstructor(
    node: ts.ConstructorDeclaration,
    contractType: ContractClassPType,
    constructorMethodInfo: ConstructorInfo,
  ) {
    return visitInChildContext(this, node, contractType, constructorMethodInfo)
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
              ...this.contractInfo.propertyInitializerStatements,
            )
          }
          return statement
        } catch (e) {
          invariant(e instanceof Error, 'Only errors should be thrown')
          logger.error(e)
          return []
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
