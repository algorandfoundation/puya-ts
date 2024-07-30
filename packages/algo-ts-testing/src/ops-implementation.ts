import { Account, bytes, gtxn, internal, Txn, uint64 } from '@algorandfoundation/algo-ts'
import { btoi, internalError, itob, StubUint64Compat, TransactionBase, TransactionType, Uint64Cls } from './internal'
export const buildOpsImplementation = (txnGroup: TransactionBase[]): Partial<internal.OpsNamespace> => {
  const currentTransaction =
    (txnGroup.find((t) => t.type === TransactionType.ApplicationCall) as unknown as gtxn.ApplicationTxn) ??
    internalError('Transaction group must contain at least one ApplicationCall transaction (type="appl")')

  return {
    btoi,
    itob,
    Txn: {
      applicationArgs(_n: StubUint64Compat): bytes {
        return currentTransaction.appArgs(Uint64Cls.getNumber(_n))
      },
      get sender(): Account {
        return currentTransaction.sender
      },
      get numAppArgs(): uint64 {
        return Uint64Cls.getNumber(currentTransaction.numAppArgs)
      },
    } as unknown as typeof Txn,
  }
}
