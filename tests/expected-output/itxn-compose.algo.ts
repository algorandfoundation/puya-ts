import type { PaymentComposeFields } from '@algorandfoundation/algorand-typescript'
import { Contract, TransactionType, Txn, Uint64 } from '@algorandfoundation/algorand-typescript'

class ItxnComposeAlgo extends Contract {
  test() {
    // @expect-error PaymentComposeFields type should not be used explicitly as it contains optional fields which cannot be interrogated at runtime...
    const args: PaymentComposeFields = {
      type: TransactionType.Payment,
      receiver: Txn.sender,
      amount: Uint64(10000),
    } satisfies PaymentComposeFields
  }
}
