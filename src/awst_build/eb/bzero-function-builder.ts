import { FunctionBuilder, type NodeBuilder } from '.'
import { intrinsicFactory } from '../../awst/intrinsic-factory'
import { IntegerConstant } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { BytesPType, uint64PType, type PType } from '../ptypes'
import { instanceEb } from '../type-registry'
import { requestConstantOfType } from './util'
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
      argSpec: (a) => [a.required(uint64PType)],
    })

    const sizeConst = requestConstantOfType(size, uint64PType)
    const sizeValue = sizeConst instanceof IntegerConstant ? sizeConst.value : null
    const ptype = new BytesPType({ length: sizeValue })

    return instanceEb(intrinsicFactory.bzero({ size: size.resolve(), wtype: ptype.wtype, sourceLocation }), ptype)
  }
}
