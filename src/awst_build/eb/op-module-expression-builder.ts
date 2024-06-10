import { FunctionBuilder, InstanceBuilder, NodeBuilder } from './index'
import { SourceLocation } from '../../awst/source-location'
import { Expression } from '../../awst/nodes'
import { CodeError } from '../../errors'
import { nodeFactory } from '../../awst/node-factory'
import { requireConstant, requireExpressionOfType } from './util'
import { bytesPType, PType, typeRegistry, uint64PType } from '../ptypes'

export class OpModuleExpressionBuilder extends NodeBuilder {
  get ptype(): PType | undefined {
    return undefined
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'Txn':
        return new TxnExpressionBuilder(sourceLocation)
      case 'btoi':
        return new IntrinsicOpBuilder(sourceLocation, {
          op: 'btoi',
          argNames: ['value'],
          immediateArgs: [],
          stackArgs: [{ name: 'value', ptype: bytesPType }],
          ptype: uint64PType,
        })
    }
    return super.memberAccess(name, sourceLocation)
  }
}

export class TxnExpressionBuilder extends NodeBuilder {
  get ptype(): PType | undefined {
    return undefined
  }
  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'applicationArgs':
        return new IntrinsicOpBuilder(sourceLocation, {
          op: 'txn',
          argNames: ['n'],
          immediateArgs: ['ApplicationArgs'],
          stackArgs: [{ name: 'n', ptype: uint64PType }],
          ptype: bytesPType,
        })
    }
    return super.memberAccess(name, sourceLocation)
  }
}

type LiteralType = 'string' | 'bigint'

type ImmediateArgMapping = {
  name: string
  literalType: LiteralType | LiteralType[]
}

type StackArg = {
  name: string
  ptype: PType
}

type IntrinsicOpMapping = {
  op: string
  argNames: string[]
  immediateArgs: Array<ImmediateArgMapping | bigint | string>
  stackArgs: Array<StackArg | Expression>
  ptype: PType
}

export class IntrinsicOpBuilder extends FunctionBuilder {
  constructor(
    sourceLocation: SourceLocation,
    private opMapping: IntrinsicOpMapping,
  ) {
    super(sourceLocation)
  }

  call(args: Array<InstanceBuilder>, sourceLocation: SourceLocation): InstanceBuilder {
    if (args.length !== this.opMapping.argNames.length) {
      throw new CodeError(`Expected ${this.opMapping.argNames.length} args`, {
        sourceLocation,
      })
    }

    const mapStackArg = (arg: Expression | StackArg): Expression => {
      if (arg instanceof Expression) return arg

      return requireExpressionOfType(args[this.opMapping.argNames.indexOf(arg.name)], arg.ptype, sourceLocation)
    }

    const mapImmediateArg = (arg: string | ImmediateArgMapping | bigint): string | bigint => {
      if (typeof arg === 'string' || typeof arg === 'bigint') return arg

      const lit = requireConstant(args[this.opMapping.argNames.indexOf(arg.name)], sourceLocation)
      const allowedTypes = Array.isArray(arg.literalType) ? arg.literalType : [arg.literalType]
      if (allowedTypes.some((a) => a === typeof lit.value)) {
        return lit.value as string | bigint
      }
      throw new CodeError(`Expected argument of type ${arg.literalType} for param ${arg.name}`, {
        sourceLocation,
      })
    }

    return typeRegistry.getInstanceEb(
      nodeFactory.intrinsicCall({
        opCode: this.opMapping.op,
        wtype: this.opMapping.ptype.wtypeOrThrow,
        sourceLocation: sourceLocation,
        stackArgs: this.opMapping.stackArgs.map(mapStackArg),
        immediates: this.opMapping.immediateArgs.map(mapImmediateArg),
      }),
      this.opMapping.ptype,
    )
  }
}
