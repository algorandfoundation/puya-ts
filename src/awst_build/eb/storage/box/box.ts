import type ts from 'typescript'
import { nodeFactory } from '../../../../awst/node-factory'
import type { BoxValueExpression, Expression } from '../../../../awst/nodes'
import type { SourceLocation } from '../../../../awst/source-location'
import { wtypes } from '../../../../awst/wtypes'
import { invariant } from '../../../../util'
import type { PType } from '../../../ptypes'
import { boolPType, BoxPType, bytesPType, ReadonlyTuplePType, stringPType, uint64PType, voidPType } from '../../../ptypes'
import { instanceEb } from '../../../type-registry'
import { FunctionBuilder, type NodeBuilder } from '../../index'
import { parseFunctionArgs } from '../../util/arg-parsing'
import { extractKey } from '../util'
import { boxExists, boxLength, BoxProxyExpressionBuilder, boxValue, BoxValueExpressionBuilder } from './base'

export class BoxFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation<ts.CallExpression>): NodeBuilder {
    const {
      ptypes: [contentPType],
      args: [{ key }],
    } = parseFunctionArgs({
      args,
      typeArgs,
      funcName: `Box`,
      callLocation: sourceLocation,
      genericTypeArgs: 1,
      argSpec: (a) => [a.obj({ key: a.required(bytesPType, stringPType) })],
    })

    const ptype = new BoxPType({ content: contentPType })
    return new BoxExpressionBuilder(extractKey(key, wtypes.boxKeyWType, sourceLocation), ptype)
  }
}

export class BoxExpressionBuilder extends BoxProxyExpressionBuilder<BoxPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof BoxPType, 'BoxExpressionBuilder must be constructed with ptype of BoxPType')
    super(expr, ptype)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    const boxValueExpr = boxValue({
      key: this._expr,
      sourceLocation,
      contentType: this.ptype.contentType,
    })
    switch (name) {
      case 'create':
        return new BoxCreateFunctionBuilder(boxValueExpr, this.ptype.contentType, sourceLocation)
      case 'key':
        return this.toBytes(sourceLocation)
      case 'value':
        return new BoxValueExpressionBuilder(boxValueExpr, this.ptype.contentType)
      case 'exists':
        return boxExists(boxValueExpr, sourceLocation)
      case 'length':
        return boxLength(boxValueExpr, sourceLocation)
      case 'delete':
        return new BoxDeleteFunctionBuilder(boxValueExpr, sourceLocation)
      case 'get':
        return new BoxGetFunctionBuilder(boxValueExpr, this.ptype.contentType, sourceLocation)
      case 'maybe':
        return new BoxMaybeFunctionBuilder(boxValueExpr, this.ptype.contentType, sourceLocation)
      case 'extract':
        return new BoxExtractFunctionBuilder(boxValueExpr, sourceLocation)
      case 'replace':
        return new BoxReplaceFunctionBuilder(boxValueExpr, sourceLocation)
      case 'resize':
        return new BoxResizeFunctionBuilder(boxValueExpr, sourceLocation)
      case 'splice':
        return new BoxSpliceFunctionBuilder(boxValueExpr, sourceLocation)
    }
    return super.memberAccess(name, sourceLocation)
  }
}

class BoxCreateFunctionBuilder extends FunctionBuilder {
  constructor(
    private boxValue: BoxValueExpression,
    private contentType: PType,
    sourceLocation: SourceLocation,
  ) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation<ts.CallExpression>): NodeBuilder {
    const {
      args: [{ size }],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      callLocation: sourceLocation,
      funcName: 'Box.create',
      argSpec: (a) => [a.obj({ size: a.optional(uint64PType) })],
    })
    if (size) {
      return instanceEb(
        nodeFactory.intrinsicCall({
          opCode: 'box_create',
          stackArgs: [this.boxValue.key, size.resolve()],
          wtype: wtypes.boolWType,
          immediates: [],
          sourceLocation,
        }),
        boolPType,
      )
    }

    return instanceEb(
      nodeFactory.intrinsicCall({
        opCode: 'box_create',
        stackArgs: [
          this.boxValue.key,
          nodeFactory.sizeOf({ sizeWtype: this.contentType.wtypeOrThrow, sourceLocation, wtype: wtypes.uint64WType }),
        ],
        wtype: wtypes.boolWType,
        immediates: [],
        sourceLocation,
      }),
      boolPType,
    )
  }
}

class BoxDeleteFunctionBuilder extends FunctionBuilder {
  constructor(
    private boxValue: BoxValueExpression,
    sourceLocation: SourceLocation,
  ) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation<ts.CallExpression>): NodeBuilder {
    parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      argSpec: (a) => [],
      callLocation: sourceLocation,
      funcName: 'delete',
    })
    return instanceEb(
      nodeFactory.stateDelete({
        sourceLocation,
        field: this.boxValue,
        wtype: wtypes.boolWType,
      }),
      boolPType,
    )
  }
}

class BoxGetFunctionBuilder extends FunctionBuilder {
  constructor(
    private readonly boxValue: BoxValueExpression,
    private readonly contentType: PType,
    sourceLocation: SourceLocation,
  ) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation<ts.CallExpression>): NodeBuilder {
    const {
      args: [{ default: defaultValue }],
    } = parseFunctionArgs({
      args,
      typeArgs,
      funcName: 'Box.get',
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      argSpec: (a) => [a.obj({ default: a.optional(this.contentType) })],
    })

    if (defaultValue) {
      return instanceEb(
        nodeFactory.stateGet({
          sourceLocation,
          default: defaultValue.resolve(),
          wtype: this.contentType.wtypeOrThrow,
          field: this.boxValue,
        }),
        this.contentType,
      )
    } else {
      return new BoxValueExpressionBuilder(this.boxValue, this.contentType)
    }
  }
}
class BoxMaybeFunctionBuilder extends FunctionBuilder {
  constructor(
    private readonly boxValue: BoxValueExpression,
    private readonly contentType: PType,
    sourceLocation: SourceLocation,
  ) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation<ts.CallExpression>): NodeBuilder {
    parseFunctionArgs({
      args,
      typeArgs,
      funcName: 'Box.maybe',
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      argSpec: () => [],
    })
    const type = new ReadonlyTuplePType({ items: [this.contentType, boolPType] })
    return instanceEb(
      nodeFactory.stateGetEx({
        sourceLocation,
        wtype: type.wtype,
        field: this.boxValue,
      }),
      type,
    )
  }
}

export class BoxResizeFunctionBuilder extends FunctionBuilder {
  constructor(
    private boxValue: BoxValueExpression,
    sourceLocation: SourceLocation,
  ) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [size],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      funcName: 'Box.resize',
      callLocation: sourceLocation,
      argSpec: (a) => [a.required(uint64PType)],
    })
    return instanceEb(
      nodeFactory.intrinsicCall({
        opCode: 'box_resize',
        stackArgs: [this.boxValue.key, size.resolve()],
        wtype: wtypes.voidWType,
        immediates: [],
        sourceLocation,
      }),
      voidPType,
    )
  }
}
export class BoxExtractFunctionBuilder extends FunctionBuilder {
  constructor(
    private boxValue: BoxValueExpression,
    sourceLocation: SourceLocation,
  ) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [start, length],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      funcName: 'Box.extract',
      callLocation: sourceLocation,
      argSpec: (a) => [a.required(uint64PType), a.required(uint64PType)],
    })
    return instanceEb(
      nodeFactory.intrinsicCall({
        opCode: 'box_extract',
        stackArgs: [this.boxValue.key, start.resolve(), length.resolve()],
        wtype: wtypes.bytesWType,
        immediates: [],
        sourceLocation,
      }),
      bytesPType,
    )
  }
}
export class BoxReplaceFunctionBuilder extends FunctionBuilder {
  constructor(
    private boxValue: BoxValueExpression,
    sourceLocation: SourceLocation,
  ) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [start, value],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      funcName: 'Box.replace',
      callLocation: sourceLocation,
      argSpec: (a) => [a.required(uint64PType), a.required(bytesPType)],
    })
    return instanceEb(
      nodeFactory.intrinsicCall({
        opCode: 'box_replace',
        stackArgs: [this.boxValue.key, start.resolve(), value.resolve()],
        wtype: wtypes.voidWType,
        immediates: [],
        sourceLocation,
      }),
      voidPType,
    )
  }
}

export class BoxSpliceFunctionBuilder extends FunctionBuilder {
  constructor(
    private boxValue: BoxValueExpression,
    sourceLocation: SourceLocation,
  ) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [start, stop, value],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      funcName: 'Box.splice',
      callLocation: sourceLocation,
      argSpec: (a) => [a.required(uint64PType), a.required(uint64PType), a.required(bytesPType)],
    })
    return instanceEb(
      nodeFactory.intrinsicCall({
        opCode: 'box_splice',
        stackArgs: [this.boxValue.key, start.resolve(), stop.resolve(), value.resolve()],
        wtype: wtypes.voidWType,
        immediates: [],
        sourceLocation,
      }),
      voidPType,
    )
  }
}
