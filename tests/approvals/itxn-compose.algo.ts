import type { Application, PaymentComposeFields, uint64 } from '@algorandfoundation/algorand-typescript'
import {
  assert,
  assertMatch,
  Contract,
  Global,
  gtxn,
  itxn,
  itxnCompose,
  TransactionType,
  Txn,
  urange,
} from '@algorandfoundation/algorand-typescript'
import type { Address } from '@algorandfoundation/algorand-typescript/arc4'
import { compileArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { Hello } from './precompiled-apps.algo'

class ItxnComposeAlgo extends Contract {
  distribute(addresses: Address[], funds: gtxn.PaymentTxn, verifier: Application) {
    assertMatch(funds, {
      receiver: Global.currentApplicationAddress,
    })
    assert(addresses.length, 'must provide some accounts')
    const share: uint64 = funds.amount / addresses.length

    const payFields = {
      type: TransactionType.Payment,
      amount: share,
      receiver: addresses[0].bytes,
    } satisfies PaymentComposeFields
    itxnCompose.begin(payFields)
    for (const i of urange(1, addresses.length)) {
      const addr = addresses[i]
      itxnCompose.next({
        ...payFields,

        receiver: addr.bytes,
      })
    }

    itxnCompose.next(VerifierContract.prototype.verify, {
      appId: verifier,
    })

    itxnCompose.next(
      itxn.assetConfig({
        assetName: 'abc',
      }),
    )

    itxnCompose.submit()
  }
  conditionalBegin(count: uint64) {
    const hello = compileArc4(Hello)
    const appId = hello.call.create({ args: ['Hi'] }).itxn.createdApp

    for (const i of urange(count)) {
      if (i === 0) {
        itxnCompose.begin(Hello.prototype.greet, { appId, args: ['ho'] })
      } else {
        itxnCompose.next(Hello.prototype.greet, { appId, args: ['ho'] })
      }
    }
    itxnCompose.submit()
  }
}

class VerifierContract extends Contract {
  verify() {
    for (let i: uint64 = 0; i < Txn.groupIndex; i++) {
      const txn = gtxn.Transaction(i)
      assert(txn.type === TransactionType.Payment, 'Txn must be pay')
    }
  }
}
