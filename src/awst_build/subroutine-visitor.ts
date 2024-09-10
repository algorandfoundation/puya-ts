import * as awst from '../awst/nodes'
import type { AwstBuildContext } from './context/awst-build-context'
import type ts from 'typescript'
import { SymbolName } from './symbol-name'
import { FunctionVisitor } from './function-visitor'
import { invariant } from '../util'

export class SubroutineVisitor extends FunctionVisitor {
  private readonly _result: awst.Subroutine

  constructor(ctx: AwstBuildContext, node: ts.FunctionDeclaration) {
    super(ctx, node)
    const sourceLocation = this.sourceLocation(node)

    this._result = new awst.Subroutine({
      id: new SymbolName({ name: this._functionName, module: this._functionType.module }).fullName,
      name: this._functionName,
      sourceLocation,
      args: this._args,
      returnType: this._functionType.returnType.wtypeOrThrow,
      body: this._body,
      documentation: this._documentation,
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
