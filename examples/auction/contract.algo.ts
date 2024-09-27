import type { gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import {
  abimethod,
  Account,
  assert,
  assertMatch,
  Asset,
  Contract,
  Global,
  GlobalState,
  itxn,
  LocalState,
  Txn,
} from '@algorandfoundation/algorand-typescript'

export class Auction extends Contract {
  previousBidder = GlobalState<Account>()

  auctionEnd = GlobalState<uint64>()

  previousBid = GlobalState<uint64>()

  asaAmt = GlobalState<uint64>()

  asa = GlobalState<Asset>()

  claimableAmount = LocalState<uint64>()

  @abimethod({ allowActions: 'NoOp', onCreate: 'require' })
  public createApplication(): void {
    this.auctionEnd.value = 0
    this.previousBid.value = 0
    this.asaAmt.value = 0
    this.asa.value = Asset()

    // Use zero address rather than an empty string for Account type safety
    this.previousBidder.value = Account()
  }

  public optIntoAsset(asset: Asset): void {
    /// Only allow app creator to opt the app account into a ASA
    assertMatch(Txn, { sender: Global.creatorAddress })

    /// Verify a ASA hasn't already been opted into
    assert(this.asa.value === Asset())

    /// Save ASA ID in global state
    this.asa.value = asset

    /// Submit opt-in transaction: 0 asset transfer to self
    itxn
      .assetTransfer({
        assetReceiver: Global.currentApplicationAddress,
        xferAsset: asset,
        assetAmount: 0,
      })
      .submit()
  }

  public startAuction(startingPrice: uint64, length: uint64, axfer: gtxn.AssetTransferTxn): void {
    assertMatch(Txn, { sender: Global.creatorAddress })

    /// Ensure the auction hasn't already been started
    assert(this.auctionEnd.value === 0)

    /// Verify axfer
    assertMatch(axfer, { assetReceiver: Global.currentApplicationAddress })

    /// Set global state
    this.asaAmt.value = axfer.assetAmount
    this.auctionEnd.value = Global.latestTimestamp + length
    this.previousBid.value = startingPrice
  }

  private pay(receiver: Account, amount: uint64): void {
    itxn
      .payment({
        receiver: receiver,
        amount: amount,
      })
      .submit()
  }

  @abimethod({ allowActions: 'OptIn' })
  public optInToApplication(): void {}

  public bid(payment: gtxn.PaymentTxn): void {
    /// Ensure auction hasn't ended
    assert(Global.latestTimestamp < this.auctionEnd.value)

    /// Verify payment transaction
    assertMatch(payment, {
      sender: Txn.sender,
      amount: { greaterThan: this.previousBid.value },
    })

    /// Set global state
    this.previousBid.value = payment.amount
    this.previousBidder.value = payment.sender

    /// Update claimable amount
    this.claimableAmount(Txn.sender).value = payment.amount
  }

  public claimBids(): void {
    const originalAmount = this.claimableAmount(Txn.sender).value
    let amount = originalAmount

    /// subtract previous bid if sender is previous bidder
    if (Txn.sender === this.previousBidder.value) amount = amount - this.previousBid.value

    this.pay(Txn.sender, amount)
    this.claimableAmount(Txn.sender).value = originalAmount - amount
  }

  public claimAsset(asset: Asset): void {
    assert(Global.latestTimestamp > this.auctionEnd.value)

    /// Send ASA to previous bidder
    itxn
      .assetTransfer({
        assetReceiver: this.previousBidder.value,
        xferAsset: asset,
        assetAmount: this.asaAmt.value,
        assetCloseTo: this.previousBidder.value,
      })
      .submit()
  }

  @abimethod({ allowActions: 'DeleteApplication' })
  public deleteApplication(): void {
    itxn
      .payment({
        receiver: Global.creatorAddress,
        closeRemainderTo: Global.creatorAddress,
        amount: 0,
      })
      .submit()
  }
}
