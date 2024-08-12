import { bytes, gtxn, internal, Uint64 } from '@algorandfoundation/algo-ts'
import { TestExecutionContext } from '../test-execution-context'
import { asBigInt } from '../util'

export class TxnValueGenerator {
  applicationCall({ appId, args, sender, ...rest }: Partial<gtxn.ApplicationTxn> & { args?: bytes[] }): gtxn.ApplicationTxn {
    const context = internal.ctxMgr.instance as TestExecutionContext
    if (appId && !context.ledger.applications.has(asBigInt(appId.id))) {
      throw new internal.errors.InternalError(`Application ID ${appId.id} not found in test context`)
    }
    return {
      sender: sender ?? context.defaultSender,
      type: gtxn.TransactionType.ApplicationCall,
      numAppArgs: Uint64(args?.length ?? 0),
      appId: appId ?? context.any.application(),
      appArgs(index) {
        return args![index]
      },
      ...rest,
    } as gtxn.ApplicationTxn
  }

  payment({ sender, ...rest }: Partial<gtxn.PayTxn>): gtxn.PayTxn {
    const context = internal.ctxMgr.instance as TestExecutionContext
    return {
      sender: sender ?? context.defaultSender,
      type: gtxn.TransactionType.Payment,
      ...rest,
    } as gtxn.PayTxn
  }
}
