import type ts from 'typescript'
import * as awst from '../../awst/nodes'
import { FunctionVisitor } from './function-visitor'
import { visitInChildContext } from './util'

export class LogicSigProgramVisitor extends FunctionVisitor {
  constructor(node: ts.MethodDeclaration) {
    super(node)
  }

  get result() {
    const sourceLocation = this.sourceLocation(this.node)
    const { args, body, documentation } = this.buildFunctionAwst()
    return new awst.Subroutine({
      id: this._functionType.fullName,
      name: this._functionType.name,
      sourceLocation,
      args,
      returnType: this._functionType.returnType.wtypeOrThrow,
      body,
      documentation,
      inline: null,
      pure: false,
    })
  }

  public static buildLogicSigProgram(node: ts.MethodDeclaration) {
    return visitInChildContext(LogicSigProgramVisitor, node)
  }
}
