import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import { BoolConstant } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { wtypes } from '../../../awst/wtypes'
import type { PType } from '../../ptypes'
import { boolPType } from '../../ptypes'
import { ARC4BoolClass, arc4BooleanType, type ARC4EncodedType } from '../../ptypes/arc4-types'
import type { InstanceBuilder, NodeBuilder } from '../index'
import { ClassBuilder } from '../index'
import { parseFunctionArgs } from '../util/arg-parsing'
import { Arc4EncodedBaseExpressionBuilder } from './base'

export class BoolClassBuilder extends ClassBuilder {
  readonly ptype = ARC4BoolClass

  newCall(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    const {
      args: [initialValue],
    } = parseFunctionArgs({
      args,
      typeArgs,
      callLocation: sourceLocation,
      funcName: `${this.typeDescription} constructor}`,
      genericTypeArgs: 0,
      argSpec: (a) => [a.optional(boolPType)],
    })
    let expr: Expression
    if (!initialValue) {
      expr = nodeFactory.boolConstant({
        value: false,
        sourceLocation,
        wtype: wtypes.arc4BooleanWType,
      })
    } else {
      const value = initialValue.resolve()
      if (value instanceof BoolConstant) {
        expr = nodeFactory.boolConstant({
          value: value.value,
          sourceLocation,
          wtype: wtypes.arc4BooleanWType,
        })
      } else {
        expr = nodeFactory.aRC4Encode({
          value: value,
          wtype: wtypes.arc4BooleanWType,
          sourceLocation,
        })
      }
    }

    return new BoolExpressionBuilder(expr)
  }
}

export class BoolExpressionBuilder extends Arc4EncodedBaseExpressionBuilder<ARC4EncodedType> {
  constructor(expression: Expression) {
    super(expression, arc4BooleanType)
  }
}
