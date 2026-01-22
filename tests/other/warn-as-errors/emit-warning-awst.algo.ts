import { abimethod, Contract } from '@algorandfoundation/algorand-typescript'

class ContractLogsWarn extends Contract {
  @abimethod({ allowActions: ['NoOp', 'NoOp'] })
  public justNoop(): void {}
}
