import type { bytes } from '@algorandfoundation/algorand-typescript'
import { abimethod, Bytes, log, Uint64 } from '@algorandfoundation/algorand-typescript'
import { TealScriptBase } from './teal-script-base.algo'

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
