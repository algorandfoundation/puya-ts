import { err, Contract, arc4 } from '@algorandfoundation/algo-ts'

export abstract class TealScriptBase extends Contract {
  @arc4.abimethod({ allowActions: 'DeleteApplication' })
  public deleteApplication() {
    err('not supported')
  }
  @arc4.abimethod({ allowActions: 'NoOp', onCreate: 'require' })
  public createApplication() {
    err('not supported')
  }
  @arc4.abimethod({ allowActions: 'UpdateApplication' })
  public updateApplication() {
    err('not supported')
  }
  @arc4.abimethod({ allowActions: 'OptIn' })
  public optInToApplication() {
    err('not supported')
  }
  @arc4.abimethod({ allowActions: 'CloseOut' })
  public closeOutOfApplication() {
    err('not supported')
  }
}
