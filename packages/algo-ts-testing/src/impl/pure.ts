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

export const divw = (
  a: internal.primitives.StubUint64Compat,
  b: internal.primitives.StubUint64Compat,
  c: internal.primitives.StubUint64Compat,
): uint64 => {
  const i = uint128ToBigInt(a, b)
  const j = internal.primitives.Uint64Cls.fromCompat(c).asBigInt()
  return Uint64(i / j)
}

export const exp = (a: internal.primitives.StubUint64Compat, b: internal.primitives.StubUint64Compat): uint64 => {
  const base = internal.primitives.Uint64Cls.fromCompat(a).asBigInt()
  const exponent = internal.primitives.Uint64Cls.fromCompat(b).asBigInt()
  if (base === 0n && exponent === 0n) {
    throw internal.errors.codeError('0 ** 0 is undefined')
  }
  return Uint64(base ** exponent)
}

export const expw = (a: internal.primitives.StubUint64Compat, b: internal.primitives.StubUint64Compat): readonly [uint64, uint64] => {
  const base = internal.primitives.Uint64Cls.fromCompat(a).asBigInt()
  const exponent = internal.primitives.Uint64Cls.fromCompat(b).asBigInt()
  if (base === 0n && exponent === 0n) {
    throw internal.errors.codeError('0 ** 0 is undefined')
  }
  return toUint128(base ** exponent)
}

export const extract = (
  a: internal.primitives.StubBytesCompat,
  b: internal.primitives.StubUint64Compat,
  c: internal.primitives.StubUint64Compat,
): bytes => {
  const bytesValue = internal.primitives.BytesCls.fromCompat(a)
  const bytesLength = bytesValue.length.asBigInt()

  const start = internal.primitives.Uint64Cls.fromCompat(b).asBigInt()
  const length = internal.primitives.Uint64Cls.fromCompat(c).asBigInt()
  let end = start + length
  if ((typeof b === 'number' || typeof b === 'bigint') && (typeof c === 'number' || typeof c === 'bigint') && length === 0n) {
    end = bytesLength
  }

  if (start > bytesLength) {
    internal.errors.codeError(`extraction start ${start} is beyond length`)
  }
  if (end > bytesLength) {
    internal.errors.codeError(`extraction end ${end} is beyond length`)
  }

  return bytesValue.slice(start, end).asAlgoTs()
}

export const extractUint16 = (a: internal.primitives.StubBytesCompat, b: internal.primitives.StubUint64Compat): uint64 => {
  const result = extract(a, b, 2)
  const bytesResult = internal.primitives.BytesCls.fromCompat(result)
  return bytesResult.toUint64().asAlgoTs()
}

export const extractUint32 = (a: internal.primitives.StubBytesCompat, b: internal.primitives.StubUint64Compat): uint64 => {
  const result = extract(a, b, 4)
  const bytesResult = internal.primitives.BytesCls.fromCompat(result)
  return bytesResult.toUint64().asAlgoTs()
}

export const extractUint64 = (a: internal.primitives.StubBytesCompat, b: internal.primitives.StubUint64Compat): uint64 => {
  const result = extract(a, b, 8)
  const bytesResult = internal.primitives.BytesCls.fromCompat(result)
  return bytesResult.toUint64().asAlgoTs()
}

export const getBit = (
  a: internal.primitives.StubUint64Compat | internal.primitives.StubBytesCompat,
  b: internal.primitives.StubUint64Compat,
): uint64 => {
  let binaryString: string
  const uint64Cls = asMaybeUint64Cls(a)
  const bytesCls = asMaybeBytesCls(a)

  if (uint64Cls) {
    binaryString = [...uint64Cls.toBytes().asUint8Array()]
      .reverse()
      .map((x) => x.toString(2).padStart(8, '0'))
      .join('')
  } else if (bytesCls) {
    binaryString = [...bytesCls.asUint8Array()].map((x) => x.toString(2).padStart(8, '0')).join('')
  } else {
    internal.errors.codeError('unknown type for argument a')
  }

  const index = internal.primitives.Uint64Cls.fromCompat(b).asNumber()
  if (index >= binaryString.length) {
    internal.errors.codeError(`getBit index ${index} is beyond length`)
  }
  return binaryString[index] === '1' ? Uint64(1) : Uint64(0)
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
