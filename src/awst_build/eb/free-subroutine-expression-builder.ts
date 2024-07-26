import { FunctionBuilder, InstanceBuilder } from './index'
import { SourceLocation } from '../../awst/source-location'
import { PType } from '../ptypes'
import { InternalError } from '../../errors'
import { nodeFactory } from '../../awst/node-factory'
import { requireExpressionOfType } from './util'
import { typeRegistry } from '../type-registry'
import { ContractClassPType, FunctionPType } from '../ptypes/ptype-classes'
import { BaseClassSubroutineTarget, FreeSubroutineTarget, InstanceSubroutineTarget } from '../../awst/nodes'

abstract class SubroutineExpressionBuilder extends FunctionBuilder {
  protected constructor(
    sourceLocation: SourceLocation,
    protected readonly _ptype: FunctionPType,
    protected readonly target: FreeSubroutineTarget | InstanceSubroutineTarget | BaseClassSubroutineTarget,
  ) {
    super(sourceLocation)
  }

  get ptype() {
    return this._ptype
  }

  call(args: ReadonlyArray<InstanceBuilder>, _typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    const mappedArgs = args.map((a, i) =>
      nodeFactory.callArg({ name: undefined, value: requireExpressionOfType(a, this.ptype.parameters[i][1], sourceLocation) }),
    )

    return typeRegistry.getInstanceEb(
      nodeFactory.subroutineCallExpression({
        target: this.target,
        args: mappedArgs,
        sourceLocation: sourceLocation,
        wtype: this.ptype.returnType.wtypeOrThrow,
      }),
      this.ptype.returnType,
    )
  }
}

export class ContractMethodExpressionBuilder extends SubroutineExpressionBuilder {
  constructor(sourceLocation: SourceLocation, ptype: FunctionPType) {
    super(
      sourceLocation,
      ptype,
      nodeFactory.instanceSubroutineTarget({
        name: ptype.name,
      }),
    )
  }
}

export class BaseContractMethodExpressionBuilder extends SubroutineExpressionBuilder {
  constructor(sourceLocation: SourceLocation, ptype: FunctionPType, baseContractPType: ContractClassPType) {
    super(
      sourceLocation,
      ptype,
      nodeFactory.baseClassSubroutineTarget({
        name: ptype.name,
        baseClass: {
          name: baseContractPType.name,
          module: baseContractPType.module,
        },
      }),
    )
  }
}

export class FreeSubroutineExpressionBuilder extends SubroutineExpressionBuilder {
  constructor(sourceLocation: SourceLocation, ptype: PType) {
    if (!(ptype instanceof FunctionPType)) {
      throw new InternalError(`Invalid ptype`)
    }
    super(
      sourceLocation,
      ptype,
      nodeFactory.freeSubroutineTarget({
        name: ptype.name,
        moduleName: ptype.module,
      }),
    )
  }
}
