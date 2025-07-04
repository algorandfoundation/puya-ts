import type { ARC4StructType, ARC4TupleType, DynamicArrayType, StaticArrayType } from '../arc4-types'
import type { PType } from '../base'
import type {
  ArrayLiteralPType,
  ArrayPType,
  FixedArrayPType,
  ImmutableObjectPType,
  MutableObjectPType,
  MutableTuplePType,
  ReadonlyArrayPType,
  ReadonlyTuplePType,
  ReferenceArrayType,
} from '../index'
import { DefaultVisitor } from './default-visitor'

export function isMutableType(ptype: PType) {
  return ptype.accept(new IsMutableVisitor())
}

export function containsMutableType(ptype: PType) {
  return ptype.accept(new ContainsMutableVisitor())
}

export function isOrContainsMutableType(ptype: PType) {
  return isMutableType(ptype) || containsMutableType(ptype)
}

class ContainsMutableVisitor extends DefaultVisitor<boolean> {
  readonly isMutableVisitor = new IsMutableVisitor()

  constructor() {
    super()
  }

  /**
   * Does this ptype contain a mutable type
   *
   * @param ptype
   */
  static accept(ptype: PType): boolean {
    return ptype.accept(new ContainsMutableVisitor())
  }

  defaultReturn(ptype: PType): boolean {
    return false
  }

  visitARC4StructType(ptype: ARC4StructType): boolean {
    return Object.values(ptype.fields).some((t) => t.accept(this) || t.accept(this.isMutableVisitor))
  }

  visitARC4TupleType(ptype: ARC4TupleType): boolean {
    return ptype.items.some((t) => t.accept(this) || t.accept(this.isMutableVisitor))
  }

  visitImmutableObjectPType(ptype: ImmutableObjectPType): boolean {
    return Object.values(ptype.properties).some((t) => t.accept(this) || t.accept(this.isMutableVisitor))
  }

  visitMutableObjectPType(ptype: MutableObjectPType): boolean {
    return Object.values(ptype.properties).some((t) => t.accept(this) || t.accept(this.isMutableVisitor))
  }

  visitReferenceArrayType(ptype: ReferenceArrayType): boolean {
    return ptype.elementType.accept(this) || ptype.elementType.accept(this.isMutableVisitor)
  }

  visitDynamicArrayType(ptype: DynamicArrayType): boolean {
    return ptype.elementType.accept(this) || ptype.elementType.accept(this.isMutableVisitor)
  }

  visitStaticArrayType(ptype: StaticArrayType): boolean {
    return ptype.elementType.accept(this) || ptype.elementType.accept(this.isMutableVisitor)
  }

  visitFixedArrayPType(ptype: FixedArrayPType): boolean {
    return ptype.elementType.accept(this) || ptype.elementType.accept(this.isMutableVisitor)
  }

  visitReadonlyArrayPType(ptype: ReadonlyArrayPType): boolean {
    return ptype.elementType.accept(this) || ptype.elementType.accept(this.isMutableVisitor)
  }

  visitArrayPType(ptype: ArrayPType): boolean {
    return ptype.elementType.accept(this) || ptype.elementType.accept(this.isMutableVisitor)
  }

  visitReadonlyTuplePType(ptype: ReadonlyTuplePType): boolean {
    return ptype.items.some((t) => t.accept(this) || t.accept(this.isMutableVisitor))
  }

  visitMutableTuplePType(ptype: MutableTuplePType): boolean {
    return ptype.items.some((t) => t.accept(this) || t.accept(this.isMutableVisitor))
  }

  visitArrayLiteralPType(ptype: ArrayLiteralPType): boolean {
    return ptype.items.some((t) => t.accept(this) || t.accept(this.isMutableVisitor))
  }
}

class IsMutableVisitor extends DefaultVisitor<boolean> {
  /**
   * Is this ptype a mutable type
   *
   * @param ptype
   */
  static accept(ptype: PType): boolean {
    return ptype.accept(new ContainsMutableVisitor())
  }

  defaultReturn(ptype: PType): boolean {
    return false
  }

  visitARC4StructType(ptype: ARC4StructType): boolean {
    return !ptype.frozen
  }

  visitARC4TupleType(ptype: ARC4TupleType): boolean {
    return true
  }

  visitMutableObjectPType(ptype: MutableObjectPType): boolean {
    return true
  }

  visitReferenceArrayType(ptype: ReferenceArrayType): boolean {
    return true
  }

  visitDynamicArrayType(ptype: DynamicArrayType): boolean {
    return !ptype.immutable
  }

  visitStaticArrayType(ptype: StaticArrayType): boolean {
    return !ptype.immutable
  }

  visitFixedArrayPType(ptype: FixedArrayPType): boolean {
    return true
  }

  visitArrayPType(ptype: ArrayPType): boolean {
    return true
  }

  visitMutableTuplePType(ptype: MutableTuplePType): boolean {
    return true
  }
}
