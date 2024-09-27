import { ctxMgr } from './execution-context'

import {
  AddwType,
  BalanceType,
  Base64DecodeType,
  BitLengthType,
  BsqrtType,
  BtoiType,
  BzeroType,
  ConcatType,
  DivmodwType,
  DivwType,
  EcdsaPkDecompressType,
  EcdsaPkRecoverType,
  EcdsaVerifyType,
  Ed25519verifyBareType,
  Ed25519verifyType,
  EllipticCurveType,
  ExpType,
  ExpwType,
  ExtractType,
  ExtractUint16Type,
  ExtractUint32Type,
  ExtractUint64Type,
  GaidType,
  GetBitType,
  GetByteType,
  GlobalType,
  GTxnType,
  ItobType,
  ITxnCreateType,
  ITxnType,
  JsonRefType,
  Keccak256Type,
  MulwType,
  OpsNamespace,
  ReplaceType,
  SelectType,
  SetBitType,
  SetByteType,
  Sha256Type,
  Sha3_256Type,
  Sha512_256Type,
  ShlType,
  ShrType,
  SqrtType,
  SubstringType,
  TxnType,
  VrfVerifyType,
} from './op-types'
import { AnyFunction, DeliberateAny } from './typescript-helpers'

type KeyIsFunction<TKey extends keyof TObj, TObj> = TKey extends DeliberateAny ? (TObj[TKey] extends AnyFunction ? TKey : never) : never
type KeyIsNotFunction<TKey extends keyof TObj, TObj> = TKey extends DeliberateAny ? (TObj[TKey] extends AnyFunction ? never : TKey) : never
type ObjectKeys = KeyIsNotFunction<keyof OpsNamespace, OpsNamespace>
type FunctionKeys = KeyIsFunction<keyof OpsNamespace, OpsNamespace>

const createFunctionProxy = <TName extends FunctionKeys>(name: TName) => {
  return (...args: Parameters<OpsNamespace[TName]>): ReturnType<OpsNamespace[TName]> => {
    const implementation: AnyFunction = (ctxMgr.instance.op as OpsNamespace)[name] as OpsNamespace[TName]
    return implementation(...args) as ReturnType<OpsNamespace[TName]>
  }
}

const createObjectProxy = <TName extends ObjectKeys>(name: TName) => {
  return new Proxy(
    {} as OpsNamespace[TName],
    {
      get<TProperty extends keyof OpsNamespace[TName]>(_target: OpsNamespace[TName], property: TProperty): OpsNamespace[TName][TProperty] {
        return Reflect.get(ctxMgr.instance.op[name]!, property)
      },
    } as ProxyHandler<OpsNamespace[TName]>,
  )
}

export const addw: AddwType = createFunctionProxy('addw')
export const balance: BalanceType = createFunctionProxy('balance')
export const base64Decode: Base64DecodeType = createFunctionProxy('base64Decode')
export const bitLength: BitLengthType = createFunctionProxy('bitLength')
export const bsqrt: BsqrtType = createFunctionProxy('bsqrt')
export const btoi: BtoiType = createFunctionProxy('btoi')
export const bzero: BzeroType = createFunctionProxy('bzero')
export const concat: ConcatType = createFunctionProxy('concat')
export const divmodw: DivmodwType = createFunctionProxy('divmodw')
export const divw: DivwType = createFunctionProxy('divw')
export const ecdsaPkDecompress: EcdsaPkDecompressType = createFunctionProxy('ecdsaPkDecompress')
export const ecdsaPkRecover: EcdsaPkRecoverType = createFunctionProxy('ecdsaPkRecover')
export const ecdsaVerify: EcdsaVerifyType = createFunctionProxy('ecdsaVerify')
export const ed25519verifyBare: Ed25519verifyBareType = createFunctionProxy('ed25519verifyBare')
export const ed25519verify: Ed25519verifyType = createFunctionProxy('ed25519verify')
export const exp: ExpType = createFunctionProxy('exp')
export const expw: ExpwType = createFunctionProxy('expw')
export const extract: ExtractType = createFunctionProxy('extract')
export const extractUint16: ExtractUint16Type = createFunctionProxy('extractUint16')
export const extractUint32: ExtractUint32Type = createFunctionProxy('extractUint32')
export const extractUint64: ExtractUint64Type = createFunctionProxy('extractUint64')
export const gaid: GaidType = createFunctionProxy('gaid')
export const getBit: GetBitType = createFunctionProxy('getBit')
export const getByte: GetByteType = createFunctionProxy('getByte')
export const itob: ItobType = createFunctionProxy('itob')
export const keccak256: Keccak256Type = createFunctionProxy('keccak256')
export const minBalance: BalanceType = createFunctionProxy('minBalance')
export const mulw: MulwType = createFunctionProxy('mulw')
export const replace: ReplaceType = createFunctionProxy('replace')
export const select: SelectType = createFunctionProxy('select') as SelectType
export const setBit: SetBitType = createFunctionProxy('setBit') as SetBitType
export const setByte: SetByteType = createFunctionProxy('setByte')
export const sha256: Sha256Type = createFunctionProxy('sha256')
export const sha3_256: Sha3_256Type = createFunctionProxy('sha3_256')
export const sha512_256: Sha512_256Type = createFunctionProxy('sha512_256')
export const shl: ShlType = createFunctionProxy('shl')
export const shr: ShrType = createFunctionProxy('shr')
export const sqrt: SqrtType = createFunctionProxy('sqrt')
export const substring: SubstringType = createFunctionProxy('substring')
export const vrfVerify: VrfVerifyType = createFunctionProxy('vrfVerify')

export const EllipticCurve: EllipticCurveType = createObjectProxy('EllipticCurve')
export const Global: GlobalType = createObjectProxy('Global')
export const GTxn: GTxnType = createObjectProxy('GTxn')
export const JsonRef: JsonRefType = createObjectProxy('JsonRef')
export const Txn: TxnType = createObjectProxy('Txn')
export const ITxn: ITxnType = createObjectProxy('ITxn')
export const ITxnCreate: ITxnCreateType = createObjectProxy('ITxnCreate')

export const AcctParams = createObjectProxy('AcctParams')
export const AppParams = createObjectProxy('AppParams')
export const AssetHolding = createObjectProxy('AssetHolding')
export const AssetParams = createObjectProxy('AssetParams')

export { VrfVerify } from './op-types'
