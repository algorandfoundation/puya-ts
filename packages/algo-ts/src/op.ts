import { ctxMgr } from './execution-context'
import {
  AddwType,
  Base64DecodeType,
  BitLengthType,
  BsqrtType,
  BtoiType,
  BzeroType,
  DivmodwType,
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
export const bitLength: BitLengthType = (a) => {
  return ctxMgr.instance.op.bitLength!(a)
}
export const bsqrt: BsqrtType = (a) => {
  return ctxMgr.instance.op.bsqrt!(a)
}
export const btoi: BtoiType = (a) => {
  return ctxMgr.instance.op.btoi!(a)
}
export const bzero: BzeroType = (a) => {
  return ctxMgr.instance.op.bzero!(a)
}
export const divmodw: DivmodwType = (a, b, c, d) => {
  return ctxMgr.instance.op.divmodw!(a, b, c, d)
}
export const itob: ItobType = (a) => {
  return ctxMgr.instance.op.itob!(a)
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
