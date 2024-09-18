import type { InstanceBuilder } from '../index'
import { BuilderBinaryOp, FunctionBuilder, InstanceExpressionBuilder, NodeBuilder } from '../index'
import type { PType } from '../../ptypes'
import { IterableIteratorType, TuplePType } from '../../ptypes'
import { uint64PType } from '../../ptypes'
import { NumberPType } from '../../ptypes'
import type { SourceLocation } from '../../../awst/source-location'
import {
  ARC4EncodedType,
  DynamicArrayConstructor,
  DynamicArrayType,
  StaticArrayConstructor,
  StaticArrayType,
} from '../../ptypes/arc4-types'
import type { Expression } from '../../../awst/nodes'
import { codeInvariant, invariant } from '../../../util'
import { parseFunctionArgs } from '../util/arg-parsing'
import { requireExpressionOfType, requireInstanceBuilder } from '../util'
import { nodeFactory } from '../../../awst/node-factory'
import { UInt64ExpressionBuilder } from '../uint64-expression-builder'
import { uint64WType } from '../../../awst/wtypes'
import { BigIntLiteralExpressionBuilder } from '../literal/big-int-literal-expression-builder'
import { logger } from '../../../logger'
import { instanceEb } from '../../type-registry'
import { IterableIteratorExpressionBuilder } from '../iterable-iterator-expression-builder'

export class DynamicArrayConstructorBuilder extends NodeBuilder {
  readonly ptype = DynamicArrayConstructor
  newCall(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    const {
      args: [...initialItems],
      ptypes: [elementType],
    } = parseFunctionArgs({
      args,
      typeArgs,
      callLocation: sourceLocation,
      funcName: 'DynamicArray constructor',
      genericTypeArgs: 1,
      argSpec: (a) => args.map((_) => a.required()),
    })
    codeInvariant(elementType instanceof ARC4EncodedType, 'Element type must be an ARC4 encoded type', sourceLocation)
    const initialItemExprs = initialItems.map((i) => requireExpressionOfType(i, elementType))
    const ptype = new DynamicArrayType({ elementType, sourceLocation })
    return new DynamicArrayExpressionBuilder(
      nodeFactory.newArray({
        values: initialItemExprs,
        wtype: ptype.wtype,
        sourceLocation,
      }),
      ptype,
    )
  }
}
export class StaticArrayConstructorBuilder extends NodeBuilder {
  readonly ptype = StaticArrayConstructor
  newCall(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    const {
      args: [...initialItems],
      ptypes: [elementType, arraySize],
    } = parseFunctionArgs({
      args,
      typeArgs,
      callLocation: sourceLocation,
      funcName: 'DynamicArray constructor',
      genericTypeArgs: 2,
      argSpec: (a) => args.map((_) => a.required()),
    })
    codeInvariant(elementType instanceof ARC4EncodedType, 'Element type must be an ARC4 encoded type', sourceLocation)
    codeInvariant(
      arraySize instanceof NumberPType && arraySize.literalValue !== undefined,
      `Array size type parameter of ${this.typeDescription} must be a literal number. Inferred type is ${arraySize.name}`,
      sourceLocation,
    )
    const initialItemExprs = initialItems.map((i) => requireExpressionOfType(i, elementType))
    const ptype = new StaticArrayType({ elementType, arraySize: arraySize.literalValue, sourceLocation })

    // TODO: We should support passing no args in which case the array should be initialized with 'default' values where
    // default is specific to the element type.
    codeInvariant(
      BigInt(initialItemExprs.length) === arraySize.literalValue,
      `Static array of size ${arraySize.literalValue} must be initialized with ${arraySize.literalValue} values`,
      sourceLocation,
    )

    return new StaticArrayExpressionBuilder(
      nodeFactory.newArray({
        values: initialItemExprs,
        wtype: ptype.wtype,
        sourceLocation,
      }),
      ptype,
    )
  }
}

export abstract class ArrayExpressionBuilder<
  TArrayType extends DynamicArrayType | StaticArrayType,
> extends InstanceExpressionBuilder<TArrayType> {
  iterate(sourceLocation: SourceLocation): Expression {
    return this.resolve()
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'at':
        return new ArrayAtFunctionBuilder(this)
      case 'entries':
        return new EntriesFunctionBuilder(this)
      case 'copy':
        return new CopyFunctionBuilder(this)
    }
    return super.memberAccess(name, sourceLocation)
  }
}

class CopyFunctionBuilder extends FunctionBuilder {
  constructor(private arrayBuilder: ArrayExpressionBuilder<DynamicArrayType | StaticArrayType>) {
    super(arrayBuilder.sourceLocation)
  }

  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    return instanceEb(
      nodeFactory.copy({
        value: this.arrayBuilder.resolve(),
        sourceLocation,
      }),
      this.arrayBuilder.ptype,
    )
  }
}
class EntriesFunctionBuilder extends FunctionBuilder {
  constructor(private arrayBuilder: ArrayExpressionBuilder<DynamicArrayType | StaticArrayType>) {
    super(arrayBuilder.sourceLocation)
  }

  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    parseFunctionArgs({ args, typeArgs, callLocation: sourceLocation, argSpec: (_) => [], genericTypeArgs: 0, funcName: 'entries' })
    const iteratorType = IterableIteratorType.parameterise([
      new TuplePType({ items: [uint64PType, this.arrayBuilder.ptype.elementType], immutable: true }),
    ])
    return new IterableIteratorExpressionBuilder(
      nodeFactory.enumeration({
        expr: this.arrayBuilder.iterate(sourceLocation),
        sourceLocation,
        wtype: iteratorType.wtype,
      }),
      iteratorType,
    )
  }
}

export class DynamicArrayExpressionBuilder extends ArrayExpressionBuilder<DynamicArrayType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof DynamicArrayType, 'ptype must be instance of DynamicArrayType')
    super(expr, ptype)
  }
  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'length':
        return new UInt64ExpressionBuilder(
          nodeFactory.intrinsicCall({
            opCode: 'extract_uint16',
            immediates: [],
            stackArgs: [this._expr, nodeFactory.uInt64Constant({ value: 0n, sourceLocation })],
            sourceLocation,
            wtype: uint64WType,
          }),
        )
    }
    return super.memberAccess(name, sourceLocation)
  }
}

export class StaticArrayExpressionBuilder extends ArrayExpressionBuilder<StaticArrayType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof StaticArrayType, 'ptype must be instance of StaticArrayType')
    super(expr, ptype)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'length':
        return new UInt64ExpressionBuilder(nodeFactory.uInt64Constant({ value: this.ptype.arraySize, sourceLocation }))
    }
    return super.memberAccess(name, sourceLocation)
  }
}

export class ArrayAtFunctionBuilder extends FunctionBuilder {
  constructor(private arrayBuilder: ArrayExpressionBuilder<StaticArrayType | DynamicArrayType>) {
    super(arrayBuilder.sourceLocation)
  }

  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [index],
    } = parseFunctionArgs({
      args,
      typeArgs,
      funcName: 'at',
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      argSpec: (a) => [a.required()],
    })

    let indexExpr: Expression

    if (index instanceof BigIntLiteralExpressionBuilder) {
      if (this.arrayBuilder.ptype instanceof StaticArrayType) {
        const staticSize = this.arrayBuilder.ptype.arraySize
        if (index.value < -staticSize || index.value >= staticSize) {
          logger.error(index.sourceLocation, 'Index access outside the bounds of the array')
        }
        indexExpr = nodeFactory.uInt64Constant({
          value: index.value < 0 ? staticSize + index.value : index.value,
          sourceLocation: index.sourceLocation,
        })
      } else {
        const dynamicSize = requireInstanceBuilder(this.arrayBuilder.memberAccess('length', sourceLocation))
        const absoluteIndex = nodeFactory.uInt64Constant({
          value: index.value < 0n ? index.value * -1n : index.value,
          sourceLocation: index.sourceLocation,
        })
        if (index.value < 0) {
          indexExpr = dynamicSize.binaryOp(new UInt64ExpressionBuilder(absoluteIndex), BuilderBinaryOp.sub, index.sourceLocation).resolve()
        } else {
          indexExpr = absoluteIndex
        }
      }
    } else {
      indexExpr = index.resolveToPType(uint64PType).resolve()
    }
    return instanceEb(
      nodeFactory.indexExpression({
        base: this.arrayBuilder.resolve(),
        index: indexExpr,
        wtype: this.arrayBuilder.ptype.elementType.wtype,
        sourceLocation,
      }),
      this.arrayBuilder.ptype.elementType,
    )
  }
}
