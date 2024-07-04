import { wtypes } from '../../awst'
import {
  LibFunctionType,
  LiteralValueType,
  NamespaceType,
  InstanceType,
  TransientType,
  FunctionType,
  BaseContractClassType,
} from './ptype-classes'
import { Constants } from '../../constants'
export { PType, TuplePType, IntrinsicEnumType } from './ptype-classes'
export * from './op-ptypes'
export const voidPType = new InstanceType({
  name: 'void',
  module: 'lib.d.ts',
  wtype: wtypes.voidWType,
})

export const boolPType = new InstanceType({
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
export const stringPType = new InstanceType({
  name: 'str',
  module: 'lib.d.ts',
  wtype: wtypes.stringWType,
})
export const StringFunction = new LibFunctionType({
  name: 'String',
  module: 'typescript/lib/lib.es5.d.ts',
})

export const uint64PType = new InstanceType({
  name: 'uint64',
  module: Constants.primitivesModuleName,
  wtype: wtypes.uint64WType,
})

export const numberPType = new TransientType({
  name: 'number',
  module: 'lib.d.ts',
  altType: uint64PType,
  singleton: false,
})
export const Uint64Function = new LibFunctionType({
  name: 'Uint64',
  module: Constants.primitivesModuleName,
})

export const biguintPType = new InstanceType({
  name: 'biguint',
  module: Constants.primitivesModuleName,
  wtype: wtypes.biguintWType,
})

export const BigUintFunction = new LibFunctionType({
  name: 'BigUint',
  module: Constants.primitivesModuleName,
})
export const bytesPType = new InstanceType({
  name: 'bytes',
  module: Constants.primitivesModuleName,
  wtype: wtypes.bytesWType,
})
export const BytesFunction = new LibFunctionType({
  name: 'Bytes',
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

export const errFunction = new LibFunctionType({
  name: 'err',
  module: Constants.utilModuleName,
})

export const assetPType = new InstanceType({
  name: 'Asset',
  wtype: wtypes.assetWType,
  module: Constants.referenceModuleName,
})
export const AssetFunction = new LibFunctionType({
  name: 'Asset',
  module: Constants.referenceModuleName,
})
export const accountPType = new InstanceType({
  name: 'Account',
  wtype: wtypes.accountWType,
  module: Constants.referenceModuleName,
})
export const applicationPType = new InstanceType({
  name: 'Application',
  wtype: wtypes.applicationWType,
  module: Constants.referenceModuleName,
})
export const GlobalStateFunction = new LibFunctionType({
  name: 'GlobalState',
  module: Constants.stateModuleName,
})

export const ClearStateProgram = new FunctionType({
  name: Constants.clearStateProgramMethodName,
  module: Constants.baseContractModuleName,
  returnType: uint64PType,
  parameters: [],
})

export const ApprovalProgram = new FunctionType({
  name: Constants.approvalProgramMethodName,
  module: Constants.arc4ModuleName,
  returnType: boolPType,
  parameters: [],
})

export const BaseContractType = new BaseContractClassType({
  module: Constants.baseContractModuleName,
  name: 'BaseContract',
  methods: {
    clearStateProgram: ClearStateProgram,
  },
  properties: {},
  baseType: undefined,
  isArc4: false,
})
export const ContractType = new BaseContractClassType({
  module: Constants.arc4ModuleName,
  name: 'Contract',
  methods: {
    approvalProgram: ApprovalProgram,
    clearStateProgram: ClearStateProgram,
  },
  properties: {},
  baseType: BaseContractType,
  isArc4: true,
})
