import type { SourceLocation } from '../../../awst/source-location'
import { CodeError, throwError } from '../../../errors'
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

export function hasProperty(ptype: PType, property: string, sourceLocation: SourceLocation) {
  return Boolean(getIndexType(ptype, property, sourceLocation))
}
export function hasPropertyOfType(ptype: PType, property: string, propType: PType, sourceLocation: SourceLocation) {
  return Boolean(getIndexType(ptype, property, sourceLocation)?.equals(propType))
}
export function getPropertyType(ptype: PType, property: string, sourceLocation: SourceLocation) {
  return (
    getIndexType(ptype, property, sourceLocation) ??
    throwError(new CodeError(`Property ${property} does not exist on ${ptype.name}`, { sourceLocation }))
  )
}

export function getIndexType(ptype: PType, index: bigint | string, sourceLocation: SourceLocation) {
  return IndexTypeVisitor.accept(ptype, index, sourceLocation)
}

export class IndexTypeVisitor extends DefaultVisitor<PType | undefined> {
  constructor(
    private readonly index: string | bigint,
    private readonly sourceLocation: SourceLocation,
  ) {
    super()
  }

  /**
   * Return the type that would result from accessing the specified index of a value of this type.
   *
   * @param ptype
   * @param index
   * @param sourceLocation
   */
  static accept(ptype: PType, index: string | bigint, sourceLocation: SourceLocation): PType | undefined {
    return ptype.accept(new IndexTypeVisitor(index, sourceLocation))
  }

  defaultReturn(ptype: PType): PType | undefined {
    throw new CodeError(`${ptype.name} is not indexable by ${typeof this.index === 'bigint' ? 'number' : 'string'}`, {
      sourceLocation: this.sourceLocation,
    })
  }

  visitARC4StructType(ptype: ARC4StructType): PType | undefined {
    if (typeof this.index === 'string') {
      return ptype.fields[this.index]
    }
    return super.visitARC4StructType(ptype)
  }

  visitObjectPType(ptype: ObjectPType): PType | undefined {
    if (typeof this.index === 'string') {
      return ptype.properties[this.index]
    }
    return super.visitObjectPType(ptype)
  }

  visitMutableObjectType(ptype: MutableObjectType): PType | undefined {
    if (typeof this.index === 'string') {
      return ptype.fields[this.index]
    }
    return super.visitMutableObjectType(ptype)
  }

  visitReferenceArrayType(ptype: ReferenceArrayType): PType | undefined {
    if (typeof this.index === 'bigint') {
      return ptype.elementType
    }
    return super.visitReferenceArrayType(ptype)
  }

  visitDynamicArrayType(ptype: DynamicArrayType): PType | undefined {
    if (typeof this.index === 'bigint') {
      return ptype.elementType
    }
    return super.visitDynamicArrayType(ptype)
  }

  visitStaticArrayType(ptype: StaticArrayType): PType | undefined {
    if (typeof this.index === 'bigint') {
      return this.index >= 0 && this.index < ptype.arraySize ? ptype.elementType : undefined
    }
    return super.visitStaticArrayType(ptype)
  }

  visitFixedArrayPType(ptype: FixedArrayPType): PType | undefined {
    if (typeof this.index === 'bigint') {
      return this.index >= 0 && this.index < ptype.arraySize ? ptype.elementType : undefined
    }
    return super.visitFixedArrayPType(ptype)
  }

  visitReadonlyArrayPType(ptype: ReadonlyArrayPType): PType | undefined {
    if (typeof this.index === 'bigint') {
      return ptype.elementType
    }
    return super.visitReadonlyArrayPType(ptype)
  }

  visitArrayPType(ptype: ArrayPType): PType | undefined {
    if (typeof this.index === 'bigint') {
      return ptype.elementType
    }
    return super.visitArrayPType(ptype)
  }

  visitReadonlyTuplePType(ptype: ReadonlyTuplePType): PType | undefined {
    if (typeof this.index === 'bigint') {
      return ptype.items[Number(this.index)]
    }
    return super.visitReadonlyTuplePType(ptype)
  }

  visitMutableTuplePType(ptype: MutableTuplePType): PType | undefined {
    if (typeof this.index === 'bigint') {
      return ptype.items[Number(this.index)]
    }
    return super.visitMutableTuplePType(ptype)
  }

  visitArrayLiteralPType(ptype: ArrayLiteralPType): PType | undefined {
    if (typeof this.index === 'bigint') {
      return ptype.items[Number(this.index)]
    }
    return super.visitArrayLiteralPType(ptype)
  }
}
