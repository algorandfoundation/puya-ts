import type { ConstantValue } from '../../../awst'
import type { PTypeOrClass } from '../../ptypes'
import { bigIntPType, biguintPType, boolPType, bytesPType, numberPType, stringPType, uint64PType } from '../../ptypes'
import { UFixedNxMType, UintNType } from '../../ptypes/arc4-types'

export function isValidLiteralForPType(literalValue: ConstantValue, ptype: PTypeOrClass): boolean {
  if (ptype.equals(stringPType)) {
    return typeof literalValue === 'string'
  }
  if (ptype.equals(numberPType)) {
    return (
      typeof literalValue === 'bigint' && BigInt(Number.MIN_SAFE_INTEGER) <= literalValue && literalValue <= BigInt(Number.MAX_SAFE_INTEGER)
    )
  }
  if (ptype.equals(bigIntPType)) {
    return typeof literalValue === 'bigint'
  }
  if (ptype.equals(uint64PType)) {
    return typeof literalValue === 'bigint' && 0 <= literalValue && literalValue < 2n ** 64n
  }
  if (ptype.equals(biguintPType)) {
    return typeof literalValue === 'bigint' && 0 <= literalValue && literalValue < 2n ** 512n
  }
  if (ptype instanceof UintNType || ptype instanceof UFixedNxMType) {
    return typeof literalValue === 'bigint' && 0 <= literalValue && literalValue < 2n ** ptype.n
  }
  if (ptype.equals(boolPType)) {
    return typeof literalValue === 'boolean'
  }
  if (ptype.equals(bytesPType)) {
    return literalValue instanceof Uint8Array
  }
  return false
}
