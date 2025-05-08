import { Buffer } from 'node:buffer'
import { InternalError } from '../errors'
import { uint8ArrayToBase32, uint8ArrayToUtf8 } from '../util'
import type { ContractReference } from './models'
import * as nodes from './nodes'
import type { CommaExpression, ConvertArray } from './nodes'
import { AppStorageKind, BytesEncoding, ContractMethodTarget, InstanceMethodTarget, InstanceSuperMethodTarget, SubroutineID } from './nodes'
import { SymbolToNumber } from './util'
import { wtypes } from './wtypes'

function printBytes(value: Uint8Array, encoding: BytesEncoding) {
  switch (encoding) {
    case BytesEncoding.utf8:
      return `"${uint8ArrayToUtf8(value)}"`
    case BytesEncoding.base64:
      return `b64<${Buffer.from(value).toString('base64')}>`
    case BytesEncoding.base32:
      return `b32<${uint8ArrayToBase32(value)}>`
    default:
      return `0x${Buffer.from(value).toString('hex')}`
  }
}
export class ToCodeVisitor
  implements
    nodes.RootNodeVisitor<string[]>,
    nodes.ContractMemberNodeVisitor<string[]>,
    nodes.StatementVisitor<string[]>,
    nodes.ExpressionVisitor<string>
{
  visitRange(expression: nodes.Range): string {
    return `urange(${expression.start.accept(this)}, ${expression.stop.accept(this)}, ${expression.step.accept(this)})`
  }
  visitCommaExpression(expression: CommaExpression): string {
    return expression.expressions.map((e) => e.accept(this)).join(', ')
  }

  visitVoidConstant(expression: nodes.VoidConstant): string {
    return `void`
  }
  visitGroupTransactionReference(expression: nodes.GroupTransactionReference): string {
    return `group_transaction(index=${expression.index.accept(this)}, type=${expression.wtype})`
  }
  visitPuyaLibCall(expression: nodes.PuyaLibCall): string {
    return `${expression.func}(${expression.args.map((a) => a.value.accept(this)).join(', ')})`
  }
  visitARC4Router(expression: nodes.ARC4Router): string {
    return `arc4Router()`
  }
  visitAppStorageDefinition(contractMemberNode: nodes.AppStorageDefinition): string[] {
    throw new Error('Method not implemented.')
  }
  #singleEval = new SymbolToNumber()
  visitUInt64PostfixUnaryOperation(expression: nodes.UInt64PostfixUnaryOperation): string {
    return `${expression.target.accept(this)}${expression.op}`
  }
  visitBigUIntPostfixUnaryOperation(expression: nodes.BigUIntPostfixUnaryOperation): string {
    return `${expression.target.accept(this)}${expression.op}`
  }
  visitCompiledContract(expression: nodes.CompiledContract): string {
    let overrides = Array.from(expression.allocationOverrides.entries())
      .map(([f, v]) => `${f}=${v.accept(this)}`)
      .join(', ')
    if (overrides) {
      overrides = `, ${overrides}`
    }

    let templateVars = Array.from(expression.templateVariables.entries())
      .map(([n, v]) => `${n}=${v.accept(this)}`)
      .join(', ')
    if (templateVars) {
      templateVars = `, ${templateVars}`
    }

    const prefix = expression.prefix ? `, prefix=${expression.prefix}` : ''

    return `compile(${expression.contract.id}${overrides}${prefix}${templateVars}`
  }
  visitCompiledLogicSig(expression: nodes.CompiledLogicSig): string {
    let templateVars = Array.from(expression.templateVariables.entries())
      .map(([n, v]) => `${n}=${v.accept(this)}`)
      .join(', ')
    if (templateVars) {
      templateVars = `, ${templateVars}`
    }

    const prefix = expression.prefix ? `, prefix=${expression.prefix}` : ''

    return `compile(${expression.logicSig.id}${prefix}${templateVars}`
  }
  visitLoopExit(statement: nodes.LoopExit): string[] {
    return ['break']
  }
  visitLoopContinue(statement: nodes.LoopContinue): string[] {
    return ['continue']
  }
  visitGoto(statement: nodes.Goto): string[] {
    return [`goto ${statement.target}`]
  }
  visitIntersectionSliceExpression(expression: nodes.IntersectionSliceExpression): string {
    const args = [expression.beginIndex, expression.endIndex]
      .flatMap((f) => (typeof f === 'bigint' ? f : (f?.accept(this) ?? [])))
      .join(', ')
    return `${expression.base.accept(this)}.slice(${args})`
  }
  visitBoxPrefixedKeyExpression(expression: nodes.BoxPrefixedKeyExpression): string {
    return `BoxMapKey(prefix=${expression.prefix.accept(this)}, key=${expression.key.accept(this)})`
  }

  visitBoxValueExpression(expression: nodes.BoxValueExpression): string {
    return `Box[${expression.key.accept(this)}].value`
  }
  visitIntegerConstant(expression: nodes.IntegerConstant): string {
    if (expression.tealAlias) return expression.tealAlias
    return `${expression.value}`
  }
  visitDecimalConstant(expression: nodes.DecimalConstant): string {
    return `${expression.value}m`
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
    return `TemplateVar[${expression.wtype}](${expression.name})`
  }
  visitMethodConstant(expression: nodes.MethodConstant): string {
    return `Method("${expression.value}")`
  }
  visitAddressConstant(expression: nodes.AddressConstant): string {
    return `Address("${expression.value}")`
  }
  visitARC4Encode(expression: nodes.ARC4Encode): string {
    return `ARC4_ENCODE(${expression.value.accept(this)}, wtype=${expression.wtype})`
  }
  visitCopy(expression: nodes.Copy): string {
    return `copy(${expression.value.accept(this)})`
  }
  visitArrayConcat(expression: nodes.ArrayConcat): string {
    return `${expression.left.accept(this)}.concat(${expression.right.accept(this)})`
  }
  visitArrayPop(expression: nodes.ArrayPop): string {
    return `${expression.base.accept(this)}.pop()`
  }
  visitArrayExtend(expression: nodes.ArrayExtend): string {
    return `${expression.base.accept(this)}.push(...${expression.other.accept(this)}`
  }
  visitArrayLength(expression: nodes.ArrayLength): string {
    return `${expression.array.accept(this)}.length`
  }
  visitArrayReplace(expression: nodes.ArrayReplace): string {
    return `${expression.base.accept(this)}.with(${expression.index.accept(this)}, ${expression.value.accept(this)})`
  }
  visitARC4Decode(expression: nodes.ARC4Decode): string {
    return `ARC4_DECODE(${expression.value.accept(this)})`
  }
  visitIntrinsicCall(expression: nodes.IntrinsicCall): string {
    const immediates = expression.immediates.length ? `<${expression.immediates.map((i) => i).join(', ')}>` : ''
    const stack = expression.stackArgs.map((a) => a.accept(this)).join(', ')
    return `${expression.opCode}${immediates}(${stack})`
  }
  visitCreateInnerTransaction(expression: nodes.CreateInnerTransaction): string {
    const fields = Array.from(expression.fields.entries())
      .map(([f, v]) => `${f}=${v.accept(this)}`)
      .join(', ')
    return `create_inner_transaction(${fields})`
  }
  visitUpdateInnerTransaction(expression: nodes.UpdateInnerTransaction): string {
    const fields = Array.from(expression.fields.entries())
      .map(([f, v]) => `${f}=${v.accept(this)}`)
      .join(', ')
    return `update_inner_transaction(${expression.itxn.accept(this)}, ${fields})`
  }
  visitCheckedMaybe(expression: nodes.CheckedMaybe): string {
    return `checked_maybe(${expression.expr.accept(this)}, comment=${expression.comment})`
  }
  visitTupleExpression(expression: nodes.TupleExpression): string {
    const names = expression.wtype.names
    if (names) {
      return `{ ${expression.items.map((item, i) => `${names[i]}: ${item.accept(this)}`).join(', ')} }`
    }

    return `<tuple>[${expression.items.map((i) => i.accept(this)).join(', ')}]`
  }
  visitTupleItemExpression(expression: nodes.TupleItemExpression): string {
    return `${expression.base.accept(this)}.${expression.index}`
  }
  visitVarExpression(expression: nodes.VarExpression): string {
    return expression.name
  }
  visitInnerTransactionField(expression: nodes.InnerTransactionField): string {
    const indexAccess = expression.arrayIndex ? `[${expression.arrayIndex.accept(this)}]` : ''
    return `${expression.itxn.accept(this)}.${expression.field}${indexAccess}`
  }
  visitSetInnerTransactionFields(expression: nodes.SetInnerTransactionFields): string {
    return `${expression.startWithBegin ? 'begin' : 'next'}_txn(${expression.itxns.map((i) => i.accept(this)).join(', ')})`
  }
  visitSizeOf(expression: nodes.SizeOf): string {
    return `size_of(${expression.sizeWtype})`
  }

  visitSubmitInnerTransaction(expression: nodes.SubmitInnerTransaction): string {
    return `submit_txn(${expression.itxns.map((i) => i.accept(this)).join(', ')})`
  }
  visitFieldExpression(expression: nodes.FieldExpression): string {
    return `${expression.base.accept(this)}.${expression.name}`
  }
  visitIndexExpression(expression: nodes.IndexExpression): string {
    return `${expression.base.accept(this)}[${expression.index.accept(this)}]`
  }
  visitSliceExpression(expression: nodes.SliceExpression): string {
    return `${expression.base.accept(this)}[${expression.beginIndex?.accept(this) ?? ''}:${expression.endIndex?.accept(this) ?? ''}]`
  }
  visitAppStateExpression(expression: nodes.AppStateExpression): string {
    return `GlobalState[${expression.key.accept(this)}]`
  }
  visitAppAccountStateExpression(expression: nodes.AppAccountStateExpression): string {
    return `LocalState[${expression.account.accept(this)}][${expression.key.accept(this)}]`
  }
  visitSingleEvaluation(expression: nodes.SingleEvaluation): string {
    const [id, isNew] = this.#singleEval.forSymbol(expression.id)
    if (!isNew) {
      return `#${id}`
    }
    return `(#${id} = ${expression.source.accept(this)})`
  }
  visitReinterpretCast(expression: nodes.ReinterpretCast): string {
    const target = expression.expr.accept(this)
    if (expression.wtype.equals(wtypes.boolWType)) {
      return `Boolean(${target})`
    }
    return `reinterpret_cast<${expression.wtype}>(${target})`
  }
  visitNewArray(expression: nodes.NewArray): string {
    return `new ${expression.wtype.name}(${expression.values.map((v) => v.accept(this)).join(', ')})`
  }
  visitConditionalExpression(expression: nodes.ConditionalExpression): string {
    return `(${expression.condition.accept(this)} ? ${expression.trueExpr.accept(this)} : ${expression.falseExpr.accept(this)})`
  }
  visitAssignmentExpression(expression: nodes.AssignmentExpression): string {
    const rvalue =
      expression.value instanceof nodes.AssignmentExpression ? `(${expression.value.accept(this)})` : expression.value.accept(this)
    return `(${expression.target.accept(this)} = ${rvalue})`
  }
  visitNumericComparisonExpression(expression: nodes.NumericComparisonExpression): string {
    return `${expression.lhs.accept(this)} ${expression.operator} ${expression.rhs.accept(this)}`
  }
  visitBytesComparisonExpression(expression: nodes.BytesComparisonExpression): string {
    return `${expression.lhs.accept(this)} ${expression.operator} ${expression.rhs.accept(this)}`
  }
  visitSubroutineCallExpression(expression: nodes.SubroutineCallExpression): string {
    const target = this.visitCallTarget(expression.target)
    return `${target}(${expression.args.map((a) => a.value.accept(this)).join(', ')})`
  }
  visitCallTarget(target: nodes.SubroutineCallExpression['target']) {
    if (target instanceof SubroutineID) return target.target
    if (target instanceof ContractMethodTarget) return `${target.cref}.${target.memberName}`
    if (target instanceof InstanceMethodTarget) return `this.${target.memberName}`
    if (target instanceof InstanceSuperMethodTarget) return `super.${target.memberName}`
    throw new InternalError(`Unhandled target: ${target}`)
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
    return `${expression.left.accept(this)} ${expression.op} ${expression.right.accept(this)}`
  }
  visitNot(expression: nodes.Not): string {
    return `!${expression.expr.accept(this)}`
  }
  visitEnumeration(expression: nodes.Enumeration): string {
    return `enumerate(${expression.expr.accept(this)})`
  }
  visitReversed(expression: nodes.Reversed): string {
    return `reversed(${expression.expr.accept(this)})`
  }
  visitStateGet(expression: nodes.StateGet): string {
    return `STATE_GET(${expression.field.accept(this)}, default=${expression.default.accept(this)})`
  }

  visitStateDelete(expression: nodes.StateDelete): string {
    return `STATE_DELETE(${expression.field.accept(this)})`
  }
  visitStateGetEx(expression: nodes.StateGetEx): string {
    return `STATE_GET_EX(${expression.field.accept(this)})`
  }
  visitStateExists(expression: nodes.StateExists): string {
    return `STATE_EXISTS(${expression.field.accept(this)})`
  }
  visitNewStruct(expression: nodes.NewStruct): string {
    const props = Array.from(expression.values)
      .map(([k, v]) => `${k}=${v.accept(this)}`)
      .join(', ')
    return `new ${expression.wtype.name}(${props})`
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
    return [`${statement.target.accept(this)}: ${statement.target.wtype} = ${statement.value.accept(this)}`]
  }
  visitUInt64AugmentedAssignment(statement: nodes.UInt64AugmentedAssignment): string[] {
    return [`${statement.target.accept(this)} = ${statement.target.accept(this)} ${statement.op} ${statement.value.accept(this)}`]
  }
  visitBigUIntAugmentedAssignment(statement: nodes.BigUIntAugmentedAssignment): string[] {
    return [`${statement.target.accept(this)} = ${statement.target.accept(this)} ${statement.op} ${statement.value.accept(this)}`]
  }
  visitBytesAugmentedAssignment(statement: nodes.BytesAugmentedAssignment): string[] {
    return [`${statement.target.accept(this)} = ${statement.target.accept(this)} ${statement.op} ${statement.value.accept(this)}`]
  }
  visitForInLoop(statement: nodes.ForInLoop): string[] {
    return [
      `for (${statement.items.accept(this)} in ${statement.sequence.accept(this)}) {`,
      ...indent(statement.loopBody.accept(this)),
      '}',
    ]
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
  visitEmit(expression: nodes.Emit): string {
    return `emit("${expression.signature}", ${expression.value.accept(this)})`
  }

  visitContractMethod(statement: nodes.ContractMethod): string[] {
    const args = statement.args.map((a) => `${a.name}: ${a.wtype}`).join(', ')

    const prefix = statement.cref.id === this.currentContract.at(-1)?.id ? '' : `${statement.cref.className}::`
    return [`${prefix}${statement.memberName}(${args}): ${statement.returnType}`, '{', ...indent(statement.body.accept(this)), '}', '']
  }
  visitLogicSignature(moduleStatement: nodes.LogicSignature): string[] {
    return ['', `logicsig ${moduleStatement.id} {`, ...indent(moduleStatement.program.body.accept(this)), '}']
  }
  visitAssertExpression(expression: nodes.AssertExpression): string {
    return [
      expression.condition ? 'assert(' : 'err(',
      expression.condition?.accept(this) ?? '',
      expression.errorMessage ? `, comment=${expression.errorMessage}` : '',
      ')',
    ].join('')
  }

  visitConvertArray(expression: ConvertArray): string {
    return `convert_array(${expression.expr.accept(this)}, wtype=${expression.wtype})`
  }

  private currentContract: ContractReference[] = []
  visitContract(c: nodes.Contract): string[] {
    this.currentContract.push(c.id)

    using _ = {
      [Symbol.dispose]: () => {
        this.currentContract.pop()
      },
    }
    const body: string[] = []
    if (c.appState.length) {
      const storageByKind = Array.from(c.appState.values()).reduce(
        (acc, cur) => acc.set(cur.kind, [...(acc.get(cur.kind) ?? []), cur]),
        new Map<AppStorageKind, nodes.AppStorageDefinition[]>(),
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
      body.push(`reservedScratchSpace: [${Array.from(c.reservedScratchSpace).join(', ')}]`)
    }
    if (c.approvalProgram) {
      body.push(...this.visitSpecialMethod(c.approvalProgram, 'approvalProgram'))
    }
    if (c.clearProgram) {
      body.push(...this.visitSpecialMethod(c.clearProgram, 'clearProgram'))
    }
    for (const method of c.methods) {
      body.push(...method.accept(this))
    }

    const header = ['contract', c.name]

    return [header.join(' '), '{', ...indent(body), '}']
  }

  visitSpecialMethod(statement: nodes.ContractMethod, name: string): string[] {
    return [`${name}(): ${statement.returnType}`, '{', ...indent(statement.body.accept(this)), '}', '']
  }
}

function indent(lines: string[], indentSize = '  '): string[] {
  return lines.map((l) => `${indentSize}${l}`)
}
