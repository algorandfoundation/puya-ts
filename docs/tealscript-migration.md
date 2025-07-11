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
| `verify...Txn` | `assertMatch` | `assertMatch` can be used on any txn type or any object |
| `globals` | [`Global`](TODO: link to Global docs) ||
| `StaticArray` | `FixedArray` | May not cover all cases. See the array section for more details |

## Migrations

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

In TEALScript boxes are created via the create method: `create(size?: uint64)`.

In Algorand TypeScript the create method uses an object with a size parameter: `create(options?: { size?: uint64 })`

In both, the size will automatically be determined for fixed-length types, thus the size parameter is optional

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
      configAssetName: 'AST3',
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
      assetName: 'AST3',
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

TODO: For 1.0 we will probably have similar types to TEALScript (i.e. `AppID` that is an ABI `uint64`) but exact API is TBD

### Compiled Contract Information

TEALScript contracts have static methods for getting the contract programs and schema. In Algorand TypeScript, you must first explicitly
compile the contract and then use the resulting object to access program information.

##### TEALScript

```ts
// Access program information directly via static methods
sendMethodCall<typeof Greeter.prototype.createApplication>({
  clearStateProgram: Greeter.clearProgram(),
  approvalProgram: Greeter.approvalProgram(),
  globalNumUint: Greeter.schema.global.numUint,
  methodArgs: ['hello'],
});
```

##### Algorand TypeScript

```ts
// First explicitly compile the app
const compiled = compileArc4(Greeter)

// Then access program information on the compiled object
const app = compiled.call.createApplication({
  args: ['hello'],
  globalNumUint: compiled.globalUints
}).itxn.createdApp
```

### Logic Sigs

In TEALScript, logic sigs must implement the `logic` method which may take one or more arguments which map to the lsig arguments when
forming the transaction. All lsigs are approved unless an error occurs. Algorand TypeScript also requires implementation of the `program` method but it may not take an arguments and must return a `boolean` or `uint64` indicating whether the transaction is approved or not.

##### TEALScript

```ts
class DangerousPaymentLsig extends LogicSig {
  logic(amt: uint64) {
    assert(this.txn.amount === amt)
  }
}
```

##### Algorand TypeScript

```ts
import { op, LogicSig, Txn } from '@algorandfoundation/algorand-typescript'

class DangerousPaymentLsig extends LogicSig {
  program() {
    const amt = op.btoi(op.arg(0))
    return Txn.amount ===
  }
}
```

### Template Variables

In TEALScript, template variables must be properties of a contract. In Algorand TypeScript, they can be defined like any other variable.

###### TEALScript

```ts
class AppCaller extends LogicSig {
  APP_ID = TemplateVar<AppID>();

  logic(): void {
    assert(this.txn.applicationID === this.APP_ID);
  }
}
```

###### Algorand TypeScript

```ts
class AppCaller extends LogicSig {
  logic(): void {
    assert(this.txn.applicationID === TemplateVar<uint64>('APP_ID'));
  }
}
```

### Importing

In TEALScript, all of the type are injecting into the global namespace. This means no importing is required for most functions and objects.
Algorand Typescript, however, requires explicit importing of every type, allowing for better LSP discovery.

##### TEALScript

```ts
import { LogicSig } from '@algorandfoundation/tealscript'

class AppCaller extends LogicSig {
  logic(): void {
    // No need to import assert
    assert(this.txn.applicationID === 1234);
  }
}
```

##### Algorand TypeScript

```ts
import { LogicSig, Txn, assert, uint64 } from '@algorandfoundation/tealscript'

class AppCaller extends LogicSig {
  logic(): uint64 {
    assert(Txn.applicationID === 1234);

    return 1
  }
}
```

### Numerical Types

#### `number` Type

Both TEALScript and Algorand TypeScript have a `uint64` type, but Algorand TypeScript disallows any types to be resolved as `number`. This
means all arithmetic values must be explicitly typed as `uint64`, otherwise they will have the `number` type which is not allowed.

##### TEALScript

```ts
add(a: uint64, b: uint64): uint64 {
  // Type not needed for sum
  const sum = a + b;
  return sum;
}
```

##### Algorand TypeScript

```ts
add(a: uint64, b: uint64): uint64 {
  // The type is required for sum
  const sum: uint64 = a + b;
  return sum;
}
```

#### UintN types

TEALScript supports typed numeric literals for most common uint types, such as `uint8`, `uint16`, `uint256`, etc. In Algorand TypeScript,
the UintN constructors must be used.

##### TEALScript

```ts
addOne(n: uint256): uint256 {
  const one: uint256 = 1;
  const sum = n + one;
  return sum;
}
```

##### Algorand TypeScript

```ts
addOne(n: UintN256): UintN256 {
  // Need to explicitly use UintN256 constructor to get uint256 and use bigint to perform arithmetic
  const one = 1n;
  const sum = new UintN256(n.native + one + one);
  return sum;
}
```

#### Math and Overflows

In TEALScript, overflow checks do not occur until the value is encoded (returned, logged, put into an array/object). In Algorand TypeScript,
overflow checking occurs whenever the `UintN` constructor is used. Since overflow checking is fairly expensive, it is recommended to not use
the `UintN` type until it needs to be encoded.

##### TEALScript

```ts
addToNumber(n: uint8) {
  assert(n != 0)
  const x: uint8 = 255
  const sum = n + x // Intermediate value of overflows the max uint8, but not checked here

  // final returned value is within max value of uint8, so no error
  return sum - x
}
```

##### Algorand TypeScript

```ts
addToNumber(n: UintN8) {
  // Use biguint for intermediate values which can go up to u512
  const x: biguint = 255
  const sum: biguint = BigUint(n.bytes) + x

  return new UintN8(sum - x)
}
```

### Casting

In TEALScript, the `as` keyword is used to cast values as different types. Much like regular typescript, the `as` keyword in Algorand
TypeScript cannot change runtime behavior. This means constructors must be used instead of `as`

##### TEALScript

```ts
convertNumber(n: uint64): uint8 {
  return n as uint8
}
```

##### Algorand TypeScript

```ts
convertNumber(n: uint64): UintN8 {
  return new UintN8(n)
}
```

### Array & Object References

TEALScript allows developers to create mutable references to arrays and objects, even when nested. Algorand TypeScript, however, does not
allow this. Any new variables must copy the array or object.

##### TEALScript

```ts
const a: uint64[] = [1, 2, 3]
const b = a
b.push(4)

assert(a === b) // a and b are referencing the same array
```

##### Algorand TypeScript

```ts
const a: uint64[] = [1, 2, 3]
const b = clone(a)
b.push(4)

assertMatch(a, [1, 2, 3])
assertMatch(b, [1, 2, 3, 4]) // a and b are different arrays
```
