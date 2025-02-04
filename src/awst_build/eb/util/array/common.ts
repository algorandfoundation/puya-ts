import type { SourceLocation } from '../../../../awst/source-location'
import { CodeError } from '../../../../errors'
import type { PType } from '../../../ptypes'
import { ArrayLiteralPType, ArrayPType } from '../../../ptypes'
import { ARC4ArrayType } from '../../../ptypes/arc4-types'

export function arrayElementType(arrayType: PType, sourceLocation: SourceLocation) {
  if (arrayType instanceof ARC4ArrayType) return arrayType.elementType
  if (arrayType instanceof ArrayPType) return arrayType.elementType
  if (arrayType instanceof ArrayLiteralPType) return arrayType.elementType
  throw new CodeError(`${arrayType} does not appear to be an array type`, { sourceLocation })
}
