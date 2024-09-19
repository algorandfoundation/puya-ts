import type { BoxValueExpression, Expression } from '../../../awst/nodes'
import { BytesConstant } from '../../../awst/nodes'
import type { ContractClassPType, PType } from '../../ptypes'
import { stringPType } from '../../ptypes'
import { uint64PType } from '../../ptypes'
import { voidPType } from '../../ptypes'
import { boolPType, TuplePType } from '../../ptypes'
import { boxRefType, bytesPType } from '../../ptypes'
import type { InstanceBuilder, NodeBuilder } from '../index'
import { ParameterlessFunctionBuilder } from '../index'
import { FunctionBuilder, InstanceExpressionBuilder } from '../index'
import { BoxMapPType, BoxPType, BoxRefPType } from '../../ptypes'
import { codeInvariant, invariant } from '../../../util'
import type { SourceLocation } from '../../../awst/source-location'
import { requireExpressionOfType } from '../util'
import { ValueProxy } from './value-proxy'
import { nodeFactory } from '../../../awst/node-factory'
import { instanceEb, typeRegistry } from '../../type-registry'
import { VoidExpressionBuilder } from '../void-expression-builder'
import { boolWType, boxKeyWType, bytesWType, voidWType } from '../../../awst/wtypes'
import { parseFunctionArgs } from '../util/arg-parsing'
import { intrinsicFactory } from '../../../awst/intrinsic-factory'
import { BooleanExpressionBuilder } from '../boolean-expression-builder'
import { AppStorageDeclaration } from '../../contract-data'
import { extractKey } from './util'

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
      argSpec: (a) => [a.obj({ key: a.required(bytesPType, stringPType) })],
    })

    const ptype = new BoxPType({ content: contentPType })
    return new BoxExpressionBuilder(extractKey(key, boxKeyWType), ptype)
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
      argSpec: (a) => [a.obj({ key: a.required(bytesPType, stringPType) })],
    })

    return new BoxRefExpressionBuilder(extractKey(key, boxKeyWType), boxRefType)
  }
}
export class BoxMapFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      ptypes: [keySuffixType, contentPType],
      args: [{ keyPrefix }],
    } = parseFunctionArgs({
      args,
      typeArgs,
      funcName: `BoxMap`,
      callLocation: sourceLocation,
      genericTypeArgs: 2,
      argSpec: (a) => [a.obj({ keyPrefix: a.required(bytesPType, stringPType) })],
    })

    const ptype = new BoxMapPType({ content: contentPType, keyType: keySuffixType })
    return new BoxMapExpressionBuilder(extractKey(keyPrefix, boxKeyWType), ptype)
  }
}

export abstract class BoxProxyExpressionBuilder<
  TProxyType extends BoxMapPType | BoxRefPType | BoxPType,
> extends InstanceExpressionBuilder<TProxyType> {
  buildStorageDeclaration(memberName: string, memberLocation: SourceLocation, contractType: ContractClassPType): AppStorageDeclaration {
    codeInvariant(
      this._expr instanceof BytesConstant,
      `key${this.ptype instanceof BoxMapPType ? ' prefix' : ''} must be a compile time constant value if ${this.typeDescription} is assigned to a contract member`,
    )
    return new AppStorageDeclaration({
      sourceLocation: memberLocation,
      ptype: this.ptype,
      memberName: memberName,
      keyOverride: this._expr ?? null,
      description: null,
      definedIn: contractType,
    })
  }
}

export class BoxMapExpressionBuilder extends BoxProxyExpressionBuilder<BoxMapPType> {
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
      case 'has':
        return new BoxMapHasFunctionBuilder(this._expr, this.ptype, sourceLocation)
    }
    return super.memberAccess(name, sourceLocation)
  }
}
export class BoxRefExpressionBuilder extends BoxProxyExpressionBuilder<BoxRefPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof BoxRefPType, 'BoxRefExpressionBuilder must be constructed with ptype of BoxRefPType')
    super(expr, ptype)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    const boxValueExpr = boxValue({
      key: this._expr,
      sourceLocation,
      contentType: this.ptype.contentType,
    })
    switch (name) {
      case 'put':
        return new BoxRefPutFunctionBuilder(boxValueExpr)
      case 'splice':
        return new BoxRefSpliceFunctionBuilder(boxValueExpr)
      case 'create':
        return new BoxRefCreateFunctionBuilder(boxValueExpr)
      case 'extract':
        return new BoxRefExtractFunctionBuilder(boxValueExpr)
      case 'replace':
        return new BoxRefReplaceFunctionBuilder(boxValueExpr)
      case 'value':
        return new BoxValueExpressionBuilder(boxValueExpr, this.ptype.contentType)
    }
    return super.memberAccess(name, sourceLocation)
  }
}

export abstract class BoxRefBaseFunctionBuilder extends FunctionBuilder {
  constructor(protected readonly boxValue: BoxValueExpression) {
    super(boxValue.sourceLocation)
  }
}

export class BoxRefCreateFunctionBuilder extends BoxRefBaseFunctionBuilder {
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [{ size }],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      funcName: 'BoxRef.create',
      callLocation: sourceLocation,
      argSpec: (a) => [a.obj({ size: a.required(uint64PType) })],
    })
    return instanceEb(
      nodeFactory.intrinsicCall({
        opCode: 'box_create',
        stackArgs: [this.boxValue, size.resolve()],
        wtype: boolWType,
        immediates: [],
        sourceLocation,
      }),
      boolPType,
    )
  }
}
export class BoxRefExtractFunctionBuilder extends BoxRefBaseFunctionBuilder {
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [start, length],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      funcName: 'BoxRef.extract',
      callLocation: sourceLocation,
      argSpec: (a) => [a.required(uint64PType), a.required(uint64PType)],
    })
    return instanceEb(
      nodeFactory.intrinsicCall({
        opCode: 'box_extract',
        stackArgs: [this.boxValue, start.resolve(), length.resolve()],
        wtype: bytesWType,
        immediates: [],
        sourceLocation,
      }),
      bytesPType,
    )
  }
}
export class BoxRefReplaceFunctionBuilder extends BoxRefBaseFunctionBuilder {
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [start, value],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      funcName: 'BoxRef.replace',
      callLocation: sourceLocation,
      argSpec: (a) => [a.required(uint64PType), a.required(bytesPType)],
    })
    return instanceEb(
      nodeFactory.intrinsicCall({
        opCode: 'box_replace',
        stackArgs: [this.boxValue, start.resolve(), value.resolve()],
        wtype: voidWType,
        immediates: [],
        sourceLocation,
      }),
      voidPType,
    )
  }
}

export class BoxRefPutFunctionBuilder extends BoxRefBaseFunctionBuilder {
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [value],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      funcName: 'BoxRef.put',
      callLocation: sourceLocation,
      argSpec: (a) => [a.required(bytesPType)],
    })
    return instanceEb(
      nodeFactory.intrinsicCall({
        opCode: 'box_put',
        stackArgs: [this.boxValue, value.resolve()],
        wtype: voidWType,
        immediates: [],
        sourceLocation,
      }),
      voidPType,
    )
  }
}
export class BoxRefSpliceFunctionBuilder extends BoxRefBaseFunctionBuilder {
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [start, stop, value],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      funcName: 'BoxRef.splice',
      callLocation: sourceLocation,
      argSpec: (a) => [a.required(uint64PType), a.required(uint64PType), a.required(bytesPType)],
    })
    return instanceEb(
      nodeFactory.intrinsicCall({
        opCode: 'box_splice',
        stackArgs: [this.boxValue, start.resolve(), stop.resolve(), value.resolve()],
        wtype: voidWType,
        immediates: [],
        sourceLocation,
      }),
      voidPType,
    )
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
    const value = requireExpressionOfType(other, this.ptype)
    return typeRegistry.getInstanceEb(
      nodeFactory.assignmentExpression({
        target: this.resolveLValue(),
        value,
        sourceLocation,
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
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    parseFunctionArgs({
      args,
      typeArgs,
      funcName: 'Box.maybe',
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      argSpec: () => [],
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
class BoxMapHasFunctionBuilder extends BoxMapFunctionBuilderBase {
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [key],
    } = parseFunctionArgs({
      args,
      typeArgs,
      funcName: 'BoxMap.has',
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      argSpec: (a) => [a.required(this.keyType)],
    })
    return new BooleanExpressionBuilder(
      nodeFactory.stateExists({
        wtype: boolWType,
        field: this.boxValueExpression(key.resolve()),
        sourceLocation,
      }),
    )
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
      argSpec: (a) => [a.required(this.keyType), a.obj({ default: a.optional(this.contentType) })],
    })

    if (defaultValue) {
      return instanceEb(
        nodeFactory.stateGet({
          sourceLocation,
          default: defaultValue.resolve(),
          wtype: this.contentType.wtypeOrThrow,
          field: this.boxValueExpression(key.resolve()),
        }),
        this.contentType,
      )
    } else {
      return new BoxValueExpressionBuilder(this.boxValueExpression(key.resolve()), this.contentType)
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
      argSpec: (a) => [a.required(this.keyType), a.required(this.contentType)],
    })

    return instanceEb(
      nodeFactory.assignmentExpression({
        target: this.boxValueExpression(key.resolve()),
        sourceLocation,
        value: value.resolve(),
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
      argSpec: (a) => [a.required(this.keyType)],
    })

    return new VoidExpressionBuilder(
      nodeFactory.stateDelete({
        field: this.boxValueExpression(key.resolve()),
        sourceLocation,
        wtype: voidWType,
      }),
    )
  }
}
