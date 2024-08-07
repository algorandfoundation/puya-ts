import type { BoxValueExpression, Expression } from '../../../awst/nodes'
import type { PType } from '../../ptypes'
import { boolPType, TuplePType } from '../../ptypes'
import { boxRefType, bytesPType } from '../../ptypes'
import type { InstanceBuilder, NodeBuilder } from '../index'
import { ParameterlessFunctionBuilder } from '../index'
import { FunctionBuilder, InstanceExpressionBuilder } from '../index'
import { BoxMapPType, BoxPType, BoxRefPType } from '../../ptypes'
import { invariant } from '../../../util'
import type { SourceLocation } from '../../../awst/source-location'
import { requireExpressionOfType } from '../util'
import { ValueProxy } from './value-proxy'
import { nodeFactory } from '../../../awst/node-factory'
import { instanceEb, typeRegistry } from '../../type-registry'
import { VoidExpressionBuilder } from '../void-expression-builder'
import { boolWType, voidWType } from '../../../awst/wtypes'
import { parseFunctionArgs } from '../util/arg-parsing'
import { intrinsicFactory } from '../../../awst/intrinsic-factory'
import { BooleanExpressionBuilder } from '../boolean-expression-builder'

export class BoxFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      ptypes: [contentPType],
      args: [{ key }],
    } = parseFunctionArgs({
      args,
      typeArgs,
      funcName: `Box`,
      callLocation: sourceLocation,
      genericTypeArgs: 1,
      argMap: [{ key: [bytesPType] }],
    })

    const ptype = new BoxPType({ content: contentPType })
    return new BoxExpressionBuilder(key, ptype)
  }
}
export class BoxRefFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [{ key }],
    } = parseFunctionArgs({
      args,
      typeArgs,
      funcName: `BoxRef`,
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      argMap: [{ key: [bytesPType] }],
    })

    return new BoxRefExpressionBuilder(key, boxRefType)
  }
}
export class BoxMapFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      ptypes: [keyPrefixPType, contentPType],
      args: [{ keyPrefix }],
    } = parseFunctionArgs({
      args,
      typeArgs,
      funcName: `BoxMap`,
      callLocation: sourceLocation,
      genericTypeArgs: 2,
      argMap: [{ keyPrefix: [bytesPType] }],
    })

    const ptype = new BoxMapPType({ content: contentPType, keyType: keyPrefixPType })
    return new BoxMapExpressionBuilder(keyPrefix, ptype)
  }
}

export class BoxMapExpressionBuilder extends InstanceExpressionBuilder<BoxMapPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof BoxMapPType, 'BoxMapExpressionBuilder must be constructed with ptype of BoxMapPType')
    super(expr, ptype)
  }
  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'set':
        return new BoxMapSetFunctionBuilder(this._expr, this.ptype, sourceLocation)
      case 'delete':
        return new BoxMapDeleteFunctionBuilder(this._expr, this.ptype, sourceLocation)
      case 'get':
        return new BoxMapGetFunctionBuilder(this._expr, this.ptype, sourceLocation)
    }
    return super.memberAccess(name, sourceLocation)
  }
}
export class BoxRefExpressionBuilder extends InstanceExpressionBuilder<BoxRefPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof BoxRefPType, 'BoxRefExpressionBuilder must be constructed with ptype of BoxRefPType')
    super(expr, ptype)
  }
}

function boxValue({
  key,
  sourceLocation,
  contentType,
}: {
  key: Expression
  sourceLocation: SourceLocation
  contentType: PType
}): BoxValueExpression {
  return nodeFactory.boxValueExpression({
    key,
    sourceLocation,
    wtype: contentType.wtypeOrThrow,
    existsAssertionMessage: 'Box must have value',
  })
}

export class BoxExpressionBuilder extends InstanceExpressionBuilder<BoxPType> {
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
      case 'value':
        return new BoxValueExpressionBuilder(boxValueExpr, this.ptype.contentType)
      case 'exists':
        return new BooleanExpressionBuilder(
          nodeFactory.stateExists({
            field: boxValueExpr,
            sourceLocation,
            wtype: boolWType,
          }),
        )
      case 'delete':
        return new BoxDeleteFunctionBuilder(boxValueExpr, sourceLocation)
      case 'get':
        return new BoxGetFunctionBuilder(boxValueExpr, this.ptype.contentType, sourceLocation)
      case 'maybe':
        return new BoxMaybeFunctionBuilder(boxValueExpr, this.ptype.contentType, sourceLocation)
    }
    return super.memberAccess(name, sourceLocation)
  }
}

/**
 * Wraps the box value expression and watches for certain expressions which can be optimized.
 *
 * For example box.value.bytes.slice(...) can be optimized to use box_extract directly rather
 * than reading the entire box into memory and then slicing it. All unhandled scenarios are proxied
 * through to the underlying builder for the given type.
 */
class BoxValueExpressionBuilder extends ValueProxy<PType> {
  constructor(boxValue: BoxValueExpression, ptype: PType) {
    super(boxValue, ptype)
  }
  assign(other: InstanceBuilder, sourceLocation: SourceLocation): InstanceBuilder {
    const value = requireExpressionOfType(other, this.ptype, sourceLocation)
    return typeRegistry.getInstanceEb(
      nodeFactory.assignmentExpression({
        target: this.resolveLValue(),
        value,
        sourceLocation,
        wtype: this.ptype.wtypeOrThrow,
      }),
      this.ptype,
    )
  }
}
class BoxDeleteFunctionBuilder extends ParameterlessFunctionBuilder {
  constructor(boxValue: BoxValueExpression, sourceLocation: SourceLocation) {
    super(
      boxValue,
      (expr) =>
        new VoidExpressionBuilder(
          nodeFactory.stateDelete({
            sourceLocation,
            field: boxValue,
            wtype: voidWType,
          }),
        ),
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

  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [{ default: defaultValue }],
    } = parseFunctionArgs({
      args,
      typeArgs,
      funcName: 'Box.get',
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      argMap: [{ default: [this.contentType, undefined] }],
    })

    if (defaultValue) {
      return instanceEb(
        nodeFactory.stateGet({
          sourceLocation,
          default: defaultValue,
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
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    parseFunctionArgs({
      args,
      typeArgs,
      funcName: 'Box.maybe',
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      argMap: [],
    })
    const type = new TuplePType({ items: [this.contentType, boolPType], immutable: true })

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
abstract class BoxMapFunctionBuilderBase extends FunctionBuilder {
  #mapPType: BoxMapPType
  #boxMapExpr: Expression
  constructor(boxMapExpr: Expression, mapPType: BoxMapPType, sourceLocation: SourceLocation) {
    super(sourceLocation)
    this.#mapPType = mapPType
    this.#boxMapExpr = boxMapExpr
  }
  protected get contentType() {
    return this.#mapPType.contentType
  }
  protected get keyType() {
    return this.#mapPType.keyType
  }
  protected boxValueExpression(key: Expression): BoxValueExpression {
    const keyBytes = instanceEb(key, this.keyType).toBytes(this.sourceLocation)

    return nodeFactory.boxValueExpression({
      sourceLocation: this.sourceLocation,
      existsAssertionMessage: 'Box must have value',
      key: intrinsicFactory.bytesConcat({
        left: this.#boxMapExpr,
        right: keyBytes,
        sourceLocation: this.sourceLocation,
      }),
      wtype: this.contentType.wtypeOrThrow,
    })
  }
}
class BoxMapGetFunctionBuilder extends BoxMapFunctionBuilderBase {
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [key, { default: defaultValue }],
    } = parseFunctionArgs({
      args,
      typeArgs,
      funcName: 'BoxMap.set',
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      argMap: [[this.keyType], { default: [this.contentType, undefined] }],
    })

    if (defaultValue) {
      return instanceEb(
        nodeFactory.stateGet({
          sourceLocation,
          default: defaultValue,
          wtype: this.contentType.wtypeOrThrow,
          field: this.boxValueExpression(key),
        }),
        this.contentType,
      )
    } else {
      return new BoxValueExpressionBuilder(this.boxValueExpression(key), this.contentType)
    }
  }
}
class BoxMapSetFunctionBuilder extends BoxMapFunctionBuilderBase {
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [key, value],
    } = parseFunctionArgs({
      args,
      typeArgs,
      funcName: 'BoxMap.set',
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      argMap: [[this.keyType], [this.contentType]],
    })

    return instanceEb(
      nodeFactory.assignmentExpression({
        target: this.boxValueExpression(key),
        sourceLocation,
        wtype: this.contentType.wtypeOrThrow,
        value,
      }),
      this.contentType,
    )
  }
}
class BoxMapDeleteFunctionBuilder extends BoxMapFunctionBuilderBase {
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [key],
    } = parseFunctionArgs({
      args,
      typeArgs,
      funcName: 'BoxMap.delete',
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      argMap: [[this.keyType]],
    })

    return new VoidExpressionBuilder(
      nodeFactory.stateDelete({
        field: this.boxValueExpression(key),
        sourceLocation,
        wtype: voidWType,
      }),
    )
  }
}