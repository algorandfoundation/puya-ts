import type { Application } from '@algorandfoundation/algorand-typescript'
import { abimethod, arc4, assert, Contract, err } from '@algorandfoundation/algorand-typescript'

// example: ARC4_CLIENT_PROTOCOL
export abstract class HelloWorldClient extends Contract {
  @abimethod()
  hello(name: arc4.Str): arc4.Str {
    err('stub only')
  }

  @abimethod()
  add(a: arc4.Uint64, b: arc4.Uint64): arc4.Uint64 {
    err('stub only')
  }
}

// example: ARC4_CLIENT_PROTOCOL

// example: ARC4_ABI_CALL_CLIENT
export class ClientConsumer extends Contract {
  @abimethod()
  callHello(app: Application, name: arc4.Str): arc4.Str {
    const { returnValue: result } = arc4.abiCall({
      method: HelloWorldClient.prototype.hello,
      args: [name],
      appId: app,
      fee: 0,
    })
    return result
  }

  @abimethod()
  callAdd(app: Application, a: arc4.Uint64, b: arc4.Uint64): arc4.Uint64 {
    const { returnValue: result, itxn: txn } = arc4.abiCall({
      method: HelloWorldClient.prototype.add,
      args: [a, b],
      appId: app,
      fee: 0,
    })
    assert(txn.numLogs === 1, 'only the return log was emitted by the app')
    return result
  }
}

// example: ARC4_ABI_CALL_CLIENT
