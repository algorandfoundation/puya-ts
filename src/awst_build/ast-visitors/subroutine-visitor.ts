import type ts from 'typescript'
import * as awst from '../../awst/nodes'
import { invariant } from '../../util'
import type { AwstBuildContext } from '../context/awst-build-context'
import { FunctionVisitor } from './function-visitor'

export class SubroutineVisitor extends FunctionVisitor {
  private readonly _result: awst.Subroutine

  constructor(ctx: AwstBuildContext, node: ts.FunctionDeclaration) {
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
      inline: null,
    })
  }

  get result() {
    return this._result
  }

  public static buildSubroutine(parentCtx: AwstBuildContext, node: ts.FunctionDeclaration): awst.Subroutine {
    const result = new SubroutineVisitor(parentCtx.createChildContext(), node).result
    invariant(result instanceof awst.Subroutine, "result must be Subroutine'")
    return result
  }
}
