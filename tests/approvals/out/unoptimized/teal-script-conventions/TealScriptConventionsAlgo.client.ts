// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class TealScriptConventionsAlgo extends Contract {
  @abimethod({ allowActions: ['CloseOut'], onCreate: 'require' })
  noMoreThanks(arg: arc4.Uint<64>): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp', 'DeleteApplication'], onCreate: 'require' })
  createApplication(value: arc4.DynamicBytes): void {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  setLocal(value: arc4.Str): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['OptIn'], onCreate: 'require' })
  optInToApplication(): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['UpdateApplication'], onCreate: 'require' })
  updateApplication(): void {
    err('stub only')
  }
}
