import { bytes, internal, uint64 } from '@algorandfoundation/algo-ts'

export const btoi: internal.opTypes.BtoiType = (bytes: internal.primitives.StubBytesCompat): uint64 => {
  return internal.primitives.BytesCls.fromCompat(bytes).toUint64().asAlgoTs()
}

export const itob: internal.opTypes.ItobType = (value: internal.primitives.StubUint64Compat): bytes => {
  return internal.primitives.Uint64Cls.fromCompat(value).toBytes().asAlgoTs()
}
