import { arc4, assert, Box, Bytes, OnCompleteAction, op, TransactionType } from '@algorandfoundation/algorand-typescript'
import { Tuple, UintN64 } from '@algorandfoundation/algorand-typescript/arc4'

export class BoxContract extends arc4.Contract {
  oca = Box<OnCompleteAction>({ key: Bytes('oca') })
  txn = Box<TransactionType>({ key: Bytes('txn') })

  @arc4.abimethod({ name: 'store_enums' })
  public storeEnums(): void {
    this.oca.value = OnCompleteAction.OptIn
    this.txn.value = TransactionType.ApplicationCall
  }

  @arc4.abimethod({ name: 'read_enums' })
  public readEnums(): Tuple<readonly [UintN64, UintN64]> {
    assert(op.Box.get(Bytes('oca'))[0] === op.itob(this.oca.value))
    assert(op.Box.get(Bytes('txn'))[0] === op.itob(this.txn.value))

    return new Tuple(new UintN64(this.oca.value), new UintN64(this.txn.value))
  }
}
