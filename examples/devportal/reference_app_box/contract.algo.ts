import type { Account, gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, assert, BoxMap, Contract, Global, GlobalState, Uint64, Txn } from '@algorandfoundation/algorand-typescript'

const COUNTER_BOX_KEY_LENGTH = 32 + 19
const COUNTER_BOX_VALUE_LENGTH = 8

// example: REFERENCE_APP_BOX_EXAMPLE
export class ReferenceAppBox extends Contract {
  keyLength = GlobalState({ initialValue: Uint64(COUNTER_BOX_KEY_LENGTH) })
  valueLength = GlobalState({ initialValue: Uint64(COUNTER_BOX_VALUE_LENGTH) })
  boxSize = GlobalState<uint64>()
  boxMbr = GlobalState<uint64>()
  accountBoxCounter = BoxMap<Account, uint64>({ keyPrefix: 'counter' })

  @abimethod({ onCreate: 'require' })
  create(): void {
    this.boxSize.value = this.keyLength.value + this.valueLength.value
    this.boxMbr.value = Uint64(2_500) + this.boxSize.value * Uint64(400)
  }

  @abimethod()
  incrementBoxCounter(payMbr: gtxn.PaymentTxn): uint64 {
    assert(payMbr.amount === this.boxMbr.value, 'Payment must cover the box MBR')
    assert(payMbr.receiver === Global.currentApplicationAddress, 'Payment must be to the contract')

    const [counter, hasCounter] = this.accountBoxCounter(Txn.sender).maybe()
    this.accountBoxCounter(Txn.sender).value = hasCounter ? counter + 1 : Uint64(1)
    return this.accountBoxCounter(Txn.sender).value
  }

  @abimethod({ readonly: true })
  getBoxCounter(): uint64 {
    const [counter, hasCounter] = this.accountBoxCounter(Txn.sender).maybe()
    return hasCounter ? counter : Uint64(0)
  }

  @abimethod({ readonly: true })
  getBoxCounterForAccount(account: Account): uint64 {
    const [counter, hasCounter] = this.accountBoxCounter(account).maybe()
    return hasCounter ? counter : Uint64(0)
  }

  @abimethod({ readonly: true })
  getBoxMbr(): uint64 {
    return this.boxMbr.value
  }

  @abimethod({ readonly: true })
  getBoxConfiguration(): readonly [uint64, uint64, uint64, uint64] {
    return [this.keyLength.value, this.valueLength.value, this.boxSize.value, this.boxMbr.value] as const
  }

  @abimethod()
  updateBoxConfiguration(newKeyLength: uint64, newValueLength: uint64): void {
    this.keyLength.value = newKeyLength
    this.valueLength.value = newValueLength
    this.boxSize.value = this.keyLength.value + this.valueLength.value
    this.boxMbr.value = Uint64(2_500) + this.boxSize.value * Uint64(400)
  }
}

// example: REFERENCE_APP_BOX_EXAMPLE
