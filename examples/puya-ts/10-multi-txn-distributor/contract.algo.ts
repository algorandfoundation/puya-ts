/**
 * Example 10: Multi-Txn Distributor
 *
 * This example demonstrates grouped inner transactions and outer group transaction access.
 *
 * Features:
 * - itxn.submitGroup(...) with typed tuple return (fixed-size grouped inner transactions)
 * - itxnCompose .begin() / .next() / .submit() (dynamic-size grouped inner transactions)
 * - gtxn.PaymentTxn params (reading fields from outer group transactions)
 * - TransactionType enum checks (verifying transaction types in groups)
 * - itxn.payment / itxn.assetTransfer (building inner transaction params)
 * - .copy() and .set() for reusable inner transaction params
 *
 * Prerequisites: LocalNet
 *
 * @note Educational only — not audited for production use.
 */

import type { Account, Asset, PaymentComposeFields, uint64 } from '@algorandfoundation/algorand-typescript'
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
  Uint64,
  urange,
} from '@algorandfoundation/algorand-typescript'
import type { Address } from '@algorandfoundation/algorand-typescript/arc4'

// Contract that distributes funds to multiple recipients via grouped inner transactions
// example: MULTI_TXN_DISTRIBUTOR
export class MultiTxnDistributor extends Contract {
  /** Initialize the application. */
  public createApplication(): void {}

  /**
   * Distribute equal payment to exactly two recipients using itxn.submitGroup.
   * Demonstrates typed tuple return — each element is strongly typed.
   * @param funding - the outer group payment transaction funding the distribution
   * @param recipientA - first recipient account
   * @param recipientB - second recipient account
   */
  public distributePair(funding: gtxn.PaymentTxn, recipientA: Account, recipientB: Account): void {
    // gtxn.PaymentTxn — read fields from the outer group payment transaction
    // assertMatch — consolidate multiple field checks into a single declarative assertion
    assertMatch(
      funding,
      {
        receiver: Global.currentApplicationAddress,
        amount: { greaterThan: Uint64(0) },
      },
      'Funds must be sent to this contract',
    )

    // Calculate each recipient's share
    const share: uint64 = funding.amount / 2

    // Build reusable payment params with itxn.payment
    const payA = itxn.payment({
      receiver: recipientA, // First recipient
      amount: share, // Equal share
    })

    // .copy() creates a duplicate; .set() updates specific fields
    const payB = payA.copy()
    payB.set({
      receiver: recipientB, // Override receiver to second recipient
    })

    // itxn.submitGroup — submit both payments atomically; returns typed tuple
    const [txnA, txnB] = itxn.submitGroup(payA, payB)

    // Typed results: each element is a PaymentInnerTxn with full field access
    assert(txnA.receiver === recipientA, 'txnA receiver correct')
    assert(txnB.receiver === recipientB, 'txnB receiver correct')
    assert(txnA.amount === share, 'txnA amount correct')
    assert(txnB.amount === share, 'txnB amount correct')
  }

  /**
   * Distribute funding plus opt-in to an asset for two recipients.
   * Demonstrates mixed-type submitGroup (payment + asset transfer).
   * @param funding - the outer group payment transaction funding the distribution
   * @param asset - the asset to opt into
   * @param recipientA - first recipient account
   * @param recipientB - second recipient account
   */
  public distributeWithOptIn(funding: gtxn.PaymentTxn, asset: Asset, recipientA: Account, recipientB: Account): void {
    // assertMatch — verify receiver and TransactionType in one declarative check
    assertMatch(
      funding,
      {
        receiver: Global.currentApplicationAddress,
        type: TransactionType.Payment,
      },
      'Funding must be a payment to this contract',
    )

    const share: uint64 = funding.amount / 2

    // Build a payment inner transaction
    const pay = itxn.payment({
      receiver: recipientA,
      amount: share,
    })

    // Build an asset transfer inner transaction (opt-in pattern: zero-amount self-transfer)
    const optIn = itxn.assetTransfer({
      assetReceiver: Global.currentApplicationAddress, // Send to self = opt-in
      xferAsset: asset, // Asset to opt into
      assetAmount: 0, // Zero amount signals opt-in
    })

    // itxn.submitGroup — mixed types; tuple elements match their param types
    const [payResult, optInResult] = itxn.submitGroup(pay, optIn)

    // payResult is PaymentInnerTxn; optInResult is AssetTransferInnerTxn
    assert(payResult.amount === share, 'Payment amount correct')
    assert(optInResult.xferAsset === asset, 'Opted into correct asset')
  }

  /**
   * Distribute funds to a dynamic list of recipients using itxnCompose.
   * Demonstrates .begin() / .next() / .submit() for variable-size groups.
   * @param funding - the outer group payment transaction funding the distribution
   * @param recipients - array of recipient addresses
   */
  public distributeDynamic(funding: gtxn.PaymentTxn, recipients: Address[]): void {
    // assertMatch — validate the funding transaction
    assertMatch(
      funding,
      {
        receiver: Global.currentApplicationAddress,
      },
      'Funds must be sent to this contract',
    )
    assert(recipients.length > 0, 'Must have recipients')

    // Calculate per-recipient share
    const share: uint64 = funding.amount / recipients.length

    // PaymentComposeFields — typed field object for itxnCompose
    const payFields = {
      type: TransactionType.Payment, // TransactionType enum — required for compose fields
      amount: share,
      receiver: recipients[0].bytes, // Address.bytes gives the raw 32-byte address
    } satisfies PaymentComposeFields

    // itxnCompose.begin — start the group with the first payment
    itxnCompose.begin(payFields)

    // itxnCompose.next — add subsequent payments in a loop
    for (const i of urange(1, recipients.length)) {
      const addr = recipients[i]
      itxnCompose.next({
        ...payFields,
        receiver: addr.bytes, // Override receiver for each subsequent recipient
      })
    }

    // itxnCompose.submit — execute the entire group atomically
    itxnCompose.submit()
  }

  /**
   * Verify that all preceding transactions in the outer group are payments.
   * Demonstrates gtxn.Transaction() access and TransactionType enum checks.
   */
  public verifyGroupPayments(): void {
    // Iterate over all transactions before this one in the outer group
    for (let i: uint64 = 0; i < Txn.groupIndex; i++) {
      // gtxn.Transaction(n) — access any transaction in the outer group by index
      const txn = gtxn.Transaction(i)

      // TransactionType enum check — verify each preceding txn is a Payment
      assert(txn.type === TransactionType.Payment, 'All preceding txns must be payments')
    }
  }
}
// example: MULTI_TXN_DISTRIBUTOR
