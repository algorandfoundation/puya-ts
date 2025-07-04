import type {
  ArrayLiteralPType,
  ArrayPType,
  FixedArrayPType,
  IterableIteratorType,
  MutableTuplePType,
  PType,
  ReadonlyArrayPType,
  ReadonlyTuplePType,
  ReferenceArrayType,
} from '..'
import { UnionPType } from '..'
import type { DynamicArrayType, StaticArrayType } from '../arc4-types'
import { DefaultVisitor } from './default-visitor'

export class IteratorTypeVisitor extends DefaultVisitor<PType | undefined> {
  static accept(ptype: PType): PType | undefined {
    return ptype.accept(new IteratorTypeVisitor())
  }

  defaultReturn(ptype: PType): PType | undefined {
    return undefined
  }

  visitIterableIterator(ptype: IterableIteratorType): PType | undefined {
    return ptype.itemType
  }

  visitReferenceArrayType(ptype: ReferenceArrayType): PType | undefined {
    return ptype.elementType
  }
  visitDynamicArrayType(ptype: DynamicArrayType): PType | undefined {
    return ptype.elementType
  }
  visitStaticArrayType(ptype: StaticArrayType): PType | undefined {
    return ptype.elementType
  }
  visitFixedArrayPType(ptype: FixedArrayPType): PType | undefined {
    return ptype.elementType
  }
  visitReadonlyArrayPType(ptype: ReadonlyArrayPType): PType | undefined {
    return ptype.elementType
  }
  visitArrayPType(ptype: ArrayPType): PType | undefined {
    return ptype.elementType
  }
  visitReadonlyTuplePType(ptype: ReadonlyTuplePType): PType | undefined {
    return UnionPType.fromTypes(ptype.items)
  }
  visitMutableTuplePType(ptype: MutableTuplePType): PType | undefined {
    return UnionPType.fromTypes(ptype.items)
  }
  visitArrayLiteralPType(ptype: ArrayLiteralPType): PType | undefined {
    return UnionPType.fromTypes(ptype.items)
  }
}
