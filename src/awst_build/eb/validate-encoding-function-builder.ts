import { nodeFactory } from '../../awst/node-factory'
import type { SourceLocation } from '../../awst/source-location'
import { wtypes } from '../../awst/wtypes'
import { codeInvariant } from '../../util'
import { accountPType, BytesPType, validateEncodingFunctionPType, voidPType, type PType } from '../ptypes'
import { arc4AddressAlias, StaticBytesType } from '../ptypes/arc4-types'
import { instanceEb } from '../type-registry'
import { FunctionBuilder, type NodeBuilder } from './index'
import { parseFunctionArgs } from './util/arg-parsing'

export class ValidateEncodingFunctionBuilder extends FunctionBuilder {
  readonly ptype = validateEncodingFunctionPType

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      ptypes: [ptype],
      args: [theValue],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 1,
      funcName: this.typeDescription,
      argSpec: (a) => [a.required()],
      callLocation: sourceLocation,
    })

    codeInvariant(!(ptype instanceof BytesPType) || ptype.length !== null, 'Cannot validate unbounded bytes')

    const validateType = ptype.equals(accountPType)
      ? arc4AddressAlias
      : ptype instanceof BytesPType && ptype.length !== null
        ? new StaticBytesType({ length: ptype.length })
        : ptype

    codeInvariant(validateType.wtype instanceof wtypes.ARC4Type, 'Can only validate ARC4-encoded types')

    const expr = nodeFactory.aRC4FromBytes({
      value: theValue.resolve(),
      validate: true,
      wtype: validateType.wtype,
      sourceLocation,
    })

    return instanceEb(
      nodeFactory.commaExpression({
        expressions: [expr, nodeFactory.voidConstant({ sourceLocation })],
        sourceLocation,
      }),
      voidPType,
    )
  }
}
