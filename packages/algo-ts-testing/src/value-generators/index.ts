import { TestExecutionContext } from '../test-execution-context'
import { AvmValueGenerator } from './avm'
import { TxnValueGenerator } from './txn'

export class ValueGenerator extends AvmValueGenerator {
  txn: TxnValueGenerator

  constructor(context: TestExecutionContext) {
    super(context)
    this.txn = new TxnValueGenerator(context)
  }
}
