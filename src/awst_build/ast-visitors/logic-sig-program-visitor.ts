import type ts from 'typescript'
import * as awst from '../../awst/nodes'
import { invariant } from '../../util'
import type { AwstBuildContext } from '../context/awst-build-context'
import { FunctionVisitor } from './function-visitor'

export class LogicSigProgramVisitor extends FunctionVisitor {
  private readonly _result: awst.Subroutine

  constructor(ctx: AwstBuildContext, node: ts.MethodDeclaration) {
    super(ctx, node)
    const sourceLocation = this.sourceLocation(node)
    const { args, body, documentation } = this.buildFunctionAwst(node)

    this._result = new awst.Subroutine({
      id: this._functionType.fullName,
      name: this._functionType.name,
      sourceLocation,
      args,
      returnType: this._functionType.returnType.wtypeOrThrow,
      body,
      documentation,
    })
  }

  get result() {
    return this._result
  }

  public static buildLogicSigProgram(parentCtx: AwstBuildContext, node: ts.MethodDeclaration): awst.Subroutine {
    const result = new LogicSigProgramVisitor(parentCtx.createChildContext(), node).result
    invariant(result instanceof awst.Subroutine, "result must be Subroutine'")
    return result
  }
}
