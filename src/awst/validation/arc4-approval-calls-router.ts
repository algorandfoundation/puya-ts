import { Constants } from '../../constants'
import { logger } from '../../logger'
import type { ARC4Router, AWST, ContractMethod, SubroutineCallExpression } from '../nodes'
import { Contract, InstanceSuperMethodTarget } from '../nodes'
import { FunctionTraverser } from './awst-traverser'

export class Arc4ApprovalCallsRouter extends FunctionTraverser {
  static validate(awst: AWST[]) {
    for (const item of awst) {
      if (item instanceof Contract) {
        if (item.methods.some((m) => m.arc4MethodConfig)) {
          const validator = new Arc4ApprovalCallsRouter()
          validator.validate(item.approvalProgram)
        }
      }
    }
  }

  #superCalled = false
  #routerCalled = false

  validate(approvalProgram: ContractMethod) {
    approvalProgram.body.accept(this)
    if (!this.#superCalled && !this.#routerCalled) {
      logger.warn(
        approvalProgram.sourceLocation,
        'Contract overrides approval program method but does not appear to call super.approvalProgram(). ARC4 routing may not work as expected',
      )
    }
  }

  visitSubroutineCallExpression(expression: SubroutineCallExpression) {
    if (expression.target instanceof InstanceSuperMethodTarget && expression.target.memberName === Constants.approvalProgramMethodName) {
      this.#superCalled = true
    }
    super.visitSubroutineCallExpression(expression)
  }

  visitARC4Router(expression: ARC4Router) {
    this.#routerCalled = true
    super.visitARC4Router(expression)
  }
}
