import { bytes, gtxn, internal, Uint64 } from '@algorandfoundation/algo-ts'
import { TestExecutionContext } from '../test-execution-context'
import { asBigInt } from '../util'

export class TxnValueGenerator {
  #context: TestExecutionContext
  constructor(context: TestExecutionContext) {
    this.#context = context
  }
  applicationCall({ appId, args, sender, ...rest }: Partial<gtxn.ApplicationTxn> & { args: bytes[] }): gtxn.ApplicationTxn {
    if (appId && !this.#context.ledger.applications.has(asBigInt(appId.id))) {
      throw new internal.errors.InternalError(`Application ID ${appId.id} not found in test context`)
    }
    return {
      sender: sender ?? this.#context.defaultSender,
      type: gtxn.TransactionType.ApplicationCall,
      numAppArgs: Uint64(args.length),
      appId: appId ?? this.#context.any.application(),
      appArgs(index) {
        return args[index]
      },
      ...rest,
    } as gtxn.ApplicationTxn
  }

  payment({ sender, ...rest }: Partial<gtxn.PayTxn>): gtxn.PayTxn {
    return {
      sender: sender ?? this.#context.defaultSender,
      type: gtxn.TransactionType.Payment,
      ...rest,
    } as gtxn.PayTxn
  }
}
