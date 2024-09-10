import * as awst from '../awst/nodes'
import type { AwstBuildContext } from './context/awst-build-context'
import type ts from 'typescript'
import { FunctionVisitor } from './function-visitor'
import { invariant } from '../util'
import type { NodeBuilder } from './eb'
import { ContractClassPType } from './ptypes'
import { ContractSuperBuilder, ContractThisBuilder } from './eb/contract-builder'
import { CodeError } from '../errors'
import type { ContractReference } from '../awst/models'

export type ContractMethodInfo = {
  cref: ContractReference
  arc4MethodConfig?: awst.ContractMethod['arc4MethodConfig']
}

export class ContractMethodVisitor extends FunctionVisitor {
  private readonly _result: awst.ContractMethod

  constructor(
    ctx: AwstBuildContext,
    node: ts.MethodDeclaration | ts.ConstructorDeclaration,
    private contractInfo: ContractMethodInfo,
  ) {
    super(ctx, node)
    const sourceLocation = this.sourceLocation(node)

    this._result = new awst.ContractMethod({
      arc4MethodConfig: contractInfo.arc4MethodConfig ?? null,
      memberName: this._functionName,
      sourceLocation,
      args: this._args,
      returnType: this._functionType.returnType.wtypeOrThrow,
      body: this._body,
      inheritable: true,
      synthetic: false,
      cref: contractInfo.cref,
      documentation: this._documentation,
    })
  }

  get result() {
    return this._result
  }

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

  public static buildContractMethod(
    parentCtx: AwstBuildContext,
    node: ts.MethodDeclaration,
    contractMethodInfo: ContractMethodInfo,
  ): awst.ContractMethod {
    const result = new ContractMethodVisitor(parentCtx.createChildContext(), node, contractMethodInfo).result
    invariant(result instanceof awst.ContractMethod, "result must be ContractMethod'")
    return result
  }
  public static buildConstructor(parentCtx: AwstBuildContext, node: ts.ConstructorDeclaration, contractMethodInfo: ContractMethodInfo) {
    const result = new ContractMethodVisitor(parentCtx.createChildContext(), node, contractMethodInfo).result
    invariant(result instanceof awst.ContractMethod, "result must be ContractMethod'")
    return result
  }
}
