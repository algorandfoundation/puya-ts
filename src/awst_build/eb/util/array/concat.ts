import { intrinsicFactory } from '../../../../awst/intrinsic-factory'
import { nodeFactory } from '../../../../awst/node-factory'
import type { Expression } from '../../../../awst/nodes'
import type { SourceLocation } from '../../../../awst/source-location'
import { wtypes } from '../../../../awst/wtypes'
import { CodeError } from '../../../../errors'
import { bigIntToUint8Array, codeInvariant } from '../../../../util'
import type { PType } from '../../../ptypes'
import { ArrayLiteralPType, ArrayPType, FixedArrayPType, MutableTuplePType, ReadonlyArrayPType, ReadonlyTuplePType } from '../../../ptypes'
import { ARC4ArrayType, DynamicArrayType, DynamicBytesType, StaticArrayType, StaticBytesType } from '../../../ptypes/arc4-types'
import { containsMutableType } from '../../../ptypes/visitors/contains-mutable-visitor'
import { instanceEb } from '../../../type-registry'
import type { InstanceBuilder } from '../../index'

export function concatArrays(left: InstanceBuilder, right: InstanceBuilder, sourceLocation: SourceLocation): InstanceBuilder {
  if (containsMutableType(left.ptype)) {
    left.checkForUnclonedMutables('when being concatenated')
  }
  if (containsMutableType(right.ptype)) {
    right.checkForUnclonedMutables('when being concatenated')
  }
  if (left.ptype instanceof StaticBytesType || left.ptype instanceof StaticArrayType) {
    /*
      TODO: This is only required because puya doesn't support staticarray + other => dynamic array
      To work around this, we convert arc4 static bytes and static array to dynamic bytes and dynamic array
     */
    const dynamicType = left.ptype instanceof StaticBytesType ? DynamicBytesType : new DynamicArrayType({ ...left.ptype })
    return concatArrays(toArc4Dynamic(left.ptype.arraySize, left.resolve(), dynamicType), right, sourceLocation)
  } else if (left.ptype instanceof FixedArrayPType || left.ptype instanceof ReadonlyArrayPType) {
    /*
      TODO: This is only required because puya doesn't support FixedArray + other => array
      To work around this, we convert fixed array to array
     */
    const arrayType = new ArrayPType({ elementType: left.ptype.elementType })
    const updatedLeft = instanceEb(
      nodeFactory.convertArray({
        expr: left.resolve(),
        wtype: arrayType.wtype,
        sourceLocation: left.sourceLocation,
      }),
      arrayType,
    )
    return concatArrays(updatedLeft, right, sourceLocation)
  }

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
    if (
      right instanceof ArrayPType ||
      right instanceof ArrayLiteralPType ||
      right instanceof ReadonlyArrayPType ||
      right instanceof ARC4ArrayType ||
      right instanceof FixedArrayPType
    ) {
      sameElementType(left.elementType, right.elementType, sourceLocation)
      return new ArrayPType({
        elementType: left.elementType,
      })
    }
    if (right instanceof ReadonlyTuplePType || right instanceof MutableTuplePType) {
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

function toArc4Dynamic(staticSize: bigint, staticBytes: Expression, dynamicType: DynamicArrayType) {
  return instanceEb(
    nodeFactory.reinterpretCast({
      expr: intrinsicFactory.bytesConcat({
        left: nodeFactory.bytesConstant({
          value: bigIntToUint8Array(staticSize, 2),
          sourceLocation: staticBytes.sourceLocation,
        }),
        right: nodeFactory.reinterpretCast({
          expr: staticBytes,
          wtype: wtypes.bytesWType,
          sourceLocation: staticBytes.sourceLocation,
        }),
        sourceLocation: staticBytes.sourceLocation,
      }),
      wtype: dynamicType.wtype,
      sourceLocation: staticBytes.sourceLocation,
    }),
    dynamicType,
  )
}
