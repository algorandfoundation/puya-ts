import { bytes, internal, Uint64, uint64 } from '@algorandfoundation/algo-ts'
import { MAX_UINT64 } from '../constants'

export const addw: internal.opTypes.AddwType = (
  a: internal.primitives.StubUint64Compat,
  b: internal.primitives.StubUint64Compat,
): readonly [uint64, uint64] => {
  const uint64A = internal.primitives.Uint64Cls.fromCompat(a)
  const uint64B = internal.primitives.Uint64Cls.fromCompat(b)
  const sum = uint64A.asBigInt() + uint64B.asBigInt()
  return toUint128(sum)
}

export const btoi: internal.opTypes.BtoiType = (value: internal.primitives.StubBytesCompat): uint64 => {
  const bytesValue = internal.primitives.BytesCls.fromCompat(value)
  if (bytesValue.length.asAlgoTs() > 8) {
    internal.errors.avmError(`btoi arg too long, got [${bytesValue.length.valueOf()}]bytes`)
  }
  return bytesValue.toUint64().asAlgoTs()
}

export const itob: internal.opTypes.ItobType = (value: internal.primitives.StubUint64Compat): bytes => {
  return internal.primitives.Uint64Cls.fromCompat(value).toBytes().asAlgoTs()
}

const toUint128 = (value: bigint): [uint64, uint64] => {
  const cf = value >> 64n
  const rest = value & MAX_UINT64
  return [Uint64(cf), Uint64(rest)]
}
