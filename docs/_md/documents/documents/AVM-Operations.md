---
title: AVM Operations
type: doc
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [Algorand TypeScript Language Guide](../Algorand-TypeScript-Language-Guide.md) / AVM Operations

# AVM Operations

Algorand TypeScript allows you to express [every op code the AVM has available](https://dev.algorand.co/reference/algorand-teal/opcodes/), excluding those that manipulate the stack or control execution, as these would interfere with the compiler. These are all exported from the [ops module](../modules/op.html). It is possible to import ops individually or via the entire namespace.

```ts
// Import op from module root
import { assert, Contract, op } from '@algorandfoundation/algorand-typescript'
// Import whole module from ./op
import * as op2 from '@algorandfoundation/algorand-typescript/op'
// Import individual ops
import { bzero } from '@algorandfoundation/algorand-typescript/op'

class MyContract extends Contract {
  test() {
    const a = bzero(8).bitwiseInvert()
    const b = op2.btoi(a)
    assert(b === 2 ** 64 - 1)

    const c = op.shr(b, 32)

    assert(c === 2 ** 32 - 1)
  }
}
```

## Txn, Global, and other Enums

Many of the AVM ops that take an enum argument have been abstracted into a static type with a property or function per enum member.

```ts
import { Contract, Global, log, Txn } from '@algorandfoundation/algorand-typescript'
import { AppParams } from '@algorandfoundation/algorand-typescript/op'

class MyContract extends Contract {
  test() {
    log(Txn.sender)
    log(Txn.applicationArgs(0))
    log(Global.groupId)
    log(Global.creatorAddress)
    log(...AppParams.appAddress(123))
  }
}
```
