import { Arc28EmitFunctionBuilder } from '../eb/arc28/arc-28-emit-function-builder'
import { Arc4AbiMethodDecoratorBuilder, Arc4BareMethodDecoratorBuilder } from '../eb/arc4-bare-method-decorator-builder'
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
} from '../eb/arc4/util'
import { AssertFunctionBuilder, ErrFunctionBuilder } from '../eb/assert-function-builder'
import { AssertMatchFunctionBuilder } from '../eb/assert-match-function-builder'
import { BigUintExpressionBuilder, BigUintFunctionBuilder } from '../eb/biguint-expression-builder'
import { BooleanExpressionBuilder, BooleanFunctionBuilder } from '../eb/boolean-expression-builder'
import { BytesExpressionBuilder, BytesFunctionBuilder } from '../eb/bytes-expression-builder'
import { CompileFunctionBuilder } from '../eb/compiled/compile-function'
import { ContractClassBuilder, ContractOptionsDecoratorBuilder } from '../eb/contract-builder'
import { EnsureBudgetFunctionBuilder } from '../eb/ensure-budget'
import { FreeSubroutineExpressionBuilder } from '../eb/free-subroutine-expression-builder'
import { IntrinsicEnumBuilder } from '../eb/intrinsic-enum-builder'
import { IterableIteratorExpressionBuilder } from '../eb/iterable-iterator-expression-builder'
import { ObjectExpressionBuilder } from '../eb/literal/object-expression-builder'
import { LogFunctionBuilder } from '../eb/log-function-builder'
import { LogicSigClassBuilder, LogicSigOptionsDecoratorBuilder } from '../eb/logic-sig-builder'
import { NamespaceBuilder } from '../eb/namespace-builder'
import { NativeArrayExpressionBuilder } from '../eb/native-array-expression-builder'
import { NeverExpressionBuilder } from '../eb/never-expression-builder'
import { FreeIntrinsicOpBuilder, IntrinsicOpGroupBuilder, IntrinsicOpGroupOrFunctionTypeBuilder } from '../eb/op-module-builder'
import { AccountExpressionBuilder, AccountFunctionBuilder } from '../eb/reference/account'
import { ApplicationExpressionBuilder, ApplicationFunctionBuilder } from '../eb/reference/application'
import { AssetExpressionBuilder, AssetFunctionBuilder } from '../eb/reference/asset'
import {
  BoxExpressionBuilder,
  BoxFunctionBuilder,
  BoxMapExpressionBuilder,
  BoxMapFunctionBuilder,
  BoxRefExpressionBuilder,
  BoxRefFunctionBuilder,
} from '../eb/storage/box'
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
import { TupleExpressionBuilder } from '../eb/tuple-expression-builder'
import { Uint64EnumMemberExpressionBuilder, Uint64EnumTypeBuilder } from '../eb/uint64-enum-type-builder'
import { UInt64ExpressionBuilder, UInt64FunctionBuilder } from '../eb/uint64-expression-builder'
import { UnresolvableExpressionBuilder } from '../eb/unresolvable-expression-builder'
import { UrangeFunctionBuilder } from '../eb/urange-function'
import { VoidExpressionBuilder } from '../eb/void-expression-builder'
import { OP_METADATA } from '../op-metadata'
import type { TypeRegistry } from '../type-registry'
import {
  AddressClass,
  arc4AddressAlias,
  ARC4BoolClass,
  arc4BooleanType,
  arc4ByteAlias,
  ARC4StrClass,
  arc4StringType,
  ARC4StructClass,
  ARC4StructType,
  Arc4TupleClass,
  Arc4TupleGeneric,
  ARC4TupleType,
  ByteClass,
  decodeArc4Function,
  DynamicArrayConstructor,
  DynamicArrayGeneric,
  DynamicArrayType,
  DynamicBytesConstructor,
  DynamicBytesType,
  encodeArc4Function,
  interpretAsArc4Function,
  methodSelectorFunction,
  StaticArrayConstructor,
  StaticArrayGeneric,
  StaticArrayType,
  StaticBytesConstructor,
  StaticBytesGeneric,
  StaticBytesType,
  UFixedNxMClass,
  UFixedNxMGeneric,
  UFixedNxMType,
  UintN128Class,
  UintN16Class,
  UintN256Class,
  UintN32Class,
  UintN64Class,
  UintN8Class,
  UintNClass,
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
  BoxFunction,
  BoxGeneric,
  BoxMapFunction,
  BoxMapGeneric,
  BoxMapPType,
  BoxPType,
  BoxRefFunction,
  boxRefType,
  BytesFunction,
  bytesPType,
  ClassMethodDecoratorContext,
  compileFunctionType,
  ContractClassPType,
  contractOptionsDecorator,
  ensureBudgetFunction,
  errFunction,
  FunctionPType,
  GeneratorGeneric,
  GeneratorType,
  GlobalStateFunction,
  GlobalStateGeneric,
  GlobalStateType,
  IntrinsicFunctionGroupType,
  IntrinsicFunctionGroupTypeType,
  IntrinsicFunctionType,
  IntrinsicFunctionTypeType,
  IterableIteratorGeneric,
  IterableIteratorType,
  keyRegistrationGtxnType,
  keyRegistrationItxnFn,
  keyRegistrationItxnParamsType,
  keyRegistrationItxnType,
  KeyRegistrationTxnFunction,
  LocalStateFunction,
  LocalStateGeneric,
  LocalStateType,
  logFunction,
  logicSigOptionsDecorator,
  LogicSigPType,
  NamespacePType,
  neverPType,
  ObjectPType,
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
  StringFunction,
  stringPType,
  submitGroupItxnFunction,
  SuperPrototypeSelector,
  SuperPrototypeSelectorGeneric,
  TemplateVarFunction,
  TransactionFunction,
  transactionTypeType,
  TuplePType,
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
  typeRegistry.register({ ptype: bytesPType, instanceEb: BytesExpressionBuilder })
  typeRegistry.register({ ptype: BytesFunction, singletonEb: BytesFunctionBuilder })
  typeRegistry.register({ ptype: stringPType, instanceEb: StringExpressionBuilder })
  typeRegistry.register({ ptype: voidPType, instanceEb: VoidExpressionBuilder })
  typeRegistry.register({ ptype: StringFunction, singletonEb: StringFunctionBuilder })

  // Compound
  typeRegistry.register({ ptype: ArrayPType, instanceEb: NativeArrayExpressionBuilder })
  typeRegistry.register({ ptype: TuplePType, instanceEb: TupleExpressionBuilder })
  typeRegistry.register({ ptype: ObjectPType, instanceEb: ObjectExpressionBuilder })

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
  typeRegistry.register({ ptype: assertMatchFunction, singletonEb: AssertMatchFunctionBuilder })
  typeRegistry.register({ ptype: ensureBudgetFunction, singletonEb: EnsureBudgetFunctionBuilder })
  typeRegistry.register({ ptype: urangeFunction, singletonEb: UrangeFunctionBuilder })
  typeRegistry.register({ ptype: TemplateVarFunction, singletonEb: TemplateVarFunctionBuilder })
  typeRegistry.register({ ptype: compileFunctionType, singletonEb: CompileFunctionBuilder })
  typeRegistry.register({ ptype: arc28EmitFunction, singletonEb: Arc28EmitFunctionBuilder })

  typeRegistry.register({ ptype: ContractClassPType, singletonEb: ContractClassBuilder })
  typeRegistry.register({ ptype: contractOptionsDecorator, singletonEb: ContractOptionsDecoratorBuilder })
  typeRegistry.register({ ptype: LogicSigPType, singletonEb: LogicSigClassBuilder })
  typeRegistry.register({ ptype: logicSigOptionsDecorator, singletonEb: LogicSigOptionsDecoratorBuilder })

  for (const enumType of [opUpFeeSourceType, onCompleteActionType, transactionTypeType]) {
    typeRegistry.register({ ptype: enumType, singletonEb: Uint64EnumTypeBuilder })
    typeRegistry.register({ ptype: enumType.memberType, instanceEb: Uint64EnumMemberExpressionBuilder })
  }

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
  typeRegistry.register({ ptype: GlobalStateFunction, singletonEb: GlobalStateFunctionBuilder })
  typeRegistry.registerGeneric({ generic: GlobalStateGeneric, ptype: GlobalStateType, instanceEb: GlobalStateExpressionBuilder })
  typeRegistry.register({ ptype: LocalStateFunction, singletonEb: LocalStateFunctionBuilder })
  typeRegistry.registerGeneric({ generic: LocalStateGeneric, ptype: LocalStateType, instanceEb: LocalStateExpressionBuilder })
  typeRegistry.register({ ptype: BoxFunction, singletonEb: BoxFunctionBuilder })
  typeRegistry.registerGeneric({ generic: BoxGeneric, ptype: BoxPType, instanceEb: BoxExpressionBuilder })
  typeRegistry.register({ ptype: BoxMapFunction, singletonEb: BoxMapFunctionBuilder })
  typeRegistry.registerGeneric({ generic: BoxMapGeneric, ptype: BoxMapPType, instanceEb: BoxMapExpressionBuilder })
  typeRegistry.register({ ptype: BoxRefFunction, singletonEb: BoxRefFunctionBuilder })
  typeRegistry.register({ ptype: boxRefType, instanceEb: BoxRefExpressionBuilder })

  // Reference types
  typeRegistry.register({ ptype: ApplicationFunctionType, singletonEb: ApplicationFunctionBuilder })
  typeRegistry.register({ ptype: applicationPType, instanceEb: ApplicationExpressionBuilder })
  typeRegistry.register({ ptype: AccountFunction, singletonEb: AccountFunctionBuilder })
  typeRegistry.register({ ptype: accountPType, instanceEb: AccountExpressionBuilder })
  typeRegistry.register({ ptype: AssetFunction, singletonEb: AssetFunctionBuilder })
  typeRegistry.register({ ptype: assetPType, instanceEb: AssetExpressionBuilder })

  // ARC4 encoded
  typeRegistry.register({ ptype: UintNClass, singletonEb: UintNClassBuilder })
  typeRegistry.register({ ptype: arc4AbiMethodDecorator, singletonEb: Arc4AbiMethodDecoratorBuilder })
  typeRegistry.register({ ptype: arc4BareMethodDecorator, singletonEb: Arc4BareMethodDecoratorBuilder })
  typeRegistry.register({ ptype: ByteClass, singletonEb: classBuilderForUintNAlias(ByteClass, arc4ByteAlias) })
  typeRegistry.register({ ptype: UintN8Class, singletonEb: classBuilderForUintNAlias(UintN8Class, new UintNType({ n: 8n })) })
  typeRegistry.register({ ptype: UintN16Class, singletonEb: classBuilderForUintNAlias(UintN8Class, new UintNType({ n: 16n })) })
  typeRegistry.register({ ptype: UintN32Class, singletonEb: classBuilderForUintNAlias(UintN8Class, new UintNType({ n: 32n })) })
  typeRegistry.register({ ptype: UintN64Class, singletonEb: classBuilderForUintNAlias(UintN8Class, new UintNType({ n: 64n })) })
  typeRegistry.register({ ptype: UintN128Class, singletonEb: classBuilderForUintNAlias(UintN8Class, new UintNType({ n: 128n })) })
  typeRegistry.register({ ptype: UintN256Class, singletonEb: classBuilderForUintNAlias(UintN8Class, new UintNType({ n: 256n })) })
  typeRegistry.registerGeneric({ generic: UintNGeneric, ptype: UintNType, instanceEb: UintNExpressionBuilder })
  typeRegistry.register({ ptype: UFixedNxMClass, singletonEb: UFixedNxMClassBuilder })
  typeRegistry.registerGeneric({ generic: UFixedNxMGeneric, ptype: UFixedNxMType, instanceEb: UFixedNxMExpressionBuilder })
  typeRegistry.register({ ptype: arc4ByteAlias, instanceEb: UintNExpressionBuilder })
  typeRegistry.register({ ptype: DynamicArrayConstructor, singletonEb: DynamicArrayClassBuilder })
  typeRegistry.registerGeneric({ generic: DynamicArrayGeneric, ptype: DynamicArrayType, instanceEb: DynamicArrayExpressionBuilder })
  typeRegistry.register({ ptype: StaticArrayConstructor, singletonEb: StaticArrayClassBuilder })
  typeRegistry.registerGeneric({ generic: StaticArrayGeneric, ptype: StaticArrayType, instanceEb: StaticArrayExpressionBuilder })
  typeRegistry.register({ ptype: arc4AddressAlias, instanceEb: AddressExpressionBuilder })
  typeRegistry.register({ ptype: AddressClass, singletonEb: AddressClassBuilder })
  typeRegistry.register({ ptype: ARC4BoolClass, singletonEb: BoolClassBuilder })
  typeRegistry.register({ ptype: arc4BooleanType, instanceEb: BoolExpressionBuilder })
  typeRegistry.register({ ptype: arc4StringType, instanceEb: StrExpressionBuilder })
  typeRegistry.register({ ptype: ARC4StrClass, singletonEb: StrClassBuilder })
  typeRegistry.register({ ptype: Arc4TupleClass, singletonEb: Arc4TupleClassBuilder })
  typeRegistry.registerGeneric({ generic: Arc4TupleGeneric, ptype: ARC4TupleType, instanceEb: Arc4TupleExpressionBuilder })
  typeRegistry.register({ ptype: ARC4StructType, instanceEb: StructExpressionBuilder })
  typeRegistry.register({ ptype: ARC4StructClass, singletonEb: StructClassBuilder })
  typeRegistry.register({ ptype: DynamicBytesConstructor, singletonEb: DynamicBytesClassBuilder })
  typeRegistry.register({ ptype: StaticBytesConstructor, singletonEb: StaticBytesClassBuilder })
  typeRegistry.register({ ptype: DynamicBytesType, instanceEb: DynamicBytesExpressionBuilder })
  typeRegistry.registerGeneric({ generic: StaticBytesGeneric, ptype: StaticBytesType, instanceEb: StaticBytesExpressionBuilder })
  typeRegistry.register({ ptype: interpretAsArc4Function, singletonEb: InterpretAsArc4FunctionBuilder })
  typeRegistry.register({ ptype: encodeArc4Function, singletonEb: EncodeArc4FunctionBuilder })
  typeRegistry.register({ ptype: decodeArc4Function, singletonEb: DecodeArc4FunctionBuilder })
  typeRegistry.register({ ptype: methodSelectorFunction, singletonEb: MethodSelectorFunctionBuilder })

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
}
