// This file is auto-generated, do not modify
import { Contract, abimethod, err, type Account, type Application, type Asset, type arc4, type gtxn } from '@algorandfoundation/algorand-typescript'

export abstract class ContractTwo extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  renamedSomeMethod(): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test(): arc4.Bool {
    err('stub only')
  }

  @abimethod({ resourceEncoding: 'index', allowActions: ['NoOp'], onCreate: 'require' })
  referenceTypesIndex(
    pay: gtxn.PaymentTxn,
    asset: Asset,
    account: Account,
    app: Application,
    appTxn: gtxn.ApplicationCallTxn,
  ): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
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
