import { ExpressionBuilder, IntermediateExpressionBuilder } from './index'
import { SourceLocation } from '../../awst/source-location'
import { Expression, Literal } from '../../awst/nodes'
import { CodeError } from '../../errors'
import { nodeFactory } from '../../awst/node-factory'
import { requireExpressionOfType, requireLiteral } from './util'
import { bytesPType, PType, typeRegistry, uint64PType } from '../ptypes'

export class OpModuleExpressionBuilder extends IntermediateExpressionBuilder {
  memberAccess(name: string, sourceLocation: SourceLocation): ExpressionBuilder | Literal {
    switch (name) {
      case 'Txn':
        return new TxnExpressionBuilder(sourceLocation)
      case 'btoi':
        return new IntrinsicOpExpressionBuilder(sourceLocation, {
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

export class TxnExpressionBuilder extends IntermediateExpressionBuilder {
  memberAccess(name: string, sourceLocation: SourceLocation): ExpressionBuilder | Literal {
    switch (name) {
      case 'applicationArgs':
        return new IntrinsicOpExpressionBuilder(sourceLocation, {
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

export class IntrinsicOpExpressionBuilder extends IntermediateExpressionBuilder {
  constructor(
    sourceLocation: SourceLocation,
    private opMapping: IntrinsicOpMapping,
  ) {
    super(sourceLocation)
  }

  call(args: Array<ExpressionBuilder | Literal>, sourceLocation: SourceLocation): ExpressionBuilder {
    if (args.length !== this.opMapping.argNames.length) {
      throw new CodeError(`Expected ${this.opMapping.argNames.length} args`, {
        sourceLocation,
      })
    }

    const mapStackArg = (arg: Expression | StackArg): Expression => {
      if (arg instanceof Expression) return arg

      return requireExpressionOfType(args[this.opMapping.argNames.indexOf(arg.name)], arg.ptype.wtypeOrThrow)
    }

    const mapImmediateArg = (arg: string | ImmediateArgMapping | bigint): string | bigint => {
      if (typeof arg == 'string' || typeof arg == 'bigint') return arg

      const lit = requireLiteral(args[this.opMapping.argNames.indexOf(arg.name)])
      const allowedTypes = Array.isArray(arg.literalType) ? arg.literalType : [arg.literalType]
      if (allowedTypes.some((a) => a == typeof lit.value)) {
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

    return super.call(args, sourceLocation)
  }
}
