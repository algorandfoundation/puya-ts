import type ts from 'typescript'
import * as awst from '../../awst/nodes'
import { FunctionVisitor } from './function-visitor'
import { visitInChildContext } from './util'

export class SubroutineVisitor extends FunctionVisitor {
  constructor(node: ts.FunctionDeclaration) {
    super(node)
  }

  get result() {
    const sourceLocation = this.sourceLocation(this.node)

    const { args, body, documentation } = this.buildFunctionAwst()

    return new awst.Subroutine({
      id: this.functionType.fullName,
      name: this.functionType.name,
      sourceLocation,
      args,
      returnType: this.functionType.returnType.wtypeOrThrow,
      body,
      documentation,
      inline: null,
      pure: false,
    })
  }

  public static buildSubroutine(node: ts.FunctionDeclaration) {
    return visitInChildContext(SubroutineVisitor, node)
  }
}
