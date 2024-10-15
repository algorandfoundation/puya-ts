import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { uint64WType } from '../../../awst/wtypes'
import { codeInvariant, invariant } from '../../../util'
import type { PType } from '../../ptypes'
import { IterableIteratorType, NumericLiteralPType, TuplePType, uint64PType } from '../../ptypes'
import {
  ARC4EncodedType,
  DynamicArrayConstructor,
  DynamicArrayType,
  StaticArrayConstructor,
  StaticArrayType,
} from '../../ptypes/arc4-types'
import { instanceEb } from '../../type-registry'
import type { InstanceBuilder } from '../index'
import { FunctionBuilder, InstanceExpressionBuilder, NodeBuilder } from '../index'
import { IterableIteratorExpressionBuilder } from '../iterable-iterator-expression-builder'
import { AtFunctionBuilder } from '../shared/at-function-builder'
import { SliceFunctionBuilder } from '../shared/slice-function-builder'
import { UInt64ExpressionBuilder } from '../uint64-expression-builder'
import { requireExpressionOfType } from '../util'
import { parseFunctionArgs } from '../util/arg-parsing'

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
      arraySize instanceof NumericLiteralPType,
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
        return new AtFunctionBuilder(
          this.resolve(),
          this.ptype.elementType,
          this.ptype instanceof StaticArrayType
            ? this.ptype.arraySize
            : requireExpressionOfType(this.memberAccess('length', sourceLocation), uint64PType),
        )
      case 'entries':
        return new EntriesFunctionBuilder(this)
      case 'copy':
        return new CopyFunctionBuilder(this)
      case 'slice':
        return new SliceFunctionBuilder(this.resolve(), this.ptype)
    }
    return super.memberAccess(name, sourceLocation)
  }
}

class CopyFunctionBuilder extends FunctionBuilder {
  constructor(private arrayBuilder: ArrayExpressionBuilder<DynamicArrayType | StaticArrayType>) {
    super(arrayBuilder.sourceLocation)
  }

  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    parseFunctionArgs({ args, typeArgs, genericTypeArgs: 0, argSpec: (a) => [], funcName: 'copy', callLocation: sourceLocation })
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
    const iteratorType = IterableIteratorType.parameterise([new TuplePType({ items: [uint64PType, this.arrayBuilder.ptype.elementType] })])
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
      case 'push':
        return new ArrayPushFunctionBuilder(this)
      case 'pop':
        return new ArrayPopFunctionBuilder(this)
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

export class ArrayPushFunctionBuilder extends FunctionBuilder {
  constructor(private arrayBuilder: ArrayExpressionBuilder<DynamicArrayType>) {
    super(arrayBuilder.sourceLocation)
  }

  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const elementType = this.arrayBuilder.ptype.elementType
    const {
      args: [...items],
    } = parseFunctionArgs({
      args,
      typeArgs,
      funcName: 'at',
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      argSpec: (a) => [a.required(elementType), ...args.slice(1).map(() => a.required(elementType))],
    })

    return instanceEb(
      nodeFactory.arrayExtend({
        base: this.arrayBuilder.resolve(),
        other: nodeFactory.tupleExpression({
          items: items.map((i) => i.resolve()),
          sourceLocation,
        }),
        sourceLocation,
        wtype: this.arrayBuilder.ptype.wtype,
      }),
      this.arrayBuilder.ptype,
    )
  }
}
export class ArrayPopFunctionBuilder extends FunctionBuilder {
  constructor(private arrayBuilder: ArrayExpressionBuilder<DynamicArrayType>) {
    super(arrayBuilder.sourceLocation)
  }

  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const elementType = this.arrayBuilder.ptype.elementType
    parseFunctionArgs({
      args,
      typeArgs,
      funcName: 'at',
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      argSpec: () => [],
    })

    return instanceEb(
      nodeFactory.arrayPop({
        base: this.arrayBuilder.resolve(),
        sourceLocation,
        wtype: elementType.wtype,
      }),
      elementType,
    )
  }
}
