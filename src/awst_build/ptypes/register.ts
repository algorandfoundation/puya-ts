import { Arc4AbiMethodDecoratorBuilder, Arc4BareMethodDecoratorBuilder } from '../eb/arc4-bare-method-decorator-builder'
import {
  AddressClassBuilder,
  AddressExpressionBuilder,
  DynamicArrayClassBuilder,
  DynamicArrayExpressionBuilder,
  StaticArrayClassBuilder,
  StaticArrayExpressionBuilder,
} from '../eb/arc4/arrays'
import { BoolClassBuilder, BoolExpressionBuilder } from '../eb/arc4/bool'
import { StrClassBuilder, StrExpressionBuilder } from '../eb/arc4/string'
import { ByteClassBuilder, UintNClassBuilder, UintNExpressionBuilder } from '../eb/arc4/uintn'
import { AssertFunctionBuilder, ErrFunctionBuilder } from '../eb/assert-function-builder'
import { AssertMatchFunctionBuilder } from '../eb/assert-match-function-builder'
import { BigUintExpressionBuilder, BigUintFunctionBuilder } from '../eb/biguint-expression-builder'
import { BooleanExpressionBuilder, BooleanFunctionBuilder } from '../eb/boolean-expression-builder'
import { BytesExpressionBuilder, BytesFunctionBuilder } from '../eb/bytes-expression-builder'
import { EnsureBudgetFunctionBuilder } from '../eb/ensure-budget'
import { FreeSubroutineExpressionBuilder } from '../eb/free-subroutine-expression-builder'
import { IntrinsicEnumBuilder } from '../eb/intrinsic-enum-builder'
import { IterableIteratorExpressionBuilder } from '../eb/iterable-iterator-expression-builder'
import { ObjectExpressionBuilder } from '../eb/literal/object-expression-builder'
import { LogFunctionBuilder } from '../eb/log-function-builder'
import { NamespaceBuilder } from '../eb/namespace-builder'
import { NativeArrayExpressionBuilder } from '../eb/native-array-expression-builder'
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
import { UrangeFunctionBuilder } from '../eb/urange-function'
import { VoidExpressionBuilder } from '../eb/void-expression-builder'
import { OP_METADATA } from '../op-metadata'
import type { TypeRegistry } from '../type-registry'
import {
  AddressClass,
  arc4AddressAlias,
  ARC4BoolClass,
  ARC4BooleanType,
  arc4ByteAlias,
  ARC4StrClass,
  ARC4StringType,
  ByteClass,
  DynamicArrayConstructor,
  DynamicArrayType,
  StaticArrayConstructor,
  StaticArrayType,
  UintNClass,
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
  BoxMapFunction,
  BoxMapPType,
  BoxPType,
  BoxRefFunction,
  boxRefType,
  BytesFunction,
  bytesPType,
  ensureBudgetFunction,
  errFunction,
  FunctionPType,
  GlobalStateFunction,
  GlobalStateType,
  IntrinsicFunctionGroupType,
  IntrinsicFunctionGroupTypeType,
  IntrinsicFunctionType,
  IntrinsicFunctionTypeType,
  IterableIteratorType,
  keyRegistrationGtxnType,
  keyRegistrationItxnFn,
  keyRegistrationItxnParamsType,
  keyRegistrationItxnType,
  KeyRegistrationTxnFunction,
  LocalStateFunction,
  LocalStateType,
  logFunction,
  NamespacePType,
  ObjectPType,
  onCompleteActionType,
  opUpFeeSourceType,
  paymentGtxnType,
  paymentItxnFn,
  paymentItxnParamsType,
  paymentItxnType,
  PaymentTxnFunction,
  StringFunction,
  stringPType,
  submitGroupItxnFunction,
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
  typeRegistry.register({ ptype: boolPType, instanceEb: BooleanExpressionBuilder })
  typeRegistry.register({ ptype: BooleanFunction, singletonEb: BooleanFunctionBuilder })
  typeRegistry.register({ ptype: uint64PType, instanceEb: UInt64ExpressionBuilder })
  typeRegistry.register({ ptype: Uint64Function, singletonEb: UInt64FunctionBuilder })
  typeRegistry.register({ ptype: biguintPType, instanceEb: BigUintExpressionBuilder })
  typeRegistry.register({ ptype: BigUintFunction, singletonEb: BigUintFunctionBuilder })
  typeRegistry.register({ ptype: bytesPType, instanceEb: BytesExpressionBuilder })
  typeRegistry.register({ ptype: BytesFunction, singletonEb: BytesFunctionBuilder })
  typeRegistry.register({ ptype: stringPType, instanceEb: StringExpressionBuilder })
  typeRegistry.register({ ptype: StringFunction, singletonEb: StringFunctionBuilder })
  typeRegistry.register({ ptype: logFunction, singletonEb: LogFunctionBuilder })
  typeRegistry.register({ ptype: assertFunction, singletonEb: AssertFunctionBuilder })
  typeRegistry.register({ ptype: errFunction, singletonEb: ErrFunctionBuilder })
  typeRegistry.register({ ptype: AssetFunction, singletonEb: AssetFunctionBuilder })
  typeRegistry.register({ ptype: assetPType, instanceEb: AssetExpressionBuilder })
  typeRegistry.register({ ptype: FunctionPType, singletonEb: FreeSubroutineExpressionBuilder })
  typeRegistry.register({ ptype: NamespacePType, singletonEb: NamespaceBuilder })
  typeRegistry.register({ ptype: voidPType, instanceEb: VoidExpressionBuilder })
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

  typeRegistry.register({ ptype: ArrayPType, instanceEb: NativeArrayExpressionBuilder })

  typeRegistry.register({ ptype: GlobalStateFunction, singletonEb: GlobalStateFunctionBuilder })
  typeRegistry.registerGeneric({ ptype: GlobalStateType, instanceEb: GlobalStateExpressionBuilder })
  typeRegistry.register({ ptype: LocalStateFunction, singletonEb: LocalStateFunctionBuilder })
  typeRegistry.registerGeneric({ ptype: LocalStateType, instanceEb: LocalStateExpressionBuilder })
  typeRegistry.register({ ptype: BoxFunction, singletonEb: BoxFunctionBuilder })
  typeRegistry.registerGeneric({ ptype: BoxPType, instanceEb: BoxExpressionBuilder })
  typeRegistry.register({ ptype: BoxMapFunction, singletonEb: BoxMapFunctionBuilder })
  typeRegistry.registerGeneric({ ptype: BoxMapPType, instanceEb: BoxMapExpressionBuilder })
  typeRegistry.register({ ptype: BoxRefFunction, singletonEb: BoxRefFunctionBuilder })
  typeRegistry.register({ ptype: boxRefType, instanceEb: BoxRefExpressionBuilder })
  typeRegistry.register({ ptype: TuplePType, instanceEb: TupleExpressionBuilder })
  typeRegistry.register({ ptype: arc4AbiMethodDecorator, singletonEb: Arc4AbiMethodDecoratorBuilder })
  typeRegistry.register({ ptype: arc4BareMethodDecorator, singletonEb: Arc4BareMethodDecoratorBuilder })
  typeRegistry.register({ ptype: ObjectPType, instanceEb: ObjectExpressionBuilder })
  typeRegistry.register({ ptype: AccountFunction, singletonEb: AccountFunctionBuilder })
  typeRegistry.register({ ptype: accountPType, instanceEb: AccountExpressionBuilder })
  typeRegistry.register({ ptype: UintNClass, singletonEb: UintNClassBuilder })
  typeRegistry.register({ ptype: ByteClass, singletonEb: ByteClassBuilder })
  typeRegistry.registerGeneric({ ptype: UintNType, instanceEb: UintNExpressionBuilder })
  typeRegistry.register({ ptype: arc4ByteAlias, instanceEb: UintNExpressionBuilder })
  typeRegistry.register({ ptype: DynamicArrayConstructor, singletonEb: DynamicArrayClassBuilder })
  typeRegistry.registerGeneric({ ptype: DynamicArrayType, instanceEb: DynamicArrayExpressionBuilder })
  typeRegistry.register({ ptype: StaticArrayConstructor, singletonEb: StaticArrayClassBuilder })
  typeRegistry.registerGeneric({ ptype: StaticArrayType, instanceEb: StaticArrayExpressionBuilder })
  typeRegistry.register({ ptype: arc4AddressAlias, instanceEb: AddressExpressionBuilder })
  typeRegistry.register({ ptype: AddressClass, singletonEb: AddressClassBuilder })
  typeRegistry.register({ ptype: ARC4BoolClass, singletonEb: BoolClassBuilder })
  typeRegistry.register({ ptype: ARC4BooleanType, instanceEb: BoolExpressionBuilder })
  typeRegistry.register({ ptype: ARC4StringType, instanceEb: StrExpressionBuilder })
  typeRegistry.register({ ptype: ARC4StrClass, singletonEb: StrClassBuilder })

  typeRegistry.register({ ptype: ApplicationFunctionType, singletonEb: ApplicationFunctionBuilder })
  typeRegistry.register({ ptype: applicationPType, instanceEb: ApplicationExpressionBuilder })

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

  typeRegistry.register({ ptype: assertMatchFunction, singletonEb: AssertMatchFunctionBuilder })
  typeRegistry.register({ ptype: ensureBudgetFunction, singletonEb: EnsureBudgetFunctionBuilder })

  for (const enumType of [opUpFeeSourceType, onCompleteActionType, transactionTypeType]) {
    typeRegistry.register({ ptype: enumType, singletonEb: Uint64EnumTypeBuilder })
    typeRegistry.register({ ptype: enumType.memberType, instanceEb: Uint64EnumMemberExpressionBuilder })
  }

  typeRegistry.register({ ptype: urangeFunction, singletonEb: UrangeFunctionBuilder })
  typeRegistry.registerGeneric({ ptype: IterableIteratorType, instanceEb: IterableIteratorExpressionBuilder })

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
