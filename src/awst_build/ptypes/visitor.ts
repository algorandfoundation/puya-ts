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
} from './arc4-types'
import type {
  AnyPType,
  ArrayLiteralPType,
  ArrayPType,
  BoxMapPType,
  BoxPType,
  BoxRefPType,
  BytesPType,
  ContractClassPType,
  FixedArrayPType,
  FunctionPType,
  GenericPType,
  GlobalStateType,
  GroupTransactionPType,
  InnerTransactionPType,
  InstanceType,
  InternalType,
  IntrinsicEnumType,
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
  MutableTuplePType,
  NamespacePType,
  ObjectPType,
  ReadonlyArrayPType,
  ReadonlyTuplePType,
  ReferenceArrayType,
  SuperPrototypeSelector,
  TransientType,
  TypeParameterType,
  Uint64EnumMemberType,
  Uint64EnumType,
  UnsupportedType,
} from './index'
import type { MutableObjectClass, MutableObjectType } from './mutable-object'

export interface PTypeVisitor<T> {
  visitGeneric(ptype: GenericPType): T

  visitMutableObjectType(ptype: MutableObjectType): T

  visitMutableObjectClass(ptype: MutableObjectClass): T

  visitIntrinsicEnumType(ptype: IntrinsicEnumType): T

  visitReferenceArrayType(ptype: ReferenceArrayType): T

  visitUnsupportedType(ptype: UnsupportedType): T

  visitTransientType(ptype: TransientType): T

  visitARC4InstanceType(ptype: ARC4InstanceType): T
  visitARC4StructClass(ptype: ARC4StructClass): T
  visitARC4StructType(ptype: ARC4StructType): T
  visitARC4TupleType(ptype: ARC4TupleType): T
  visitUintNType(ptype: UintNType): T
  visitUFixedNxMType(ptype: UFixedNxMType): T
  visitDynamicArrayType(ptype: DynamicArrayType): T
  visitStaticArrayType(ptype: StaticArrayType): T
  visitContractProxyType(ptype: ContractProxyType): T
  visitObjectPType(ptype: ObjectPType): T
  visitLogicSigPType(ptype: LogicSigPType): T
  visitItxnParamsPType(ptype: ItxnParamsPType): T
  visitInnerTransactionPType(ptype: InnerTransactionPType): T
  visitSuperPrototypeSelector(ptype: SuperPrototypeSelector): T
  visitUint64EnumType(ptype: Uint64EnumType): T
  visitUint64EnumMemberType(ptype: Uint64EnumMemberType): T
  visitLibFunctionType(ptype: LibFunctionType): T
  visitGroupTransactionPType(ptype: GroupTransactionPType): T
  visitBytesPType(ptype: BytesPType): T
  visitFixedArrayPType(ptype: FixedArrayPType): T
  visitReadonlyArrayPType(ptype: ReadonlyArrayPType): T
  visitArrayPType(ptype: ArrayPType): T
  visitReadonlyTuplePType(ptype: ReadonlyTuplePType): T
  visitMutableTuplePType(ptype: MutableTuplePType): T
  visitArrayLiteralPType(ptype: ArrayLiteralPType): T
  visitFunctionPType(ptype: FunctionPType): T
  visitNamespacePType(ptype: NamespacePType): T
  visitIntrinsicFunctionTypeType(ptype: IntrinsicFunctionTypeType): T
  visitIntrinsicFunctionType(ptype: IntrinsicFunctionType): T
  visitIntrinsicFunctionGroupTypeType(ptype: IntrinsicFunctionGroupTypeType): T
  visitIntrinsicFunctionGroupType(ptype: IntrinsicFunctionGroupType): T
  visitLibObjType(ptype: LibObjType): T
  visitLibClassType(ptype: LibClassType): T
  visitInstanceType(ptype: InstanceType): T

  visitContractClassPType(ptype: ContractClassPType): T

  visitGlobalStateType(ptype: GlobalStateType): T
  visitLocalStateType(ptype: LocalStateType): T
  visitBoxPType(ptype: BoxPType): T
  visitBoxMapPType(ptype: BoxMapPType): T
  visitBoxRefPType(ptype: BoxRefPType): T

  visitTypeParameterType(ptype: TypeParameterType): T

  visitInternalType(ptype: InternalType): T

  visitAnyPType(ptype: AnyPType): T

  visitIterableIterator(ptype: IterableIteratorType): T
}
