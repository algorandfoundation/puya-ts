import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import { StringConstant } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { wtypes } from '../../../awst/wtypes'
import type { PType } from '../../ptypes'
import { stringPType } from '../../ptypes'
import type { ARC4EncodedType } from '../../ptypes/arc4-types'
import { ARC4StrClass, arc4StringType } from '../../ptypes/arc4-types'
import type { InstanceBuilder, NodeBuilder } from '../index'
import { ClassBuilder } from '../index'
import { parseFunctionArgs } from '../util/arg-parsing'
import { Arc4EncodedBaseExpressionBuilder } from './base'

export class StrClassBuilder extends ClassBuilder {
  readonly ptype = ARC4StrClass

  newCall(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    const {
      args: [initialValue],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      funcName: this.typeDescription,
      callLocation: sourceLocation,
      argSpec: (a) => [a.optional(stringPType)],
    })

    if (!initialValue) {
      return new StrExpressionBuilder(
        nodeFactory.stringConstant({
          value: '',
          sourceLocation: sourceLocation,
          wtype: wtypes.arc4StringAliasWType,
        }),
      )
    }
    const expr = initialValue.resolve()
    if (expr instanceof StringConstant) {
      return new StrExpressionBuilder(
        nodeFactory.stringConstant({
          value: expr.value,
          sourceLocation: sourceLocation,
          wtype: wtypes.arc4StringAliasWType,
        }),
      )
    } else {
      return new StrExpressionBuilder(
        nodeFactory.aRC4Encode({
          value: expr,
          wtype: wtypes.arc4StringAliasWType,
          sourceLocation,
        }),
      )
    }
  }
}

export class StrExpressionBuilder extends Arc4EncodedBaseExpressionBuilder<ARC4EncodedType> {
  constructor(expression: Expression) {
    super(expression, arc4StringType)
  }
}
