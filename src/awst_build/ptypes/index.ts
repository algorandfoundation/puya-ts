import { wtypes } from '../../awst'
import { LibFunctionType, LiteralValueType, NamespaceType, SimpleType, TransientType } from './ptype-classes'
import { Constants } from '../../constants'
export { PType, TuplePType, IntrinsicEnumType } from './ptype-classes'
export * from './op-ptypes'
export const voidPType = new SimpleType({
  name: 'void',
  module: 'lib.d.ts',
  wtype: wtypes.voidWType,
})

export const boolPType = new SimpleType({
  name: 'boolean',
  module: 'lib.d.ts',
  wtype: wtypes.boolWType,
})

export const BooleanFunction = new LibFunctionType({
  name: 'Boolean',
  module: 'lib.d.ts',
})

export const bigintLiteralPType = new LiteralValueType({
  name: 'bigint',
  module: 'lib.d.ts',
})

export const stringLiteralPType = new LiteralValueType({
  name: 'string',
  module: 'lib.d.ts',
})

export const uint64PType = new SimpleType({
  name: 'uint64',
  module: Constants.primitivesModuleName,
  wtype: wtypes.uint64WType,
})

export const numberPType = new TransientType({
  name: 'number',
  module: 'lib.d.ts',
  altType: uint64PType,
})
export const Uint64Function = new LibFunctionType({
  name: 'Uint64',
  module: Constants.primitivesModuleName,
})

export const biguintPType = new SimpleType({
  name: 'biguint',
  module: Constants.primitivesModuleName,
  wtype: wtypes.biguintWType,
})

export const BigUintFunction = new LibFunctionType({
  name: 'BigUint',
  module: Constants.primitivesModuleName,
})
export const bytesPType = new SimpleType({
  name: 'bytes',
  module: Constants.primitivesModuleName,
  wtype: wtypes.bytesWType,
})
export const BytesFunction = new LibFunctionType({
  name: 'Bytes',
  module: Constants.primitivesModuleName,
})

export const strPType = new SimpleType({
  name: 'str',
  module: Constants.primitivesModuleName,
  wtype: wtypes.stringWType,
})
export const StrFunction = new LibFunctionType({
  name: 'Str',
  module: Constants.primitivesModuleName,
})
export const opNamespace = new NamespaceType({
  name: 'op',
  module: Constants.opModuleName,
})
export const logFunction = new LibFunctionType({
  name: 'log',
  module: Constants.utilModuleName,
})
export const assertFunction = new LibFunctionType({
  name: 'assert',
  module: Constants.utilModuleName,
})

export const assetPType = new SimpleType({
  name: 'Asset',
  wtype: wtypes.assetWType,
  module: Constants.referenceModuleName,
})
export const accountPType = new SimpleType({
  name: 'Account',
  wtype: wtypes.accountWType,
  module: Constants.referenceModuleName,
})
export const applicationPType = new SimpleType({
  name: 'Application',
  wtype: wtypes.applicationWType,
  module: Constants.referenceModuleName,
})
export const GlobalStateFunction = new LibFunctionType({
  name: 'GlobalState',
  module: Constants.stateModuleName,
})
