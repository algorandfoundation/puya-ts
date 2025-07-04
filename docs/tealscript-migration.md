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

##### TEALScript

```ts
class Swapper
  swap = new EventLogger<{
    assetA: AssetID;
    assetB: AssetID;
  }>();

  doSwap(a: AssetID, b: AssetID) {
    this.swap.log({assetA: a, assetB: b})
  }
}
```

##### Algorand TypeScript

```ts
type Swap = {assetA: uint64, assetB: uint64}

class Swapper
  doSwap(a: uint64, b: uint64) {
    emit('swap', {assetA: a, assetB: b} as Swap)
  }
}
```

The event name can also be inferred from the name of a defined type

```ts
type swap = {assetA: uint64, assetB: uint64}

class Swapper
  doSwap(a: uint64, b: uint64) {
    emit<swap>({assetA: a, assetB: b})
  }
}
```

### Box Creation

TODO

### Box Iteration

TODO: is this supported?

### Inner Transactions

The interfaces for forming, sending, and inspecting inner transactions have significantly improved with Algorand TypeScript, but the
interfaces are quite different. They all revolve around the `itxn` namespace.

#### Sending a transaction

##### TEALScript

```ts
sendAssetConfig({
  total: 1000,
  assetName: 'AST1',
  unitName: 'unit'
  decimals: 3,
  manager: this.app.address,
  reserve: this.app.address
})
```

##### Algorand TypeScript

```ts
import { itxn, Global, log } from '@algorandfoundation/algorand-typescript'

const assetParams = itxn.assetConfig({
  total: 1000,
  assetName: 'AST1',
  unitName: 'unit',
  decimals: 3,
  manager: Global.currentApplicationAddress,
  reserve: Global.currentApplicationAddress,
})

const asset1_txn = assetParams.submit()
log(asset1_txn.createdAsset.id)
```

#### Sending a Transaction Group

##### TEALScript

```ts
    this.pendingGroup.addAssetCreation({
      configAssetTotal: 1000,
      configAssetName: this.name.value,
      configAssetUnitName: 'unit',
      configAssetDecimals: 3,
      configAssetManager: this.app.address,
      configAssetReserve: this.app.address,
    });

    this.pendingGroup.addAppCall({
      approvalProgram: APPROVE,
      clearStateProgram: APPROVE,
      fee: 0,
    });

    const appCreateTxn = this.lastInnerGroup[0];
    const asset3_txn = this.lastInnerGroup[1];

    assert(appCreateTxn.createdApplicationID, 'app is created');
    assert(asset3_txn.createdAssetID === 'AST3', 'asset3_txn is correct');
```

##### Algorand TypeScript

```ts
    const assetParams = itxn.assetConfig({
      total: 1000,
      assetName: this.name.value,
      unitName: 'unit',
      decimals: 3,
      manager: Global.currentApplicationAddress,
      reserve: Global.currentApplicationAddress,
    })

    const appCreateParams = itxn.applicationCall({
      approvalProgram: APPROVE,
      clearStateProgram: APPROVE,
      fee: 0,
    })

    const [appCreateTxn, asset3_txn] = itxn.submitGroup(appCreateParams, assetParams)

    assert(appCreateTxn.createdApp, 'app is created')
    assert(asset3_txn.assetName === Bytes('AST3'), 'asset3_txn is correct')
```

#### Typed Method Calls

In Algorand TypeScript, there is a specific `abiCall` method for typed contract-to-contract calls instead of a generic like in TEALScript.

These examples are for calling a contract method with the signature `greet(name: string): string` in a contract `Hello` that returns `"hello " + name`

##### TEALScript

```ts
const result = sendMethodCall<typeof Hello.prototype.greet>({
  applicationID: app,
  methodArgs: ['algo dev'],
});

assert(result === 'hello algo dev')
```

##### Algorand TypeScript

```ts
const result = abiCall(Hello.prototype.greet, {
  appId: app,
  args: ['algo dev'],
}).returnValue
assert(result === 'hello algo dev')
```

#### App Creation

In Algorand TypeScript, you must first explicitly compile a contract before creating it or access the programs/schema

##### TEALScript

```ts
sendMethodCall<typeof Greeter.prototype.createApplication>({
  clearStateProgram: Greeter.clearProgram(),
  approvalProgram: Greeter.approvalProgram(),
  globalNumUint: Greeter.schema.global.numUint,
  methodArgs: ['hello'],
});

const app = this.itxn.createdApplicationId;

const result = sendMethodCall<typeof Greeter.prototype.greet>({
  applicationID: app,
  methodArgs: ['world'],
});

assert(result == 'hello world')
```

##### Algorand TypeScript

```ts
// First explicitly compile the app
const compiled = compileArc4(Greeter)

const app = compiled.call.createApplication({
  args: ['hello'],
  globalNumUint: compiled.globalUints
}).itxn.createdApp

const result = compiled.call.greet({
  args: ['world'],
  appId: app,
}).returnValue

assert(result === 'hello world')
```

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
