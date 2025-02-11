import { nodeFactory } from '../../../../awst/node-factory'
import type { SourceLocation } from '../../../../awst/source-location'
import { CodeError } from '../../../../errors'
import { codeInvariant } from '../../../../util'
import type { PType } from '../../../ptypes'
import { ArrayLiteralPType, ArrayPType, TuplePType } from '../../../ptypes'
import { ARC4ArrayType, DynamicArrayType, DynamicBytesType, StaticBytesType } from '../../../ptypes/arc4-types'
import { instanceEb } from '../../../type-registry'
import type { InstanceBuilder } from '../../index'

export function concatArrays(left: InstanceBuilder, right: InstanceBuilder, sourceLocation: SourceLocation): InstanceBuilder {
  const returnType = getArrayConcatType(left.ptype, right.ptype, sourceLocation)
  return instanceEb(
    nodeFactory.arrayConcat({
      left: left.resolve(),
      right: right.resolve(),
      wtype: returnType.wtype,
      sourceLocation,
    }),
    returnType,
  )
}

function getArrayConcatType(left: PType, right: PType, sourceLocation: SourceLocation) {
  if (left instanceof ARC4ArrayType) {
    if (right instanceof ARC4ArrayType) {
      sameElementType(left.elementType, right.elementType, sourceLocation)
      if (left.equals(DynamicBytesType) || left instanceof StaticBytesType) {
        return DynamicBytesType
      }
      return new DynamicArrayType({
        elementType: left.elementType,
      })
    }
  } else if (left instanceof ArrayPType || left instanceof ArrayLiteralPType) {
    if (right instanceof ArrayPType || right instanceof ArrayLiteralPType || right instanceof ARC4ArrayType) {
      sameElementType(left.elementType, right.elementType, sourceLocation)
      return new ArrayPType({
        elementType: left.elementType,
      })
    }
    if (right instanceof TuplePType) {
      right.items.forEach((i) => sameElementType(left.elementType, i, sourceLocation))
      return new ArrayPType({
        elementType: left.elementType,
      })
    }
  }
  cannotConcat(left, right, sourceLocation)
}

function cannotConcat(left: PType, right: PType, sourceLocation: SourceLocation): never {
  throw new CodeError(`Cannot concat ${left} with ${right}`, { sourceLocation })
}

function sameElementType(left: PType, right: PType, sourceLocation: SourceLocation) {
  codeInvariant(left.equals(right), `Cannot concat array of type ${left} with iterable of type ${right}`, sourceLocation)
}
