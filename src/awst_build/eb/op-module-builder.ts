import { nodeFactory } from '../../awst/node-factory'
import { Expression, IntegerConstant, StringConstant } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { CodeError, InternalError } from '../../errors'
import { enumerate, invariant } from '../../util'
import type { IntrinsicOpGrouping, IntrinsicOpMapping } from '../op-metadata'
import { OP_METADATA } from '../op-metadata'
import type { PType } from '../ptypes'
import { IntrinsicEnumType, IntrinsicFunctionGroupType, IntrinsicFunctionType, stringPType } from '../ptypes'
import { typeRegistry } from '../type-registry'
import type { InstanceBuilder } from './index'
import { FunctionBuilder, NodeBuilder } from './index'
import { requestConstantOfType, requestExpressionOfType } from './util'

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
  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    if (!Object.hasOwn(this.opGrouping.ops, name)) {
      return super.memberAccess(name, sourceLocation)
    }
    const metaData = this.opGrouping.ops[name]

    if (metaData.signatures.some((s) => s.argNames.length)) {
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

  call(args: Array<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    signatureLoop: for (const [index, sig] of enumerate(this.opMapping.signatures)) {
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
