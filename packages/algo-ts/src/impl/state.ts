import { bytes } from '../primitives'
import { Account } from '../reference'
import { AssertError } from './errors'

export class GlobalStateCls<ValueType> {
  private readonly _instanceType: string = GlobalStateCls.name
  private readonly _type: string

  #value: ValueType | undefined
  key: bytes | undefined

  delete: () => void = () => {
    this.#value = undefined
  }

  static [Symbol.hasInstance](x: unknown): x is GlobalStateCls<unknown> {
    return x instanceof Object && '_instanceType' in x && (x as { _instanceType: string })['_instanceType'] === GlobalStateCls.name
  }

  get value(): ValueType {
    if (this.#value === undefined) {
      throw new AssertError('value is not set')
    }
    return this.#value
  }

  set value(v: ValueType) {
    this.#value = v
  }

  get hasValue(): boolean {
    return this.#value !== undefined
  }

  constructor(type: string, key?: bytes, value?: ValueType) {
    this._type = type
    this.key = key
    this.#value = value
  }
}

export class LocalStateCls<ValueType> {
  #value: ValueType | undefined
  delete: () => void = () => {
    this.#value = undefined
  }
  get value(): ValueType {
    if (this.#value === undefined) {
      throw new AssertError('value is not set')
    }
    return this.#value
  }

  set value(v: ValueType) {
    this.#value = v
  }

  get hasValue(): boolean {
    return this.#value !== undefined
  }
}

export class LocalStateMapCls<ValueType> {
  private readonly _type: string

  #value = new Map<bytes, LocalStateCls<ValueType>>()

  constructor(type: string) {
    this._type = type
  }

  getValue(account: Account): LocalStateCls<ValueType> {
    if (!this.#value.has(account.bytes)) {
      this.#value.set(account.bytes, new LocalStateCls<ValueType>())
    }
    return this.#value.get(account.bytes)!
  }
}
