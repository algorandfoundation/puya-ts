import { ctxMgr } from './execution-context'
import { BytesCls, StubBytesCompat, StubUint64Compat, Uint64Cls } from './impl/primitives'
import { BtoiType, Ed25519verifyBareType, GlobalType, GTxnType, ItobType, TxnType } from './op-types'
import { bytes, uint64 } from './primitives'

export const btoi: BtoiType = (bytes: StubBytesCompat): uint64 => {
  return BytesCls.fromCompat(bytes).toUint64().asAlgoTs()
}
export const itob: ItobType = (value: StubUint64Compat): bytes => {
  return Uint64Cls.fromCompat(value).toBytes().asAlgoTs()
}
export const GTxn: GTxnType = new Proxy({} as GTxnType, {
  get: (_target, prop) => {
    return Reflect.get(ctxMgr.instance.op.GTxn, prop)
  },
})

export const Txn: TxnType = new Proxy({} as TxnType, {
  get: (_target, prop) => {
    return Reflect.get(ctxMgr.instance.op.Txn, prop)
  },
})

export const Global: GlobalType = new Proxy({} as GlobalType, {
  get: (_target, prop) => {
    return Reflect.get(ctxMgr.instance.op.Global, prop)
  },
})

export const ed25519verifyBare: Ed25519verifyBareType = (a: bytes, b: bytes, c: bytes) => {
  throw new Error('TODO')
}
