import { internal } from '@algorandfoundation/algo-ts'

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
