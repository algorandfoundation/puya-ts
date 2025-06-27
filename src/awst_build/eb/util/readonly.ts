import type { PType } from '../../ptypes'
import { ArrayPType, MutableObjectPType, MutableTuplePType, ReadonlyArrayPType, ReadonlyTuplePType } from '../../ptypes'

export function tryConvertToReadonly(type: PType): PType {
  if (type instanceof MutableTuplePType) {
    return new ReadonlyTuplePType({ items: type.items })
  }
  if (type instanceof ArrayPType) {
    return new ReadonlyArrayPType({ elementType: type.elementType })
  }
  if (type instanceof MutableObjectPType) {
    return type.toImmutable()
  }

  return type
}
