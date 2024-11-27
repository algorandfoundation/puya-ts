import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import { EqualityComparison } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { wtypes } from '../../../awst/wtypes'
import { CodeError } from '../../../errors'
import { codeInvariant, hexToUint8Array } from '../../../util'
import { bytesPType, type PType } from '../../ptypes'
import { ARC4EncodedType } from '../../ptypes/arc4-types'
import { instanceEb, typeRegistry } from '../../type-registry'
import { BooleanExpressionBuilder } from '../boolean-expression-builder'
import { BytesExpressionBuilder } from '../bytes-expression-builder'
import type { InstanceBuilder, NodeBuilder } from '../index'
import { BuilderComparisonOp, ClassBuilder, FunctionBuilder, InstanceExpressionBuilder } from '../index'
import { parseFunctionArgs } from '../util/arg-parsing'

export abstract class Arc4EncodedBaseClassBuilder extends ClassBuilder {
  constructor(sourceLocation: SourceLocation) {
    super(sourceLocation)
  }
  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'fromBytes':
        return new Arc4EncodedFromBytesFunctionBuilder(sourceLocation)
      case 'fromLog':
        return new Arc4EncodedFromLogFunctionBuilder(sourceLocation)
    }
    return super.memberAccess(name, sourceLocation)
  }
}

export class Arc4EncodedBaseExpressionBuilder<T extends ARC4EncodedType> extends InstanceExpressionBuilder<T> {
  constructor(expr: Expression, ptype: T) {
    super(expr, ptype)
  }

  compare(other: InstanceBuilder, op: BuilderComparisonOp, sourceLocation: SourceLocation): InstanceBuilder {
    switch (op) {
      case BuilderComparisonOp.eq:
      case BuilderComparisonOp.ne:
        throw new CodeError(`${op} operator is not supported on ${this.typeDescription}. Use 'equals' method instead`, { sourceLocation })
    }
    return super.compare(other, op, sourceLocation)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'bytes':
        return new BytesExpressionBuilder(this.toBytes(sourceLocation))
      case 'equals':
        return new Arc4EqualsFunctionBuilder(this, sourceLocation)
      case 'native':
        if (this.ptype.nativeType === undefined) break
        return instanceEb(
          nodeFactory.aRC4Decode({
            value: this.resolve(),
            sourceLocation,
            wtype: this.ptype.nativeType.wtypeOrThrow,
          }),
          this.ptype.nativeType,
        )
    }
    return super.memberAccess(name, sourceLocation)
  }

  toBytes(sourceLocation: SourceLocation): Expression {
    return nodeFactory.reinterpretCast({
      expr: this.resolve(),
      wtype: wtypes.bytesWType,
      sourceLocation,
    })
  }
}

class Arc4EqualsFunctionBuilder extends FunctionBuilder {
  constructor(
    private left: Arc4EncodedBaseExpressionBuilder<ARC4EncodedType>,
    sourceLocation: SourceLocation,
  ) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [right],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      callLocation: sourceLocation,
      funcName: 'equals',
      argSpec: (a) => [a.required(this.left.ptype)],
    })
    return new BooleanExpressionBuilder(
      nodeFactory.bytesComparisonExpression({
        operator: EqualityComparison.eq,
        lhs: this.left.toBytes(sourceLocation),
        rhs: right.toBytes(sourceLocation),
        sourceLocation,
      }),
    )
  }
}

export class Arc4EncodedFromBytesFunctionBuilder extends FunctionBuilder {
  constructor(
    sourceLocation: SourceLocation,
    private ptypeFactory?: (args: PType[]) => ARC4EncodedType,
    private genericArgsCount?: number,
  ) {
    super(sourceLocation)
  }
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const funcName = 'fromBytes'
    const {
      ptypes,
      args: [initialValueBuilder],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: this.genericArgsCount ?? 1,
      funcName,
      argSpec: (a) => [a.required(bytesPType)],
      callLocation: sourceLocation,
    })

    const ptype = this.ptypeFactory ? this.ptypeFactory(ptypes) : ptypes[0]
    codeInvariant(ptype instanceof ARC4EncodedType, 'Expected ARC4EncodedType')
    const initialValue = initialValueBuilder.resolve()
    const initialValueExpr = nodeFactory.reinterpretCast({
      wtype: ptype.wtype,
      sourceLocation,
      expr: initialValue,
    })

    return typeRegistry.getInstanceEb(initialValueExpr, ptype)
  }
}

export class Arc4EncodedFromLogFunctionBuilder extends FunctionBuilder {
  constructor(
    sourceLocation: SourceLocation,
    private ptypeFactory?: (args: PType[]) => ARC4EncodedType,
    private genericArgsCount?: number,
  ) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const funcName = 'fromLog'
    const {
      ptypes,
      args: [initialValueBuilder],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: this.genericArgsCount ?? 1,
      funcName,
      argSpec: (a) => [a.required(bytesPType)],
      callLocation: sourceLocation,
    })

    const ptype = this.ptypeFactory ? this.ptypeFactory(ptypes) : ptypes[0]
    codeInvariant(ptype instanceof ARC4EncodedType, 'Expected ARC4EncodedType')
    const initialValue = initialValueBuilder.resolve()
    const arc4Value = nodeFactory.intrinsicCall({
      opCode: 'extract',
      immediates: [4n, 0n],
      wtype: bytesPType.wtype,
      stackArgs: [initialValue],
      sourceLocation,
    })
    const arc4ValueExpr = nodeFactory.reinterpretCast({
      wtype: ptype.wtype,
      sourceLocation,
      expr: arc4Value,
    })
    const arc4ReturnValuePrefix = nodeFactory.intrinsicCall({
      opCode: 'extract',
      immediates: [0n, 4n],
      wtype: bytesPType.wtype,
      stackArgs: [initialValue],
      sourceLocation,
    })
    const arc4PrefixIsValid = nodeFactory.bytesComparisonExpression({
      operator: EqualityComparison.eq,
      lhs: arc4ReturnValuePrefix,
      rhs: nodeFactory.bytesConstant({ value: hexToUint8Array('151F7C75'), sourceLocation }),
      sourceLocation,
    })

    const fromLogExpr = nodeFactory.checkedMaybe({
      expr: nodeFactory.tupleExpression({ items: [arc4ValueExpr, arc4PrefixIsValid], sourceLocation }),
      comment: 'ARC4 prefix is valid',
    })
    return typeRegistry.getInstanceEb(fromLogExpr, ptype)
  }
}
