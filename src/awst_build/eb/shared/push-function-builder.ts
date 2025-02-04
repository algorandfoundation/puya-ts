import { nodeFactory } from '../../../awst/node-factory'
import type { SourceLocation } from '../../../awst/source-location'
import type { PType } from '../../ptypes'
import { instanceEb } from '../../type-registry'
import type { InstanceBuilder } from '../index'
import { FunctionBuilder, type NodeBuilder } from '../index'
import { parseFunctionArgs } from '../util/arg-parsing'

export class ArrayPushFunctionBuilder extends FunctionBuilder {
  constructor(private arrayBuilder: InstanceBuilder<{ elementType: PType } & PType>) {
    super(arrayBuilder.sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const elementType = this.arrayBuilder.ptype.elementType
    const {
      args: [...items],
    } = parseFunctionArgs({
      args,
      typeArgs,
      funcName: 'push',
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
        wtype: this.arrayBuilder.ptype.wtypeOrThrow,
      }),
      this.arrayBuilder.ptype,
    )
  }
}
