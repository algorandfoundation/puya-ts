import { ctxMgr } from './execution-context'
import { BtoiType, Ed25519verifyBareType, GlobalType, GTxnType, ItobType, TxnType } from './op-types'
import { bytes } from './primitives'

export const btoi: BtoiType = (bytes) => {
  return ctxMgr.instance.op.btoi!(bytes)
}
export const itob: ItobType = (value) => {
  return ctxMgr.instance.op.itob!(value)
}

export const GTxn: GTxnType = new Proxy({} as GTxnType, {
  get: (_target, prop) => {
    return Reflect.get(ctxMgr.instance.op.GTxn!, prop)
  },
})

export const Txn: TxnType = new Proxy({} as TxnType, {
  get: (_target, prop) => {
    return Reflect.get(ctxMgr.instance.op.Txn!, prop)
  },
})

export const Global: GlobalType = new Proxy({} as GlobalType, {
  get: (_target, prop) => {
    return Reflect.get(ctxMgr.instance.op.Global!, prop)
  },
})

export const ed25519verifyBare: Ed25519verifyBareType = (a: bytes, b: bytes, c: bytes) => {
  throw new Error('TODO')
}
