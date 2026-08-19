import type { Account, Application, Asset, uint64 } from '@algorandfoundation/algorand-typescript'
import {
  abimethod,
  assert,
  Contract,
  Global,
  GlobalState,
  LocalState,
  OnCompleteAction,
  Txn,
  Uint64,
} from '@algorandfoundation/algorand-typescript'

/**
 * A tour of `@abimethod` options. Each method here is annotated with a
 * different combination so it's easy to see their use cases.
 */
export class AbiMethodOptions extends Contract {
  governor = GlobalState<Account>()
  feeAsset = GlobalState<Asset>()
  joinEventCount = GlobalState({ initialValue: Uint64(0) })
  leaveEventCount = GlobalState({ initialValue: Uint64(0) })
  joinedRound = LocalState<uint64>()

  @abimethod({ onCreate: 'require' })
  create(governor: Account, feeAsset: Asset): void {
    // By default, a `Contract` can be created via any bare or `NoOp` call.
    // Marking a method `onCreate: 'require'` forces creation to go through that
    // method instead, allowing constructor-style initialization with parameters.
    this.governor.value = governor
    this.feeAsset.value = feeAsset
  }

  // In puya-ts every `@abimethod()` is public; there is no separate `public`
  // alias like PuyaPy's, so a getter is just a plain abimethod.
  @abimethod()
  publicGovernorGetter(): Account {
    return this.governor.value
  }

  // example: ABIMETHOD_NAME
  @abimethod({ name: 'ping' })
  longInternalName(): string {
    // `name` decouples the on-chain ABI method name from the TypeScript
    // function name. Useful for keeping the ABI surface stable while
    // renaming the implementation, or for shortening selector signatures.
    return 'ping'
  }

  // example: ABIMETHOD_NAME

  // example: ABIMETHOD_READONLY
  @abimethod({ readonly: true })
  getJoinEventCount(): uint64 {
    // `readonly: true` marks the method as side-effect-free. Clients can run
    // it via `simulate` without sending a real transaction. Puya does not
    // enforce read-only at the bytecode level; it constitutes a promise to the
    // caller.
    return this.joinEventCount.value
  }

  // example: ABIMETHOD_READONLY

  // example: ABIMETHOD_DEFAULT_ARGS
  @abimethod({
    defaultArguments: {
      feeAsset: { from: 'feeAsset' }, // name of a state member
      expectedJoinEventCount: { from: 'getJoinEventCount' }, // a readonly method
    },
  })
  adminAction(feeAsset: Asset, expectedJoinEventCount: uint64): void {
    // `defaultArguments` lets a client fill arguments automatically from the
    // contract's own state or readonly methods. Each value is either:
    //   * a member name for a storage member (state default), or
    //   * the name of a `readonly: true` method (dynamic default).
    // Clients that read the ABI metadata can supply the defaults on the
    // user's behalf: here that means attaching the configured `feeAsset`
    // resource without a separate state read, and pre-filling
    // `expectedJoinEventCount` as an optimistic-concurrency check.
    assert(Txn.sender === this.governor.value, 'only governor')

    // the arg is caller-supplied, so check it against the configured asset
    // before acting on it — here a mismatch is tolerated with an early
    // return rather than a failed transaction
    if (feeAsset !== this.feeAsset.value) {
      // do some specific handling for this case
      return
    }

    // compare-and-swap guard: reject if membership changed since observed
    assert(expectedJoinEventCount === this.joinEventCount.value, 'stale join event count')
    // privileged work acting on `feeAsset` would go here
  }

  // example: ABIMETHOD_DEFAULT_ARGS

  // example: ABIMETHOD_RESOURCE_ENCODING
  @abimethod({ resourceEncoding: 'index' })
  eligibleBalance(asset: Asset, app: Application, account: Account): uint64 {
    // `resourceEncoding: 'index'` (the pre-PuyaPy-5.0 behavior) tells the
    // ABI router to expect resource references as a `uint8` index into the
    // foreign-array slots populated by the caller. This saves calldata when
    // the same resources are reused across calls in a group.
    //
    // Without this option, the default is `'value'`; the client passes the
    // full Asset id / app id / account address directly, which is simpler and
    // reflected in the published ABI signature.
    assert(account.isOptedIn(app), 'account not opted in to app')
    // note: opting in creates a zero-balance holding, so this only proves the
    // account *can* hold the asset
    // use `asset.balance(account) > 0` to require an actual balance
    assert(account.isOptedIn(asset), 'account is not opted in to the asset')
    return asset.balance(account)
  }

  // example: ABIMETHOD_RESOURCE_ENCODING

  // example: ABIMETHOD_ALLOW_ACTIONS
  @abimethod({ allowActions: ['NoOp', 'OptIn'] })
  join(): void {
    // `allowActions` declares which OnComplete actions can dispatch to
    // this method. The default is `['NoOp']`. Listing `'OptIn'` here lets
    // the same logic run during a NoOp call *or* an opt-in call, which is
    // a handy way to bundle "first-time setup" with regular use: new
    // members come in via OptIn (the network opens their local state in
    // the same transaction), returning members hit the NoOp path.
    // Inspect `Txn.onCompletion` to branch on which one actually ran.

    // Common path: every join (first or repeat) must be opted in to the fee asset.
    // Even though the asset comes from state, this holding lookup still
    // requires it to be an *available resource* on the call — the AlgoKit
    // client discovers and attaches the reference automatically (via
    // simulate); a hand-rolled caller must add it to the asset references.
    assert(Txn.sender.isOptedIn(this.feeAsset.value), 'must be opted in to fee asset')

    // One-time setup runs only on the OptIn variant, where the sender's
    // local state has just been allocated.
    if (Txn.onCompletion === OnCompleteAction.OptIn) {
      this.joinEventCount.value += 1 // record this account's join
      this.joinedRound(Txn.sender).value = Global.round
    }
  }

  @abimethod({ allowActions: 'CloseOut' })
  optOut(): void {
    // A CloseOut handler: a member voluntarily leaving releases their
    // local state, and the leave event is counted so the pair of counters
    // keeps a best-effort registry: active members are approximately
    // `joinEventCount - leaveEventCount`.
    //
    // Note: an account can always leave via a ClearState transaction, which
    // cannot be blocked and bypasses this handler, so a ClearState leave is
    // never recorded and the difference can overcount active members.
    this.leaveEventCount.value += 1
  }

  @abimethod({ allowActions: 'DeleteApplication' })
  shutDown(): void {
    // A delete handler. Only routable from a DeleteApplication action.
    assert(Txn.sender === this.governor.value, 'only governor can delete')
  }

  // example: ABIMETHOD_ALLOW_ACTIONS
}
