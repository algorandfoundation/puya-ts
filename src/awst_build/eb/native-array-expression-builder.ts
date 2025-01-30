import type { Expression } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { logger } from '../../logger'
import { invariant } from '../../util'
import type { PType } from '../ptypes'
import { ArrayPType } from '../ptypes'
import type { InstanceBuilder, NodeBuilder } from './index'
import { FunctionBuilder, InstanceExpressionBuilder } from './index'
import { SliceFunctionBuilder } from './shared/slice-function-builder'
import { indexAccess } from './util/array/index-access'
import { arrayLength } from './util/array/length'

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
    logger.warn(sourceLocation, 'TODO: Return array replace node')
    return this.arrayBuilder
  }
}
