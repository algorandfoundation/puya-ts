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
  StringCompat,
  str,
  Account,
} from '@algorandfoundation/algo-ts'
import { encodeBytes, makeBigUint, makeBytes, makeNumber, makeStr, makeUint64, makeUInt8Array } from './primitives'
import { buildOpsImplementation } from './ops-implementation'
import { Transaction } from './transactions/runtime'
import { AssertError, avmError, AvmError } from './errors'
import { AccountCls, ApplicationCls, AssetCls } from './reference'

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
    return arrayLike.at(makeNumber(index)) ?? avmError('Index out of bounds')
  }
  arraySlice<T>(arrayLike: T[], start: Uint64Compat, end: Uint64Compat): T[] {
    return arrayLike.slice(makeNumber(start), makeNumber(end))
  }

  application(id: uint64): Application {
    return new ApplicationCls(id)
  }
  asset(id: uint64): Asset {
    return new AssetCls(id)
  }

  log(...args: (Uint64Compat | BytesCompat)[]): void {
    this.#logs.push(args.map(encodeBytes).reduce((left, right) => left.concat(right)))
  }
  get ops(): Partial<internal.OpsImplementation> {
    return buildOpsImplementation(this.#txnGroup)
  }
  makeUint64(v: Uint64Compat): uint64 {
    return makeUint64(v)
  }
  makeInterpolatedBytes(b: TemplateStringsArray, replacements: BytesCompat[]): bytes {
    return b
      .flatMap((templateText, index) => {
        const replacement = replacements[index]
        if (replacement) {
          return [makeBytes(templateText), makeBytes(replacement)]
        }
        return [makeBytes(templateText)]
      })
      .reduce((a, b) => a.concat(b))
  }
  makeString(s: StringCompat): str {
    return makeStr(s)
  }

  makeBytes(b: BytesCompat): bytes {
    return makeBytes(b)
  }
  makeBigUint(v: BigUintCompat): biguint {
    return makeBigUint(v)
  }
  get rawLogs() {
    return this.#logs.map(makeUInt8Array)
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
