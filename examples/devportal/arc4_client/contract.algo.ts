import type { Application } from '@algorandfoundation/algorand-typescript'
import { abimethod, arc4, assert, Contract, err, log } from '@algorandfoundation/algorand-typescript'

// example: ARC4_CLIENT_PROTOCOL
/**
 * A typed client for an *external* ARC-4 contract.
 *
 * It is an abstract `Contract` that describes the methods we want to call by their
 * signatures, with stubbed bodies (`err('stub only')`) — the bodies are never emitted,
 * they exist only so the class type-checks.
 *
 * A client like this can be generated from a compiled contract's ABI.
 *
 * The signatures match the on-chain contract's published ABI; puya-ts uses them to:
 *   - derive the correct ABI selector for each call,
 *   - type-check the args we pass,
 *   - type the return value.
 *
 * A typed client is preferable to passing a method-name string to `arc4.abiCall`
 * because mistakes (wrong arg type, missing arg, etc.) are caught at compile time
 * rather than as on-chain failures.
 */
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

// A concrete implementation of the client protocol, used by the on-chain tests to give
// ClientConsumer a real target app. Not part of the doc snippets above.
export class HelloWorld extends HelloWorldClient {
  @abimethod()
  hello(name: arc4.Str): arc4.Str {
    return new arc4.Str(`Hello, ${name.native}`)
  }

  @abimethod()
  add(a: arc4.Uint64, b: arc4.Uint64): arc4.Uint64 {
    return new arc4.Uint64(a.asUint64() + b.asUint64())
  }
}

// A second target whose `add` emits an extra log besides the ABI return log, violating
// ClientConsumer's `numLogs === 1` expectation. Used by the on-chain tests. Not a doc snippet.
export class ChattyHelloWorld extends HelloWorldClient {
  @abimethod()
  hello(name: arc4.Str): arc4.Str {
    return new arc4.Str(`Hello, ${name.native}`)
  }

  @abimethod()
  add(a: arc4.Uint64, b: arc4.Uint64): arc4.Uint64 {
    log('extra log entry')
    return new arc4.Uint64(a.asUint64() + b.asUint64())
  }
}

// example: ARC4_ABI_CALL_CLIENT
/**
 * Calls into an external contract via the typed `HelloWorldClient`. Each
 * `arc4.abiCall({ method: HelloWorldClient.prototype.method, ... })` returns a result
 * object whose `returnValue` has the type declared on the client, plus the inner
 * transaction handle (`itxn`).
 */
export class ClientConsumer extends Contract {
  @abimethod()
  callHello(app: Application, name: arc4.Str): arc4.Str {
    // Call `hello(string)string` on the target app. The return type is inferred as
    // `arc4.Str` from the client method.
    const { returnValue: result } = arc4.abiCall({
      method: HelloWorldClient.prototype.hello,
      args: [name],
      appId: app,
      // fee: 0 means the outer transaction must cover the inner fee
      fee: 0,
    })
    return result
  }

  @abimethod()
  callAdd(app: Application, a: arc4.Uint64, b: arc4.Uint64): arc4.Uint64 {
    // Call `add(uint64,uint64)uint64`. Arg types are checked against the client method
    // signature at compile time.
    //
    // `itxn` is the inner transaction handle. It's useful when you want to inspect the
    // call after the fact (e.g. confirm which app id was hit, read emitted logs, etc.).
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
