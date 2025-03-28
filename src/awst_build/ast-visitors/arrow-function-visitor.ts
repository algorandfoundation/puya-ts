import type ts from 'typescript'
import * as awst from '../../awst/nodes'
import { FunctionVisitor } from './function-visitor'
import { visitInChildContext } from './util'

export class ArrowFunctionVisitor extends FunctionVisitor {
  constructor(node: ts.ArrowFunction) {
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
    })
  }

  public static buildArrowFunction(node: ts.ArrowFunction) {
    return visitInChildContext(ArrowFunctionVisitor, node)
  }
}
