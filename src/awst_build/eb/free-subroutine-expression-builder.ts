import { nodeFactory } from '../../awst/node-factory'
import type { InstanceMethodTarget, InstanceSuperMethodTarget, SubroutineID } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { InternalError } from '../../errors'
import type { ContractClassPType, PType } from '../ptypes'
import { FunctionPType } from '../ptypes'
import { typeRegistry } from '../type-registry'
import type { InstanceBuilder } from './index'
import { FunctionBuilder } from './index'
import { parseFunctionArgs } from './util/arg-parsing'

abstract class SubroutineExpressionBuilder extends FunctionBuilder {
  protected constructor(
    sourceLocation: SourceLocation,
    public readonly ptype: FunctionPType,
    protected readonly target: SubroutineID | InstanceMethodTarget | InstanceSuperMethodTarget,
  ) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    const { args: mappedArgs } = parseFunctionArgs({
      args,
      typeArgs,
      funcName: this.ptype.name,
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      argSpec: (a) => this.ptype.parameters.map(([_, ptype]) => a.required(ptype)),
    })

    return typeRegistry.getInstanceEb(
      nodeFactory.subroutineCallExpression({
        target: this.target,
        args: mappedArgs.map((a) => nodeFactory.callArg({ name: null, value: a.resolve() })),
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
      nodeFactory.instanceMethodTarget({
        memberName: ptype.name,
      }),
    )
  }
}

export class BaseContractMethodExpressionBuilder extends SubroutineExpressionBuilder {
  constructor(sourceLocation: SourceLocation, ptype: FunctionPType, baseContractPType: ContractClassPType) {
    super(
      sourceLocation,
      ptype,
      nodeFactory.instanceSuperMethodTarget({
        memberName: ptype.name,
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
      nodeFactory.subroutineID({
        target: ptype.fullName,
      }),
    )
  }
}
