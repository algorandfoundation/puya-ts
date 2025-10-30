import type ts from 'typescript'
import { nodeFactory } from '../../../awst/node-factory'
import type { SourceLocation } from '../../../awst/source-location'
import type { PType } from '../../ptypes'
import { instanceEb } from '../../type-registry'
import type { InstanceBuilder } from '../index'
import { FunctionBuilder, type NodeBuilder } from '../index'
import { parseFunctionArgs } from '../util/arg-parsing'

export class ArrayPopFunctionBuilder extends FunctionBuilder {
  constructor(private arrayBuilder: InstanceBuilder<{ elementType: PType } & PType>) {
    super(arrayBuilder.sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation<ts.CallExpression>): NodeBuilder {
    const elementType = this.arrayBuilder.ptype.elementType
    parseFunctionArgs({
      args,
      typeArgs,
      funcName: 'pop',
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      argSpec: () => [],
    })

    return instanceEb(
      nodeFactory.arrayPop({
        base: this.arrayBuilder.resolve(),
        sourceLocation,
        wtype: elementType.wtypeOrThrow,
      }),
      elementType,
    )
  }
}
