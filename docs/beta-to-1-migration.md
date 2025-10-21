# Migrating Algorand TypeScript beta to 1.0

## Breaking changes

### Object literals are mutable by default

Object literals are now mutable by default, which can be leveraged without any changes.
If you'd like to keep the same execution semantics as before, then apply a `readonly` or `as const` modifier to make them immutable.

```typescript
/**** Before (puya-ts beta) ****/
// These types and objects are immutable
type Point = { y: uint64; x: uint64 }
const p1: Point = { x: 1, y: 2 }
const p2 = { x: Uint64(1), y: Uint64(2) }

/**** After (puya-ts 1.0) ****/
// These types and objects are mutable
type Point = { y: uint64; x: uint64 }
const p1: Point = { x: 1, y: 2 }
const p2 = { x: Uint64(1), y: Uint64(2) }
p1.x = 3
p2.x = 3

// or if you want to maintain the previous execution semantics
// explicitly mark as `readonly` or `as const`
type Point = Readonly<{ y: uint64; x: uint64 }>
const p1: Point = { x: 1, y: 2 }
const p2 = { x: Uint64(1), y: Uint64(2) } as const
```

### Native arrays are mutable by default

Native arrays are now mutable by default, which can be leveraged without any changes.
If you'd like to keep the same execution semantics as before, then apply a `readonly` or `as const` modifier to make them immutable.

```typescript
/**** Before (puya-ts beta) ****/
// The arrays are immutable
const t1: uint64[] = [1, 2, 3]
const t2 = [Uint64(1), Uint64(2), Uint64(3)]

/**** After (puya-ts 1.0) ****/
// The arrays are mutable
const t1: uint64[] = [1, 2, 3]
const t2 = [Uint64(1), Uint64(2), Uint64(3)]

t1[0] = 3
t1.push(4)
t2[0] = 3
t2.push(4)

// or if you want to maintain the previous execution semantics
// explicitly mark as `readonly` or `as const`
const t1: readonly uint64[] = [1, 2, 3]
const t2 = [Uint64(1), Uint64(2), Uint64(3)] as const
```

### `MutableArray` has been renamed to `ReferenceArray`

Now that native arrays are mutable by default, it was confusing to call the scratch slot backed arrays with reference semantics `MutableArray`, so they have been renamed.

```typescript
/**** Before (puya-ts beta) ****/
const a = new MutableArray<uint64>()

/**** After (puya-ts 1.0) ****/
const a = new ReferenceArray<uint64>()
```

### Replace `xxx.copy()` calls with `clone(xxx)`

```typescript
/**** Before (puya-ts beta) ****/
const a = new arc4.StaticArray<UintN64, 3>(new UintN64(1), new UintN64(2), new UintN64(3))
const b = a.copy()

/**** After (puya-ts 1.0) ****/
const a = new arc4.StaticArray<Uint64, 3>(new Uint64(1), new Uint64(2), new Uint64(3))
const b = clone(a)
```

### ARC4 numeric types no longer have the 'N' and 'NxM' suffixes

The 'N' and 'NxM' suffixes have been removed from the ARC4 numeric types, which results in more natural type names.

```typescript
/**** Before (puya-ts beta) ****/
type User = {
  id: arc4.UintN16
  score: arc4.UFixedNxM<32, 4>
}
const user = {
  id: new arc4.UintN<16>(1234),
  score: new arc4.UFixedNxM<32, 4>('1.234'),
}

/**** After (puya-ts 1.0) ****/
type User = {
  id: arc4.Uint16
  score: arc4.UFixed<32, 4>
}
const user = {
  id: new arc4.Uint<16>(1234),
  score: new arc4.UFixed<32, 4>('1.234'),
}
```

### Direct import of functions and types from `gtxn` and `itxn` modules are no longer supported

```typescript
/**** Before (puya-ts beta) ****/
import type { PaymentTxn } from '@algorandfoundation/algorand-typescript/gtxn'

function reflectAllPay(pay: PaymentTxn) {
  ...
}

/**** After (puya-ts 1.0) ****/
import type { gtxn } from '@algorandfoundation/algorand-typescript'

function reflectAllPay(pay: gtxn.PaymentTxn) {
  ...
}
```

### Application, Asset and Account arguments are now passed by their uint64 id (Application and Asset) or bytes[32] address (Account) by default

`resourceEncoding: 'index' | 'value'` option is added to `@abimethod` decorator config with `value` as default. Use `index` for those methods which need to preserve the previous behaviour.

```typescript
/**** Before (puya-ts beta) ****/
test(asset: Asset, app: Application, acc: Account) {
  const assetIdx = op.btoi(Txn.applicationArgs(1))
  assert(asset === Txn.assets(assetIdx), 'expected asset to be passed by index')

  const appIdx = op.btoi(Txn.applicationArgs(2))
  assert(app === Txn.applications(appIdx), 'expected application to be passed by index')

  const accIdx = op.btoi(Txn.applicationArgs(3))
  assert(acc === Txn.accounts(accIdx), 'expected account to be passed by index')

  return [assetIdx, appIdx, accIdx] as const
}


/**** After (puya-ts 1.0) ****/
// use `index` resource encoding to keep old behaviour
@abimethod({ resourceEncoding: 'index' })
test(asset: Asset, app: Application, acc: Account) {
  const assetIdx = op.btoi(Txn.applicationArgs(1))
  assert(asset === Txn.assets(assetIdx), 'expected asset to be passed by index')

  const appIdx = op.btoi(Txn.applicationArgs(2))
  assert(app === Txn.applications(appIdx), 'expected application to be passed by index')

  const accIdx = op.btoi(Txn.applicationArgs(3))
  assert(acc === Txn.accounts(accIdx), 'expected account to be passed by index')

  return [assetIdx, appIdx, accIdx] as const
}

// or update the implementation to use default `value` resource encoding

test(asset: Asset, app: Application, acc: Account): [Asset, Application, Account] {
  const assetId = op.btoi(Txn.applicationArgs(1))
  assert(asset === Asset(assetId), 'expected asset to be passed by value')

  const appId = op.btoi(Txn.applicationArgs(2))
  assert(app === Application(appId), 'expected application to be passed by value')

  const address = Txn.applicationArgs(3)
  assert(acc === Account(address), 'expected account to be passed by value')

  return [asset, app, acc]
}
```

### Rename test files from `.(spec|test).ts` to `.algo.(spec|test).ts`.

Existing test files that need to run in a simulated AVM environment or import modules from `algorand-typescript` or `algorand-typescript-testing` packages should be renamed to have either the `.algo.spec.ts` or `.algo.test.ts` extension.

`puyaTsTransformer` will only provide the simulated AVM environment and executable implementations of `algorand-typescript` module to files with those extensions, excluding standard `.spec.ts` or `.test.ts` files (e.g. `e2e.spec.ts`).

This change can improve test performance by ensuring only relevant files are processed through `puyaTsTransformer`.

### Rename `arc4EncodedLength` function to `sizeOf`

```typescript
/**** Before (puya-ts beta) ****/
assert(arc4EncodedLength<uint64>() === 8)
assert(arc4EncodedLength<boolean>() === 1)
assert(arc4EncodedLength<UintN<512>>() === 64)
assert(arc4EncodedLength<[StaticArray<Bool, 10>, boolean, boolean]>() === 3)

/**** After (puya-ts 1.0) ****/
assert(sizeOf<uint64>() === 8)
assert(sizeOf<boolean>() === 1)
assert(sizeOf<Uint<512>>() === 64)
assert(sizeOf<[StaticArray<Bool, 10>, boolean, boolean]>() === 3)
```

### Change `abiCall` helper signature to support type only imports

The signature of `abiCall` helper changes from

```typescript
abiCall(MyContract.prototype.myMethod, { ... })
```

to

```typescript
abiCall({ method: MyContract.prototype.myMethod, ... })
```

The new `method` property exists to provide a natural way to specify the `TMethod` generic parameter, but it is optional and alternatively the generic arg can be specified explicitly with

```typescript
abiCall<typeof MyContract.prototype.myMethod>({ ... })
```

This form of invocation supports using type only imports `import type { MyContract } from '...'` which allow for circular references versus value imports which cannot be circular.

If, in some unforeseen circumstances, both a type argument and the `method` property are provided to the `abiCall` helper, the type argument takes precedence and the method specified by the type argument is called.

```typescript
/**** Before (puya-ts beta) ****/
const result2 = abiCall(Hello.prototype.greet, {
  appId: app,
  args: ['abi'],
}).returnValue

assert(result2 === 'hello abi')

const result3 = abiCall(HelloStubbed.prototype.greet, {
  appId: app,
  args: ['stubbed'],
}).returnValue
assert(result3 === 'hello stubbed')

/**** After (puya-ts 1.0) ****/
// provide method property
const result2 = abiCall({
  method: Hello.prototype.greet,
  appId: app,
  args: ['abi'],
}).returnValue

assert(result2 === 'hello abi')

// or provide type argument, this approach supports using type only imports
const result3 = abiCall<typeof HelloStubbed.prototype.greet>({
  appId: app,
  args: ['stubbed'],
}).returnValue
assert(result3 === 'hello stubbed')
```

### Rename `interpretAsArc4` function to `convertBytes`

The function now accepts an `options` object with `strategy: 'unsafe-cast' | 'validate'` and an optional `prefix` parameter.

```typescript
/**** Before (puya-ts beta) ****/
const x = interpretAsArc4<Uint<32>>(a)
const y = interpretAsArc4<Byte>(b, 'log')

/**** After (puya-ts 1.0) ****/
const x = convertBytes<Uint<32>>(a, { strategy: 'validate' })
const y = convertBytes<Byte>(b, { prefix: 'log', strategy: 'unsafe-cast' })
```

### Remove `BoxRef`, use `Box<bytes>` instead

`Box<bytes>` now includes all functionality previously available in `BoxRef`, including `extract`, `replace`, `resize`, and `splice` methods.

```typescript
/**** Before (puya-ts beta) ****/
const box = BoxRef({ key: 'test_key' })
box.create({ size: 32768 })

const boxValue = new Uint8Array(Array(5).fill([0x01, 0x02]).flat())
box.put(Bytes(boxValue))

const replacement = new Uint8Array(Array(2).fill(0x11))
box.splice(1, 5, Bytes(replacement))

box.replace(0, Bytes(0x11))

const extracted = box.extract(0, 3)

box.resize(newSize)

/**** After (puya-ts 1.0) ****/
const box = Box<bytes>({ key: 'test_key' })
box.create({ size: 32768 })

const boxValue = new Uint8Array(Array(5).fill([0x01, 0x02]).flat())
box.value = Bytes(boxValue)

const replacement = new Uint8Array(Array(2).fill(0x11))
box.splice(1, 5, Bytes(replacement))

box.replace(0, Bytes(0x11))

const extracted = box.extract(0, 3)

box.resize(newSize)
```

### replace `.native` property with `.asUint64()` and `.asBigUint()` methods for `arc4.Uint` types

For `Uint` types larger than 64 bits, `.asUint64()` throws an overflow error if the value exceeds `uint64` bounds.

```typescript
/**** Before (puya-ts beta) ****/
const z = new Uint<8>(n)
const z_native = z.native

const a = new Uint<128>(b)
const a_native = a.native

/**** After (puya-ts 1.0) ****/
const z = new Uint<8>(n)
const z_native = z.asUint64()

const a = new Uint<128>(b)
const a_native = a.asBigUint()
```

## New features

### Native mutable objects

```typescript
type Point = { x: uint64; y: uint64 }
const p: Point = { x: 1, y: 2 }
// or
const p: { x: uint64; y: uint64 } = { x: 1, y: 2 }
// or
const p = { x: Uint64(1), y: Uint64(2) }

p.x = 3
p.y = 4
```

### Native mutable arrays

The native TypeScript array is mutable and supports both arc4 and native types. You typically don't need to use an `arc4.DynamicArray` anymore.

```typescript
const a: Array<uint64> = [1, 2, 3]
// or
const a: uint64[] = [1, 2, 3]
// or
const a = [Uint64(1), Uint64(2), Uint64(3)]

a[0] = 10
a.push(4)
```

### New `FixedArray` type

A `FixedArray` type was added which has a fixed size, is mutable, and supports both arc4 and native types. You typically don't need to use an `arc4.StaticArray` anymore.

```typescript
const x = new FixedArray<uint64, 4>(1, 2, 3, 4)
x[0] = 0
```

### `Bytes` type now supports fixed size byte sequences

An optional length generic type argument has been added for declaring statically sized byte sequences.

The original unbounded `bytes` type without the length generic remains available and no changes are required unless you want to take advantage of the new feature.

The bytes type can also be declared with a length and an optional `strategy` parameter with valid options of `'assert-length'` or `'unsafe-cast'` (defaults to `'assert-length'`) to indicate if it should assert the length of the input versus an `unsafe` casting which doesn't verify the input length. Due to covariance a `bytes<N>` value can always be assigned to a `bytes` target but in order to do the opposite, you will need to call `.toFixed` on the unbounded value. This method takes the same options parameter with a length and an optional `strategy` properties.

```typescript
snapshotPublicKey = GlobalState<bytes<32>>()

const fromUtf8 = Bytes('abc', { length: 3 })

function padTo32(b: bytes<16>): bytes<32> {
  return b.bitwiseOr(bzero(32)).toFixed({ length: 32, strategy: 'unsafe-cast' })
}
```

### Number and bigint types can be used when declaring consts

We now support `number` and `bigint` literals when they are assigned to a `const` variable. Basic expressions are also allowed as long as they evaluate to a compile-time constant.

**Note:** `number` literals cannot exceed `Number.MAX_SAFE_INTEGER` as they will lose precision when parsed, but it is possible to write expressions that would evaluate to unsafe integers e.g. `2 ** 54`. This is because evaluation is handled by the compiler and performed using the `bigint` type.

```typescript
const x = 123
const y = x * 500
const a = 2n ** 128n
```

### Tuples can be stored in boxes, global and local state

```typescript
boxA = Box<[string, bytes]>({ key: Bytes('A') })
boxA.value = ['Hello', Bytes('World')]
```

### Box maps support composite key types

```typescript
boxMap = BoxMap<{ a: uint64; b: uint64 }, string>({ keyPrefix: '' })

boxMap({ a: 1, b: 2 }).value = 'test'
```

### `Box` supports direct bytes access via `extract`, `replace`, `resize`, and `splice` methods

`extract`, `replace`, `resize`, and `splice` methods were added to the `Box` type for direct access to box bytes.

**Note:** This enables direct manipulation of the bytes of any box, though it should be noted that mutations via this approach are not validated against the `Box` value type which could lead to box content being invalid for the expected type.

```typescript
boxMap = BoxMap<Account, StaticArray<Uint8, 4>>({ keyPrefix: '' })
const boxForCaller = this.boxMap(Txn.sender)

boxForCaller.create()

boxForCaller.replace(0, new Uint8(123).bytes)
```

### Inner transaction groups can be dynamically composed

The `itxnCompose` helper exposes three methods, `begin` and `next`, and `submit`. Multiple calls to `begin`, or calls to `next` that are not preceded by a `begin` will fail when executed on chain.

Use `GITxn` ops (e.g. `op.GITxn.lastLog(1)`) to read the result from any of these transactions.

```typescript
distribute(addresses: Address[], funds: gtxn.PaymentTxn, verifier: Application) {
  const share: uint64 = funds.amount / addresses.length
  const payFields = {
    type: TransactionType.Payment,
    amount: share,
    receiver: addresses[0].bytes,
  } satisfies PaymentComposeFields

  itxnCompose.begin(payFields)
  for (const i of urange(1, addresses.length)) {
    const addr = addresses[i]
    itxnCompose.next({
      ...payFields,

      receiver: addr.bytes,
    })
  }
  itxnCompose.next(VerifierContract.prototype.verify, {
    appId: verifier,
  })
  itxnCompose.next(
    itxn.assetConfig({
      assetName: 'abc',
    }),
  )

  itxnCompose.submit()
}
```

### `not` expressions are now supported on `match` and `assertMatch`

```typescript
assertMatch(xObj, { x: { not: 3 } }, 'x should not be 3')
assertMatch(Txn, { sender: { not: Global.zeroAddress } })
```

### `@readonly` decorator can be used instead of `@abimethod({ readonly: true })`

A new `@readonly` decorator has been added to provide a shorthand for `@abimethod({ readonly: true })`. Setting `readonly` flag via `@abimethod` decorator is still available to avoid needing multiple decorators when other options are also needed to be set e.g. `@arc4.abimethod({ allowActions: ['NoOp'], readonly: true })`.

```typescript
// use @abimethod decorator to set `readonly` flag
@abimethod({ readonly: true })
public getPreconditions(signature: bytes<64>): VotingPreconditions {
  ...
}

// or use @readonly decorator
@readonly
public getPreconditions(signature: bytes<64>): VotingPreconditions {
  ...
}
```

### `validateEncoding` option is added to `@abimethod` decorator

`validateEncoding` option controls validation behaviour for the method and has valid values of `"args"` and `"unsafe-disabled"`.

If `"args"`, then ABI arguments are validated automatically to ensure they are encoded correctly.
If `"unsafe-disabled"`, then no automatic validation occurs. Arguments can instead be validated using the validateEncoding(...) function.

The default behaviour of this option can be controlled with the --validate-abi-args CLI flag.

```typescript
class AbiValidationAlgo extends Contract {
  @abimethod({ validateEncoding: 'args' })
  withValidation(value: bytes<32>) {
    return value.length
  }

  @abimethod({ validateEncoding: 'unsafe-disabled' })
  withoutValidation(value: bytes<32>) {
    return value.length
  }

  // performs validation on `value` parameter by default
  defaultValidation(value: bytes<32>) {
    return value.length
  }
}
```

### `validateEncoding` function can be used to ensure the value is well-formed

It performs validation to ensure the value is well-formed and throws errors if it is not.

```typescript
class AbiValidationAlgo extends Contract {
  @abimethod({ validateEncoding: 'unsafe-disabled' })
  manualValidation(value: bytes<32>) {
    validateEncoding(value)
    return value.length
  }
}
```

### `--validate-abi-args` and `--validate-abi-return` CLI flags are added

- `--validate-abi-args`: validates ABI transaction arguments by ensuring they are encoded correctly.
- `--validate-abi-return`: validates encoding of ABI return values when using convertBytes with 'log' `prefix` option, `arc4.abiCall`, and strongly typed contract to contract calls.
