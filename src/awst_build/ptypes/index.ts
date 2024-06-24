import { wtypes } from '../../awst'
import { LibFunctionType, LiteralValueType, NamespaceType, SimpleType } from './ptype-classes'
export { PType, TuplePType, IntrinsicEnumType, FreeSubroutineType } from './ptype-classes'
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
  module: '@algorandfoundation/algo-ts/primitives.d.ts',
  wtype: wtypes.uint64WType,
})
export const Uint64Function = new LibFunctionType({
  name: 'Uint64',
  module: '@algorandfoundation/algo-ts/primitives.d.ts',
})

export const biguintPType = new SimpleType({
  name: 'biguint',
  module: '@algorandfoundation/algo-ts/primitives.d.ts',
  wtype: wtypes.biguintWType,
})

export const BigUintFunction = new LibFunctionType({
  name: 'BigUint',
  module: '@algorandfoundation/algo-ts/primitives.d.ts',
})
export const bytesPType = new SimpleType({
  name: 'bytes',
  module: '@algorandfoundation/algo-ts/primitives.d.ts',
  wtype: wtypes.bytesWType,
})
export const BytesFunction = new LibFunctionType({
  name: 'Bytes',
  module: '@algorandfoundation/algo-ts/primitives.d.ts',
})

export const strPType = new SimpleType({
  name: 'str',
  module: '@algorandfoundation/algo-ts/primitives.d.ts',
  wtype: wtypes.stringWType,
})
export const StrFunction = new LibFunctionType({
  name: 'Str',
  module: '@algorandfoundation/algo-ts/primitives.d.ts',
})
export const opNamespace = new NamespaceType({
  name: 'op',
  module: '@algorandfoundation/algo-ts/op.d.ts',
})
export const logFunction = new LibFunctionType({
  name: 'log',
  module: '@algorandfoundation/algo-ts/util.d.ts',
})
export const assertFunction = new LibFunctionType({
  name: 'assert',
  module: '@algorandfoundation/algo-ts/util.d.ts',
})

export const assetPType = new SimpleType({
  name: 'Asset',
  wtype: wtypes.assetWType,
  module: '@algorandfoundation/algo-ts/reference.d.ts',
})
export const accountPType = new SimpleType({
  name: 'Account',
  wtype: wtypes.accountWType,
  module: '@algorandfoundation/algo-ts/reference.d.ts',
})
export const applicationPType = new SimpleType({
  name: 'Application',
  wtype: wtypes.applicationWType,
  module: '@algorandfoundation/algo-ts/reference.d.ts',
})
