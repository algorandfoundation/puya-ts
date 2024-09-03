import { ctxMgr } from './execution-context'
import {
  AddwType,
  Base64DecodeType,
  BitLengthType,
  BsqrtType,
  BtoiType,
  BzeroType,
  ConcatType,
  DivmodwType,
  DivwType,
  Ed25519verifyBareType,
  ExpType,
  ExpwType,
  ExtractType,
  ExtractUint16Type,
  ExtractUint32Type,
  ExtractUint64Type,
  GetBitType,
  GetBytesType,
  GlobalType,
  GTxnType,
  ItobType,
  JsonRefType,
  Keccak256Type,
  MulwType,
  ReplaceType,
  SelectBytesType,
  SelectUint64Type,
  SetBitBytesType,
  SetBitUint64Type,
  SetBytesType,
  Sha256Type,
  Sha3_256Type,
  Sha512_256Type,
  ShlType,
  ShrType,
  SqrtType,
  SubstringType,
  TxnType,
} from './op-types'

export const addw: AddwType = (...args) => {
  return ctxMgr.instance.op.addw!(...args)
}
export const base64Decode: Base64DecodeType = (...args) => {
  return ctxMgr.instance.op.base64Decode!(...args)
}
export const bitLength: BitLengthType = (...args) => {
  return ctxMgr.instance.op.bitLength!(...args)
}
export const bsqrt: BsqrtType = (...args) => {
  return ctxMgr.instance.op.bsqrt!(...args)
}
export const btoi: BtoiType = (...args) => {
  return ctxMgr.instance.op.btoi!(...args)
}
export const bzero: BzeroType = (...args) => {
  return ctxMgr.instance.op.bzero!(...args)
}
export const concat: ConcatType = (...args) => {
  return ctxMgr.instance.op.concat!(...args)
}
export const divmodw: DivmodwType = (...args) => {
  return ctxMgr.instance.op.divmodw!(...args)
}
export const divw: DivwType = (...args) => {
  return ctxMgr.instance.op.divw!(...args)
}
export const exp: ExpType = (...args) => {
  return ctxMgr.instance.op.exp!(...args)
}
export const expw: ExpwType = (...args) => {
  return ctxMgr.instance.op.expw!(...args)
}
export const extract: ExtractType = (...args) => {
  return ctxMgr.instance.op.extract!(...args)
}
export const extractUint16: ExtractUint16Type = (...args) => {
  return ctxMgr.instance.op.extractUint16!(...args)
}
export const extractUint32: ExtractUint32Type = (...args) => {
  return ctxMgr.instance.op.extractUint32!(...args)
}
export const extractUint64: ExtractUint64Type = (...args) => {
  return ctxMgr.instance.op.extractUint64!(...args)
}
export const getBit: GetBitType = (...args) => {
  return ctxMgr.instance.op.getBit!(...args)
}
export const getBytes: GetBytesType = (...args) => {
  return ctxMgr.instance.op.getBytes!(...args)
}
export const itob: ItobType = (...args) => {
  return ctxMgr.instance.op.itob!(...args)
}
export const mulw: MulwType = (...args) => {
  return ctxMgr.instance.op.mulw!(...args)
}
export const replace: ReplaceType = (...args) => {
  return ctxMgr.instance.op.replace!(...args)
}
export const selectBytes: SelectBytesType = (...args) => {
  return ctxMgr.instance.op.selectBytes!(...args)
}
export const selectUint64: SelectUint64Type = (...args) => {
  return ctxMgr.instance.op.selectUint64!(...args)
}
export const setBitBytes: SetBitBytesType = (...args) => {
  return ctxMgr.instance.op.setBitBytes!(...args)
}
export const setBitUint64: SetBitUint64Type = (...args) => {
  return ctxMgr.instance.op.setBitUint64!(...args)
}
export const setBytes: SetBytesType = (...args) => {
  return ctxMgr.instance.op.setBytes!(...args)
}
export const shl: ShlType = (...args) => {
  return ctxMgr.instance.op.shl!(...args)
}
export const shr: ShrType = (...args) => {
  return ctxMgr.instance.op.shr!(...args)
}
export const sqrt: SqrtType = (...args) => {
  return ctxMgr.instance.op.sqrt!(...args)
}
export const substring: SubstringType = (...args) => {
  return ctxMgr.instance.op.substring!(...args)
}
export const JsonRef: JsonRefType = new Proxy({} as JsonRefType, {
  get: (_target, prop) => {
    return Reflect.get(ctxMgr.instance.op.JsonRef!, prop)
  },
})

export const sha256: Sha256Type = (...args) => {
  return ctxMgr.instance.op.sha256!(...args)
}
export const sha3_256: Sha3_256Type = (...args) => {
  return ctxMgr.instance.op.sha3_256!(...args)
}
export const keccak256: Keccak256Type = (...args) => {
  return ctxMgr.instance.op.keccak256!(...args)
}
export const sha512_256: Sha512_256Type = (...args) => {
  return ctxMgr.instance.op.sha512_256!(...args)
}
export const ed25519verifyBare: Ed25519verifyBareType = (...args) => {
  return ctxMgr.instance.op.ed25519verifyBare!(...args)
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
