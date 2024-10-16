import { bytes, Uint64 } from '../primitives'
import { Account } from '../reference'
import { uint8ArrayToHex } from './encoding-util'
import { AssertError } from './errors'
import { BytesCls, Uint64Cls } from './primitives'

export class GlobalStateCls<ValueType> {
  private readonly _type: string = GlobalStateCls.name

  #value: ValueType | undefined
  key: bytes | undefined

  delete: () => void = () => {
    if (this.#value instanceof Uint64Cls) {
      this.#value = Uint64(0) as ValueType
    } else {
      this.#value = undefined
    }
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
    this.key = key !== undefined ? BytesCls.fromCompat(key).asAlgoTs() : undefined
    this.#value = value
  }
}

export class LocalStateCls<ValueType> {
  #value: ValueType | undefined
  delete: () => void = () => {
    if (this.#value instanceof Uint64Cls) {
      this.#value = Uint64(0) as ValueType
    } else {
      this.#value = undefined
    }
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
  #value = new Map<string, LocalStateCls<ValueType>>()

  getValue(account: Account): LocalStateCls<ValueType> {
    const accountString = uint8ArrayToHex(BytesCls.fromCompat(account.bytes).asUint8Array())
    if (!this.#value.has(accountString)) {
      this.#value.set(accountString, new LocalStateCls<ValueType>())
    }
    return this.#value.get(accountString)!
  }
}
