import { Account, Asset, Application, bytes, uint64 } from '@algorandfoundation/algo-ts'

export class AccountCls implements Account {
  constructor(private address: bytes) {}

  get bytes(): bytes {
    return this.address
  }
}

export class AssetCls implements Asset {
  constructor(public readonly id: uint64) {}
  get total(): uint64 {
    throw new Error('Not implemented')
  }
  get decimals(): uint64 {
    throw new Error('Not implemented')
  }
  get defaultFrozen(): boolean {
    throw new Error('Not implemented')
  }
  get unitName(): bytes {
    throw new Error('Not implemented')
  }
  get name(): bytes {
    throw new Error('Not implemented')
  }
  get url(): bytes {
    throw new Error('Not implemented')
  }
  get metadataHash(): bytes {
    throw new Error('Not implemented')
  }
  get manager(): Account {
    throw new Error('Not implemented')
  }
  get reserve(): Account {
    throw new Error('Not implemented')
  }
  get freeze(): Account {
    throw new Error('Not implemented')
  }
  get clawback(): Account {
    throw new Error('Not implemented')
  }
  get creator(): Account {
    throw new Error('Not implemented')
  }
  balance(_account: Account): uint64 {
    throw new Error('Method not implemented.')
  }
  frozen(_account: Account): boolean {
    throw new Error('Method not implemented.')
  }
}

export class ApplicationCls implements Application {
  constructor(public readonly id: uint64) {}
  get approvalProgram(): bytes {
    throw new Error('Method not implemented.')
  }
  get clearStateProgram(): bytes {
    throw new Error('Method not implemented.')
  }
  get globalNumUint(): uint64 {
    throw new Error('Method not implemented.')
  }
  get globalNumBytes(): uint64 {
    throw new Error('Method not implemented.')
  }
  get localNumUint(): uint64 {
    throw new Error('Method not implemented.')
  }
  get localNumBytes(): uint64 {
    throw new Error('Method not implemented.')
  }
  get extraProgramPages(): uint64 {
    throw new Error('Method not implemented.')
  }
  get creator(): Account {
    throw new Error('Method not implemented.')
  }
  get address(): Account {
    throw new Error('Method not implemented.')
  }
}
