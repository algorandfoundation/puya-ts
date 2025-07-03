import { intrinsicFactory } from '../../../awst/intrinsic-factory'
import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { wtypes } from '../../../awst/wtypes'
import { CodeError } from '../../../errors'
import { codeInvariant, invariant } from '../../../util'
import type { PType, PTypeOrClass } from '../../ptypes'
import {
  ArrayGeneric,
  ArrayPType,
  FixedArrayGeneric,
  FixedArrayPType,
  numberPType,
  ReadonlyArrayPType,
  ReadonlyTuplePType,
  uint64PType,
} from '../../ptypes'
import { ARC4ArrayType, ARC4EncodedType } from '../../ptypes/arc4-types'
import { instanceEb } from '../../type-registry'
import type { InstanceBuilder, NodeBuilder } from '../index'
import { ClassBuilder, FunctionBuilder, InstanceExpressionBuilder } from '../index'
import { OptionalExpressionBuilder } from '../optional-expression-builder'
import { AtFunctionBuilder } from '../shared/at-function-builder'
import { SliceFunctionBuilder } from '../shared/slice-function-builder'
import { requireExpressionOfType } from '../util'
import { parseFunctionArgs } from '../util/arg-parsing'
import { concatArrays } from '../util/array/concat'
import { EntriesFunctionBuilder, KeysFunctionBuilder } from '../util/array/entries'
import { indexAccess } from '../util/array/index-access'
import { arrayLength } from '../util/array/length'
import { translateNegativeIndex } from '../util/translate-negative-index'

export type NativeArrayLike = FixedArrayPType | ReadonlyArrayPType | ArrayPType

export class NativeArrayClassBuilder extends ClassBuilder {
  readonly ptype = ArrayGeneric

  newCall(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    const ptype = this.ptype.parameterise(typeArgs)
    const { args: initialItems } = parseFunctionArgs({
      args,
      typeArgs,
      callLocation: sourceLocation,
      funcName: this.typeDescription,
      genericTypeArgs: 1,
      argSpec: (a) => args.map((_) => a.required(ptype.elementType)),
    })
    const initialItemExprs = initialItems.map((i) => requireExpressionOfType(i, ptype.elementType))
    return new NativeArrayExpressionBuilder(
      nodeFactory.newArray({
        values: initialItemExprs,
        wtype: ptype.wtype,
        sourceLocation,
      }),
      ptype,
    )
  }
}

export class NativeArrayLikeExpressionBuilder<T extends NativeArrayLike = NativeArrayLike> extends InstanceExpressionBuilder<T> {
  iterate(sourceLocation: SourceLocation): Expression {
    return this.resolve()
  }

  indexAccess(index: InstanceBuilder | bigint, sourceLocation: SourceLocation): NodeBuilder {
    return indexAccess(this, index, sourceLocation)
  }

  protected requireMutable(method: string, sourceLocation: SourceLocation) {
    codeInvariant(!this.ptype.immutable, `Cannot call ${method} on immutable array`, sourceLocation)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'with':
        return new WithFunctionBuilder(this, sourceLocation)
      case 'length':
        return arrayLength(this, sourceLocation)
      case 'slice':
        return new SliceFunctionBuilder(this.resolve(), this.ptype)
      case 'concat':
        return new ConcatFunctionBuilder(this, sourceLocation)
      case 'at':
        return new AtFunctionBuilder(
          this.resolve(),
          this.ptype.elementType,
          arrayLength(this, sourceLocation).resolve(),
          sourceLocation,
          true,
        )
      case 'pop':
        this.requireMutable(name, sourceLocation)
        return new PopFunctionBuilder(this, sourceLocation)
      case 'push':
        this.requireMutable(name, sourceLocation)
        return new PushFunctionBuilder(this, sourceLocation)
    }
    return super.memberAccess(name, sourceLocation)
  }
}
export class NativeArrayExpressionBuilder extends NativeArrayLikeExpressionBuilder<ArrayPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof ArrayPType, 'ptype must be instance of ArrayPType')
    super(expr, ptype)
  }

  iterate(sourceLocation: SourceLocation): Expression {
    return this.resolve()
  }

  indexAccess(index: InstanceBuilder | bigint, sourceLocation: SourceLocation): NodeBuilder {
    return indexAccess(this, index, sourceLocation)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'pop':
        this.requireMutable(name, sourceLocation)
        return new PopFunctionBuilder(this, sourceLocation)
      case 'push':
        this.requireMutable(name, sourceLocation)
        return new PushFunctionBuilder(this, sourceLocation)
    }

    return super.memberAccess(name, sourceLocation)
  }

  resolvableToPType(ptype: PTypeOrClass): boolean {
    if (ptype.equals(this.ptype)) return true
    if (ptype instanceof ReadonlyArrayPType) {
      // Mutable array can be assigned to immutable of same type
      return this.ptype.elementType.equals(ptype.elementType)
    }
    return super.resolvableToPType(ptype)
  }

  resolveToPType(ptype: PTypeOrClass): InstanceBuilder {
    if (ptype.equals(this.ptype)) return this
    if (ptype instanceof ReadonlyArrayPType && this.ptype.elementType.equals(ptype.elementType)) {
      return instanceEb(
        nodeFactory.convertArray({
          expr: this.resolve(),
          sourceLocation: this.sourceLocation,
          wtype: ptype.wtype,
        }),
        ptype,
      )
    }
    return super.resolveToPType(ptype)
  }
}
class PopFunctionBuilder extends FunctionBuilder {
  constructor(
    private arrayBuilder: NativeArrayLikeExpressionBuilder,
    sourceLocation: SourceLocation,
  ) {
    super(sourceLocation)
  }
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      argSpec: () => [],
      callLocation: sourceLocation,
      funcName: 'Array.pop',
    })
    const elementType = this.arrayBuilder.ptype.elementType

    return new OptionalExpressionBuilder(
      instanceEb(
        nodeFactory.arrayPop({
          sourceLocation,
          base: this.arrayBuilder.resolve(),
          wtype: elementType.wtypeOrThrow,
        }),
        elementType,
      ),
    )
  }
}
class PushFunctionBuilder extends FunctionBuilder {
  constructor(
    private arrayBuilder: NativeArrayLikeExpressionBuilder,
    sourceLocation: SourceLocation,
  ) {
    super(sourceLocation)
  }
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const elementType = this.arrayBuilder.ptype.elementType
    const { args: items } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      argSpec: (a) => args.map(() => a.required(elementType)),
      callLocation: sourceLocation,
      funcName: 'Array.push',
    })

    const target = this.arrayBuilder.singleEvaluation()

    return instanceEb(
      nodeFactory.commaExpression({
        expressions: [
          nodeFactory.arrayExtend({
            sourceLocation,
            base: target.resolve(),
            other: nodeFactory.tupleExpression({
              items: items.map((i) => i.resolve()),
              sourceLocation,
            }),
            wtype: wtypes.voidWType,
          }),
          arrayLength(target, sourceLocation).resolve(),
        ],
        sourceLocation,
      }),
      uint64PType,
    )
  }
}

class ConcatFunctionBuilder extends FunctionBuilder {
  constructor(
    private arrayBuilder: NativeArrayLikeExpressionBuilder,
    sourceLocation: SourceLocation,
  ) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [...items],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      argSpec: (a) => args.map(() => a.required()),
      callLocation: sourceLocation,
      funcName: 'Array.concat',
    })
    const elementType = this.arrayBuilder.ptype.elementType

    return new NativeArrayExpressionBuilder(
      items
        .reduce((acc, cur) => {
          if (cur.resolvableToPType(elementType)) {
            return concatArrays(
              acc,
              instanceEb(
                nodeFactory.tupleExpression({
                  items: [cur.resolveToPType(elementType).resolve()],
                  sourceLocation: cur.sourceLocation,
                }),
                new ReadonlyTuplePType({ items: [elementType] }),
              ),
              sourceLocation,
            )
          } else if (cur.resolvableToPType(this.arrayBuilder.ptype)) {
            if (cur.ptype instanceof ReadonlyTuplePType) {
              // Tuple can stay as a tuple, as long as it _is_ resolvable to an array
              return concatArrays(acc, cur, sourceLocation)
            }
            return concatArrays(acc, cur.resolveToPType(this.arrayBuilder.ptype), sourceLocation)
          }
          if (!(elementType instanceof ARC4EncodedType)) {
            throw new CodeError(`${cur.typeDescription} cannot be concatenated to ${this.typeDescription}`, { sourceLocation })
          }
          if (cur.ptype instanceof ARC4ArrayType && cur.ptype.elementType.equals(elementType)) {
            return concatArrays(acc, cur, sourceLocation)
          }
          throw new Error('TODO')
        }, this.arrayBuilder)
        .resolve(),
      this.arrayBuilder.ptype,
    )
  }
}

class WithFunctionBuilder extends FunctionBuilder {
  constructor(
    private arrayBuilder: NativeArrayLikeExpressionBuilder,
    sourceLocation: SourceLocation,
  ) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [index, newValue],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      argSpec: (a) => [a.required(uint64PType, numberPType), a.required(this.arrayBuilder.ptype.elementType)],
      callLocation: sourceLocation,
      funcName: 'Array.with',
    })

    return instanceEb(
      nodeFactory.arrayReplace({
        base: this.arrayBuilder.resolve(),
        value: newValue.resolve(),
        index: translateNegativeIndex(arrayLength(this.arrayBuilder, index.sourceLocation).resolve(), index),
        sourceLocation,
      }),
      this.arrayBuilder.ptype,
    )
  }
}

export class FixedArrayClassBuilder extends ClassBuilder {
  readonly ptype = FixedArrayGeneric

  newCall(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    const ptype = this.ptype.parameterise(typeArgs)
    const { args: initialItems } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 2,
      argSpec: (a) => args.map(() => a.required(ptype.elementType)),
      callLocation: sourceLocation,
      funcName: this.typeDescription,
    })

    if (initialItems.length === 0) {
      codeInvariant(ptype.fixedByteSize !== null, 'Zero arg constructor can only be used for fixed arrays with a fixed size encoding.')
      return new FixedArrayExpressionBuilder(
        intrinsicFactory.bzero({
          size: nodeFactory.sizeOf({ sizeWtype: ptype.wtype, sourceLocation, wtype: wtypes.uint64WType }),
          wtype: ptype.wtype,
          sourceLocation,
        }),
        ptype,
      )
    }

    codeInvariant(
      BigInt(initialItems.length) === ptype.arraySize,
      `FixedArray of size ${ptype.arraySize} must be initialized with ${ptype.arraySize} values`,
      sourceLocation,
    )

    return new FixedArrayExpressionBuilder(
      nodeFactory.newArray({
        values: initialItems.map((i) => requireExpressionOfType(i, ptype.elementType)),
        wtype: ptype.wtype,
        sourceLocation,
      }),
      ptype,
    )
  }
}

export class FixedArrayExpressionBuilder extends NativeArrayLikeExpressionBuilder<FixedArrayPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof FixedArrayPType, 'ptype must be FixedArrayPType', expr.sourceLocation)
    super(expr, ptype)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'entries':
        return new EntriesFunctionBuilder(this)
      case 'keys':
        return new KeysFunctionBuilder(this)
    }
    return super.memberAccess(name, sourceLocation)
  }
}

export class ReadonlyArrayExpressionBuilder extends NativeArrayLikeExpressionBuilder<ReadonlyArrayPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof ReadonlyArrayPType, 'ptype must be ReadonlyArrayPType', expr.sourceLocation)
    super(expr, ptype)
  }
}
