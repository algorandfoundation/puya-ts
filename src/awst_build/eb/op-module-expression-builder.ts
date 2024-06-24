import { FunctionBuilder, InstanceBuilder, NodeBuilder } from './index'
import { SourceLocation } from '../../awst/source-location'
import { Expression, IntegerConstant, StringConstant } from '../../awst/nodes'
import { CodeError, InternalError } from '../../errors'
import { nodeFactory } from '../../awst/node-factory'
import { requestConstantOfType, requestExpressionOfType, requestStringLiteral } from './util'
import { PType } from '../ptypes'
import { IntrinsicOpGrouping, IntrinsicOpMapping, OP_METADATA } from '../op-metadata'
import { enumerate } from '../../util'
import { IntrinsicEnumType } from '../ptypes/ptype-classes'
import { typeRegistry } from '../type-registry'

export class OpModuleExpressionBuilder extends NodeBuilder {
  get ptype(): PType | undefined {
    return undefined
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    if (!Object.hasOwn(OP_METADATA, name)) {
      return super.memberAccess(name, sourceLocation)
    }

    const metaData = OP_METADATA[name]

    if (metaData.type === 'op-grouping') {
      return new OpGroupingExpressionBuilder(sourceLocation, metaData)
    } else {
      return new IntrinsicOpBuilder(sourceLocation, metaData)
    }
  }
}

export class OpGroupingExpressionBuilder extends NodeBuilder {
  constructor(
    sourceLocation: SourceLocation,
    private opGrouping: IntrinsicOpGrouping,
  ) {
    super(sourceLocation)
  }
  get ptype(): PType | undefined {
    return undefined
  }
  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    if (!Object.hasOwn(this.opGrouping.ops, name)) {
      return super.memberAccess(name, sourceLocation)
    }
    const metaData = this.opGrouping.ops[name]

    if (
      metaData.signatures.some(
        (s) => s.immediateArgs.some((a) => typeof a !== 'object') || s.stackArgs.some((a) => !(a instanceof Expression)),
      )
    ) {
      return new IntrinsicOpBuilder(sourceLocation, metaData)
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

export class IntrinsicOpBuilder extends FunctionBuilder {
  constructor(
    sourceLocation: SourceLocation,
    private opMapping: IntrinsicOpMapping,
  ) {
    super(sourceLocation)
  }

  call(args: Array<InstanceBuilder>, sourceLocation: SourceLocation): InstanceBuilder {
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
          const expr = requestExpressionOfType(thisArg, ptype, sourceLocation)
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
            const enumValue = requestStringLiteral(thisArg)
            if (enumValue) {
              immediates.push(enumValue)
              continue immediateArgLoop
            }
          }
          const constantValue = requestConstantOfType(thisArg, ptype, sourceLocation)
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
