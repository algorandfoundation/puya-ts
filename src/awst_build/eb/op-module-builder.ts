import type ts from 'typescript'
import { intrinsicFactory } from '../../awst/intrinsic-factory'
import { nodeFactory } from '../../awst/node-factory'
import { Expression, IntegerConstant, StringConstant, UInt64BinaryOperator } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { CodeError, InternalError } from '../../errors'
import { codeInvariant, invariant } from '../../util'
import type { IntrinsicOpGrouping, IntrinsicOpMapping } from '../op-metadata'
import { OP_METADATA } from '../op-metadata'
import type { PType } from '../ptypes'
import {
  BytesPType,
  bytesPType,
  IntrinsicEnumType,
  IntrinsicFunctionGroupType,
  IntrinsicFunctionType,
  stringPType,
  uint64PType,
  voidPType,
} from '../ptypes'
import { instanceEb, typeRegistry } from '../type-registry'
import { FunctionBuilder, InstanceExpressionBuilder, NodeBuilder } from './index'
import { requestConstantOfType, requestExpressionOfType } from './util'
import { parseFunctionArgs } from './util/arg-parsing'

export class IntrinsicOpGroupBuilder extends NodeBuilder {
  private opGrouping: IntrinsicOpGrouping
  public readonly ptype: IntrinsicFunctionGroupType
  constructor(sourceLocation: SourceLocation, ptype: PType) {
    super(sourceLocation)
    invariant(ptype instanceof IntrinsicFunctionGroupType, 'ptype must be IntrinsicFunctionGroupType')
    this.ptype = ptype
    const metaData = OP_METADATA[ptype.name]
    invariant(metaData.type === 'op-grouping', 'ptype must map to op-grouping')
    this.opGrouping = metaData
  }

  hasProperty(name: string): boolean {
    return Object.hasOwn(this.opGrouping.ops, name)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    if (!Object.hasOwn(this.opGrouping.ops, name)) {
      return super.memberAccess(name, sourceLocation)
    }
    const metaData = this.opGrouping.ops[name]

    if (metaData.signatures.some((s) => s.argNames.length || s.returnType.equals(voidPType))) {
      return new GroupedIntrinsicOpBuilder(sourceLocation, metaData)
    }

    const [sig] = metaData.signatures
    return typeRegistry.getInstanceEb(
      nodeFactory.intrinsicCall({
        wtype: sig.returnType.wtypeOrThrow,
        opCode: metaData.op,
        sourceLocation: sourceLocation,
        stackArgs: sig.stackArgs.map((x) => {
          if (x instanceof Expression) {
            return x
          }
          throw new InternalError('Intrinsic property expression cannot have unresolved arguments', { sourceLocation })
        }),
        immediates: sig.immediateArgs.map((x) => {
          switch (typeof x) {
            case 'string':
            case 'bigint':
              return x
            default:
              throw new InternalError('Intrinsic property expression cannot have unresolved arguments', { sourceLocation })
          }
        }),
      }),
      sig.returnType,
    )
  }
}

abstract class IntrinsicOpBuilderBase extends FunctionBuilder {
  protected constructor(
    sourceLocation: SourceLocation,
    private opMapping: IntrinsicOpMapping,
  ) {
    super(sourceLocation)
  }

  /**
   * Extract with 2 args extracts to the end of the sequence, the exact op code depends on if the start index is a constant value or not
   * @param args
   * @param typeArgs
   * @param sourceLocation
   */
  handleExtract(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [target, start, end],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      funcName: 'extract',
      callLocation: sourceLocation,
      argSpec: (a) => [a.required(bytesPType), a.required(uint64PType), a.optional(uint64PType)],
    })
    if (end) {
      const endExpr = end.resolve()
      codeInvariant(
        !(endExpr instanceof IntegerConstant && endExpr.value === 0n),
        'Extract with length=0 will always return an empty byte array. Omit length parameter to extract to the end of the sequence.',
      )
      return instanceEb(
        nodeFactory.intrinsicCall({
          opCode: 'extract3',
          immediates: [],
          stackArgs: [target.resolve(), start.resolve(), endExpr],
          wtype: bytesPType.wtype,
          sourceLocation,
        }),
        bytesPType,
      )
    }
    const startExpr = start.resolve()
    if (startExpr instanceof IntegerConstant) {
      // Use immediate version of extract
      return instanceEb(
        nodeFactory.intrinsicCall({
          opCode: 'extract',
          immediates: [startExpr.value, 0n],
          stackArgs: [target.resolve()],
          wtype: bytesPType.wtype,
          sourceLocation,
        }),
        bytesPType,
      )
    } else {
      const targetExpr = target.singleEvaluation().resolve()
      const startExpr = start.singleEvaluation().resolve()
      return instanceEb(
        nodeFactory.intrinsicCall({
          opCode: 'extract3',
          immediates: [],
          stackArgs: [
            targetExpr,
            startExpr,
            nodeFactory.uInt64BinaryOperation({
              op: UInt64BinaryOperator.sub,
              sourceLocation,
              left: intrinsicFactory.bytesLen({ value: targetExpr, sourceLocation }),
              right: startExpr,
            }),
          ],
          wtype: bytesPType.wtype,
          sourceLocation,
        }),
        bytesPType,
      )
    }
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation<ts.CallExpression>): NodeBuilder {
    if (this.opMapping.op === 'extract3') {
      return this.handleExtract(args, typeArgs, sourceLocation)
    }
    signatureLoop: for (const [index, sig] of this.opMapping.signatures.entries()) {
      const isLastSig = index + 1 >= this.opMapping.signatures.length
      if (args.length !== sig.argNames.length) {
        if (isLastSig)
          throw new CodeError(`Expected ${sig.argNames.length} args`, {
            sourceLocation,
          })
        else continue
      }

      const immediates: Array<string | bigint> = []
      const stackArgs: Array<Expression> = []

      stackArgLoop: for (const arg of sig.stackArgs) {
        if (arg instanceof Expression) {
          stackArgs.push(arg)
          continue
        }
        const thisArg = args[sig.argNames.indexOf(arg.name)]

        const bytesParamLength = (arg.ptypes.find((ptype) => ptype instanceof BytesPType && ptype.length) as BytesPType)?.length
        if (thisArg.ptype instanceof BytesPType && thisArg.ptype.length && bytesParamLength && bytesParamLength !== thisArg.ptype.length) {
          throw new CodeError(`Argument ${arg.name} must be bytes<${bytesParamLength}>`, {
            sourceLocation,
          })
        }

        for (const ptype of arg.ptypes) {
          const expr = requestExpressionOfType(thisArg, ptype)
          if (expr) {
            stackArgs.push(expr)
            continue stackArgLoop
          }
        }
        continue signatureLoop
      }

      immediateArgLoop: for (const arg of sig.immediateArgs) {
        if (typeof arg === 'string' || typeof arg === 'bigint') {
          immediates.push(arg)
          continue
        }
        const thisArg = args[sig.argNames.indexOf(arg.name)]

        for (const ptype of arg.ptypes) {
          if (ptype instanceof IntrinsicEnumType) {
            const enumValue = requestConstantOfType(thisArg, stringPType)
            if (enumValue) {
              invariant(enumValue instanceof StringConstant, 'stringPType constant must be StringConstant')
              immediates.push(enumValue.value)
              continue immediateArgLoop
            }
          }
          const constantValue = requestConstantOfType(thisArg, ptype)
          if (constantValue) {
            if (constantValue instanceof IntegerConstant || constantValue instanceof StringConstant) {
              immediates.push(constantValue.value)
              continue immediateArgLoop
            }
            throw new InternalError(`Constant value ${constantValue} cannot be converted to an immediate argument`, { sourceLocation })
          }
        }
        continue signatureLoop
      }

      return typeRegistry.getInstanceEb(
        nodeFactory.intrinsicCall({
          opCode: this.opMapping.op,
          wtype: sig.returnType.wtypeOrThrow,
          sourceLocation: sourceLocation,
          stackArgs,
          immediates,
        }),
        sig.returnType,
      )
    }
    throw new CodeError(`Could not map arguments to any known signature`, { sourceLocation })
  }
}

export class FreeIntrinsicOpBuilder extends IntrinsicOpBuilderBase {
  readonly ptype: IntrinsicFunctionType
  constructor(sourceLocation: SourceLocation, ptype: PType) {
    invariant(ptype instanceof IntrinsicFunctionType, 'ptype must be IntrinsicFunctionType')
    const metaData = OP_METADATA[ptype.name]
    invariant(metaData.type === 'op-mapping', 'ptype must map to op-grouping')
    super(sourceLocation, metaData)
    this.ptype = ptype
  }
}

export class GroupedIntrinsicOpBuilder extends IntrinsicOpBuilderBase {
  constructor(sourceLocation: SourceLocation, opMapping: IntrinsicOpMapping) {
    super(sourceLocation, opMapping)
  }
}

/**
 * Builder for expressions which have the 'type' of an intrinsic function or group but are not the singleton instance
 * imported from @algorandfoundat/algorand-typescript. This is not supported.
 */
export class IntrinsicOpGroupOrFunctionTypeBuilder extends InstanceExpressionBuilder<PType> {
  constructor(expr: Expression, ptype: PType) {
    super(expr, ptype)
    throw new CodeError('Invalid alias of op function or group type', { sourceLocation: expr.sourceLocation })
  }
}
