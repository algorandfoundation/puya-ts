import type { Account, Application, Asset, uint64 } from '@algorandfoundation/algorand-typescript'
import {
  abimethod,
  assert,
  Contract,
  GlobalState,
  OnCompleteAction,
  Txn,
  Uint64,
} from '@algorandfoundation/algorand-typescript'

export class AbiMethodOptions extends Contract {
  governor = GlobalState<Account>()
  feeAsset = GlobalState<Asset>()
  memberCount = GlobalState({ initialValue: Uint64(0) })

  @abimethod({ onCreate: 'require' })
  create(governor: Account, feeAsset: Asset): void {
    this.governor.value = governor
    this.feeAsset.value = feeAsset
  }

  @abimethod()
  aPublicMethod(): Account {
    return this.governor.value
  }

  // example: ABIMETHOD_NAME
  @abimethod({ name: 'ping' })
  longInternalName(): string {
    return 'ping'
  }

  // example: ABIMETHOD_NAME

  // example: ABIMETHOD_READONLY
  @abimethod({ readonly: true })
  getMemberCount(): uint64 {
    return this.memberCount.value
  }

  // example: ABIMETHOD_READONLY

  // example: ABIMETHOD_DEFAULT_ARGS
  @abimethod({
    defaultArguments: {
      governor: { from: 'governor' },
      feeAsset: { from: 'feeAsset' },
      currentMemberCount: { from: 'getMemberCount' },
    },
  })
  adminAction(governor: Account, feeAsset: Asset, currentMemberCount: uint64): void {
    assert(Txn.sender === governor, 'only governor')
    assert(feeAsset === this.feeAsset.value, 'fee asset mismatch')
    assert(currentMemberCount === this.memberCount.value, 'member count mismatch')
  }

  // example: ABIMETHOD_DEFAULT_ARGS

  // example: ABIMETHOD_RESOURCE_ENCODING
  @abimethod({ resourceEncoding: 'index' })
  eligibleBalance(asset: Asset, app: Application, account: Account): uint64 {
    assert(account.isOptedIn(app), 'account not opted in to app')
    assert(account.isOptedIn(asset), 'account does not hold asset')
    return asset.balance(account)
  }

  // example: ABIMETHOD_RESOURCE_ENCODING

  // example: ABIMETHOD_ALLOW_ACTIONS
  @abimethod({ allowActions: ['NoOp', 'OptIn'] })
  join(): void {
    assert(Txn.sender.isOptedIn(this.feeAsset.value), 'must hold fee asset to join')

    if (Txn.onCompletion === OnCompleteAction.OptIn) {
      this.memberCount.value += 1
    }
  }

  @abimethod({ allowActions: 'CloseOut' })
  optOut(): void {
    this.memberCount.value -= 1
  }

  @abimethod({ allowActions: 'DeleteApplication' })
  shutDown(): void {
    assert(Txn.sender === this.governor.value, 'only governor can delete')
  }

  // example: ABIMETHOD_ALLOW_ACTIONS
}
