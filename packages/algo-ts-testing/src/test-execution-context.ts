import {
  BytesCompat,
  Uint64Compat,
  internal,
  BigUintCompat,
  uint64,
  biguint,
  bytes,
  Application,
  Asset,
  Account,
} from '@algorandfoundation/algo-ts'
import { BigUintCls, BytesCls, toExternalValue, Uint64Cls, toBytes } from './primitives'
import { buildOpsImplementation } from './ops-implementation'
import { Transaction } from './transactions/runtime'
import { AssertError, avmError, AvmError } from './errors'
import { AccountCls, ApplicationCls, AssetCls } from './reference'
import { DeliberateAny } from './typescript-helpers'

export class TestExecutionContext implements internal.ExecutionContext {
  #logs: bytes[] = []
  #txnGroup: Transaction[]

  constructor(txnGroup: Transaction[]) {
    this.#txnGroup = txnGroup
  }

  account(address: bytes): Account {
    return new AccountCls(address)
  }

  arrayAt<T>(arrayLike: T[], index: Uint64Compat): T {
    return arrayLike.at(Uint64Cls.fromCompat(index).asNumber()) ?? avmError('Index out of bounds')
  }
  arraySlice(arrayLike: Uint8Array, start: Uint64Compat, end: Uint64Compat): Uint8Array
  arraySlice<T>(arrayLike: T[], start: Uint64Compat, end: Uint64Compat): T[]
  arraySlice<T>(arrayLike: T[] | Uint8Array, start: Uint64Compat, end: Uint64Compat) {
    return arrayLike.slice(Uint64Cls.getNumber(start), Uint64Cls.getNumber(end)) as DeliberateAny
  }

  application(id: uint64): Application {
    return new ApplicationCls(id)
  }
  asset(id: uint64): Asset {
    return new AssetCls(id)
  }

  log(...args: (Uint64Compat | BytesCompat)[]): void {
    this.#logs.push(args.map(toBytes).reduce((left, right) => left.concat(right)))
  }
  get ops(): Partial<internal.OpsNamespace> {
    return buildOpsImplementation(this.#txnGroup)
  }
  makeUint64(v: Uint64Compat): uint64 {
    return Uint64Cls.fromCompat(v).asAlgoTs()
  }
  makeInterpolatedBytes(b: TemplateStringsArray, replacements: BytesCompat[]): bytes {
    return b
      .flatMap((templateText, index) => {
        const replacement = replacements[index]
        if (replacement) {
          return [BytesCls.fromCompat(templateText), BytesCls.fromCompat(replacement)]
        }
        return [BytesCls.fromCompat(templateText)]
      })
      .reduce((a, b) => a.concat(b))
      .asAlgoTs()
  }

  makeBytes(b: BytesCompat): bytes {
    return BytesCls.fromCompat(b).asAlgoTs()
  }
  makeBigUint(v: BigUintCompat): biguint {
    return BigUintCls.fromCompat(v).asAlgoTs()
  }
  get rawLogs() {
    return this.#logs.map((l) => toExternalValue(l))
  }

  assert(condition: unknown, message?: string): asserts condition {
    if (!condition) {
      throw new AssertError(message ?? 'Assertion failed')
    }
  }

  err(message?: string): never {
    throw new AvmError(message ?? 'Err')
  }
}
