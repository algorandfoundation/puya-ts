import { PType } from './base'

export class IntrinsicEnumType extends PType {
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
}
