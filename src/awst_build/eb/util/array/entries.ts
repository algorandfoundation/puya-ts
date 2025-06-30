import { nodeFactory } from '../../../../awst/node-factory'
import type { SourceLocation } from '../../../../awst/source-location'
import { codeInvariant } from '../../../../util'
import type { ArrayPType, FixedArrayPType, MutableTuplePType, PType, ReadonlyArrayPType } from '../../../ptypes'
import { IterableIteratorGeneric, ReadonlyTuplePType, uint64PType } from '../../../ptypes'
import type { DynamicArrayType, StaticArrayType } from '../../../ptypes/arc4-types'
import { IteratorTypeVisitor } from '../../../ptypes/visitors/iterator-type-visitor'
import type { InstanceBuilder } from '../../index'
import { FunctionBuilder, type NodeBuilder } from '../../index'
import { IterableIteratorExpressionBuilder } from '../../iterable-iterator-expression-builder'
import { parseFunctionArgs } from '../arg-parsing'
import { arrayLength } from './length'

type ArrayLike =
  | StaticArrayType
  | DynamicArrayType
  | ArrayPType
  | ReadonlyArrayPType
  | MutableTuplePType
  | ReadonlyTuplePType
  | FixedArrayPType

export class EntriesFunctionBuilder extends FunctionBuilder {
  constructor(private arrayBuilder: InstanceBuilder<ArrayLike>) {
    super(arrayBuilder.sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    parseFunctionArgs({ args, typeArgs, callLocation: sourceLocation, argSpec: (_) => [], genericTypeArgs: 0, funcName: 'entries' })

    const sequenceType = IteratorTypeVisitor.accept(this.arrayBuilder.ptype)
    codeInvariant(sequenceType, 'Target is not iterable', this.arrayBuilder.sourceLocation)

    const iteratorType = IterableIteratorGeneric.parameterise([new ReadonlyTuplePType({ items: [uint64PType, sequenceType] })])
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
export class KeysFunctionBuilder extends FunctionBuilder {
  constructor(private arrayBuilder: InstanceBuilder<ArrayLike>) {
    super(arrayBuilder.sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    parseFunctionArgs({ args, typeArgs, callLocation: sourceLocation, argSpec: (_) => [], genericTypeArgs: 0, funcName: 'keys' })

    const sequenceType = IteratorTypeVisitor.accept(this.arrayBuilder.ptype)
    codeInvariant(sequenceType, 'Target is not iterable', this.arrayBuilder.sourceLocation)

    const iteratorType = IterableIteratorGeneric.parameterise([uint64PType])
    return new IterableIteratorExpressionBuilder(
      nodeFactory.range({
        start: nodeFactory.uInt64Constant({ value: 0n, sourceLocation }),
        step: nodeFactory.uInt64Constant({ value: 1n, sourceLocation }),
        stop: arrayLength(this.arrayBuilder, sourceLocation).resolve(),
        sourceLocation,
        wtype: iteratorType.wtype,
      }),
      iteratorType,
    )
  }
}
