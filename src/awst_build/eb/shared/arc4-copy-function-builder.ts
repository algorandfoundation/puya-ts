import { nodeFactory } from '../../../awst/node-factory'
import type { SourceLocation } from '../../../awst/source-location'
import type { PType } from '../../ptypes'
import { instanceEb } from '../../type-registry'
import type { InstanceBuilder } from '../index'
import { FunctionBuilder, type NodeBuilder } from '../index'
import { parseFunctionArgs } from '../util/arg-parsing'

export class Arc4CopyFunctionBuilder extends FunctionBuilder {
  constructor(private baseBuilder: InstanceBuilder) {
    super(baseBuilder.sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    parseFunctionArgs({ args, typeArgs, genericTypeArgs: 0, argSpec: (a) => [], funcName: 'copy', callLocation: sourceLocation })
    return instanceEb(
      nodeFactory.copy({
        value: this.baseBuilder.resolve(),
        sourceLocation,
      }),
      this.baseBuilder.ptype,
    )
  }
}
