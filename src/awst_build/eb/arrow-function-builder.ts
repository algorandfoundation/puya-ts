import type { Block, Expression } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import type { wtypes } from '../../awst/wtypes'
import type { FunctionPType, PType } from '../ptypes'
import { NodeBuilder } from './index'

export type ArrowFunctionParameter = {
  name: string
  wtype: wtypes.WType
  sourceLocation: SourceLocation
}

export type ArrowFunction = {
  parameters: ArrowFunctionParameter[]
  body: Expression | Block
  sourceLocation: SourceLocation
}

export class ArrowFunctionBuilder extends NodeBuilder {
  readonly ptype: PType

  constructor(arrowFunction: ArrowFunction, ptype: FunctionPType) {
    super(arrowFunction.sourceLocation)
    this.ptype = ptype
  }
}
