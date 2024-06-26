/* AUTOGENERATED FILE - DO NOT EDIT (see puya/scripts/generate_ts_nodes.py) */
import * as wtypes from './wtypes'
import { SourceLocation } from './source-location'
import { ARC4BareMethodConfig, ARC4ABIMethodConfig } from './arc4'
import { Props } from '../typescript-helpers'
export abstract class Node {
  sourceLocation!: SourceLocation
}
export abstract class Statement extends Node {
  abstract accept<T>(visitor: StatementVisitor<T>): T
}
export abstract class Expression extends Node {
  wtype!: wtypes.WType
  abstract accept<T>(visitor: ExpressionVisitor<T>): T
}
export class ExpressionStatement extends Statement {
  constructor(props: Props<ExpressionStatement>) {
    super()
    Object.assign(this, props)
  }
  expr!: Expression
  accept<T>(visitor: StatementVisitor<T>): T {
    return visitor.visitExpressionStatement(this)
  }
}
export class Block extends Statement {
  constructor(props: Props<Block>) {
    super()
    Object.assign(this, props)
  }
  body!: Array<Statement>
  description: string | undefined
  accept<T>(visitor: StatementVisitor<T>): T {
    return visitor.visitBlock(this)
  }
}
export class IfElse extends Statement {
  constructor(props: Props<IfElse>) {
    super()
    Object.assign(this, props)
  }
  condition!: Expression
  ifBranch!: Block
  elseBranch: Block | undefined
  accept<T>(visitor: StatementVisitor<T>): T {
    return visitor.visitIfElse(this)
  }
}
export class Switch extends Statement {
  constructor(props: Props<Switch>) {
    super()
    Object.assign(this, props)
  }
  value!: Expression
  cases!: Map<Expression, Block>
  defaultCase: Block | undefined
  accept<T>(visitor: StatementVisitor<T>): T {
    return visitor.visitSwitch(this)
  }
}
export class WhileLoop extends Statement {
  constructor(props: Props<WhileLoop>) {
    super()
    Object.assign(this, props)
  }
  condition!: Expression
  loopBody!: Block
  accept<T>(visitor: StatementVisitor<T>): T {
    return visitor.visitWhileLoop(this)
  }
}
export class BreakStatement extends Statement {
  constructor(props: Props<BreakStatement>) {
    super()
    Object.assign(this, props)
  }
  accept<T>(visitor: StatementVisitor<T>): T {
    return visitor.visitBreakStatement(this)
  }
}
export class ContinueStatement extends Statement {
  constructor(props: Props<ContinueStatement>) {
    super()
    Object.assign(this, props)
  }
  accept<T>(visitor: StatementVisitor<T>): T {
    return visitor.visitContinueStatement(this)
  }
}
export class AssertStatement extends Statement {
  constructor(props: Props<AssertStatement>) {
    super()
    Object.assign(this, props)
  }
  condition!: Expression
  comment: string | undefined
  accept<T>(visitor: StatementVisitor<T>): T {
    return visitor.visitAssertStatement(this)
  }
}
export class ReturnStatement extends Statement {
  constructor(props: Props<ReturnStatement>) {
    super()
    Object.assign(this, props)
  }
  value: Expression | undefined
  accept<T>(visitor: StatementVisitor<T>): T {
    return visitor.visitReturnStatement(this)
  }
}
export class IntegerConstant extends Expression {
  constructor(props: Props<IntegerConstant>) {
    super()
    Object.assign(this, props)
  }
  value!: bigint
  tealAlias: string | undefined
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitIntegerConstant(this)
  }
}
export class DecimalConstant extends Expression {
  constructor(props: Props<DecimalConstant>) {
    super()
    Object.assign(this, props)
  }
  declare wtype: wtypes.ARC4UFixedNxM
  value!: number
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitDecimalConstant(this)
  }
}
export class BoolConstant extends Expression {
  constructor(props: Props<BoolConstant>) {
    super()
    Object.assign(this, props)
  }
  value!: boolean
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitBoolConstant(this)
  }
}
export enum BytesEncoding {
  unknown = 'unknown',
  base16 = 'base16',
  base32 = 'base32',
  base64 = 'base64',
  utf8 = 'utf8',
}
export class BytesConstant extends Expression {
  constructor(props: Props<BytesConstant>) {
    super()
    Object.assign(this, props)
  }
  value!: Uint8Array
  encoding!: BytesEncoding
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitBytesConstant(this)
  }
}
export class StringConstant extends Expression {
  constructor(props: Props<StringConstant>) {
    super()
    Object.assign(this, props)
  }
  value!: string
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitStringConstant(this)
  }
}
export class TemplateVar extends Expression {
  constructor(props: Props<TemplateVar>) {
    super()
    Object.assign(this, props)
  }
  name!: string
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitTemplateVar(this)
  }
}
export class MethodConstant extends Expression {
  constructor(props: Props<MethodConstant>) {
    super()
    Object.assign(this, props)
  }
  value!: string
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitMethodConstant(this)
  }
}
export class AddressConstant extends Expression {
  constructor(props: Props<AddressConstant>) {
    super()
    Object.assign(this, props)
  }
  value!: string
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitAddressConstant(this)
  }
}
export class ARC4Encode extends Expression {
  constructor(props: Props<ARC4Encode>) {
    super()
    Object.assign(this, props)
  }
  value!: Expression
  declare wtype: wtypes.ARC4Type
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitARC4Encode(this)
  }
}
export class Copy extends Expression {
  constructor(props: Props<Copy>) {
    super()
    Object.assign(this, props)
  }
  value!: Expression
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitCopy(this)
  }
}
export class ArrayConcat extends Expression {
  constructor(props: Props<ArrayConcat>) {
    super()
    Object.assign(this, props)
  }
  left!: Expression
  right!: Expression
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitArrayConcat(this)
  }
}
export class ArrayPop extends Expression {
  constructor(props: Props<ArrayPop>) {
    super()
    Object.assign(this, props)
  }
  base!: Expression
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitArrayPop(this)
  }
}
export class ArrayExtend extends Expression {
  constructor(props: Props<ArrayExtend>) {
    super()
    Object.assign(this, props)
  }
  base!: Expression
  other!: Expression
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitArrayExtend(this)
  }
}
export class ARC4Decode extends Expression {
  constructor(props: Props<ARC4Decode>) {
    super()
    Object.assign(this, props)
  }
  value!: Expression
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitARC4Decode(this)
  }
}
export class IntrinsicCall extends Expression {
  constructor(props: Props<IntrinsicCall>) {
    super()
    Object.assign(this, props)
  }
  opCode!: string
  immediates!: Array<string | bigint>
  stackArgs!: Array<Expression>
  comment?: string | undefined
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitIntrinsicCall(this)
  }
}
export class TxnField {
  constructor(props: Props<TxnField>) {
    Object.assign(this, props)
  }
  wtype!: wtypes.WType
  additionalInputWtypes!: Array<wtypes.WType | wtypes.WType>
  immediate!: string
  numValues!: bigint
  isInnerParam!: boolean
}
export class TxnFields {
  constructor(props: Props<TxnFields>) {
    Object.assign(this, props)
  }
  approvalProgramPages!: TxnField
  clearStateProgramPages!: TxnField
  fee!: TxnField
  type!: TxnField
  appArgs!: TxnField
  accounts!: TxnField
  assets!: TxnField
  apps!: TxnField
  lastLog!: TxnField
}
export class CreateInnerTransaction extends Expression {
  constructor(props: Props<CreateInnerTransaction>) {
    super()
    Object.assign(this, props)
  }
  declare wtype: wtypes.WInnerTransactionFields
  fields!: Map<TxnField, Expression>
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitCreateInnerTransaction(this)
  }
}
export class UpdateInnerTransaction extends Expression {
  constructor(props: Props<UpdateInnerTransaction>) {
    super()
    Object.assign(this, props)
  }
  itxn!: Expression
  fields!: Map<TxnField, Expression>
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitUpdateInnerTransaction(this)
  }
}
export class CheckedMaybe extends Expression {
  constructor(props: Props<CheckedMaybe>) {
    super()
    Object.assign(this, props)
  }
  expr!: Expression
  comment!: string
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitCheckedMaybe(this)
  }
}
export class TupleExpression extends Expression {
  constructor(props: Props<TupleExpression>) {
    super()
    Object.assign(this, props)
  }
  items!: Array<Expression>
  declare wtype: wtypes.WTuple
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitTupleExpression(this)
  }
}
export class TupleItemExpression extends Expression {
  constructor(props: Props<TupleItemExpression>) {
    super()
    Object.assign(this, props)
  }
  base!: Expression
  index!: bigint
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitTupleItemExpression(this)
  }
}
export class VarExpression extends Expression {
  constructor(props: Props<VarExpression>) {
    super()
    Object.assign(this, props)
  }
  name!: string
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitVarExpression(this)
  }
}
export class InnerTransactionField extends Expression {
  constructor(props: Props<InnerTransactionField>) {
    super()
    Object.assign(this, props)
  }
  itxn!: Expression
  field!: TxnField
  arrayIndex: Expression | undefined
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitInnerTransactionField(this)
  }
}
export class SubmitInnerTransaction extends Expression {
  constructor(props: Props<SubmitInnerTransaction>) {
    super()
    Object.assign(this, props)
  }
  group!: Expression | [Expression]
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitSubmitInnerTransaction(this)
  }
}
export class FieldExpression extends Expression {
  constructor(props: Props<FieldExpression>) {
    super()
    Object.assign(this, props)
  }
  base!: Expression
  name!: string
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitFieldExpression(this)
  }
}
export class IndexExpression extends Expression {
  constructor(props: Props<IndexExpression>) {
    super()
    Object.assign(this, props)
  }
  base!: Expression
  index!: Expression
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitIndexExpression(this)
  }
}
export class SliceExpression extends Expression {
  constructor(props: Props<SliceExpression>) {
    super()
    Object.assign(this, props)
  }
  base!: Expression
  beginIndex: Expression | undefined
  endIndex: Expression | undefined
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitSliceExpression(this)
  }
}
export class IntersectionSliceExpression extends Expression {
  constructor(props: Props<IntersectionSliceExpression>) {
    super()
    Object.assign(this, props)
  }
  base!: Expression
  beginIndex: Expression | bigint | undefined
  endIndex: Expression | bigint | undefined
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitIntersectionSliceExpression(this)
  }
}
export class AppStateExpression extends Expression {
  constructor(props: Props<AppStateExpression>) {
    super()
    Object.assign(this, props)
  }
  key!: Expression
  existsAssertionMessage: string | undefined
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitAppStateExpression(this)
  }
}
export class AppAccountStateExpression extends Expression {
  constructor(props: Props<AppAccountStateExpression>) {
    super()
    Object.assign(this, props)
  }
  key!: Expression
  existsAssertionMessage: string | undefined
  account!: Expression
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitAppAccountStateExpression(this)
  }
}
export class BoxValueExpression extends Expression {
  constructor(props: Props<BoxValueExpression>) {
    super()
    Object.assign(this, props)
  }
  key!: Expression
  existsAssertionMessage: string | undefined
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitBoxValueExpression(this)
  }
}
export class SingleEvaluation extends Expression {
  constructor(props: Props<SingleEvaluation>) {
    super()
    Object.assign(this, props)
  }
  source!: Expression
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitSingleEvaluation(this)
  }
}
export class ReinterpretCast extends Expression {
  constructor(props: Props<ReinterpretCast>) {
    super()
    Object.assign(this, props)
  }
  expr!: Expression
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitReinterpretCast(this)
  }
}
export class NewArray extends Expression {
  constructor(props: Props<NewArray>) {
    super()
    Object.assign(this, props)
  }
  declare wtype: wtypes.WArray | wtypes.ARC4Array
  values!: Array<Expression>
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitNewArray(this)
  }
}
export class ConditionalExpression extends Expression {
  constructor(props: Props<ConditionalExpression>) {
    super()
    Object.assign(this, props)
  }
  condition!: Expression
  trueExpr!: Expression
  falseExpr!: Expression
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitConditionalExpression(this)
  }
}
export class AssignmentStatement extends Statement {
  constructor(props: Props<AssignmentStatement>) {
    super()
    Object.assign(this, props)
  }
  target!:
    | VarExpression
    | FieldExpression
    | IndexExpression
    | TupleExpression
    | AppStateExpression
    | AppAccountStateExpression
    | BoxValueExpression
  value!: Expression
  accept<T>(visitor: StatementVisitor<T>): T {
    return visitor.visitAssignmentStatement(this)
  }
}
export class AssignmentExpression extends Expression {
  constructor(props: Props<AssignmentExpression>) {
    super()
    Object.assign(this, props)
  }
  target!:
    | VarExpression
    | FieldExpression
    | IndexExpression
    | TupleExpression
    | AppStateExpression
    | AppAccountStateExpression
    | BoxValueExpression
  value!: Expression
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitAssignmentExpression(this)
  }
}
export enum EqualityComparison {
  eq = '==',
  ne = '!=',
}
export enum NumericComparison {
  eq = '==',
  ne = '!=',
  lt = '<',
  lte = '<=',
  gt = '>',
  gte = '>=',
}
export class NumericComparisonExpression extends Expression {
  constructor(props: Props<NumericComparisonExpression>) {
    super()
    Object.assign(this, props)
  }
  lhs!: Expression
  operator!: NumericComparison
  rhs!: Expression
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitNumericComparisonExpression(this)
  }
}
export class BytesComparisonExpression extends Expression {
  constructor(props: Props<BytesComparisonExpression>) {
    super()
    Object.assign(this, props)
  }
  lhs!: Expression
  operator!: EqualityComparison
  rhs!: Expression
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitBytesComparisonExpression(this)
  }
}
export class ContractReference {
  constructor(props: Props<ContractReference>) {
    Object.assign(this, props)
  }
  moduleName!: string
  className!: string
}
export class InstanceSubroutineTarget {
  constructor(props: Props<InstanceSubroutineTarget>) {
    Object.assign(this, props)
  }
  name!: string
}
export class BaseClassSubroutineTarget {
  constructor(props: Props<BaseClassSubroutineTarget>) {
    Object.assign(this, props)
  }
  baseClass!: ContractReference
  name!: string
}
export class FreeSubroutineTarget {
  constructor(props: Props<FreeSubroutineTarget>) {
    Object.assign(this, props)
  }
  moduleName!: string
  name!: string
}
export class CallArg {
  constructor(props: Props<CallArg>) {
    Object.assign(this, props)
  }
  name: string | undefined
  value!: Expression
}
export class SubroutineCallExpression extends Expression {
  constructor(props: Props<SubroutineCallExpression>) {
    super()
    Object.assign(this, props)
  }
  target!: FreeSubroutineTarget | InstanceSubroutineTarget | BaseClassSubroutineTarget
  args!: Array<CallArg>
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitSubroutineCallExpression(this)
  }
}
export enum UInt64BinaryOperator {
  add = '+',
  sub = '-',
  mult = '*',
  floorDiv = '//',
  mod = '%',
  pow = '**',
  lshift = '<<',
  rshift = '>>',
  bitOr = '|',
  bitXor = '^',
  bitAnd = '&',
}
export enum BigUIntBinaryOperator {
  add = '+',
  sub = '-',
  mult = '*',
  floorDiv = '//',
  mod = '%',
  bitOr = '|',
  bitXor = '^',
  bitAnd = '&',
}
export enum BytesBinaryOperator {
  add = '+',
  bitOr = '|',
  bitXor = '^',
  bitAnd = '&',
}
export enum BytesUnaryOperator {
  bitInvert = '~',
}
export enum UInt64UnaryOperator {
  bitInvert = '~',
}
export class UInt64UnaryOperation extends Expression {
  constructor(props: Props<UInt64UnaryOperation>) {
    super()
    Object.assign(this, props)
  }
  op!: UInt64UnaryOperator
  expr!: Expression
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitUInt64UnaryOperation(this)
  }
}
export class BytesUnaryOperation extends Expression {
  constructor(props: Props<BytesUnaryOperation>) {
    super()
    Object.assign(this, props)
  }
  op!: BytesUnaryOperator
  expr!: Expression
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitBytesUnaryOperation(this)
  }
}
export class UInt64BinaryOperation extends Expression {
  constructor(props: Props<UInt64BinaryOperation>) {
    super()
    Object.assign(this, props)
  }
  left!: Expression
  op!: UInt64BinaryOperator
  right!: Expression
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitUInt64BinaryOperation(this)
  }
}
export class BigUIntBinaryOperation extends Expression {
  constructor(props: Props<BigUIntBinaryOperation>) {
    super()
    Object.assign(this, props)
  }
  left!: Expression
  op!: BigUIntBinaryOperator
  right!: Expression
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitBigUIntBinaryOperation(this)
  }
}
export class BytesBinaryOperation extends Expression {
  constructor(props: Props<BytesBinaryOperation>) {
    super()
    Object.assign(this, props)
  }
  left!: Expression
  op!: BytesBinaryOperator
  right!: Expression
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitBytesBinaryOperation(this)
  }
}
export enum BinaryBooleanOperator {
  and = 'and',
  or = 'or',
}
export class BooleanBinaryOperation extends Expression {
  constructor(props: Props<BooleanBinaryOperation>) {
    super()
    Object.assign(this, props)
  }
  left!: Expression
  op!: BinaryBooleanOperator
  right!: Expression
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitBooleanBinaryOperation(this)
  }
}
export class Not extends Expression {
  constructor(props: Props<Not>) {
    super()
    Object.assign(this, props)
  }
  expr!: Expression
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitNot(this)
  }
}
export class Contains extends Expression {
  constructor(props: Props<Contains>) {
    super()
    Object.assign(this, props)
  }
  item!: Expression
  sequence!: Expression
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitContains(this)
  }
}
export class UInt64AugmentedAssignment extends Statement {
  constructor(props: Props<UInt64AugmentedAssignment>) {
    super()
    Object.assign(this, props)
  }
  target!:
    | VarExpression
    | FieldExpression
    | IndexExpression
    | TupleExpression
    | AppStateExpression
    | AppAccountStateExpression
    | BoxValueExpression
  op!: UInt64BinaryOperator
  value!: Expression
  accept<T>(visitor: StatementVisitor<T>): T {
    return visitor.visitUInt64AugmentedAssignment(this)
  }
}
export class BigUIntAugmentedAssignment extends Statement {
  constructor(props: Props<BigUIntAugmentedAssignment>) {
    super()
    Object.assign(this, props)
  }
  target!:
    | VarExpression
    | FieldExpression
    | IndexExpression
    | TupleExpression
    | AppStateExpression
    | AppAccountStateExpression
    | BoxValueExpression
  op!: BigUIntBinaryOperator
  value!: Expression
  accept<T>(visitor: StatementVisitor<T>): T {
    return visitor.visitBigUIntAugmentedAssignment(this)
  }
}
export class BytesAugmentedAssignment extends Statement {
  constructor(props: Props<BytesAugmentedAssignment>) {
    super()
    Object.assign(this, props)
  }
  target!:
    | VarExpression
    | FieldExpression
    | IndexExpression
    | TupleExpression
    | AppStateExpression
    | AppAccountStateExpression
    | BoxValueExpression
  op!: BytesBinaryOperator
  value!: Expression
  accept<T>(visitor: StatementVisitor<T>): T {
    return visitor.visitBytesAugmentedAssignment(this)
  }
}
export class Range extends Node {
  constructor(props: Props<Range>) {
    super()
    Object.assign(this, props)
  }
  start!: Expression
  stop!: Expression
  step!: Expression
}
export class OpUp extends Node {
  constructor(props: Props<OpUp>) {
    super()
    Object.assign(this, props)
  }
  n!: Expression
}
export class Enumeration extends Expression {
  constructor(props: Props<Enumeration>) {
    super()
    Object.assign(this, props)
  }
  expr!: Expression | Range
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitEnumeration(this)
  }
}
export class Reversed extends Expression {
  constructor(props: Props<Reversed>) {
    super()
    Object.assign(this, props)
  }
  expr!: Expression | Range
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitReversed(this)
  }
}
export class ForInLoop extends Statement {
  constructor(props: Props<ForInLoop>) {
    super()
    Object.assign(this, props)
  }
  sequence!: Expression | Range
  items!:
    | VarExpression
    | FieldExpression
    | IndexExpression
    | TupleExpression
    | AppStateExpression
    | AppAccountStateExpression
    | BoxValueExpression
  loopBody!: Block
  accept<T>(visitor: StatementVisitor<T>): T {
    return visitor.visitForInLoop(this)
  }
}
export class StateGet extends Expression {
  constructor(props: Props<StateGet>) {
    super()
    Object.assign(this, props)
  }
  field!: AppStateExpression | AppAccountStateExpression | BoxValueExpression
  default!: Expression
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitStateGet(this)
  }
}
export class StateGetEx extends Expression {
  constructor(props: Props<StateGetEx>) {
    super()
    Object.assign(this, props)
  }
  field!: AppStateExpression | AppAccountStateExpression | BoxValueExpression
  declare wtype: wtypes.WTuple
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitStateGetEx(this)
  }
}
export class StateExists extends Expression {
  constructor(props: Props<StateExists>) {
    super()
    Object.assign(this, props)
  }
  field!: AppStateExpression | AppAccountStateExpression | BoxValueExpression
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitStateExists(this)
  }
}
export class StateDelete extends Statement {
  constructor(props: Props<StateDelete>) {
    super()
    Object.assign(this, props)
  }
  field!: AppStateExpression | AppAccountStateExpression | BoxValueExpression
  accept<T>(visitor: StatementVisitor<T>): T {
    return visitor.visitStateDelete(this)
  }
}
export class NewStruct extends Expression {
  constructor(props: Props<NewStruct>) {
    super()
    Object.assign(this, props)
  }
  declare wtype: wtypes.WStructType | wtypes.ARC4Struct
  values!: Map<string, Expression>
  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitNewStruct(this)
  }
}
export abstract class ModuleStatement extends Node {
  name!: string
  abstract accept<T>(visitor: ModuleStatementVisitor<T>): T
}
export class ConstantDeclaration extends ModuleStatement {
  constructor(props: Props<ConstantDeclaration>) {
    super()
    Object.assign(this, props)
  }
  value!: bigint | string | Uint8Array | boolean
  accept<T>(visitor: ModuleStatementVisitor<T>): T {
    return visitor.visitConstantDeclaration(this)
  }
}
export class SubroutineArgument extends Node {
  constructor(props: Props<SubroutineArgument>) {
    super()
    Object.assign(this, props)
  }
  name!: string
  wtype!: wtypes.WType
}
export abstract class Function extends ModuleStatement {
  moduleName!: string
  args!: Array<SubroutineArgument>
  returnType!: wtypes.WType
  body!: Block
  docstring: string | undefined
  abstract accept<T>(visitor: ModuleStatementVisitor<T>): T
}
export class Subroutine extends Function {
  constructor(props: Props<Subroutine>) {
    super()
    Object.assign(this, props)
  }
  accept<T>(visitor: ModuleStatementVisitor<T>): T {
    return visitor.visitSubroutine(this)
  }
}
export class ContractMethod extends Function {
  constructor(props: Props<ContractMethod>) {
    super()
    Object.assign(this, props)
  }
  className!: string
  arc4MethodConfig: ARC4BareMethodConfig | ARC4ABIMethodConfig | undefined
  accept<T>(visitor: ModuleStatementVisitor<T>): T {
    return visitor.visitContractMethod(this)
  }
}
export enum AppStorageKind {
  appGlobal,
  accountLocal,
  box,
}
export class AppStorageDefinition extends Node {
  constructor(props: Props<AppStorageDefinition>) {
    super()
    Object.assign(this, props)
  }
  memberName!: string
  kind!: AppStorageKind
  storageWtype!: wtypes.WType
  keyWtype: wtypes.WType | undefined
  key!: BytesConstant
  description: string | undefined
}
export class LogicSignature extends ModuleStatement {
  constructor(props: Props<LogicSignature>) {
    super()
    Object.assign(this, props)
  }
  moduleName!: string
  program!: Subroutine
  accept<T>(visitor: ModuleStatementVisitor<T>): T {
    return visitor.visitLogicSignature(this)
  }
}
export class StateTotals {
  constructor(props: Props<StateTotals>) {
    Object.assign(this, props)
  }
  globalUints: bigint | undefined
  localUints: bigint | undefined
  globalBytes: bigint | undefined
  localBytes: bigint | undefined
}
export class ContractFragment extends ModuleStatement {
  constructor(props: Props<ContractFragment>) {
    super()
    Object.assign(this, props)
  }
  moduleName!: string
  nameOverride: string | undefined
  isAbstract!: boolean
  isArc4!: boolean
  bases!: Array<ContractReference>
  init: ContractMethod | undefined
  approvalProgram: ContractMethod | undefined
  clearProgram: ContractMethod | undefined
  subroutines!: Array<ContractMethod>
  appState!: Map<string, AppStorageDefinition>
  reservedScratchSpace!: Set<bigint>
  stateTotals: StateTotals | undefined
  docstring: string | undefined
  methods!: Map<string, ContractMethod>
  accept<T>(visitor: ModuleStatementVisitor<T>): T {
    return visitor.visitContractFragment(this)
  }
}
export class StructureField extends Node {
  constructor(props: Props<StructureField>) {
    super()
    Object.assign(this, props)
  }
  name!: string
  wtype!: wtypes.WType
}
export class StructureDefinition extends ModuleStatement {
  constructor(props: Props<StructureDefinition>) {
    super()
    Object.assign(this, props)
  }
  fields!: Array<StructureField>
  wtype!: wtypes.WType
  docstring: string | undefined
  accept<T>(visitor: ModuleStatementVisitor<T>): T {
    return visitor.visitStructureDefinition(this)
  }
}
export class Module {
  constructor(props: Props<Module>) {
    Object.assign(this, props)
  }
  name!: string
  sourceFilePath!: string
  body!: Array<ModuleStatement>
}
export type LValue = VarExpression | FieldExpression | IndexExpression | TupleExpression | AppStateExpression | AppAccountStateExpression
export type Constant = IntegerConstant | BoolConstant | BytesConstant | StringConstant
export const concreteNodes = {
  expressionStatement: ExpressionStatement,
  block: Block,
  ifElse: IfElse,
  switch: Switch,
  whileLoop: WhileLoop,
  breakStatement: BreakStatement,
  continueStatement: ContinueStatement,
  assertStatement: AssertStatement,
  returnStatement: ReturnStatement,
  integerConstant: IntegerConstant,
  decimalConstant: DecimalConstant,
  boolConstant: BoolConstant,
  bytesConstant: BytesConstant,
  stringConstant: StringConstant,
  templateVar: TemplateVar,
  methodConstant: MethodConstant,
  addressConstant: AddressConstant,
  aRC4Encode: ARC4Encode,
  copy: Copy,
  arrayConcat: ArrayConcat,
  arrayPop: ArrayPop,
  arrayExtend: ArrayExtend,
  aRC4Decode: ARC4Decode,
  intrinsicCall: IntrinsicCall,
  txnField: TxnField,
  txnFields: TxnFields,
  createInnerTransaction: CreateInnerTransaction,
  updateInnerTransaction: UpdateInnerTransaction,
  checkedMaybe: CheckedMaybe,
  tupleExpression: TupleExpression,
  tupleItemExpression: TupleItemExpression,
  varExpression: VarExpression,
  innerTransactionField: InnerTransactionField,
  submitInnerTransaction: SubmitInnerTransaction,
  fieldExpression: FieldExpression,
  indexExpression: IndexExpression,
  sliceExpression: SliceExpression,
  intersectionSliceExpression: IntersectionSliceExpression,
  appStateExpression: AppStateExpression,
  appAccountStateExpression: AppAccountStateExpression,
  boxValueExpression: BoxValueExpression,
  singleEvaluation: SingleEvaluation,
  reinterpretCast: ReinterpretCast,
  newArray: NewArray,
  conditionalExpression: ConditionalExpression,
  assignmentStatement: AssignmentStatement,
  assignmentExpression: AssignmentExpression,
  numericComparisonExpression: NumericComparisonExpression,
  bytesComparisonExpression: BytesComparisonExpression,
  contractReference: ContractReference,
  instanceSubroutineTarget: InstanceSubroutineTarget,
  baseClassSubroutineTarget: BaseClassSubroutineTarget,
  freeSubroutineTarget: FreeSubroutineTarget,
  callArg: CallArg,
  subroutineCallExpression: SubroutineCallExpression,
  uInt64UnaryOperation: UInt64UnaryOperation,
  bytesUnaryOperation: BytesUnaryOperation,
  uInt64BinaryOperation: UInt64BinaryOperation,
  bigUIntBinaryOperation: BigUIntBinaryOperation,
  bytesBinaryOperation: BytesBinaryOperation,
  booleanBinaryOperation: BooleanBinaryOperation,
  not: Not,
  contains: Contains,
  uInt64AugmentedAssignment: UInt64AugmentedAssignment,
  bigUIntAugmentedAssignment: BigUIntAugmentedAssignment,
  bytesAugmentedAssignment: BytesAugmentedAssignment,
  range: Range,
  opUp: OpUp,
  enumeration: Enumeration,
  reversed: Reversed,
  forInLoop: ForInLoop,
  stateGet: StateGet,
  stateGetEx: StateGetEx,
  stateExists: StateExists,
  stateDelete: StateDelete,
  newStruct: NewStruct,
  constantDeclaration: ConstantDeclaration,
  subroutineArgument: SubroutineArgument,
  subroutine: Subroutine,
  contractMethod: ContractMethod,
  appStorageDefinition: AppStorageDefinition,
  logicSignature: LogicSignature,
  stateTotals: StateTotals,
  contractFragment: ContractFragment,
  structureField: StructureField,
  structureDefinition: StructureDefinition,
  module: Module,
  uInt64Constant: IntegerConstant,
  bigUIntConstant: IntegerConstant,
} as const
export interface ExpressionVisitor<T> {
  visitIntegerConstant(expression: IntegerConstant): T
  visitDecimalConstant(expression: DecimalConstant): T
  visitBoolConstant(expression: BoolConstant): T
  visitBytesConstant(expression: BytesConstant): T
  visitStringConstant(expression: StringConstant): T
  visitTemplateVar(expression: TemplateVar): T
  visitMethodConstant(expression: MethodConstant): T
  visitAddressConstant(expression: AddressConstant): T
  visitARC4Encode(expression: ARC4Encode): T
  visitCopy(expression: Copy): T
  visitArrayConcat(expression: ArrayConcat): T
  visitArrayPop(expression: ArrayPop): T
  visitArrayExtend(expression: ArrayExtend): T
  visitARC4Decode(expression: ARC4Decode): T
  visitIntrinsicCall(expression: IntrinsicCall): T
  visitCreateInnerTransaction(expression: CreateInnerTransaction): T
  visitUpdateInnerTransaction(expression: UpdateInnerTransaction): T
  visitCheckedMaybe(expression: CheckedMaybe): T
  visitTupleExpression(expression: TupleExpression): T
  visitTupleItemExpression(expression: TupleItemExpression): T
  visitVarExpression(expression: VarExpression): T
  visitInnerTransactionField(expression: InnerTransactionField): T
  visitSubmitInnerTransaction(expression: SubmitInnerTransaction): T
  visitFieldExpression(expression: FieldExpression): T
  visitIndexExpression(expression: IndexExpression): T
  visitSliceExpression(expression: SliceExpression): T
  visitIntersectionSliceExpression(expression: IntersectionSliceExpression): T
  visitAppStateExpression(expression: AppStateExpression): T
  visitAppAccountStateExpression(expression: AppAccountStateExpression): T
  visitBoxValueExpression(expression: BoxValueExpression): T
  visitSingleEvaluation(expression: SingleEvaluation): T
  visitReinterpretCast(expression: ReinterpretCast): T
  visitNewArray(expression: NewArray): T
  visitConditionalExpression(expression: ConditionalExpression): T
  visitAssignmentExpression(expression: AssignmentExpression): T
  visitNumericComparisonExpression(expression: NumericComparisonExpression): T
  visitBytesComparisonExpression(expression: BytesComparisonExpression): T
  visitSubroutineCallExpression(expression: SubroutineCallExpression): T
  visitUInt64UnaryOperation(expression: UInt64UnaryOperation): T
  visitBytesUnaryOperation(expression: BytesUnaryOperation): T
  visitUInt64BinaryOperation(expression: UInt64BinaryOperation): T
  visitBigUIntBinaryOperation(expression: BigUIntBinaryOperation): T
  visitBytesBinaryOperation(expression: BytesBinaryOperation): T
  visitBooleanBinaryOperation(expression: BooleanBinaryOperation): T
  visitNot(expression: Not): T
  visitContains(expression: Contains): T
  visitEnumeration(expression: Enumeration): T
  visitReversed(expression: Reversed): T
  visitStateGet(expression: StateGet): T
  visitStateGetEx(expression: StateGetEx): T
  visitStateExists(expression: StateExists): T
  visitNewStruct(expression: NewStruct): T
}
export interface StatementVisitor<T> {
  visitExpressionStatement(statement: ExpressionStatement): T
  visitBlock(statement: Block): T
  visitIfElse(statement: IfElse): T
  visitSwitch(statement: Switch): T
  visitWhileLoop(statement: WhileLoop): T
  visitBreakStatement(statement: BreakStatement): T
  visitContinueStatement(statement: ContinueStatement): T
  visitAssertStatement(statement: AssertStatement): T
  visitReturnStatement(statement: ReturnStatement): T
  visitAssignmentStatement(statement: AssignmentStatement): T
  visitUInt64AugmentedAssignment(statement: UInt64AugmentedAssignment): T
  visitBigUIntAugmentedAssignment(statement: BigUIntAugmentedAssignment): T
  visitBytesAugmentedAssignment(statement: BytesAugmentedAssignment): T
  visitForInLoop(statement: ForInLoop): T
  visitStateDelete(statement: StateDelete): T
}
export interface ModuleStatementVisitor<T> {
  visitConstantDeclaration(moduleStatement: ConstantDeclaration): T
  visitSubroutine(moduleStatement: Subroutine): T
  visitContractMethod(moduleStatement: ContractMethod): T
  visitLogicSignature(moduleStatement: LogicSignature): T
  visitContractFragment(moduleStatement: ContractFragment): T
  visitStructureDefinition(moduleStatement: StructureDefinition): T
}
