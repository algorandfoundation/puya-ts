import { ObjectPType } from '.'
import type { SourceLocation } from '../../awst/source-location'
import { wtypes } from '../../awst/wtypes'

import { Constants } from '../../constants'
import { ptypeToArc4EncodedType } from '../arc4-util'
import { ARC4EncodedType } from './arc4-types'
import { PType } from './base'

export class MutableObjectClass extends PType {
  readonly name: string
  readonly module: string
  readonly singleton = true
  readonly instanceType: MutableObjectType
  readonly sourceLocation: SourceLocation | undefined
  readonly wtype = undefined
  constructor({
    name,
    module,
    instanceType,
    sourceLocation,
  }: {
    name: string
    module: string
    instanceType: MutableObjectType
    sourceLocation?: SourceLocation
  }) {
    super()
    this.name = name
    this.module = module
    this.sourceLocation = sourceLocation
    this.instanceType = instanceType
  }

  static fromObjectType(ptype: MutableObjectType) {
    return new MutableObjectClass({
      ...ptype,
      instanceType: ptype,
    })
  }
}

export class MutableObjectType extends ARC4EncodedType {
  fixedBitSize: bigint | null
  readonly name: string
  readonly module: string
  readonly description: string | undefined
  readonly singleton = false
  readonly fields: Record<string, PType>
  readonly sourceLocation: SourceLocation | undefined
  readonly frozen: boolean

  constructor({
    name,
    frozen,
    module,
    fields,
    description,
    sourceLocation,
  }: {
    name: string
    module: string
    frozen: boolean
    description: string | undefined
    fields: Record<string, PType>
    sourceLocation?: SourceLocation
  }) {
    super()
    this.name = name
    this.module = module
    this.frozen = frozen
    this.fields = fields
    this.description = description
    this.sourceLocation = sourceLocation
    this.fixedBitSize = sourceLocation
      ? ARC4EncodedType.calculateFixedBitSize(Object.values(fields).map((f) => ptypeToArc4EncodedType(f, sourceLocation)))
      : null
  }

  get nativeType(): ObjectPType {
    return ObjectPType.anonymous(this.fields)
  }

  get wtype(): wtypes.ARC4Struct {
    return new wtypes.ARC4Struct({
      name: this.name,
      fields: Object.fromEntries(Object.entries(this.fields).map(([f, t]) => [f, t.wtypeOrThrow])),
      sourceLocation: this.sourceLocation,
      desc: this.description ?? null,
      frozen: this.frozen,
    })
  }

  get signature(): string {
    return `${this.name}${this.wtype.arc4Alias}`
  }
}

export const mutableObjectBaseType = new MutableObjectType({
  name: 'MutableObjectBase',
  module: Constants.moduleNames.algoTs.mutableObject,
  fields: {},
  description: undefined,
  frozen: false,
})
