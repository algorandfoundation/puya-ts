import { Arc28EmitFunctionBuilder } from '../eb/arc28/arc-28-emit-function-builder'
import {
  Arc4AbiMethodDecoratorBuilder,
  Arc4BareMethodDecoratorBuilder,
  ReadonlyDecoratorBuilder,
} from '../eb/arc4-method-decorator-builder'
import {
  AddressClassBuilder,
  AddressExpressionBuilder,
  DynamicArrayClassBuilder,
  DynamicArrayExpressionBuilder,
  DynamicBytesClassBuilder,
  DynamicBytesExpressionBuilder,
  StaticArrayClassBuilder,
  StaticArrayExpressionBuilder,
  StaticBytesClassBuilder,
  StaticBytesExpressionBuilder,
} from '../eb/arc4/arrays'
import { BoolClassBuilder, BoolExpressionBuilder } from '../eb/arc4/bool'
import { AbiCallFunctionBuilder, CompileArc4FunctionBuilder, ContractProxyExpressionBuilder } from '../eb/arc4/c2c'
import { StrClassBuilder, StrExpressionBuilder } from '../eb/arc4/string'
import { StructClassBuilder, StructExpressionBuilder } from '../eb/arc4/struct'
import { Arc4TupleClassBuilder, Arc4TupleExpressionBuilder } from '../eb/arc4/tuple'
import { UFixedNxMClassBuilder, UFixedNxMExpressionBuilder } from '../eb/arc4/ufixed'
import { classBuilderForUintNAlias, UintNClassBuilder, UintNExpressionBuilder } from '../eb/arc4/uintn'
import {
  DecodeArc4FunctionBuilder,
  EncodeArc4FunctionBuilder,
  InterpretAsArc4FunctionBuilder,
  MethodSelectorFunctionBuilder,
  SizeOfFunctionBuilder,
} from '../eb/arc4/util'
import {
  FixedArrayClassBuilder,
  FixedArrayExpressionBuilder,
  NativeArrayClassBuilder,
  NativeArrayExpressionBuilder,
  ReadonlyArrayExpressionBuilder,
} from '../eb/array-like/arrays'
import { MutableTupleExpressionBuilder } from '../eb/array-like/mutable-tuple-expression-builder'
import { ReadonlyTupleExpressionBuilder } from '../eb/array-like/readonly-tuple-expression-builder'
import { ResolvedArrayLiteralExpressionBuilder } from '../eb/array-like/resolved-array-literal-expression-builder'
import { AssertFunctionBuilder, ErrFunctionBuilder } from '../eb/assert-function-builder'
import { AssertMatchFunctionBuilder } from '../eb/assert-match-function-builder'
import { BigUintExpressionBuilder, BigUintFunctionBuilder } from '../eb/biguint-expression-builder'
import { BooleanExpressionBuilder, BooleanFunctionBuilder } from '../eb/boolean-expression-builder'
import { BytesExpressionBuilder, BytesFunctionBuilder } from '../eb/bytes-expression-builder'
import { CloneFunctionBuilder } from '../eb/clone-function-builder'
import { CompileFunctionBuilder } from '../eb/compiled/compile-function'
import { ContractClassBuilder, ContractOptionsDecoratorBuilder } from '../eb/contract-builder'
import { EnsureBudgetFunctionBuilder } from '../eb/ensure-budget'

import { FreeSubroutineExpressionBuilder } from '../eb/free-subroutine-expression-builder'
import { IntrinsicEnumBuilder } from '../eb/intrinsic-enum-builder'
import { IterableIteratorExpressionBuilder } from '../eb/iterable-iterator-expression-builder'
import { LogFunctionBuilder } from '../eb/log-function-builder'
import { LogicSigClassBuilder, LogicSigOptionsDecoratorBuilder } from '../eb/logic-sig-builder'
import { MatchFunctionBuilder } from '../eb/match-function-builder'
import { NamespaceBuilder } from '../eb/namespace-builder'
import { NeverExpressionBuilder } from '../eb/never-expression-builder'
import { ObjectWithOptionalFieldsExpressionBuilder } from '../eb/object-with-optional-fields'
import { MutableObjectExpressionBuilder } from '../eb/objects/mutable-object'
import { ObjectExpressionBuilder } from '../eb/objects/object-expression-builder'
import { ResolvedObjectLiteralExpressionBuilder } from '../eb/objects/resolved-object-literal-expression-builder'
import { FreeIntrinsicOpBuilder, IntrinsicOpGroupBuilder, IntrinsicOpGroupOrFunctionTypeBuilder } from '../eb/op-module-builder'
import { ReferenceArrayClassBuilder, ReferenceArrayExpressionBuilder } from '../eb/reference-arrays'
import { AccountExpressionBuilder, AccountFunctionBuilder } from '../eb/reference/account'
import { ApplicationExpressionBuilder, ApplicationFunctionBuilder } from '../eb/reference/application'
import { AssetExpressionBuilder, AssetFunctionBuilder } from '../eb/reference/asset'
import { BoxExpressionBuilder, BoxFunctionBuilder, BoxMapExpressionBuilder, BoxMapFunctionBuilder } from '../eb/storage/box'
import { GlobalStateExpressionBuilder, GlobalStateFunctionBuilder } from '../eb/storage/global-state'
import { LocalStateExpressionBuilder, LocalStateFunctionBuilder } from '../eb/storage/local-state'
import { StringExpressionBuilder, StringFunctionBuilder } from '../eb/string-expression-builder'
import { TemplateVarFunctionBuilder } from '../eb/template-var'
import { GroupTransactionExpressionBuilder, GroupTransactionFunctionBuilder } from '../eb/transactions/group-transactions'
import {
  ItxnParamsExpressionBuilder,
  ItxnParamsFactoryFunctionBuilder,
  SubmitItxnGroupFunctionBuilder,
} from '../eb/transactions/inner-transaction-params'
import { InnerTransactionExpressionBuilder } from '../eb/transactions/inner-transactions'
import { ItxnComposeBuilder } from '../eb/transactions/itxn-compose'
import { Uint64EnumMemberExpressionBuilder, Uint64EnumTypeBuilder } from '../eb/uint64-enum-type-builder'
import { UInt64ExpressionBuilder, UInt64FunctionBuilder } from '../eb/uint64-expression-builder'
import { UnresolvableExpressionBuilder } from '../eb/unresolvable-expression-builder'
import { UrangeFunctionBuilder } from '../eb/urange-function'
import { VoidExpressionBuilder } from '../eb/void-expression-builder'
import { OP_METADATA } from '../op-metadata'
import type { TypeRegistry } from '../type-registry'
import {
  abiCallFunction,
  AddressClass,
  arc4AddressAlias,
  ARC4BoolClass,
  arc4BooleanType,
  arc4ByteAlias,
  ARC4StrClass,
  arc4StringType,
  ARC4StructClass,
  ARC4StructType,
  Arc4TupleGeneric,
  ARC4TupleType,
  ByteClass,
  compileArc4Function,
  ContractProxyGeneric,
  ContractProxyType,
  decodeArc4Function,
  DynamicArrayGeneric,
  DynamicArrayType,
  DynamicBytesConstructor,
  DynamicBytesType,
  encodeArc4Function,
  interpretAsArc4Function,
  methodSelectorFunction,
  sizeOfFunction,
  StaticArrayGeneric,
  StaticArrayType,
  StaticBytesGeneric,
  StaticBytesType,
  UFixedNxMGeneric,
  UFixedNxMType,
  UintN128Class,
  UintN16Class,
  UintN256Class,
  UintN32Class,
  UintN64Class,
  UintN8Class,
  UintNGeneric,
  UintNType,
} from './arc4-types'
import {
  AccountFunction,
  accountPType,
  anyGtxnType,
  applicationCallGtxnType,
  applicationCallItxnFn,
  applicationCallItxnParamsType,
  ApplicationFunctionType,
  applicationItxnType,
  applicationPType,
  ApplicationTxnFunction,
  arc28EmitFunction,
  arc4AbiMethodDecorator,
  arc4BareMethodDecorator,
  ArrayGeneric,
  ArrayLiteralPType,
  ArrayPType,
  assertFunction,
  assertMatchFunction,
  assetConfigGtxnType,
  assetConfigItxnFn,
  assetConfigItxnParamsType,
  assetConfigItxnType,
  AssetConfigTxnFunction,
  assetFreezeGtxnType,
  assetFreezeItxnFn,
  assetFreezeItxnParamsType,
  assetFreezeItxnType,
  AssetFreezeTxnFunction,
  AssetFunction,
  assetPType,
  assetTransferGtxnType,
  assetTransferItxnFn,
  assetTransferItxnParamsType,
  assetTransferItxnType,
  AssetTransferTxnFunction,
  BigUintFunction,
  biguintPType,
  BooleanFunction,
  boolPType,
  BoxGeneric,
  BoxMapGeneric,
  BoxMapPType,
  BoxPType,
  BytesFunction,
  BytesGeneric,
  bytesPType,
  BytesPType,
  ClassMethodDecoratorContext,
  cloneFunctionPType,
  compileFunctionType,
  ContractClassPType,
  contractOptionsDecorator,
  ensureBudgetFunction,
  errFunction,
  FixedArrayGeneric,
  FixedArrayPType,
  FunctionPType,
  GeneratorGeneric,
  GeneratorType,
  GlobalStateGeneric,
  GlobalStateType,
  ImmutableObjectPType,
  inputOnlyObjects,
  IntrinsicFunctionGroupType,
  IntrinsicFunctionGroupTypeType,
  IntrinsicFunctionType,
  IntrinsicFunctionTypeType,
  IterableIteratorGeneric,
  IterableIteratorType,
  itxnComposePType,
  keyRegistrationGtxnType,
  keyRegistrationItxnFn,
  keyRegistrationItxnParamsType,
  keyRegistrationItxnType,
  KeyRegistrationTxnFunction,
  LocalStateGeneric,
  LocalStateType,
  logFunction,
  logicSigOptionsDecorator,
  LogicSigPType,
  matchFunction,
  MutableObjectPType,
  MutableTuplePType,
  NamespacePType,
  neverPType,
  ObjectLiteralPType,
  onCompleteActionType,
  opUpFeeSourceType,
  paymentGtxnType,
  paymentItxnFn,
  paymentItxnParamsType,
  paymentItxnType,
  PaymentTxnFunction,
  PolytypeClassMethodHelper,
  PromiseGeneric,
  PromiseType,
  ReadonlyArrayGeneric,
  ReadonlyArrayPType,
  readonlyDecorator,
  ReadonlyGeneric,
  ReadonlyTuplePType,
  ReferenceArrayGeneric,
  ReferenceArrayType,
  StringFunction,
  stringPType,
  submitGroupItxnFunction,
  SuperPrototypeSelector,
  SuperPrototypeSelectorGeneric,
  TemplateVarFunction,
  TransactionFunction,
  transactionTypeType,
  Uint64EnumMemberType,
  Uint64Function,
  uint64PType,
  urangeFunction,
  voidPType,
} from './index'
import { ALL_OP_ENUMS } from './op-ptypes'

export function registerPTypes(typeRegistry: TypeRegistry) {
  if (typeRegistry.hasRegistrations) {
    return
  }
  // Primitives
  typeRegistry.register({ ptype: neverPType, instanceEb: NeverExpressionBuilder })
  typeRegistry.register({ ptype: boolPType, instanceEb: BooleanExpressionBuilder })
  typeRegistry.register({ ptype: BooleanFunction, singletonEb: BooleanFunctionBuilder })
  typeRegistry.register({ ptype: uint64PType, instanceEb: UInt64ExpressionBuilder })
  typeRegistry.register({ ptype: Uint64Function, singletonEb: UInt64FunctionBuilder })
  typeRegistry.register({ ptype: biguintPType, instanceEb: BigUintExpressionBuilder })
  typeRegistry.register({ ptype: BigUintFunction, singletonEb: BigUintFunctionBuilder })
  typeRegistry.registerGeneric({ generic: BytesGeneric, ptype: BytesPType, instanceEb: BytesExpressionBuilder })
  typeRegistry.register({ ptype: bytesPType, instanceEb: BytesExpressionBuilder })
  typeRegistry.register({ ptype: BytesFunction, singletonEb: BytesFunctionBuilder })
  typeRegistry.register({ ptype: stringPType, instanceEb: StringExpressionBuilder })
  typeRegistry.register({ ptype: voidPType, instanceEb: VoidExpressionBuilder })
  typeRegistry.register({ ptype: StringFunction, singletonEb: StringFunctionBuilder })

  // Compound
  typeRegistry.registerGeneric({
    generic: ArrayGeneric,
    ptype: ArrayPType,
    instanceEb: NativeArrayExpressionBuilder,
    singletonEb: NativeArrayClassBuilder,
  })
  typeRegistry.registerGeneric({ generic: ReadonlyArrayGeneric, ptype: ReadonlyArrayPType, instanceEb: ReadonlyArrayExpressionBuilder })
  typeRegistry.register({ ptype: ReadonlyTuplePType, instanceEb: ReadonlyTupleExpressionBuilder })
  typeRegistry.register({ ptype: MutableTuplePType, instanceEb: MutableTupleExpressionBuilder })
  typeRegistry.registerGenericTypeOnly({ generic: ReadonlyGeneric })
  typeRegistry.register({ ptype: ArrayLiteralPType, instanceEb: ResolvedArrayLiteralExpressionBuilder })
  typeRegistry.register({ ptype: ImmutableObjectPType, instanceEb: ObjectExpressionBuilder })
  typeRegistry.register({ ptype: MutableObjectPType, instanceEb: MutableObjectExpressionBuilder })
  typeRegistry.register({ ptype: ObjectLiteralPType, instanceEb: ResolvedObjectLiteralExpressionBuilder })

  typeRegistry.registerGeneric({
    generic: FixedArrayGeneric,
    ptype: FixedArrayPType,
    instanceEb: FixedArrayExpressionBuilder,
    singletonEb: FixedArrayClassBuilder,
  })

  typeRegistry.registerGeneric({
    generic: ReferenceArrayGeneric,
    ptype: ReferenceArrayType,
    instanceEb: ReferenceArrayExpressionBuilder,
    singletonEb: ReferenceArrayClassBuilder,
  })

  // Unresolvable
  typeRegistry.registerGeneric({ ptype: GeneratorType, generic: GeneratorGeneric, instanceEb: UnresolvableExpressionBuilder })
  typeRegistry.registerGeneric({ ptype: PromiseType, generic: PromiseGeneric, instanceEb: UnresolvableExpressionBuilder })
  typeRegistry.register({ ptype: ClassMethodDecoratorContext, instanceEb: UnresolvableExpressionBuilder })
  typeRegistry.registerGeneric({
    ptype: SuperPrototypeSelector,
    generic: SuperPrototypeSelectorGeneric,
    instanceEb: UnresolvableExpressionBuilder,
  })
  typeRegistry.register({ ptype: PolytypeClassMethodHelper, instanceEb: UnresolvableExpressionBuilder })

  // Lib functions
  typeRegistry.register({ ptype: logFunction, singletonEb: LogFunctionBuilder })
  typeRegistry.register({ ptype: assertFunction, singletonEb: AssertFunctionBuilder })
  typeRegistry.register({ ptype: errFunction, singletonEb: ErrFunctionBuilder })
  typeRegistry.register({ ptype: matchFunction, singletonEb: MatchFunctionBuilder })
  typeRegistry.register({ ptype: assertMatchFunction, singletonEb: AssertMatchFunctionBuilder })
  typeRegistry.register({ ptype: ensureBudgetFunction, singletonEb: EnsureBudgetFunctionBuilder })
  typeRegistry.register({ ptype: urangeFunction, singletonEb: UrangeFunctionBuilder })
  typeRegistry.register({ ptype: TemplateVarFunction, singletonEb: TemplateVarFunctionBuilder })
  typeRegistry.register({ ptype: compileFunctionType, singletonEb: CompileFunctionBuilder })
  typeRegistry.register({ ptype: arc28EmitFunction, singletonEb: Arc28EmitFunctionBuilder })
  typeRegistry.register({ ptype: cloneFunctionPType, singletonEb: CloneFunctionBuilder })
  typeRegistry.register({ ptype: ContractClassPType, singletonEb: ContractClassBuilder })
  typeRegistry.register({ ptype: contractOptionsDecorator, singletonEb: ContractOptionsDecoratorBuilder })
  typeRegistry.register({ ptype: LogicSigPType, singletonEb: LogicSigClassBuilder })
  typeRegistry.register({ ptype: logicSigOptionsDecorator, singletonEb: LogicSigOptionsDecoratorBuilder })

  for (const enumType of [opUpFeeSourceType, onCompleteActionType, transactionTypeType]) {
    typeRegistry.register({ ptype: enumType, singletonEb: Uint64EnumTypeBuilder })
    typeRegistry.register({ ptype: enumType.memberType, instanceEb: Uint64EnumMemberExpressionBuilder })
  }
  typeRegistry.register({ ptype: Uint64EnumMemberType, instanceEb: Uint64EnumMemberExpressionBuilder })

  typeRegistry.registerGeneric({
    generic: IterableIteratorGeneric,
    ptype: IterableIteratorType,
    instanceEb: IterableIteratorExpressionBuilder,
  })

  typeRegistry.register({ ptype: FunctionPType, singletonEb: FreeSubroutineExpressionBuilder })

  // Op types
  typeRegistry.register({ ptype: NamespacePType, singletonEb: NamespaceBuilder })
  for (const enumPType of ALL_OP_ENUMS) {
    typeRegistry.register({ ptype: enumPType, singletonEb: IntrinsicEnumBuilder })
  }
  for (const [name, metadata] of Object.entries(OP_METADATA)) {
    if (metadata.type === 'op-grouping') {
      typeRegistry.register({
        ptype: new IntrinsicFunctionGroupType({
          name,
        }),
        singletonEb: IntrinsicOpGroupBuilder,
      })
      typeRegistry.register({
        ptype: new IntrinsicFunctionGroupTypeType({
          name: `${name}Type`,
        }),
        instanceEb: IntrinsicOpGroupOrFunctionTypeBuilder,
      })
    } else {
      typeRegistry.register({
        ptype: new IntrinsicFunctionType({
          name,
        }),
        singletonEb: FreeIntrinsicOpBuilder,
      })
      typeRegistry.register({
        ptype: new IntrinsicFunctionTypeType({
          name: `${name}Type`,
        }),
        instanceEb: IntrinsicOpGroupOrFunctionTypeBuilder,
      })
    }
  }

  // State
  typeRegistry.registerGeneric({
    generic: GlobalStateGeneric,
    ptype: GlobalStateType,
    instanceEb: GlobalStateExpressionBuilder,
    singletonEb: GlobalStateFunctionBuilder,
  })
  typeRegistry.registerGeneric({
    generic: LocalStateGeneric,
    ptype: LocalStateType,
    instanceEb: LocalStateExpressionBuilder,
    singletonEb: LocalStateFunctionBuilder,
  })
  typeRegistry.registerGeneric({ generic: BoxGeneric, ptype: BoxPType, instanceEb: BoxExpressionBuilder, singletonEb: BoxFunctionBuilder })
  typeRegistry.registerGeneric({
    generic: BoxMapGeneric,
    ptype: BoxMapPType,
    instanceEb: BoxMapExpressionBuilder,
    singletonEb: BoxMapFunctionBuilder,
  })

  // Reference types
  typeRegistry.register({ ptype: ApplicationFunctionType, singletonEb: ApplicationFunctionBuilder })
  typeRegistry.register({ ptype: applicationPType, instanceEb: ApplicationExpressionBuilder })
  typeRegistry.register({ ptype: AccountFunction, singletonEb: AccountFunctionBuilder })
  typeRegistry.register({ ptype: accountPType, instanceEb: AccountExpressionBuilder })
  typeRegistry.register({ ptype: AssetFunction, singletonEb: AssetFunctionBuilder })
  typeRegistry.register({ ptype: assetPType, instanceEb: AssetExpressionBuilder })

  // ARC4 encoded
  typeRegistry.register({ ptype: readonlyDecorator, singletonEb: ReadonlyDecoratorBuilder })
  typeRegistry.register({ ptype: arc4AbiMethodDecorator, singletonEb: Arc4AbiMethodDecoratorBuilder })
  typeRegistry.register({ ptype: arc4BareMethodDecorator, singletonEb: Arc4BareMethodDecoratorBuilder })
  typeRegistry.register({ ptype: ByteClass, singletonEb: classBuilderForUintNAlias(ByteClass, arc4ByteAlias) })
  typeRegistry.register({ ptype: UintN8Class, singletonEb: classBuilderForUintNAlias(UintN8Class, new UintNType({ n: 8n })) })
  typeRegistry.register({ ptype: UintN16Class, singletonEb: classBuilderForUintNAlias(UintN8Class, new UintNType({ n: 16n })) })
  typeRegistry.register({ ptype: UintN32Class, singletonEb: classBuilderForUintNAlias(UintN8Class, new UintNType({ n: 32n })) })
  typeRegistry.register({ ptype: UintN64Class, singletonEb: classBuilderForUintNAlias(UintN8Class, new UintNType({ n: 64n })) })
  typeRegistry.register({ ptype: UintN128Class, singletonEb: classBuilderForUintNAlias(UintN8Class, new UintNType({ n: 128n })) })
  typeRegistry.register({ ptype: UintN256Class, singletonEb: classBuilderForUintNAlias(UintN8Class, new UintNType({ n: 256n })) })
  typeRegistry.registerGeneric({
    generic: UintNGeneric,
    ptype: UintNType,
    instanceEb: UintNExpressionBuilder,
    singletonEb: UintNClassBuilder,
  })
  typeRegistry.registerGeneric({
    generic: UFixedNxMGeneric,
    ptype: UFixedNxMType,
    instanceEb: UFixedNxMExpressionBuilder,
    singletonEb: UFixedNxMClassBuilder,
  })
  typeRegistry.register({ ptype: arc4ByteAlias, instanceEb: UintNExpressionBuilder })

  // More specific types need to be registered before their base types
  // This ensures the specific type is selected during type resolution
  // For example, StaticBytesExpressionBuilder should be selected over general StaticArrayExpressionBuilder for StaticBytesType
  typeRegistry.register({ ptype: DynamicBytesConstructor, singletonEb: DynamicBytesClassBuilder })
  typeRegistry.register({ ptype: DynamicBytesType, instanceEb: DynamicBytesExpressionBuilder })
  typeRegistry.registerGeneric({
    generic: StaticBytesGeneric,
    ptype: StaticBytesType,
    instanceEb: StaticBytesExpressionBuilder,
    singletonEb: StaticBytesClassBuilder,
  })

  typeRegistry.registerGeneric({
    generic: DynamicArrayGeneric,
    ptype: DynamicArrayType,
    instanceEb: DynamicArrayExpressionBuilder,
    singletonEb: DynamicArrayClassBuilder,
  })
  typeRegistry.registerGeneric({
    generic: StaticArrayGeneric,
    ptype: StaticArrayType,
    instanceEb: StaticArrayExpressionBuilder,
    singletonEb: StaticArrayClassBuilder,
  })
  typeRegistry.register({ ptype: arc4AddressAlias, instanceEb: AddressExpressionBuilder })
  typeRegistry.register({ ptype: AddressClass, singletonEb: AddressClassBuilder })
  typeRegistry.register({ ptype: ARC4BoolClass, singletonEb: BoolClassBuilder })
  typeRegistry.register({ ptype: arc4BooleanType, instanceEb: BoolExpressionBuilder })
  typeRegistry.register({ ptype: arc4StringType, instanceEb: StrExpressionBuilder })
  typeRegistry.register({ ptype: ARC4StrClass, singletonEb: StrClassBuilder })
  typeRegistry.registerGeneric({
    generic: Arc4TupleGeneric,
    ptype: ARC4TupleType,
    instanceEb: Arc4TupleExpressionBuilder,
    singletonEb: Arc4TupleClassBuilder,
  })
  typeRegistry.register({ ptype: ARC4StructType, instanceEb: StructExpressionBuilder })
  typeRegistry.register({ ptype: ARC4StructClass, singletonEb: StructClassBuilder })

  // ARC4 lib
  typeRegistry.register({ ptype: interpretAsArc4Function, singletonEb: InterpretAsArc4FunctionBuilder })
  typeRegistry.register({ ptype: encodeArc4Function, singletonEb: EncodeArc4FunctionBuilder })
  typeRegistry.register({ ptype: decodeArc4Function, singletonEb: DecodeArc4FunctionBuilder })
  typeRegistry.register({ ptype: methodSelectorFunction, singletonEb: MethodSelectorFunctionBuilder })
  typeRegistry.register({ ptype: sizeOfFunction, singletonEb: SizeOfFunctionBuilder })
  typeRegistry.register({ ptype: compileArc4Function, singletonEb: CompileArc4FunctionBuilder })
  typeRegistry.register({ ptype: abiCallFunction, singletonEb: AbiCallFunctionBuilder })
  typeRegistry.registerGeneric({ ptype: ContractProxyType, generic: ContractProxyGeneric, instanceEb: ContractProxyExpressionBuilder })

  // GTXN types
  typeRegistry.register({ ptype: paymentGtxnType, instanceEb: GroupTransactionExpressionBuilder })
  typeRegistry.register({ ptype: PaymentTxnFunction, singletonEb: GroupTransactionFunctionBuilder })
  typeRegistry.register({ ptype: keyRegistrationGtxnType, instanceEb: GroupTransactionExpressionBuilder })
  typeRegistry.register({ ptype: KeyRegistrationTxnFunction, singletonEb: GroupTransactionFunctionBuilder })
  typeRegistry.register({ ptype: assetConfigGtxnType, instanceEb: GroupTransactionExpressionBuilder })
  typeRegistry.register({ ptype: AssetConfigTxnFunction, singletonEb: GroupTransactionFunctionBuilder })
  typeRegistry.register({ ptype: assetTransferGtxnType, instanceEb: GroupTransactionExpressionBuilder })
  typeRegistry.register({ ptype: AssetTransferTxnFunction, singletonEb: GroupTransactionFunctionBuilder })
  typeRegistry.register({ ptype: assetFreezeGtxnType, instanceEb: GroupTransactionExpressionBuilder })
  typeRegistry.register({ ptype: AssetFreezeTxnFunction, singletonEb: GroupTransactionFunctionBuilder })
  typeRegistry.register({ ptype: applicationCallGtxnType, instanceEb: GroupTransactionExpressionBuilder })
  typeRegistry.register({ ptype: ApplicationTxnFunction, singletonEb: GroupTransactionFunctionBuilder })
  typeRegistry.register({ ptype: anyGtxnType, instanceEb: GroupTransactionExpressionBuilder })
  typeRegistry.register({ ptype: TransactionFunction, singletonEb: GroupTransactionFunctionBuilder })

  // ITXN Types
  typeRegistry.register({ ptype: paymentItxnFn, singletonEb: ItxnParamsFactoryFunctionBuilder })
  typeRegistry.register({ ptype: keyRegistrationItxnFn, singletonEb: ItxnParamsFactoryFunctionBuilder })
  typeRegistry.register({ ptype: assetConfigItxnFn, singletonEb: ItxnParamsFactoryFunctionBuilder })
  typeRegistry.register({ ptype: assetTransferItxnFn, singletonEb: ItxnParamsFactoryFunctionBuilder })
  typeRegistry.register({ ptype: assetFreezeItxnFn, singletonEb: ItxnParamsFactoryFunctionBuilder })
  typeRegistry.register({ ptype: applicationCallItxnFn, singletonEb: ItxnParamsFactoryFunctionBuilder })
  typeRegistry.register({ ptype: submitGroupItxnFunction, singletonEb: SubmitItxnGroupFunctionBuilder })

  typeRegistry.register({ ptype: paymentItxnType, instanceEb: InnerTransactionExpressionBuilder })
  typeRegistry.register({ ptype: keyRegistrationItxnType, instanceEb: InnerTransactionExpressionBuilder })
  typeRegistry.register({ ptype: assetConfigItxnType, instanceEb: InnerTransactionExpressionBuilder })
  typeRegistry.register({ ptype: assetTransferItxnType, instanceEb: InnerTransactionExpressionBuilder })
  typeRegistry.register({ ptype: assetFreezeItxnType, instanceEb: InnerTransactionExpressionBuilder })
  typeRegistry.register({ ptype: applicationItxnType, instanceEb: InnerTransactionExpressionBuilder })

  typeRegistry.register({ ptype: paymentItxnParamsType, instanceEb: ItxnParamsExpressionBuilder })
  typeRegistry.register({ ptype: keyRegistrationItxnParamsType, instanceEb: ItxnParamsExpressionBuilder })
  typeRegistry.register({ ptype: assetConfigItxnParamsType, instanceEb: ItxnParamsExpressionBuilder })
  typeRegistry.register({ ptype: assetTransferItxnParamsType, instanceEb: ItxnParamsExpressionBuilder })
  typeRegistry.register({ ptype: assetFreezeItxnParamsType, instanceEb: ItxnParamsExpressionBuilder })
  typeRegistry.register({ ptype: applicationCallItxnParamsType, instanceEb: ItxnParamsExpressionBuilder })

  // ITXN Compose
  typeRegistry.register({ ptype: itxnComposePType, singletonEb: ItxnComposeBuilder })

  for (const inputType of inputOnlyObjects) {
    typeRegistry.register({ ptype: inputType, instanceEb: ObjectWithOptionalFieldsExpressionBuilder })
  }
}
