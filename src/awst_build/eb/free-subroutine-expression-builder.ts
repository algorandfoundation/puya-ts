import { FunctionBuilder, InstanceBuilder } from './index'
import { SourceLocation } from '../../awst/source-location'
import { PType, FreeSubroutineType, typeRegistry } from '../ptypes'
import { InternalError } from '../../errors'
import { nodeFactory } from '../../awst/node-factory'
import { requireExpressionOfType } from './util'

export class FreeSubroutineExpressionBuilder extends FunctionBuilder {
  private readonly _ptype: FreeSubroutineType
  constructor(sourceLocation: SourceLocation, ptype: PType) {
    super(sourceLocation)
    if (!(ptype instanceof FreeSubroutineType)) {
      throw new InternalError(`Invalid ptype`)
    }
    this._ptype = ptype
  }

  get ptype() {
    return this._ptype
  }

  call(args: ReadonlyArray<InstanceBuilder>, sourceLocation: SourceLocation): InstanceBuilder {
    const mappedArgs = args.map((a, i) =>
      nodeFactory.callArg({ name: undefined, value: requireExpressionOfType(a, this.ptype.parameters[i], sourceLocation) }),
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
