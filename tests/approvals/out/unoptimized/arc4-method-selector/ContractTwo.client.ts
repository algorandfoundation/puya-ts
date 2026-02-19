// This file is auto-generated, do not modify
import { Contract, abimethod, err, type Account, type Application, type Asset, type arc4, type gtxn } from '@algorandfoundation/algorand-typescript'

export abstract class ContractTwo extends Contract {
  @abimethod
  renamedSomeMethod(): void {
    err('stub only')
  }

  @abimethod
  test(): arc4.Bool {
    err('stub only')
  }

  @abimethod({ resourceEncoding: 'index' })
  referenceTypesIndex(
    pay: gtxn.PaymentTxn,
    asset: Asset,
    account: Account,
    app: Application,
    appTxn: gtxn.ApplicationCallTxn,
  ): void {
    err('stub only')
  }

  @abimethod
  referenceTypesValue(
    pay: gtxn.PaymentTxn,
    asset: arc4.Uint<64>,
    account: arc4.Address,
    app: arc4.Uint<64>,
    appTxn: gtxn.ApplicationCallTxn,
  ): void {
    err('stub only')
  }
}
