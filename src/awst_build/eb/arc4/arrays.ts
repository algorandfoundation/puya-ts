import type { InstanceBuilder } from '../index'
import { InstanceExpressionBuilder } from '../index'
import { NodeBuilder } from '../index'
import type { PType } from '../../ptypes'
import { NumberPType } from '../../ptypes'
import type { SourceLocation } from '../../../awst/source-location'
import { DynamicArrayType } from '../../ptypes/arc4-types'
import { ARC4EncodedType } from '../../ptypes/arc4-types'
import { StaticArrayType } from '../../ptypes/arc4-types'
import { DynamicArrayConstructor, StaticArrayConstructor } from '../../ptypes/arc4-types'
import type { Expression } from '../../../awst/nodes'
import { codeInvariant, invariant } from '../../../util'
import { parseFunctionArgs } from '../util/arg-parsing'
import { requireExpressionOfType } from '../util'
import { nodeFactory } from '../../../awst/node-factory'

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
    const initialItemExprs = initialItems.map((i) => requireExpressionOfType(i, elementType, sourceLocation))
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
    const initialItemExprs = initialItems.map((i) => requireExpressionOfType(i, elementType, sourceLocation))
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

export abstract class ArrayExpressionBuilder extends InstanceExpressionBuilder<DynamicArrayType | StaticArrayType> {}

export class DynamicArrayExpressionBuilder extends ArrayExpressionBuilder {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof DynamicArrayType, 'ptype must be instance of DynamicArrayType')
    super(expr, ptype)
  }
}

export class StaticArrayExpressionBuilder extends ArrayExpressionBuilder {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof StaticArrayType, 'ptype must be instance of StaticArrayType')
    super(expr, ptype)
  }
}
