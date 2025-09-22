import { FunctionBuilder, type NodeBuilder } from '.'
import { intrinsicFactory } from '../../awst/intrinsic-factory'
import type { SourceLocation } from '../../awst/source-location'
import { BytesPType, NumericLiteralPType, type PType } from '../ptypes'
import { instanceEb } from '../type-registry'
import { requireIntegerConstant } from './util'
import { parseFunctionArgs } from './util/arg-parsing'

export class BzeroFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [size],
    } = parseFunctionArgs({
      args,
      typeArgs,
      callLocation: sourceLocation,
      funcName: 'bzero',
      genericTypeArgs: 1,
      argSpec: (a) => [a.required(NumericLiteralPType)],
    })
    const sizeConst = requireIntegerConstant(size)

    const ptype = new BytesPType({ length: sizeConst.value })

    return instanceEb(intrinsicFactory.bzero({ size: sizeConst.value, sourceLocation }), ptype)
  }
}
