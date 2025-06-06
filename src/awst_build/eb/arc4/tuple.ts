import { intrinsicFactory } from '../../../awst/intrinsic-factory'
import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { logger } from '../../../logger'
import { codeInvariant, invariant } from '../../../util'
import { ptypeToArc4EncodedType } from '../../arc4-util'
import type { PType } from '../../ptypes'
import { numberPType, TuplePType, uint64PType } from '../../ptypes'
import { ARC4EncodedType, Arc4TupleClass, ARC4TupleType } from '../../ptypes/arc4-types'
import { instanceEb } from '../../type-registry'
import type { InstanceBuilder, NodeBuilder } from '../index'
import { ClassBuilder, FunctionBuilder } from '../index'
import { requireIntegerConstant } from '../util'
import { parseFunctionArgs } from '../util/arg-parsing'
import { Arc4EncodedBaseExpressionBuilder } from './base'

export class Arc4TupleClassBuilder extends ClassBuilder {
  readonly ptype = Arc4TupleClass

  newCall(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    const {
      args: tupleItems,
      ptypes: [tupleType],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 1,
      funcName: this.typeDescription,
      callLocation: sourceLocation,
      argSpec: (a) => args.map(() => a.required()),
    })
    codeInvariant(tupleType instanceof TuplePType, 'Generic type must be a native tuple type', sourceLocation)

    if (args.length === 0) {
      const arc4Type = ptypeToArc4EncodedType(tupleType, sourceLocation)
      codeInvariant(arc4Type.fixedByteSize !== null, 'Zero arg constructor can only be used for tuples with a fixed size encoding.')
      return new Arc4TupleExpressionBuilder(
        intrinsicFactory.bzero({ size: arc4Type.fixedByteSize, wtype: arc4Type.wtype, sourceLocation }),
        arc4Type,
      )
    }

    const expressions: Expression[] = []
    const types: ARC4EncodedType[] = []
    for (const item of tupleItems) {
      if (item.ptype instanceof ARC4EncodedType) {
        expressions.push(item.resolve())
        types.push(item.ptype)
      } else {
        logger.error(item.sourceLocation, 'ARC4 tuple items must be ARC4 encoded types')
      }
    }
    const arc4TupleType = new ARC4TupleType({
      types,
      sourceLocation,
    })
    return new Arc4TupleExpressionBuilder(
      nodeFactory.aRC4Encode({
        value: nodeFactory.tupleExpression({
          items: expressions,
          wtype: tupleType.wtype,
          sourceLocation,
        }),
        wtype: arc4TupleType.wtype,
        sourceLocation,
      }),
      arc4TupleType,
    )
  }
}

export class Arc4TupleExpressionBuilder extends Arc4EncodedBaseExpressionBuilder<ARC4TupleType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof ARC4TupleType, 'ptype must be ARC4TupleType')
    super(expr, ptype)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'at':
        return new Arc4TupleAtFunctionBuilder(this, sourceLocation)
      case 'length':
        return instanceEb(
          nodeFactory.uInt64Constant({
            value: BigInt(this.ptype.items.length),
            sourceLocation,
          }),
          uint64PType,
        )
    }
    return super.memberAccess(name, sourceLocation)
  }
}

class Arc4TupleAtFunctionBuilder extends FunctionBuilder {
  constructor(
    private builder: Arc4TupleExpressionBuilder,
    sourceLocation: SourceLocation,
  ) {
    super(sourceLocation)
  }
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [index],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 1,
      callLocation: sourceLocation,
      funcName: 'at',
      argSpec: (a) => [a.required(numberPType)],
    })

    const indexNum = requireIntegerConstant(index).value
    codeInvariant(
      indexNum < this.builder.ptype.items.length && indexNum >= 0,
      "Index arg must be a numeric literal between 0 and the tuple's length",
    )

    const itemType = this.builder.ptype.items[Number(indexNum)]

    return instanceEb(
      nodeFactory.tupleItemExpression({
        index: indexNum,
        sourceLocation,
        base: this.builder.resolve(),
      }),
      itemType,
    )
  }
}
