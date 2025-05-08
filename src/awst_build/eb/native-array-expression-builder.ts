import { nodeFactory } from '../../awst/node-factory'
import type { Expression } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { CodeError } from '../../errors'
import { codeInvariant, invariant } from '../../util'
import type { PType } from '../ptypes'
import { ArrayPType, numberPType, ReadonlyTuplePType, uint64PType } from '../ptypes'
import { ARC4ArrayType, ARC4EncodedType } from '../ptypes/arc4-types'
import { instanceEb } from '../type-registry'
import type { InstanceBuilder, NodeBuilder } from './index'
import { FunctionBuilder, InstanceExpressionBuilder } from './index'
import { OptionalExpressionBuilder } from './optional-expression-builder'
import { AtFunctionBuilder } from './shared/at-function-builder'
import { SliceFunctionBuilder } from './shared/slice-function-builder'
import { parseFunctionArgs } from './util/arg-parsing'
import { concatArrays } from './util/array/concat'
import { indexAccess } from './util/array/index-access'
import { arrayLength } from './util/array/length'
import { translateNegativeIndex } from './util/translate-negative-index'

export class NativeArrayExpressionBuilder extends InstanceExpressionBuilder<ArrayPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof ArrayPType, 'ptype must be instance of ArrayPType')
    super(expr, ptype)
  }

  iterate(sourceLocation: SourceLocation): Expression {
    return this.resolve()
  }

  indexAccess(index: InstanceBuilder, sourceLocation: SourceLocation): NodeBuilder {
    return indexAccess(this, index, sourceLocation)
  }

  private requireMutable(method: string, sourceLocation: SourceLocation) {
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
class PopFunctionBuilder extends FunctionBuilder {
  constructor(
    private arrayBuilder: NativeArrayExpressionBuilder,
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
    private arrayBuilder: NativeArrayExpressionBuilder,
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
      funcName: 'Array.pop',
    })

    // TODO: Correctly handle returning the new array length as the below does not work
    return arrayLength(
      instanceEb(
        nodeFactory.arrayExtend({
          sourceLocation,
          base: this.arrayBuilder.resolve(),
          other: nodeFactory.tupleExpression({
            items: items.map((i) => i.resolve()),
            sourceLocation,
          }),
          wtype: this.arrayBuilder.ptype.wtype,
        }),
        this.arrayBuilder.ptype,
      ),
      sourceLocation,
    )
  }
}

class ConcatFunctionBuilder extends FunctionBuilder {
  constructor(
    private arrayBuilder: NativeArrayExpressionBuilder,
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
    private arrayBuilder: NativeArrayExpressionBuilder,
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

    return new NativeArrayExpressionBuilder(
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
