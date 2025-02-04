import { nodeFactory } from '../../awst/node-factory'
import type { Expression } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { invariant } from '../../util'
import type { PType } from '../ptypes'
import { ArrayPType, numberPType, uint64PType } from '../ptypes'
import type { InstanceBuilder, NodeBuilder } from './index'
import { FunctionBuilder, InstanceExpressionBuilder } from './index'
import { SliceFunctionBuilder } from './shared/slice-function-builder'
import { parseFunctionArgs } from './util/arg-parsing'
import { indexAccess } from './util/array/index-access'
import { arrayLength } from './util/array/length'
import { translateNegativeIndex } from './util/translate-negative-index'

export class NativeArrayExpressionBuilder extends InstanceExpressionBuilder<ArrayPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof ArrayPType, 'ptype must be instance of ArrayPType')
    super(expr, ptype)
  }

  indexAccess(index: InstanceBuilder, sourceLocation: SourceLocation): NodeBuilder {
    return indexAccess(this, index, sourceLocation)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'with':
        return new WithFunctionBuilder(this, sourceLocation)
      case 'length':
        return arrayLength(this, sourceLocation)
      case 'slice':
        return new SliceFunctionBuilder(this.resolve(), this.ptype)
    }

    return super.memberAccess(name, sourceLocation)
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
