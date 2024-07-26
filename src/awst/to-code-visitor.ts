import * as nodes from './nodes'
import {
  AppStorageDefinition,
  AppStorageKind,
  BytesEncoding,
  ExpressionVisitor,
  FreeSubroutineTarget,
  InstanceSubroutineTarget,
  ModuleStatementVisitor,
  StatementVisitor,
} from './nodes'
import { TodoError } from '../errors'
import { logger } from '../logger'
import { uint8ArrayToUtf8 } from '../util'
import { Buffer } from 'node:buffer'
import { uint8ArrayToBase32 } from '../util'

function printBytes(value: Uint8Array, encoding: BytesEncoding) {
  switch (encoding) {
    case BytesEncoding.utf8:
      return `"${uint8ArrayToUtf8(value)}"`
    case BytesEncoding.base64:
      return `b64<${Buffer.from(value).toString('base64')}>`
    case BytesEncoding.base32:
      return `b32<${uint8ArrayToBase32(value)}>`
    default:
      return `hex<${Buffer.from(value).toString('hex')}>`
  }
}
export class ToCodeVisitor implements ModuleStatementVisitor<string[]>, StatementVisitor<string[]>, ExpressionVisitor<string> {
  visitUInt64PostfixUnaryOperation(expression: nodes.UInt64PostfixUnaryOperation): string {
    return `${expression.target.accept(this)}${expression.op}`
  }
  visitBigUIntPostfixUnaryOperation(expression: nodes.BigUIntPostfixUnaryOperation): string {
    return `${expression.target.accept(this)}${expression.op}`
  }
  visitCompiledContract(expression: nodes.CompiledContract): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitCompiledLogicSig(expression: nodes.CompiledLogicSig): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitLoopExit(statement: nodes.LoopExit): string[] {
    throw new TodoError('Method not implemented.', { sourceLocation: statement.sourceLocation })
  }
  visitLoopContinue(statement: nodes.LoopContinue): string[] {
    throw new TodoError('Method not implemented.', { sourceLocation: statement.sourceLocation })
  }
  visitGoto(statement: nodes.Goto): string[] {
    return [`goto ${statement.target}`]
  }
  visitIntersectionSliceExpression(expression: nodes.IntersectionSliceExpression): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitBoxValueExpression(expression: nodes.BoxValueExpression): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitIntegerConstant(expression: nodes.IntegerConstant): string {
    if (expression.tealAlias) return expression.tealAlias
    return `${expression.value}`
  }
  visitDecimalConstant(expression: nodes.DecimalConstant): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitBoolConstant(expression: nodes.BoolConstant): string {
    return expression.value ? 'True' : 'False'
  }
  visitBytesConstant(expression: nodes.BytesConstant): string {
    return printBytes(expression.value, expression.encoding)
  }
  visitStringConstant(expression: nodes.StringConstant): string {
    return `"${expression.value}"`
  }
  visitTemplateVar(expression: nodes.TemplateVar): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitMethodConstant(expression: nodes.MethodConstant): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitAddressConstant(expression: nodes.AddressConstant): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitARC4Encode(expression: nodes.ARC4Encode): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitCopy(expression: nodes.Copy): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitArrayConcat(expression: nodes.ArrayConcat): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitArrayPop(expression: nodes.ArrayPop): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitArrayExtend(expression: nodes.ArrayExtend): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitARC4Decode(expression: nodes.ARC4Decode): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitIntrinsicCall(expression: nodes.IntrinsicCall): string {
    const immediates = expression.immediates.length ? `<${expression.immediates.map((i) => i).join(', ')}>` : ''
    const stack = expression.stackArgs.map((a) => a.accept(this)).join(', ')
    return `${expression.opCode}${immediates}(${stack})`
  }
  visitCreateInnerTransaction(expression: nodes.CreateInnerTransaction): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitUpdateInnerTransaction(expression: nodes.UpdateInnerTransaction): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitCheckedMaybe(expression: nodes.CheckedMaybe): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitTupleExpression(expression: nodes.TupleExpression): string {
    return `<tuple>[${expression.items.map((i) => i.accept(this)).join(', ')}]`
  }
  visitTupleItemExpression(expression: nodes.TupleItemExpression): string {
    return `${expression.base.accept(this)}.${expression.index}`
  }
  visitVarExpression(expression: nodes.VarExpression): string {
    return expression.name
  }
  visitInnerTransactionField(expression: nodes.InnerTransactionField): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitSubmitInnerTransaction(expression: nodes.SubmitInnerTransaction): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitFieldExpression(expression: nodes.FieldExpression): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitIndexExpression(expression: nodes.IndexExpression): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitSliceExpression(expression: nodes.SliceExpression): string {
    return `${expression.base.accept(this)}[${expression.beginIndex?.accept(this) ?? ''}:${expression.endIndex?.accept(this) ?? ''}]`
  }
  visitAppStateExpression(expression: nodes.AppStateExpression): string {
    return `GlobalState[${expression.key.accept(this)}]`
  }
  visitAppAccountStateExpression(expression: nodes.AppAccountStateExpression): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitSingleEvaluation(expression: nodes.SingleEvaluation): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitReinterpretCast(expression: nodes.ReinterpretCast): string {
    return `reinterpret_cast<${expression.wtype}>(${expression.expr.accept(this)})`
  }
  visitNewArray(expression: nodes.NewArray): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitConditionalExpression(expression: nodes.ConditionalExpression): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitAssignmentExpression(expression: nodes.AssignmentExpression): string {
    const rvalue =
      expression.value instanceof nodes.AssignmentExpression ? `(${expression.value.accept(this)})` : expression.value.accept(this)
    return `${expression.target.accept(this)} = ${rvalue}`
  }
  visitNumericComparisonExpression(expression: nodes.NumericComparisonExpression): string {
    return `${expression.lhs.accept(this)} ${expression.operator} ${expression.rhs.accept(this)}`
  }
  visitBytesComparisonExpression(expression: nodes.BytesComparisonExpression): string {
    return `${expression.lhs.accept(this)} ${expression.operator} ${expression.rhs.accept(this)}`
  }
  visitSubroutineCallExpression(expression: nodes.SubroutineCallExpression): string {
    const target =
      expression.target instanceof FreeSubroutineTarget ? '' : expression.target instanceof InstanceSubroutineTarget ? 'this.' : 'super.'
    return `${target}${expression.target.name}(${expression.args.map((a) => a.value.accept(this)).join(', ')})`
  }
  visitUInt64UnaryOperation(expression: nodes.UInt64UnaryOperation): string {
    return `${expression.op}${expression.expr.accept(this)}`
  }
  visitBytesUnaryOperation(expression: nodes.BytesUnaryOperation): string {
    return `${expression.op}${expression.expr.accept(this)}`
  }
  visitUInt64BinaryOperation(expression: nodes.UInt64BinaryOperation): string {
    return `${expression.left.accept(this)} ${expression.op} ${expression.right.accept(this)}`
  }
  visitBigUIntBinaryOperation(expression: nodes.BigUIntBinaryOperation): string {
    return `${expression.left.accept(this)} ${expression.op} ${expression.right.accept(this)}`
  }
  visitBytesBinaryOperation(expression: nodes.BytesBinaryOperation): string {
    return `${expression.left.accept(this)} ${expression.op} ${expression.right.accept(this)}`
  }
  visitBooleanBinaryOperation(expression: nodes.BooleanBinaryOperation): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitNot(expression: nodes.Not): string {
    return `!${expression.expr.accept(this)}`
  }
  visitContains(expression: nodes.Contains): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitEnumeration(expression: nodes.Enumeration): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitReversed(expression: nodes.Reversed): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitStateGet(expression: nodes.StateGet): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitStateGetEx(expression: nodes.StateGetEx): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitStateExists(expression: nodes.StateExists): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitNewStruct(expression: nodes.NewStruct): string {
    throw new TodoError('Method not implemented.', { sourceLocation: expression.sourceLocation })
  }
  visitExpressionStatement(statement: nodes.ExpressionStatement): string[] {
    return [statement.expr.accept(this)]
  }
  visitBlock(statement: nodes.Block): string[] {
    return [...(statement.label ? [`${statement.label}:`] : []), ...statement.body.flatMap((b) => b.accept(this))]
  }
  visitIfElse(statement: nodes.IfElse): string[] {
    return [
      `if (${statement.condition.accept(this)}) {`,
      ...indent(statement.ifBranch.accept(this)),
      ...(statement.elseBranch ? ['} else {', ...indent(statement.elseBranch.accept(this)), '}'] : ['}']),
    ]
  }
  visitSwitch(statement: nodes.Switch): string[] {
    return [
      `switch (${statement.value.accept(this)}) {`,
      ...indent(
        Array.from(statement.cases.entries()).flatMap(([clause, block]) => [`case ${clause.accept(this)}:`, ...indent(block.accept(this))]),
      ),
      ...(statement.defaultCase ? indent(['default:', ...indent(statement.defaultCase.accept(this))]) : []),
      '}',
    ]
  }
  visitWhileLoop(statement: nodes.WhileLoop): string[] {
    return [`while (${statement.condition.accept(this)}) {`, ...indent(statement.loopBody.accept(this)), '}']
  }
  visitReturnStatement(statement: nodes.ReturnStatement): string[] {
    return [`return ${statement.value?.accept(this) ?? ''}`]
  }
  visitAssignmentStatement(statement: nodes.AssignmentStatement): string[] {
    return [`var ${statement.target.accept(this)}: ${statement.target.wtype} = ${statement.value.accept(this)}`]
  }
  visitUInt64AugmentedAssignment(statement: nodes.UInt64AugmentedAssignment): string[] {
    throw new TodoError('Method not implemented.', { sourceLocation: statement.sourceLocation })
  }
  visitBigUIntAugmentedAssignment(statement: nodes.BigUIntAugmentedAssignment): string[] {
    throw new TodoError('Method not implemented.', { sourceLocation: statement.sourceLocation })
  }
  visitBytesAugmentedAssignment(statement: nodes.BytesAugmentedAssignment): string[] {
    throw new TodoError('Method not implemented.', { sourceLocation: statement.sourceLocation })
  }
  visitForInLoop(statement: nodes.ForInLoop): string[] {
    return [
      `for (${statement.items.accept(this)} in ${statement.sequence.accept(this)}) {`,
      ...indent(statement.loopBody.accept(this)),
      '}',
    ]
  }
  visitStateDelete(statement: nodes.StateDelete): string[] {
    throw new TodoError('Method not implemented.', { sourceLocation: statement.sourceLocation })
  }
  visitConstantDeclaration(moduleStatement: nodes.ConstantDeclaration): string[] {
    return [`${moduleStatement.name} = ${moduleStatement.value}`]
  }
  visitSubroutine(moduleStatement: nodes.Subroutine): string[] {
    const args = moduleStatement.args.map((a) => `${a.name}: ${a.wtype}`).join(', ')
    return [
      `subroutine ${moduleStatement.name}(${args}): ${moduleStatement.returnType}`,
      '{',
      ...indent(moduleStatement.body.accept(this)),
      '}',
    ]
  }
  visitContractMethod(statement: nodes.ContractMethod): string[] {
    return [`${statement.name}(): ${statement.returnType}`, '{', ...indent(statement.body.accept(this)), '}', '']
  }
  visitLogicSignature(moduleStatement: nodes.LogicSignature): string[] {
    throw new TodoError('Method not implemented.', { sourceLocation: moduleStatement.sourceLocation })
  }
  visitContractFragment(c: nodes.ContractFragment): string[] {
    const body: string[] = []
    if (c.appState.size) {
      const storageByKind = Array.from(c.appState.values()).reduce(
        (acc, cur) => acc.set(cur.kind, [...(acc.get(cur.kind) ?? []), cur]),
        new Map<AppStorageKind, AppStorageDefinition[]>(),
      )
      for (const [name, kind] of [
        ['globals', AppStorageKind.appGlobal],
        ['locals', AppStorageKind.accountLocal],
        ['boxes', AppStorageKind.box],
      ] as const) {
        const items = storageByKind.get(kind)
        if (items?.length) {
          body.push(
            `${name} {`,
            ...indent(
              items.map((g) =>
                g.keyWtype ? `[${g.key.accept(this)}]: ${g.keyWtype} => ${g.storageWtype}` : `[${g.key.accept(this)}]: ${g.storageWtype}`,
              ),
            ),
            '}',
          )
        }
      }
    }
    if (c.reservedScratchSpace.size) {
      logger.warn(c.sourceLocation, 'Handle reservedScratchSpace to-code')
    }
    if (c.init) {
      body.push(...this.visitSpecialMethod(c.init, 'constructor'))
    }
    if (c.approvalProgram) {
      body.push(...this.visitSpecialMethod(c.approvalProgram, 'approvalProgram'))
    }
    if (c.clearProgram) {
      body.push(...this.visitSpecialMethod(c.clearProgram, 'clearProgram'))
    }
    for (const method of c.subroutines) {
      body.push(...method.accept(this))
    }

    const header = ['contract', c.name]
    if (c.isAbstract) {
      header.splice(0, 0, 'abstract')
    }
    if (c.bases.length) {
      header.push('extends', c.bases.map((b) => `${b.module}::${b.name}`).join(', '))
    }

    return [header.join(' '), '{', ...indent(body), '}']
  }
  visitStructureDefinition(moduleStatement: nodes.StructureDefinition): string[] {
    throw new TodoError('Method not implemented.', { sourceLocation: moduleStatement.sourceLocation })
  }

  visitSpecialMethod(statement: nodes.ContractMethod, name: string): string[] {
    return [`${name}(): ${statement.returnType}`, '{', ...indent(statement.body.accept(this)), '}', '']
  }
}

function indent(lines: string[], indentSize = '  '): string[] {
  return lines.map((l) => `${indentSize}${l}`)
}
