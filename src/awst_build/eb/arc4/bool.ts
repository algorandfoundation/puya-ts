import type { Expression } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import type { PType } from '../../ptypes'
import { ARC4BoolClass, ARC4BooleanType, type ARC4EncodedType } from '../../ptypes/arc4-types'
import type { InstanceBuilder, NodeBuilder } from '../index'
import { Arc4EncodedBaseClassBuilder, Arc4EncodedBaseExpressionBuilder } from './base'

export class BoolClassBuilder extends Arc4EncodedBaseClassBuilder {
  readonly ptype = ARC4BoolClass

  newCall(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    throw new Error('Method not implemented.')
  }
}

export class BoolExpressionBuilder extends Arc4EncodedBaseExpressionBuilder<ARC4EncodedType> {
  constructor(expression: Expression) {
    super(expression, ARC4BooleanType)
  }
}
