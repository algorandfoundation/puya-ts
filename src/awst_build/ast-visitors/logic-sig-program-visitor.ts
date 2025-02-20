import type ts from 'typescript'
import * as awst from '../../awst/nodes'
import { invariant } from '../../util'
import { FunctionVisitor } from './function-visitor'

export class LogicSigProgramVisitor extends FunctionVisitor {
  private readonly _result: awst.Subroutine

  constructor(node: ts.MethodDeclaration) {
    super(node)
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

  public static buildLogicSigProgram(node: ts.MethodDeclaration): awst.Subroutine {
    const result = new LogicSigProgramVisitor(node).result
    invariant(result instanceof awst.Subroutine, "result must be Subroutine'")
    return result
  }
}
