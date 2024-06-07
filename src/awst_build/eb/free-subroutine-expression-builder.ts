import { ExpressionBuilder, IntermediateExpressionBuilder } from './index'
import { SourceLocation } from '../../awst/source-location'
import { PType, FreeSubroutineType, typeRegistry } from '../ptypes'
import { InternalError } from '../../errors'
import { Literal } from '../../awst/nodes'
import { nodeFactory } from '../../awst/node-factory'
import { requireExpressionOfType } from './util'

export class FreeSubroutineExpressionBuilder extends IntermediateExpressionBuilder {
  private readonly ptype: FreeSubroutineType
  constructor(sourceLocation: SourceLocation, ptype: PType) {
    super(sourceLocation)
    if (!(ptype instanceof FreeSubroutineType)) {
      throw new InternalError(`Invalid ptype`)
    }
    this.ptype = ptype
  }

  call(args: ReadonlyArray<ExpressionBuilder | Literal>, sourceLocation: SourceLocation): ExpressionBuilder {
    const mappedArgs = args.map((a, i) =>
      nodeFactory.callArg({ name: undefined, value: requireExpressionOfType(a, this.ptype.parameters[i].wtypeOrThrow) }),
    )

    return typeRegistry.getInstanceEb(
      nodeFactory.subroutineCallExpression({
        target: nodeFactory.freeSubroutineTarget({
          name: this.ptype.name,
          moduleName: this.ptype.module,
        }),
        args: mappedArgs,
        sourceLocation: sourceLocation,
        wtype: this.ptype.returnType.wtypeOrThrow,
      }),
      this.ptype.returnType,
    )
  }
}
