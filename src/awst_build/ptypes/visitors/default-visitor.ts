import type {
  AnyPType,
  ArrayLiteralPType,
  ArrayPType,
  BoxMapPType,
  BoxPType,
  BytesPType,
  ContractClassPType,
  FixedArrayPType,
  FunctionPType,
  GlobalStateType,
  GroupTransactionPType,
  ImmutableObjectPType,
  InnerTransactionPType,
  InstanceType,
  InternalType,
  IntrinsicFunctionGroupType,
  IntrinsicFunctionGroupTypeType,
  IntrinsicFunctionType,
  IntrinsicFunctionTypeType,
  IterableIteratorType,
  ItxnParamsPType,
  LibClassType,
  LibFunctionType,
  LibObjType,
  LocalStateType,
  LogicSigPType,
  MutableObjectPType,
  MutableTuplePType,
  NamespacePType,
  ObjectLiteralPType,
  ReadonlyArrayPType,
  ReadonlyTuplePType,
  ReferenceArrayType,
  SuperPrototypeSelector,
  TransientType,
  TypeParameterType,
  Uint64EnumMemberType,
  Uint64EnumType,
  UnsupportedType,
} from '..'
import type {
  ARC4InstanceType,
  ARC4StructClass,
  ARC4StructType,
  ARC4TupleType,
  ContractProxyType,
  DynamicArrayType,
  StaticArrayType,
  UFixedNxMType,
  UintNType,
} from '../arc4-types'
import type { GenericPType, PType } from '../base'
import type { IntrinsicEnumType } from '../intrinsic-enum-type'

import type { PTypeVisitor } from '../visitor'

export abstract class DefaultVisitor<T> implements PTypeVisitor<T> {
  abstract defaultReturn(ptype: PType): T

  visitIterableIterator(ptype: IterableIteratorType): T {
    return this.defaultReturn(ptype)
  }
  visitGeneric(ptype: GenericPType): T {
    return this.defaultReturn(ptype)
  }
  visitMutableObjectPType(ptype: MutableObjectPType): T {
    return this.defaultReturn(ptype)
  }

  visitObjectLiteralPType(ptype: ObjectLiteralPType): T {
    return this.defaultReturn(ptype)
  }

  visitIntrinsicEnumType(ptype: IntrinsicEnumType): T {
    return this.defaultReturn(ptype)
  }
  visitReferenceArrayType(ptype: ReferenceArrayType): T {
    return this.defaultReturn(ptype)
  }
  visitUnsupportedType(ptype: UnsupportedType): T {
    return this.defaultReturn(ptype)
  }
  visitTransientType(ptype: TransientType): T {
    return this.defaultReturn(ptype)
  }
  visitARC4InstanceType(ptype: ARC4InstanceType): T {
    return this.defaultReturn(ptype)
  }
  visitARC4StructClass(ptype: ARC4StructClass): T {
    return this.defaultReturn(ptype)
  }
  visitARC4StructType(ptype: ARC4StructType): T {
    return this.defaultReturn(ptype)
  }
  visitARC4TupleType(ptype: ARC4TupleType): T {
    return this.defaultReturn(ptype)
  }
  visitUintNType(ptype: UintNType): T {
    return this.defaultReturn(ptype)
  }
  visitUFixedNxMType(ptype: UFixedNxMType): T {
    return this.defaultReturn(ptype)
  }
  visitDynamicArrayType(ptype: DynamicArrayType): T {
    return this.defaultReturn(ptype)
  }
  visitStaticArrayType(ptype: StaticArrayType): T {
    return this.defaultReturn(ptype)
  }
  visitContractProxyType(ptype: ContractProxyType): T {
    return this.defaultReturn(ptype)
  }
  visitImmutableObjectPType(ptype: ImmutableObjectPType): T {
    return this.defaultReturn(ptype)
  }
  visitLogicSigPType(ptype: LogicSigPType): T {
    return this.defaultReturn(ptype)
  }
  visitItxnParamsPType(ptype: ItxnParamsPType): T {
    return this.defaultReturn(ptype)
  }
  visitInnerTransactionPType(ptype: InnerTransactionPType): T {
    return this.defaultReturn(ptype)
  }
  visitSuperPrototypeSelector(ptype: SuperPrototypeSelector): T {
    return this.defaultReturn(ptype)
  }
  visitUint64EnumType(ptype: Uint64EnumType): T {
    return this.defaultReturn(ptype)
  }
  visitUint64EnumMemberType(ptype: Uint64EnumMemberType): T {
    return this.defaultReturn(ptype)
  }
  visitLibFunctionType(ptype: LibFunctionType): T {
    return this.defaultReturn(ptype)
  }
  visitGroupTransactionPType(ptype: GroupTransactionPType): T {
    return this.defaultReturn(ptype)
  }
  visitBytesPType(ptype: BytesPType): T {
    return this.defaultReturn(ptype)
  }
  visitFixedArrayPType(ptype: FixedArrayPType): T {
    return this.defaultReturn(ptype)
  }
  visitReadonlyArrayPType(ptype: ReadonlyArrayPType): T {
    return this.defaultReturn(ptype)
  }
  visitArrayPType(ptype: ArrayPType): T {
    return this.defaultReturn(ptype)
  }
  visitReadonlyTuplePType(ptype: ReadonlyTuplePType): T {
    return this.defaultReturn(ptype)
  }
  visitMutableTuplePType(ptype: MutableTuplePType): T {
    return this.defaultReturn(ptype)
  }
  visitArrayLiteralPType(ptype: ArrayLiteralPType): T {
    return this.defaultReturn(ptype)
  }
  visitFunctionPType(ptype: FunctionPType): T {
    return this.defaultReturn(ptype)
  }
  visitNamespacePType(ptype: NamespacePType): T {
    return this.defaultReturn(ptype)
  }
  visitIntrinsicFunctionTypeType(ptype: IntrinsicFunctionTypeType): T {
    return this.defaultReturn(ptype)
  }
  visitIntrinsicFunctionType(ptype: IntrinsicFunctionType): T {
    return this.defaultReturn(ptype)
  }
  visitIntrinsicFunctionGroupTypeType(ptype: IntrinsicFunctionGroupTypeType): T {
    return this.defaultReturn(ptype)
  }
  visitIntrinsicFunctionGroupType(ptype: IntrinsicFunctionGroupType): T {
    return this.defaultReturn(ptype)
  }
  visitLibObjType(ptype: LibObjType): T {
    return this.defaultReturn(ptype)
  }
  visitLibClassType(ptype: LibClassType): T {
    return this.defaultReturn(ptype)
  }
  visitInstanceType(ptype: InstanceType): T {
    return this.defaultReturn(ptype)
  }
  visitContractClassPType(ptype: ContractClassPType): T {
    return this.defaultReturn(ptype)
  }
  visitGlobalStateType(ptype: GlobalStateType): T {
    return this.defaultReturn(ptype)
  }
  visitLocalStateType(ptype: LocalStateType): T {
    return this.defaultReturn(ptype)
  }
  visitBoxPType(ptype: BoxPType): T {
    return this.defaultReturn(ptype)
  }
  visitBoxMapPType(ptype: BoxMapPType): T {
    return this.defaultReturn(ptype)
  }
  visitTypeParameterType(ptype: TypeParameterType): T {
    return this.defaultReturn(ptype)
  }
  visitInternalType(ptype: InternalType): T {
    return this.defaultReturn(ptype)
  }
  visitAnyPType(ptype: AnyPType): T {
    return this.defaultReturn(ptype)
  }
}
