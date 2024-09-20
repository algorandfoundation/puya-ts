import type ts from 'typescript'
import type { ContractReference } from '../awst/models'
import * as awst from '../awst/nodes'
import { CodeError } from '../errors'
import { invariant } from '../util'
import type { AwstBuildContext } from './context/awst-build-context'
import type { NodeBuilder } from './eb'
import { ContractSuperBuilder, ContractThisBuilder } from './eb/contract-builder'
import { FunctionVisitor } from './function-visitor'
import { ContractClassPType } from './ptypes'

export type ContractMethodInfo = {
  cref: ContractReference
  arc4MethodConfig?: awst.ContractMethod['arc4MethodConfig']
}

export class ContractMethodBaseVisitor extends FunctionVisitor {
  visitSuperKeyword(node: ts.SuperExpression): NodeBuilder {
    const sourceLocation = this.sourceLocation(node)
    const ptype = this.context.getPTypeForNode(node)
    if (ptype instanceof ContractClassPType) {
      return new ContractSuperBuilder(ptype, sourceLocation, this.context)
    }
    throw new CodeError(`'super' keyword is not valid outside of a contract type`, { sourceLocation })
  }

  visitThisKeyword(node: ts.ThisExpression): NodeBuilder {
    const sourceLocation = this.sourceLocation(node)
    const ptype = this.context.getPTypeForNode(node)
    if (ptype instanceof ContractClassPType) {
      return new ContractThisBuilder(ptype, sourceLocation, this.context)
    }
    throw new CodeError(`'this' keyword is not valid outside of a contract type`, { sourceLocation })
  }
}

export class ContractMethodVisitor extends ContractMethodBaseVisitor {
  private readonly _result: awst.ContractMethod

  constructor(ctx: AwstBuildContext, node: ts.MethodDeclaration, contractInfo: ContractMethodInfo) {
    super(ctx, node)
    const sourceLocation = this.sourceLocation(node)
    const { args, body, documentation } = this.buildFunctionAwst(node)

    this._result = new awst.ContractMethod({
      arc4MethodConfig: contractInfo.arc4MethodConfig ?? null,
      memberName: this._functionType.name,
      sourceLocation,
      args,
      returnType: this._functionType.returnType.wtypeOrThrow,
      body,
      inheritable: true,
      synthetic: false,
      cref: contractInfo.cref,
      documentation,
    })
  }

  get result() {
    return this._result
  }

  public static buildContractMethod(
    parentCtx: AwstBuildContext,
    node: ts.MethodDeclaration,
    contractMethodInfo: ContractMethodInfo,
  ): awst.ContractMethod {
    const result = new ContractMethodVisitor(parentCtx.createChildContext(), node, contractMethodInfo).result
    invariant(result instanceof awst.ContractMethod, "result must be ContractMethod'")
    return result
  }
}
