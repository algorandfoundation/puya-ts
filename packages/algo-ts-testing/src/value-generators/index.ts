import { AvmValueGenerator } from './avm'
import { TxnValueGenerator } from './txn'

export class ValueGenerator extends AvmValueGenerator {
  txn: TxnValueGenerator

  constructor() {
    super()
    this.txn = new TxnValueGenerator()
  }
}
