import { PType } from './base'
import type { PTypeVisitor } from './visitor'

export class IntrinsicEnumType extends PType {
  readonly [PType.IdSymbol] = 'IntrinsicEnumType'
  readonly wtype: undefined
  readonly name: string
  readonly factory: undefined
  readonly module: string
  readonly members: Array<[string, string]>
  readonly singleton = true

  constructor({ name, module, members }: { name: string; module: string; members: Array<[string, string]> }) {
    super()
    this.members = members
    this.name = name
    this.module = module
  }

  accept<T>(visitor: PTypeVisitor<T>): T {
    return visitor.visitIntrinsicEnumType(this)
  }
}
