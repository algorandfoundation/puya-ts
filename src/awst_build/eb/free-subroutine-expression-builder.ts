import { ContractReference } from '../../awst/models'
import { nodeFactory } from '../../awst/node-factory'
import type {
  ContractMethodTarget,
  Expression,
  InstanceMethodTarget,
  InstanceSuperMethodTarget,
  LValue,
  MethodConstant,
  SubroutineID,
} from '../../awst/nodes'
import { ARC4ABIMethodConfig } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { CodeError, InternalError } from '../../errors'
import { codeInvariant } from '../../util'
import { buildArc4MethodConstant } from '../arc4-util'
import { AwstBuildContext } from '../context/awst-build-context'
import type { ContractClassPType, PType } from '../ptypes'
import { FunctionPType } from '../ptypes'
import { typeRegistry } from '../type-registry'
import type { NodeBuilder } from './index'
import { InstanceBuilder } from './index'
import { parseFunctionArgs } from './util/arg-parsing'

export abstract class SubroutineExpressionBuilder extends InstanceBuilder {
  public readonly isConstant = true
  resolve(): Expression {
    throw new CodeError('Function reference cannot be used as a value in this context', { sourceLocation: this.sourceLocation })
  }

  resolveLValue(): LValue {
    throw CodeError.invalidAssignmentTarget({ sourceLocation: this.sourceLocation, name: 'Function reference' })
  }

  protected constructor(
    sourceLocation: SourceLocation,
    public readonly ptype: FunctionPType,
    public readonly target: SubroutineID | InstanceMethodTarget | InstanceSuperMethodTarget | ContractMethodTarget,
  ) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
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

/**
 * Invoke a contract method on the current contract (ie. this.someMethod())
 */
export class ContractMethodExpressionBuilder extends SubroutineExpressionBuilder {
  declare readonly target: ContractMethodTarget

  constructor(
    sourceLocation: SourceLocation,
    ptype: FunctionPType,
    public readonly contractType: ContractClassPType,
  ) {
    super(
      sourceLocation,
      ptype,
      nodeFactory.contractMethodTarget({
        cref: ContractReference.fromPType(contractType),
        memberName: ptype.name,
      }),
    )
  }

  getMethodSelector(sourceLocation = this.sourceLocation): MethodConstant {
    const methodTarget = this.target
    const arc4Config = AwstBuildContext.current.getArc4Config(this.contractType, methodTarget.memberName)
    codeInvariant(arc4Config instanceof ARC4ABIMethodConfig, `${methodTarget.memberName} is not an ABI method`, this.sourceLocation)
    return buildArc4MethodConstant(this.ptype, arc4Config, sourceLocation)
  }
}

/**
 * Invoke a contract method on the super contract (ie. super.someMethod())
 */
export class BaseContractMethodExpressionBuilder extends SubroutineExpressionBuilder {
  constructor(sourceLocation: SourceLocation, ptype: FunctionPType) {
    super(
      sourceLocation,
      ptype,
      nodeFactory.instanceSuperMethodTarget({
        memberName: ptype.name,
      }),
    )
  }
}

/**
 * Invoke a free subroutine (ie. someMethod())
 */
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
