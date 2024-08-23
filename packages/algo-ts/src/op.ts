import { ctxMgr } from './execution-context'
import {
  AddwType,
  Base64DecodeType,
  BitLengthType,
  BtoiType,
  Ed25519verifyBareType,
  GlobalType,
  GTxnType,
  ItobType,
  TxnType,
} from './op-types'
import { bytes } from './primitives'

export const addw: AddwType = (a, b) => {
  return ctxMgr.instance.op.addw!(a, b)
}
export const base64Decode: Base64DecodeType = (e, a) => {
  return ctxMgr.instance.op.base64Decode!(e, a)
}
export const bitLength: BitLengthType = (value) => {
  return ctxMgr.instance.op.bitLength!(value)
}
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
