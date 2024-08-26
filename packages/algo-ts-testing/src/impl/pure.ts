import { biguint, Bytes, bytes, internal, Uint64, uint64 } from '@algorandfoundation/algo-ts'
import { MAX_BYTES_SIZE, MAX_UINT64 } from '../constants'
import { asMaybeBytesCls, asMaybeUint64Cls } from '../util'

export const addw = (a: internal.primitives.StubUint64Compat, b: internal.primitives.StubUint64Compat): readonly [uint64, uint64] => {
  const uint64A = internal.primitives.Uint64Cls.fromCompat(a)
  const uint64B = internal.primitives.Uint64Cls.fromCompat(b)
  const sum = uint64A.asBigInt() + uint64B.asBigInt()
  return toUint128(sum)
}

export const base64Decode = (e: internal.opTypes.Base64, a: internal.primitives.StubBytesCompat): bytes => {
  const encoding = e === internal.opTypes.Base64.StdEncoding ? 'base64' : 'base64url'
  const bytesValue = internal.primitives.BytesCls.fromCompat(a)
  const stringValue = bytesValue.toString()

  const bufferResult = Buffer.from(stringValue, encoding)
  if (bufferResult.toString(encoding) !== stringValue) {
    internal.errors.avmError('illegal base64 data')
  }

  const uint8ArrayResult = new Uint8Array(bufferResult)
  return internal.primitives.BytesCls.fromCompat(uint8ArrayResult).asAlgoTs()
}

export const bitLength = (a: internal.primitives.StubUint64Compat | internal.primitives.StubBytesCompat): uint64 => {
  const uint64Cls = asMaybeUint64Cls(a)
  const bigUintCls = asMaybeBytesCls(a)?.toBigUint()
  const bigIntValue = (uint64Cls?.asBigInt() ?? bigUintCls?.asBigInt())!
  const binaryValue = bigIntValue === 0n ? '' : bigIntValue.toString(2)
  return Uint64(binaryValue.length)
}

export const bsqrt = (a: internal.primitives.StubBigUintCompat): biguint => {
  const bigUintClsValue = internal.primitives.BigUintCls.fromCompat(a)
  const bigintValue = internal.primitives.checkBigUint(bigUintClsValue.asBigInt())
  const sqrtValue = squareroot(bigintValue)
  return internal.primitives.BigUintCls.fromCompat(sqrtValue).asAlgoTs()
}

export const btoi = (a: internal.primitives.StubBytesCompat): uint64 => {
  const bytesValue = internal.primitives.BytesCls.fromCompat(a)
  if (bytesValue.length.asAlgoTs() > 8) {
    internal.errors.avmError(`btoi arg too long, got [${bytesValue.length.valueOf()}]bytes`)
  }
  return bytesValue.toUint64().asAlgoTs()
}

export const bzero = (a: internal.primitives.StubUint64Compat): bytes => {
  const size = internal.primitives.Uint64Cls.fromCompat(a).asBigInt()
  if (size > MAX_BYTES_SIZE) {
    internal.errors.avmError('bzero attempted to create a too large string')
  }
  return Bytes(new Uint8Array(Array(Number(size)).fill(0x00)))
}

export const concat = (a: internal.primitives.StubBytesCompat, b: internal.primitives.StubBytesCompat): bytes => {
  const bytesA = internal.primitives.BytesCls.fromCompat(a)
  const bytesB = internal.primitives.BytesCls.fromCompat(b)
  return bytesA.concat(bytesB).asAlgoTs()
}

export const divmodw = (
  a: internal.primitives.StubUint64Compat,
  b: internal.primitives.StubUint64Compat,
  c: internal.primitives.StubUint64Compat,
  d: internal.primitives.StubUint64Compat,
): readonly [uint64, uint64, uint64, uint64] => {
  const i = uint128ToBigInt(a, b)
  const j = uint128ToBigInt(c, d)

  const div = i / j
  const mod = i % j
  return [...toUint128(div), ...toUint128(mod)]
}

export const itob = (a: internal.primitives.StubUint64Compat): bytes => {
  return internal.primitives.Uint64Cls.fromCompat(a).toBytes().asAlgoTs()
}

const squareroot = (x: bigint): bigint => {
  let lo = 0n,
    hi = x
  while (lo <= hi) {
    const mid = (lo + hi) / 2n
    if (mid * mid > x) hi = mid - 1n
    else lo = mid + 1n
  }
  return hi
}

const toUint128 = (value: bigint): [uint64, uint64] => {
  const cf = value >> 64n
  const rest = value & MAX_UINT64
  return [Uint64(cf), Uint64(rest)]
}

const uint128ToBigInt = (a: internal.primitives.StubUint64Compat, b: internal.primitives.StubUint64Compat): bigint => {
  const bigIntA = internal.primitives.Uint64Cls.fromCompat(a).asBigInt()
  const bigIntB = internal.primitives.Uint64Cls.fromCompat(b).asBigInt()
  return (bigIntA << 64n) + bigIntB
}
