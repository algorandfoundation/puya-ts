import { bytes } from '../primitives'
import { Account } from '../reference'
import { AssertError } from './errors'

export class GlobalStateCls<ValueType> {
  #value: ValueType | undefined
  key: bytes | undefined
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

  constructor(key?: bytes, value?: ValueType) {
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
  #value = new Map<bytes, LocalStateCls<ValueType>>()
  key: bytes | undefined

  constructor(key?: bytes) {
    this.key = key
  }

  getValue(account: Account): LocalStateCls<ValueType> {
    if (!this.#value.has(account.bytes)) {
      this.#value.set(account.bytes, new LocalStateCls<ValueType>())
    }
    return this.#value.get(account.bytes)!
  }
}
