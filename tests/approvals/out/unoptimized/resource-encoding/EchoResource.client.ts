// This file is auto-generated, do not modify
/* eslint-disable */
import type { Account, Application, Asset, arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class EchoResource extends Contract {
  @abimethod({ resourceEncoding: 'index' })
  echoResourceByIndex(
    asset: Asset,
    app: Application,
    acc: Account,
  ): arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<64>, arc4.Address]> {
    err('stub only')
  }

  @abimethod()
  echoResourceByValue(
    asset: arc4.Uint<64>,
    app: arc4.Uint<64>,
    acc: arc4.Address,
  ): arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<64>, arc4.Address]> {
    err('stub only')
  }
}
