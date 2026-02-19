// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class TealScriptConventionsAlgo extends Contract {
  @abimethod({ allowActions: ['CloseOut'] })
  noMoreThanks(arg: arc4.Uint<64>): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp', 'DeleteApplication'], onCreate: 'require' })
  createApplication(value: arc4.DynamicBytes): void {
    err('stub only')
  }

  @abimethod
  setLocal(value: arc4.Str): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['OptIn'] })
  optInToApplication(): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['UpdateApplication'] })
  updateApplication(): void {
    err('stub only')
  }
}
