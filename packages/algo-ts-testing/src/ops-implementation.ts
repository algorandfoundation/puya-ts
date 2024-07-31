// import { Account, bytes, gtxn, internal, Txn, uint64 } from '@algorandfoundation/algo-ts'
// import { btoi, internalError, itob, StateStore, StubUint64Compat, TransactionType, Uint64Cls } from './internal'
// export const buildOpsImplementation = (store: StateStore): Partial<internal.OpsNamespace> => {
//   const currentTransaction = () => {
//     const result = store.txnGroup.find((t) => t.type === TransactionType.ApplicationCall)
//     if (!result) {
//       throw internalError('Transaction group must contain at least one ApplicationCall transaction (type="appl")')
//     }
//     return result as unknown as gtxn.ApplicationTxn
//   }

//   return {
//     btoi,
//     itob,
//     Txn: {
//       applicationArgs(_n: StubUint64Compat): bytes {
//         return currentTransaction().appArgs(Uint64Cls.getNumber(_n))
//       },
//       get sender(): Account {
//         return currentTransaction().sender
//       },
//       get numAppArgs(): uint64 {
//         return Uint64Cls.getNumber(currentTransaction().numAppArgs)
//       },
//     } as unknown as typeof Txn,
//   }
// }
