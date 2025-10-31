---
title: AppLocal
type: doc
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / AppLocal

# Variable: AppLocal

> `const` **AppLocal**: `object`

Defined in: [op.ts:255](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L255)

Get or modify Local app state

## Type declaration

### delete()

> **delete**(`a`, `b`): `void`

delete key B from account A's local state of the current application

#### Parameters

##### a

Txn.Accounts offset (or, since v4, an _available_ account address), state key.
Deleting a key which is already absent has no effect on the application local state. (In particular, it does _not_ cause the program to fail.)

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

##### b

[`bytes`](../../index/type-aliases/bytes.md)

#### Returns

`void`

#### See

Native TEAL opcode: [`app_local_del`](https://dev.algorand.co/reference/algorand-teal/opcodes#app_local_del)
Min AVM version: 2

### getBytes()

> **getBytes**(`a`, `b`): [`bytes`](../../index/type-aliases/bytes.md)

local state of the key B in the current application in account A

#### Parameters

##### a

Txn.Accounts offset (or, since v4, an _available_ account address), state key.

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

##### b

[`bytes`](../../index/type-aliases/bytes.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

value. The value is zero (of type uint64) if the key does not exist.

#### See

Native TEAL opcode: [`app_local_get`](https://dev.algorand.co/reference/algorand-teal/opcodes#app_local_get)
Min AVM version: 2

### getExBytes()

> **getExBytes**(`a`, `b`, `c`): readonly \[[`bytes`](../../index/type-aliases/bytes.md), `boolean`\]

X is the local state of application B, key C in account A. Y is 1 if key existed, else 0

#### Parameters

##### a

Txn.Accounts offset (or, since v4, an _available_ account address), _available_ application id (or, since v4, a Txn.ForeignApps offset), state key.

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

##### b

[`uint64`](../../index/type-aliases/uint64.md) | [`Application`](../../index/type-aliases/Application.md)

##### c

[`bytes`](../../index/type-aliases/bytes.md)

#### Returns

readonly \[[`bytes`](../../index/type-aliases/bytes.md), `boolean`\]

did_exist flag (top of the stack, 1 if the application and key existed and 0 otherwise), value. The value is zero (of type uint64) if the key does not exist.

#### See

Native TEAL opcode: [`app_local_get_ex`](https://dev.algorand.co/reference/algorand-teal/opcodes#app_local_get_ex)
Min AVM version: 2

### getExUint64()

> **getExUint64**(`a`, `b`, `c`): readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

X is the local state of application B, key C in account A. Y is 1 if key existed, else 0

#### Parameters

##### a

Txn.Accounts offset (or, since v4, an _available_ account address), _available_ application id (or, since v4, a Txn.ForeignApps offset), state key.

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

##### b

[`uint64`](../../index/type-aliases/uint64.md) | [`Application`](../../index/type-aliases/Application.md)

##### c

[`bytes`](../../index/type-aliases/bytes.md)

#### Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

did_exist flag (top of the stack, 1 if the application and key existed and 0 otherwise), value. The value is zero (of type uint64) if the key does not exist.

#### See

Native TEAL opcode: [`app_local_get_ex`](https://dev.algorand.co/reference/algorand-teal/opcodes#app_local_get_ex)
Min AVM version: 2

### getUint64()

> **getUint64**(`a`, `b`): [`uint64`](../../index/type-aliases/uint64.md)

local state of the key B in the current application in account A

#### Parameters

##### a

Txn.Accounts offset (or, since v4, an _available_ account address), state key.

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

##### b

[`bytes`](../../index/type-aliases/bytes.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

value. The value is zero (of type uint64) if the key does not exist.

#### See

Native TEAL opcode: [`app_local_get`](https://dev.algorand.co/reference/algorand-teal/opcodes#app_local_get)
Min AVM version: 2

### put()

> **put**(`a`, `b`, `c`): `void`

write C to key B in account A's local state of the current application

#### Parameters

##### a

Txn.Accounts offset (or, since v4, an _available_ account address), state key, value.

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

##### b

[`bytes`](../../index/type-aliases/bytes.md)

##### c

[`uint64`](../../index/type-aliases/uint64.md) | [`bytes`](../../index/type-aliases/bytes.md)

#### Returns

`void`

#### See

Native TEAL opcode: [`app_local_put`](https://dev.algorand.co/reference/algorand-teal/opcodes#app_local_put)
Min AVM version: 2
