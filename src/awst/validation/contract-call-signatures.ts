import { logger } from '../../logger'
import type { ContractReference } from '../models'
import type { AWST, ContractMethod, SubroutineCallExpression } from '../nodes'
import { Contract, ContractMethodTarget, InstanceMethodTarget, InstanceSuperMethodTarget } from '../nodes'
import { wtypes } from '../wtypes'
import { FunctionTraverser } from './function-traverser'

/**
 * Reject calls that resolve to an implementation with a different compiled signature.
 */
export class ContractCallSignatures extends FunctionTraverser {
  static validate(awst: AWST[]) {
    const seen = new Set<string>()
    for (const contract of awst.filter((c) => c instanceof Contract)) {
      const callers = new Set([contract.approvalProgram, contract.clearProgram, ...contract.methods])
      for (const caller of callers) caller.body.accept(new ContractCallSignatures(contract, caller, seen))
    }
  }

  private constructor(
    private readonly contract: Contract,
    private readonly caller: ContractMethod,
    private readonly seen: Set<string>,
  ) {
    super()
  }

  /** Same logic as `resolve_function_reference` in Puya */
  private resolve(call: SubroutineCallExpression): ContractMethod | undefined {
    const { target } = call
    const mro = [this.contract.id, ...this.contract.methodResolutionOrder]
    const indexOf = (cref: ContractReference) => mro.findIndex((c) => c.id === cref.id)

    // this.m(): search the whole hierarchy, from the concrete contract down
    if (target instanceof InstanceMethodTarget) return this.resolveContractMethod(target.memberName, mro, 0)

    // super.m(): search the classes after the caller's own
    if (target instanceof InstanceSuperMethodTarget)
      return this.resolveContractMethod(target.memberName, mro, indexOf(this.caller.cref) + 1)

    // X.prototype.m() or super.class(X).m(): search from X down
    if (target instanceof ContractMethodTarget) {
      const index = indexOf(target.cref)
      if (index !== -1) return this.resolveContractMethod(target.memberName, mro, index)
    }
    return undefined
  }

  /** Akin to `Contract.resolve_contract_method` in Puya: the first implementation found from `mro[start]` onwards */
  private resolveContractMethod(memberName: string, mro: ContractReference[], start: number): ContractMethod | undefined {
    for (const cref of mro.slice(start)) {
      const method = this.contract.methods.find((m) => m.memberName === memberName && m.cref.id === cref.id)
      if (method) return method
    }
    return undefined
  }

  override visitSubroutineCallExpression(call: SubroutineCallExpression) {
    super.visitSubroutineCallExpression(call)
    const impl = this.resolve(call)
    if (!impl || signaturesMatch(call, impl)) return

    const key = `${impl.cref}.${impl.memberName}@${call.sourceLocation}`
    if (this.seen.has(key)) return
    this.seen.add(key)

    const { target } = call
    const receiver =
      target instanceof ContractMethodTarget ? target.cref.className : target instanceof InstanceSuperMethodTarget ? 'super' : 'this'
    logger.error(
      impl.sourceLocation,
      `${receiver}.${impl.memberName}() in ${this.caller.cref.className}.${this.caller.memberName} resolves to ` +
        `${impl.cref.className}.${impl.memberName} in ${this.contract.name}, which has a different signature. ` +
        `Every implementation reached through a call must keep the parameter and return types the call was compiled against`,
    )
  }
}

function signaturesMatch(call: SubroutineCallExpression, method: ContractMethod): boolean {
  return (
    call.args.length === method.args.length &&
    call.args.every((arg, i) => arg.value.wtype.hasSameStructure(method.args[i].wtype)) &&
    // A void call site can only discard the result, so any return type should be fine
    (call.wtype.equals(wtypes.voidWType) || call.wtype.hasSameStructure(method.returnType))
  )
}
