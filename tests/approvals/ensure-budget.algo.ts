import { BaseContract, ensureBudget, OpUpFeeSource } from '@algorandfoundation/algorand-typescript'

export class EnsureBudgetContract extends BaseContract {
  public approvalProgram(): boolean {
    ensureBudget(100)
    ensureBudget(100, OpUpFeeSource.GroupCredit)
    ensureBudget(100, OpUpFeeSource.AppAccount)
    ensureBudget(100, OpUpFeeSource.Any)

    return true
  }
}
