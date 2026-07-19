import { assert, Contract } from '@algorandfoundation/algorand-typescript'

class ContractLogsWarn extends Contract {
  warn_assertion_always_true() {
    assert(true)
  }
}
