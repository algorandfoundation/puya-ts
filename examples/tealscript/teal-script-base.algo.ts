import { arc4, Contract, err } from '@algorandfoundation/algorand-typescript'

export abstract class TealScriptBase extends Contract {
  @arc4.abimethod({ allowActions: 'DeleteApplication' })
  public deleteApplication(): void {
    err('not supported')
  }
  @arc4.abimethod({ allowActions: 'NoOp', onCreate: 'require' })
  public createApplication(): void {
    err('not supported')
  }
  @arc4.abimethod({ allowActions: 'UpdateApplication' })
  public updateApplication(): void {
    err('not supported')
  }
  @arc4.abimethod({ allowActions: 'OptIn' })
  public optInToApplication(): void {
    err('not supported')
  }
  @arc4.abimethod({ allowActions: 'CloseOut' })
  public closeOutOfApplication(): void {
    err('not supported')
  }
}
