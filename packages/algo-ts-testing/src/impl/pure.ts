import { bytes, internal, Uint64, uint64 } from '@algorandfoundation/algo-ts'
import { MAX_UINT64 } from '../constants'
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

export const bitLength = (value: internal.primitives.StubUint64Compat | internal.primitives.StubBytesCompat): uint64 => {
  const uint64Cls = asMaybeUint64Cls(value)
  const bigUintCls = asMaybeBytesCls(value)?.toBigUint()
  const bigIntValue = (uint64Cls?.asBigInt() ?? bigUintCls?.asBigInt())!
  if (bigIntValue === 0n) {
    return Uint64(0)
  }
  const binaryValue = bigIntValue.toString(2)
  return Uint64(binaryValue.length)
}

export const btoi = (value: internal.primitives.StubBytesCompat): uint64 => {
  const bytesValue = internal.primitives.BytesCls.fromCompat(value)
  if (bytesValue.length.asAlgoTs() > 8) {
    internal.errors.avmError(`btoi arg too long, got [${bytesValue.length.valueOf()}]bytes`)
  }
  return bytesValue.toUint64().asAlgoTs()
}

export const itob = (value: internal.primitives.StubUint64Compat): bytes => {
  return internal.primitives.Uint64Cls.fromCompat(value).toBytes().asAlgoTs()
}

const toUint128 = (value: bigint): [uint64, uint64] => {
  const cf = value >> 64n
  const rest = value & MAX_UINT64
  return [Uint64(cf), Uint64(rest)]
}
