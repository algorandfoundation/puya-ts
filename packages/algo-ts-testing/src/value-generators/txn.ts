import { bytes, gtxn, internal, Uint64 } from '@algorandfoundation/algo-ts'
import { lazyContext } from '../context-helpers/internal-context'
import { asBigInt } from '../util'

export class TxnValueGenerator {
  applicationCall({ appId, args, sender, ...rest }: Partial<gtxn.ApplicationTxn> & { args?: bytes[] }): gtxn.ApplicationTxn {
    if (appId && !lazyContext.ledger.applicationDataMap.has(asBigInt(appId.id))) {
      throw new internal.errors.InternalError(`Application ID ${appId.id} not found in test context`)
    }
    return {
      sender: sender ?? lazyContext.defaultSender,
      type: gtxn.TransactionType.ApplicationCall,
      numAppArgs: Uint64(args?.length ?? 0),
      appId: appId ?? lazyContext.any.application(),
      appArgs(index) {
        return args![index]
      },
      ...rest,
    } as gtxn.ApplicationTxn
  }

  payment({ sender, ...rest }: Partial<gtxn.PayTxn>): gtxn.PayTxn {
    return {
      sender: sender ?? lazyContext.defaultSender,
      type: gtxn.TransactionType.Payment,
      ...rest,
    } as gtxn.PayTxn
  }
}
