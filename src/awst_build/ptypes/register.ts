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
  arc4AbiMethodDecorator,
  arc4BareMethodDecorator,
  assertFunction,
  AssetFunction,
  assetPType,
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
  errFunction,
  FunctionPType,
  GlobalStateFunction,
  GlobalStateType,
  IntrinsicFunctionGroupType,
  IntrinsicFunctionType,
  logFunction,
  NamespacePType,
  ObjectPType,
  StringFunction,
  stringPType,
  TuplePType,
  Uint64Function,
  uint64PType,
  voidPType,
} from './index'
import { ObjectExpressionBuilder } from '../eb/literal/object-expression-builder'

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
}
