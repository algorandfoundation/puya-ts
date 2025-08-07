# Migrating Algorand TypeScript beta to 1.0

## Breaking changes

### Object literals are mutable by default

Object literals are now mutable by default which can be leveraged without any changes.
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

Native arrays are now mutable by default which can be leveraged without any changes.
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
const a = new arc4.StaticArray<UintN64, 3>(new UintN64(1), new UintN64(2), new UintN64(3))
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

A `FixedArray` type was added which has a fixed sized, is mutable and supports both arc4 and native types. You typically don't need to use an `arc4.StaticArray` anymore.

```typescript
const x = new FixedArray<uint64, 4>(1, 2, 3, 4)
x[0] = 0
```

### `Bytes` type now supports fixed size byte sequences

An optional length generic type argument has been added for declaring statically sized byte sequences.

The original unbounded `bytes` type without the length generic remains available and no changes are required unless you want to take advantage of the new feature.

Due to covariance a `bytes<N>` value can always be assigned to a `bytes` target but in order to do the opposite, you will need to call `.toFixed` on the unbounded value. This method takes a length and an optional boolean `checked` (defaults to `true`) option to indicate if this conversion should be _checked_ at runtime (via asserting the length) versus an `unchecked` conversion which changes the type but doesn't verify the length.

```typescript
snapshotPublicKey = GlobalState<bytes<32>>()

const fromUtf8 = Bytes<3>('abc')

function padTo32(b: bytes<16>): bytes<32> {
  return b.bitwiseOr(bzero(32)).toFixed({ length: 32, checked: false })
}
```

### Number and bigint types can be used when declaring consts

We now support `number` and `bigint` literals when they are assigned to a `const` variable. Basic expressions are also allowed as long as they evaluate to a compile-time constant.

**Note:** `number` literals cannot exceed `Number.MAX_SAFE_INTEGER` as they will lose precision when parsed, but it is possible to write expressions that would evaluate to unsafe integers eg. `2 ** 54`. This is because evaluation is handled by the compiler and performed using the `bigint` type.

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

### `Box` supports direct bytes access

A `ref` property was added to the `Box` type for direct access to box bytes.

**Note:** This enables direct manipulation of the bytes of any box, though it should be noted that mutations via this approach are not validated against the `Box` value type which could lead to box content being invalid for the expected type.

```typescript
boxMap = BoxMap<Account, StaticArray<UintN8, 4>>({ keyPrefix: '' })
const boxForCaller = this.boxMap(Txn.sender)

boxForCaller.create()

const boxRef = boxForCaller.ref

boxRef.replace(0, new UintN8(123).bytes)
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
