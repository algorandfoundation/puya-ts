# TEALScript Migration Guide

This document is up-to-date as of TEALScript v0.107.0 and Algorand TypeScript v1.0.0-beta71

## Migration Table

| TEALScript | Algorand TypeScript | Notes |
| --- | --- | --- |
| JS Object | JS Object | Algorand TypeScript does not yet support nested dynamic types in JavaScript objects. TEALScript allows one level of nesting. For nested dynamic types, see [Objects](#objects) |
| JS Array | JS Array | Algorand TypeScript does not yet support nested dynamic types in JavaScript arrays. TEALScript allows one level ofnesting. For nested dynamic types, see [Arrays](#arrays) |
| `EventLogger` | [`emit`](https://dev.algorand.co/reference/algorand-typescript/api-reference/index/functions/emit) ||
| `BoxKey` | [`Box`](TOOD: link to box docs) | The crate method has new parameters as shown [here](TODO: link to box section) |
| `Txn` | `Transaction` ||
| `PayTxn` | `PaymentTxn` ||
| `AppCallTxn` | `ApplicationCallTxn` ||
| `KeyRegTxn` | `KeyRegistrationTxn` ||
| `OnCompletion` | `OnCompleteAction` ||
| Eliptic curve opcodes (i.e `ecAdd`) | Now under [`ElipticCurve`](TODO: link to EC docs) (i.e. `ElipticCurve.add`) ||
| `GlobalStateKey` | `GlobalState` ||
| `LocalStateKey` | `LocalState` ||
| `GlobalStateMap` | Not yet supported ||
| `LocalStateMap` | Not yet supported ||
| `isOptedInToApp` and `isOptedInToAsset` | [`isOptedIn`](TODO: link to isOptedInDocs) ||
| `this.txn` | [`Txn`](TOOD: link to Txn docs) ||
| `verify...Txn` | `assertMatch` | `assertMatch` can be used on any txn type or any object ||

## Migrations

### Objects

TODO: describe different types of objects and when you need to use them over POJOs

### Arrays

TODO: describe different types of arrays and when you need to use them over native arrays

### Emitting Events

TODO

### Box Creation

TODO

### Box Iteration

TODO: is this supported?

### Inner Transactions

TODO

### Reference Types

TODO

### Static Contract Methods

TODO

### Logic Sigs

TODO

### Template Variables

TODO

### Importing

TODO

### Numerical Types

TODO

### Math and Overflows

TODO

### Casting

TODO

### Array & Object References

TODO
