import type { TypeRegistry } from '../type-registry'
import { BooleanExpressionBuilder, BooleanFunctionBuilder } from '../eb/boolean-expression-builder'
import { UInt64ExpressionBuilder, UInt64FunctionBuilder } from '../eb/uint64-expression-builder'
import { BigUintExpressionBuilder, BigUintFunctionBuilder } from '../eb/biguint-expression-builder'
import { BytesExpressionBuilder, BytesFunctionBuilder } from '../eb/bytes-expression-builder'
import { StringExpressionBuilder, StringFunctionBuilder } from '../eb/string-expression-builder'
import { LogFunctionBuilder } from '../eb/log-function-builder'
import { AssertFunctionBuilder, ErrFunctionBuilder } from '../eb/assert-function-builder'
import { AssetExpressionBuilder, AssetFunctionBuilder } from '../eb/reference/asset'
import { FreeSubroutineExpressionBuilder } from '../eb/free-subroutine-expression-builder'
import { NamespaceBuilder } from '../eb/namespace-builder'
import { VoidExpressionBuilder } from '../eb/void-expression-builder'
import { ALL_OP_ENUMS } from './op-ptypes'
import { IntrinsicEnumBuilder } from '../eb/intrinsic-enum-builder'
import { OP_METADATA } from '../op-metadata'
import { FreeIntrinsicOpBuilder, IntrinsicOpGroupBuilder } from '../eb/op-module-builder'
import { GlobalStateExpressionBuilder, GlobalStateFunctionBuilder } from '../eb/storage/global-state'
import {
  BoxExpressionBuilder,
  BoxFunctionBuilder,
  BoxMapExpressionBuilder,
  BoxMapFunctionBuilder,
  BoxRefExpressionBuilder,
  BoxRefFunctionBuilder,
} from '../eb/storage/box'
import { TupleExpressionBuilder } from '../eb/tuple-expression-builder'
import { Arc4AbiMethodDecoratorBuilder, Arc4BareMethodDecoratorBuilder } from '../eb/arc4-bare-method-decorator-builder'
import {
  AccountFunction,
  accountPType,
  anyGtxnType,
  applicationCallItxnFn,
  applicationCallItxnParamsType,
  applicationItxnType,
  applicationCallGtxnType,
  ApplicationTxnFunction,
  arc4AbiMethodDecorator,
  arc4BareMethodDecorator,
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
  IntrinsicFunctionType,
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
  PayTxnFunction,
  StringFunction,
  stringPType,
  TransactionFunction,
  transactionTypeType,
  TuplePType,
  Uint64Function,
  uint64PType,
  urangeFunction,
  voidPType,
  applicationPType,
  ApplicationFunctionType,
  submitGroupItxnFunction,
} from './index'
import { ObjectExpressionBuilder } from '../eb/literal/object-expression-builder'
import { AccountExpressionBuilder, AccountFunctionBuilder } from '../eb/reference/account'
import { LocalStateExpressionBuilder, LocalStateFunctionBuilder } from '../eb/storage/local-state'
import { UintNConstructorBuilder, UintNExpressionBuilder } from '../eb/arc4/uint-n-constructor-builder'
import { GroupTransactionExpressionBuilder, GroupTransactionFunctionBuilder } from '../eb/transactions/group-transactions'
import {
  DynamicArrayConstructor,
  DynamicArrayType,
  StaticArrayConstructor,
  StaticArrayType,
  UintNConstructor,
  UintNType,
} from './arc4-types'
import {
  DynamicArrayConstructorBuilder,
  DynamicArrayExpressionBuilder,
  StaticArrayConstructorBuilder,
  StaticArrayExpressionBuilder,
} from '../eb/arc4/arrays'
import { AssertMatchFunctionBuilder } from '../eb/assert-match-function-builder'
import { EnsureBudgetFunctionBuilder } from '../eb/ensure-budget'
import { Uint64EnumTypeBuilder } from '../eb/uint64-enum-type-builder'
import { UrangeFunctionBuilder } from '../eb/urange-function'
import { IterableIteratorExpressionBuilder } from '../eb/iterable-iterator-expression-builder'
import { InnerTransactionExpressionBuilder } from '../eb/transactions/inner-transactions'
import {
  ItxnParamsExpressionBuilder,
  ItxnParamsFactoryFunctionBuilder,
  SubmitItxnGroupFunctionBuilder,
} from '../eb/transactions/inner-transaction-params'
import { ApplicationExpressionBuilder, ApplicationFunctionBuilder } from '../eb/reference/application'

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
    } else {
      typeRegistry.register({
        ptype: new IntrinsicFunctionType({
          name,
        }),
        singletonEb: FreeIntrinsicOpBuilder,
      })
    }
  }

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
  typeRegistry.register({ ptype: UintNConstructor, singletonEb: UintNConstructorBuilder })
  typeRegistry.registerGeneric({ ptype: UintNType, instanceEb: UintNExpressionBuilder })
  typeRegistry.register({ ptype: DynamicArrayConstructor, singletonEb: DynamicArrayConstructorBuilder })
  typeRegistry.registerGeneric({ ptype: DynamicArrayType, instanceEb: DynamicArrayExpressionBuilder })
  typeRegistry.register({ ptype: StaticArrayConstructor, singletonEb: StaticArrayConstructorBuilder })
  typeRegistry.registerGeneric({ ptype: StaticArrayType, instanceEb: StaticArrayExpressionBuilder })

  typeRegistry.register({ ptype: ApplicationFunctionType, singletonEb: ApplicationFunctionBuilder })
  typeRegistry.register({ ptype: applicationPType, instanceEb: ApplicationExpressionBuilder })

  typeRegistry.register({ ptype: paymentGtxnType, instanceEb: GroupTransactionExpressionBuilder })
  typeRegistry.register({ ptype: PayTxnFunction, singletonEb: GroupTransactionFunctionBuilder })
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

  typeRegistry.register({ ptype: opUpFeeSourceType, singletonEb: Uint64EnumTypeBuilder })
  typeRegistry.register({ ptype: onCompleteActionType, singletonEb: Uint64EnumTypeBuilder })
  typeRegistry.register({ ptype: transactionTypeType, singletonEb: Uint64EnumTypeBuilder })

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
