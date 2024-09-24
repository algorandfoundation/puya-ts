import { bytes } from '../primitives'
import { Account } from '../reference'
import { AssertError } from './errors'
import { BytesCls } from './primitives'

export class GlobalStateCls<ValueType> {
  private readonly _type: string = GlobalStateCls.name

  #value: ValueType | undefined
  key: bytes | undefined

  delete: () => void = () => {
    this.#value = undefined
  }

  static [Symbol.hasInstance](x: unknown): x is GlobalStateCls<unknown> {
    return x instanceof Object && '_type' in x && (x as { _type: string })['_type'] === GlobalStateCls.name
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

  constructor(key?: bytes | string, value?: ValueType) {
    this.key = BytesCls.fromCompat(key).asAlgoTs()
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

  getValue(account: Account): LocalStateCls<ValueType> {
    if (!this.#value.has(account.bytes)) {
      this.#value.set(account.bytes, new LocalStateCls<ValueType>())
    }
    return this.#value.get(account.bytes)!
  }
}
