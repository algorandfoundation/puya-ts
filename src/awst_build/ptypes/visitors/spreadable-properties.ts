import type { SourceLocation } from '../../../awst/source-location'
import { CodeError } from '../../../errors'
import type { ARC4StructType } from '../arc4-types'
import type { PType } from '../base'
import type { ImmutableObjectPType, MutableObjectPType, ObjectLiteralPType } from '../index'
import { DefaultVisitor } from './default-visitor'

export function spreadableProperties(ptype: PType, sourceLocation: SourceLocation): ReadonlyArray<[string, PType]> {
  return ptype.accept(new SpreadablePropertiesVisitor(sourceLocation))
}

class SpreadablePropertiesVisitor extends DefaultVisitor<ReadonlyArray<[string, PType]>> {
  constructor(private readonly sourceLocation: SourceLocation) {
    super()
  }

  defaultReturn(ptype: PType): ReadonlyArray<[string, PType]> {
    throw new CodeError(`${ptype} is not spreadable`, { sourceLocation: this.sourceLocation })
  }

  visitImmutableObjectPType(ptype: ImmutableObjectPType): ReadonlyArray<[string, PType]> {
    return ptype.orderedProperties()
  }

  visitObjectLiteralPType(ptype: ObjectLiteralPType): ReadonlyArray<[string, PType]> {
    return ptype.orderedProperties()
  }

  visitARC4StructType(ptype: ARC4StructType): ReadonlyArray<[string, PType]> {
    return Object.entries(ptype.fields)
  }

  visitMutableObjectPType(ptype: MutableObjectPType): ReadonlyArray<[string, PType]> {
    return ptype.orderedProperties()
  }
}
