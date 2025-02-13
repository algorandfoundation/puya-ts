# Storage

Algorand smart contracts have [three different types of on-chain storage](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/state/)
they can utilise: [Global storage](#global-storage), [Local storage](#local-storage), and [Box Storage](#box-storage). They also have access to a transient form of storage in [Scratch space](#scratch-storage).

## Global storage

Global or Application storage is a key/value store of `bytes` or `uint64` values stored against a smart contract application. The number of values used must be declared when the application is first created. For ARC4 contracts this information is captured in the ARC32 and ARC56 specification files and automatically included in deployments.

Global storage values are declared using the [GlobalState](api/functions/GlobalState.md) function to create a [GlobalState](api/type-aliases/GlobalState.md) proxy object.

```ts
import {GlobalState, Contract, uint64, bytes, Uint64, contract} from "@algorandfoundation/algorand-typescript";

class DemoContract extends Contract {
  // The property name 'globalInt' will be used as the key
  globalInt = GlobalState<uint64>({initialValue: Uint64(1)})
  // Explicitly override the key
  globalBytes = GlobalState<bytes>({key: "alternativeKey"})

}

// If using dynamic keys, state msut be explicitly reserved
@contract({ stateTotals: { globalBytes: 5 } })
class DynamicAccessContract extends Contract {
  test(key: string, value: string) {
    // Interact with state using a dynamic key
    const dynamicAccess = GlobalState<string>({key})
    dynamicAccess.value = value
  }
}
```

## Local storage

## Box storage

## Scratch storage

Scratch storage persists for the lifetime of a group transaction and can be used to pass values between multiple calls and/or applications in the same group. Scratch storage for logic signatures is separate from that of the application calls and logic signatures do not have access to the scratch space of other transactions in the group.

Values can be written to scratch space using the `Scratch.store(...)` method and read from using `Scratch.loadUint64(...)` or `Scratch.loadBytes(...)` methods. These all take a scratch slot number between 0 and 255 inclusive and that scratch slot must be explicitly reserved by the contract using the `contract` options decorator.

```ts
import { assert, BaseContract, Bytes, contract } from '@algorandfoundation/algorand-typescript'
import { Scratch } from '@algorandfoundation/algorand-typescript/op'

@contract({ scratchSlots: [0, 1, { from: 10, to: 20 }] })
export class ReserveScratchAlgo extends BaseContract {
  setThings() {
    Scratch.store(0, 1)
    Scratch.store(1, Bytes('hello'))
    Scratch.store(15, 45)
  }

  approvalProgram(): boolean {
    this.setThings()

    assert(Scratch.loadUint64(0) === 1)
    assert(Scratch.loadBytes(1) === Bytes('hello'))
    assert(Scratch.loadUint64(15) === 45)
    return true
  }
}
```

Scratch space can be read from group transactions using the `gloadUint64` and `gloadBytes` ops. These ops take the group index of the target transaction, and a scratch slot number.

```ts
import { gloadBytes, gloadUint64 } from '@algorandfoundation/algorand-typescript/op'

function test() {
  const b = gloadBytes(0, 1)
  const u = gloadUint64(1, 2)
}
```
