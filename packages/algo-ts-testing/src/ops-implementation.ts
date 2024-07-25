import { bytes, Uint64Compat, internal, Account, uint64, Txn } from '@algorandfoundation/algo-ts'
import { btoi, itob, Uint64Cls } from './primitives'
import { Transaction } from './transactions/runtime'
import { internalError } from './errors'
export const buildOpsImplementation = (txnGroup: Transaction[]): Partial<internal.OpsNamespace> => {
  const currentTransaction =
    txnGroup.find((t) => t.type === 'appl') ??
    internalError('Transaction group must contain at least one ApplicationCall transaction (type="appl")')

  return {
    btoi,
    itob,
    Txn: {
      applicationArgs(_n: Uint64Compat): bytes {
        return currentTransaction.args[Uint64Cls.getNumber(_n)]
      },
      get sender(): Account {
        return currentTransaction.sender
      },
      get numAppArgs(): uint64 {
        return Uint64Cls.getNumber(currentTransaction.args.length)
      },
    } as unknown as typeof Txn,
  }
}
