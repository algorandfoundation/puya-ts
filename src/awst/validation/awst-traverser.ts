import type {
  AddressConstant,
  AppAccountStateExpression,
  AppStateExpression,
  AppStorageDefinition,
  ARC4Decode,
  ARC4Encode,
  ARC4FromBytes,
  ARC4Router,
  ArrayConcat,
  ArrayExtend,
  ArrayLength,
  ArrayPop,
  ArrayReplace,
  AssertExpression,
  AssignmentExpression,
  AssignmentStatement,
  BigUIntAugmentedAssignment,
  BigUIntBinaryOperation,
  BigUIntPostfixUnaryOperation,
  Block,
  BoolConstant,
  BooleanBinaryOperation,
  BoxPrefixedKeyExpression,
  BoxValueExpression,
  BytesAugmentedAssignment,
  BytesBinaryOperation,
  BytesComparisonExpression,
  BytesConstant,
  BytesUnaryOperation,
  CheckedMaybe,
  CommaExpression,
  CompiledContract,
  CompiledLogicSig,
  ConditionalExpression,
  Contract,
  ContractMemberNodeVisitor,
  ContractMethod,
  ConvertArray,
  Copy,
  CreateInnerTransaction,
  DecimalConstant,
  Emit,
  Enumeration,
  ExpressionStatement,
  ExpressionVisitor,
  FieldExpression,
  ForInLoop,
  Goto,
  GroupTransactionReference,
  IfElse,
  IndexExpression,
  InnerTransactionField,
  IntegerConstant,
  IntersectionSliceExpression,
  IntrinsicCall,
  LogicSignature,
  LoopContinue,
  LoopExit,
  MethodConstant,
  NamedTupleExpression,
  NewArray,
  NewStruct,
  Not,
  NumericComparisonExpression,
  PuyaLibCall,
  Range,
  ReinterpretCast,
  ReturnStatement,
  Reversed,
  RootNodeVisitor,
  SetInnerTransactionFields,
  SingleEvaluation,
  SizeOf,
  SliceExpression,
  StateDelete,
  StateExists,
  StateGet,
  StateGetEx,
  StatementVisitor,
  StringConstant,
  SubmitInnerTransaction,
  Subroutine,
  SubroutineCallExpression,
  Switch,
  TemplateVar,
  TupleExpression,
  TupleItemExpression,
  UInt64AugmentedAssignment,
  UInt64BinaryOperation,
  UInt64PostfixUnaryOperation,
  UInt64UnaryOperation,
  UpdateInnerTransaction,
  VarExpression,
  VoidConstant,
  WhileLoop,
} from '../nodes'
import { Expression } from '../nodes'

export class FunctionTraverser implements ExpressionVisitor<void>, StatementVisitor<void> {
  visitExpressionStatement(statement: ExpressionStatement): void {
    statement.expr.accept(this)
  }

  visitBlock(statement: Block): void {
    for (const s of statement.body) {
      s.accept(this)
    }
  }

  visitConvertArray(expression: ConvertArray): void {
    expression.expr.accept(this)
  }

  visitCommaExpression(expression: CommaExpression): void {
    for (const expr of expression.expressions) {
      expr.accept(this)
    }
  }

  visitArrayLength(expression: ArrayLength): void {
    expression.array.accept(this)
  }

  visitArrayReplace(expression: ArrayReplace): void {
    expression.base.accept(this)
    expression.index.accept(this)
    expression.value.accept(this)
  }

  visitGoto(statement: Goto): void {}

  visitIfElse(statement: IfElse): void {
    statement.condition.accept(this)
    statement.ifBranch.accept(this)
    statement.elseBranch?.accept(this)
  }

  visitSwitch(statement: Switch): void {
    statement.value.accept(this)
    for (const [cv, cb] of statement.cases.entries()) {
      cv.accept(this)
      cb.accept(this)
    }
    statement.defaultCase?.accept(this)
  }

  visitWhileLoop(statement: WhileLoop): void {
    statement.condition.accept(this)
    statement.loopBody.accept(this)
  }

  visitLoopExit(statement: LoopExit): void {}

  visitLoopContinue(statement: LoopContinue): void {}

  visitReturnStatement(statement: ReturnStatement): void {
    statement.value?.accept(this)
  }

  visitAssignmentStatement(statement: AssignmentStatement): void {
    statement.target.accept(this)
    statement.value.accept(this)
  }

  visitUInt64AugmentedAssignment(statement: UInt64AugmentedAssignment): void {
    statement.target.accept(this)
    statement.value.accept(this)
  }

  visitBigUIntAugmentedAssignment(statement: BigUIntAugmentedAssignment): void {
    statement.target.accept(this)
    statement.value.accept(this)
  }

  visitBytesAugmentedAssignment(statement: BytesAugmentedAssignment): void {
    statement.target.accept(this)
    statement.value.accept(this)
  }

  visitForInLoop(statement: ForInLoop): void {
    statement.items.accept(this)
    statement.sequence.accept(this)
    statement.loopBody.accept(this)
  }

  visitAssertExpression(expression: AssertExpression): void {
    expression.condition?.accept(this)
  }

  visitIntegerConstant(expression: IntegerConstant): void {}

  visitDecimalConstant(expression: DecimalConstant): void {}

  visitBoolConstant(expression: BoolConstant): void {}

  visitBytesConstant(expression: BytesConstant): void {}

  visitStringConstant(expression: StringConstant): void {}

  visitVoidConstant(expression: VoidConstant): void {}

  visitTemplateVar(expression: TemplateVar): void {}

  visitMethodConstant(expression: MethodConstant): void {}

  visitAddressConstant(expression: AddressConstant): void {}

  visitARC4Encode(expression: ARC4Encode): void {
    expression.value.accept(this)
  }

  visitCopy(expression: Copy): void {
    expression.value.accept(this)
  }

  visitArrayConcat(expression: ArrayConcat): void {
    expression.left.accept(this)
    expression.right.accept(this)
  }

  visitArrayPop(expression: ArrayPop): void {
    expression.base.accept(this)
  }

  visitArrayExtend(expression: ArrayExtend): void {
    expression.base.accept(this)
    expression.other.accept(this)
  }

  visitARC4Decode(expression: ARC4Decode): void {
    expression.value.accept(this)
  }

  visitIntrinsicCall(expression: IntrinsicCall): void {
    for (const a of expression.stackArgs) {
      a.accept(this)
    }
  }

  visitCreateInnerTransaction(expression: CreateInnerTransaction): void {
    for (const v of expression.fields.values()) {
      v.accept(this)
    }
  }

  visitUpdateInnerTransaction(expression: UpdateInnerTransaction): void {
    for (const v of expression.fields.values()) {
      v.accept(this)
    }
  }

  visitGroupTransactionReference(expression: GroupTransactionReference): void {
    expression.index.accept(this)
  }

  visitCheckedMaybe(expression: CheckedMaybe): void {
    expression.expr.accept(this)
  }

  visitTupleExpression(expression: TupleExpression): void {
    for (const v of expression.items) {
      v.accept(this)
    }
  }

  visitTupleItemExpression(expression: TupleItemExpression): void {
    expression.base.accept(this)
  }

  visitARC4FromBytes(expression: ARC4FromBytes): void {
    expression.value.accept(this)
  }

  visitNamedTupleExpression(expression: NamedTupleExpression): void {
    for (const v of expression.values.values()) {
      v.accept(this)
    }
  }

  visitVarExpression(expression: VarExpression): void {}

  visitInnerTransactionField(expression: InnerTransactionField): void {
    expression.itxn.accept(this)
    expression.arrayIndex?.accept(this)
  }

  visitSetInnerTransactionFields(expression: SetInnerTransactionFields): void {
    for (const itxn of expression.itxns) {
      itxn.accept(this)
    }
  }

  visitSubmitInnerTransaction(expression: SubmitInnerTransaction): void {
    for (const itxn of expression.itxns) {
      itxn.accept(this)
    }
  }

  visitSizeOf(expression: SizeOf): void {}

  visitFieldExpression(expression: FieldExpression): void {
    expression.base.accept(this)
  }

  visitIndexExpression(expression: IndexExpression): void {
    expression.base.accept(this)
    expression.index.accept(this)
  }

  visitSliceExpression(expression: SliceExpression): void {
    expression.base.accept(this)
    expression.beginIndex?.accept(this)
    expression.endIndex?.accept(this)
  }

  visitIntersectionSliceExpression(expression: IntersectionSliceExpression): void {
    expression.base.accept(this)
    expression.beginIndex instanceof Expression && expression.beginIndex.accept(this)
    expression.endIndex instanceof Expression && expression.endIndex.accept(this)
  }

  visitAppStateExpression(expression: AppStateExpression): void {
    expression.key.accept(this)
  }

  visitAppAccountStateExpression(expression: AppAccountStateExpression): void {
    expression.key.accept(this)
    expression.account.accept(this)
  }

  visitBoxPrefixedKeyExpression(expression: BoxPrefixedKeyExpression): void {
    expression.key.accept(this)
    expression.prefix.accept(this)
  }

  visitBoxValueExpression(expression: BoxValueExpression): void {
    expression.key.accept(this)
  }

  visitSingleEvaluation(expression: SingleEvaluation): void {
    expression.source.accept(this)
  }

  visitReinterpretCast(expression: ReinterpretCast): void {
    expression.expr.accept(this)
  }

  visitNewArray(expression: NewArray): void {
    for (const v of expression.values) {
      v.accept(this)
    }
  }

  visitConditionalExpression(expression: ConditionalExpression): void {
    expression.condition.accept(this)
    expression.trueExpr.accept(this)
    expression.falseExpr.accept(this)
  }

  visitAssignmentExpression(expression: AssignmentExpression): void {
    expression.target.accept(this)
    expression.value.accept(this)
  }

  visitNumericComparisonExpression(expression: NumericComparisonExpression): void {
    expression.lhs.accept(this)
    expression.rhs.accept(this)
  }

  visitBytesComparisonExpression(expression: BytesComparisonExpression): void {
    expression.lhs.accept(this)
    expression.rhs.accept(this)
  }

  visitSubroutineCallExpression(expression: SubroutineCallExpression): void {
    for (const a of expression.args) {
      a.value.accept(this)
    }
  }

  visitPuyaLibCall(expression: PuyaLibCall): void {
    for (const a of expression.args) {
      a.value.accept(this)
    }
  }

  visitUInt64UnaryOperation(expression: UInt64UnaryOperation): void {
    expression.expr.accept(this)
  }

  visitUInt64PostfixUnaryOperation(expression: UInt64PostfixUnaryOperation): void {
    expression.target.accept(this)
  }

  visitBigUIntPostfixUnaryOperation(expression: BigUIntPostfixUnaryOperation): void {
    expression.target.accept(this)
  }

  visitBytesUnaryOperation(expression: BytesUnaryOperation): void {
    expression.expr.accept(this)
  }

  visitUInt64BinaryOperation(expression: UInt64BinaryOperation): void {
    expression.left.accept(this)
    expression.right.accept(this)
  }

  visitBigUIntBinaryOperation(expression: BigUIntBinaryOperation): void {
    expression.left.accept(this)
    expression.right.accept(this)
  }

  visitBytesBinaryOperation(expression: BytesBinaryOperation): void {
    expression.left.accept(this)
    expression.right.accept(this)
  }

  visitBooleanBinaryOperation(expression: BooleanBinaryOperation): void {
    expression.left.accept(this)
    expression.right.accept(this)
  }

  visitNot(expression: Not): void {
    expression.expr.accept(this)
  }

  visitEmit(expression: Emit): void {
    expression.value.accept(this)
  }

  visitRange(expression: Range): void {
    expression.start.accept(this)
    expression.stop.accept(this)
    expression.step.accept(this)
  }

  visitEnumeration(expression: Enumeration): void {
    expression.expr.accept(this)
  }

  visitReversed(expression: Reversed): void {
    expression.expr.accept(this)
  }

  visitStateGet(expression: StateGet): void {
    expression.default.accept(this)
    expression.field.accept(this)
  }

  visitStateGetEx(expression: StateGetEx): void {
    expression.field.accept(this)
  }

  visitStateExists(expression: StateExists): void {
    expression.field.accept(this)
  }

  visitStateDelete(expression: StateDelete): void {
    expression.field.accept(this)
  }

  visitNewStruct(expression: NewStruct): void {
    for (const v of expression.values.values()) {
      v.accept(this)
    }
  }

  visitCompiledContract(expression: CompiledContract): void {
    for (const v of expression.templateVariables.values()) {
      v.accept(this)
    }
    for (const v of expression.allocationOverrides.values()) {
      v.accept(this)
    }
  }

  visitCompiledLogicSig(expression: CompiledLogicSig): void {
    for (const v of expression.templateVariables.values()) {
      v.accept(this)
    }
  }

  visitARC4Router(expression: ARC4Router): void {}
}

export class AwstTraverser extends FunctionTraverser implements RootNodeVisitor<void>, ContractMemberNodeVisitor<void> {
  visitContractMethod(contractMemberNode: ContractMethod): void {
    contractMemberNode.body.accept(this)
  }
  visitAppStorageDefinition(contractMemberNode: AppStorageDefinition): void {
    contractMemberNode.key.accept(this)
  }
  visitSubroutine(rootNode: Subroutine): void {
    rootNode.body.accept(this)
  }
  visitLogicSignature(rootNode: LogicSignature): void {
    rootNode.program.accept(this)
  }
  visitContract(rootNode: Contract): void {
    for (const s of rootNode.appState) {
      s.accept(this)
    }
    for (const m of rootNode.methods) {
      m.accept(this)
    }
  }
}
