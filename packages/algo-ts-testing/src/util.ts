import { internal } from '@algorandfoundation/algo-ts'
import { TestExecutionContext } from './test-execution-context'

export const nameOfType = (x: unknown) => {
  if (typeof x === 'object') {
    if (x === null) return 'Null'
    if (x === undefined) return 'undefined'
    if ('constructor' in x) {
      return x.constructor.name
    }
  }
  return typeof x
}

export function* iterBigInt(start: bigint, end: bigint): Generator<bigint> {
  for (let i = start; i < end; i++) {
    yield BigInt(i)
  }
}

export function asBigInt(v: internal.primitives.StubUint64Compat): bigint {
  return internal.primitives.Uint64Cls.fromCompat(v).value
}

export function extractGenericTypeArgs(t: string): string[] {
  const match = t.match(/<(.*)>/)
  if (!match) return []
  return match[1].split(',').map((x) => x.trim())
}

export const getTestExecutionContext = (): TestExecutionContext => internal.ctxMgr.instance as TestExecutionContext
