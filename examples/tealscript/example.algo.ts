import { TealScriptBase } from './teal-script-base.algo'
import type { bytes } from '@algorandfoundation/algo-ts'
import { abimethod, log, Uint64, Bytes, uint64 } from '@algorandfoundation/algo-ts'

export default class ExampleTealScript extends TealScriptBase {
  public createApplication() {
    log('Application created')

    super.createApplication()

    return Uint64(4)
  }

  @abimethod({ allowActions: ['NoOp', 'OptIn'], name: 'Overridden name', onCreate: 'allow', readonly: false })
  public customMethod(): bytes {
    return Bytes('')
  }
}
