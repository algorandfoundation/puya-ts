// This file is auto-generated, do not modify
import { Contract, abimethod, err, type Account, type Application, type Asset, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class EchoResource extends Contract {
  @abimethod({ resourceEncoding: 'index', allowActions: ['NoOp'], onCreate: 'require' })
  echoResourceByIndex(
    asset: Asset,
    app: Application,
    acc: Account,
  ): arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<64>, arc4.Address]> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  echoResourceByValue(
    asset: arc4.Uint<64>,
    app: arc4.Uint<64>,
    acc: arc4.Address,
  ): arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<64>, arc4.Address]> {
    err('stub only')
  }
}
