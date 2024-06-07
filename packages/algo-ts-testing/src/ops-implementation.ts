import { bytes, Uint64Compat, internal, Account, uint64, Txn } from '@algorandfoundation/algo-ts'
import { btoi, itob, makeNumber, makeUint64 } from './primitives'
import { Transaction } from './transactions/runtime'
import { internalError } from './errors'
export const buildOpsImplementation = (txnGroup: Transaction[]): Partial<internal.OpsImplementation> => {
  const currentTransaction =
    txnGroup.find((t) => t.type === 'appl') ??
    internalError('Transaction group must contain at least one ApplicationCall transaction (type="appl")')

  return {
    btoi,
    itob,
    txn: {
      applicationArgs(_n: Uint64Compat): bytes {
        return currentTransaction.args[makeNumber(_n)]
      },
      sender(): Account {
        return currentTransaction.sender
      },
      numAppArgs(): uint64 {
        return makeUint64(currentTransaction.args.length)
      },
    } as unknown as typeof Txn,
  }
}
