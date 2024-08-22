import { bytes, internal, uint64 } from '@algorandfoundation/algo-ts'

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
