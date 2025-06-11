import { nodeFactory } from '../../awst/node-factory'
import type { SourceLocation } from '../../awst/source-location'
import type { PType } from '../ptypes'
import { cloneFunctionPType } from '../ptypes'
import { instanceEb } from '../type-registry'
import type { InstanceBuilder } from './index'
import { FunctionBuilder, type NodeBuilder } from './index'
import { parseFunctionArgs } from './util/arg-parsing'

export class CloneFunctionBuilder extends FunctionBuilder {
  readonly ptype = cloneFunctionPType

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [target],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 1,
      argSpec: (a) => [a.required()],
      funcName: this.typeDescription,
      callLocation: sourceLocation,
    })
    return CloneFunctionBuilder.clone(target, sourceLocation)
  }

  static clone(target: InstanceBuilder, sourceLocation: SourceLocation) {
    return instanceEb(
      nodeFactory.copy({
        value: target.resolve(),
        sourceLocation,
      }),
      target.ptype,
    )
  }
}
