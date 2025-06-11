import type { ARC4StructType, DynamicArrayType, StaticArrayType } from '../arc4-types'
import type { PType } from '../base'
import type {
  ArrayLiteralPType,
  ArrayPType,
  FixedArrayPType,
  MutableTuplePType,
  ObjectPType,
  ReadonlyArrayPType,
  ReadonlyTuplePType,
  ReferenceArrayType,
} from '../index'
import type { MutableObjectType } from '../mutable-object'
import { DefaultVisitor } from './default-visitor'

export function isMutableType(ptype: PType) {
  return ptype.accept(new IsMutableVisitor())
}

export function containsMutableType(ptype: PType) {
  return ptype.accept(new ContainsMutableVisitor())
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

  visitObjectPType(ptype: ObjectPType): boolean {
    return Object.values(ptype.properties).some((t) => t.accept(this) || t.accept(this.isMutableVisitor))
  }

  visitMutableObjectType(ptype: MutableObjectType): boolean {
    return Object.values(ptype.fields).some((t) => t.accept(this) || t.accept(this.isMutableVisitor))
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
    return true
  }

  visitMutableObjectType(ptype: MutableObjectType): boolean {
    return true
  }

  visitReferenceArrayType(ptype: ReferenceArrayType): boolean {
    return true
  }

  visitDynamicArrayType(ptype: DynamicArrayType): boolean {
    return true
  }

  visitStaticArrayType(ptype: StaticArrayType): boolean {
    return true
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
