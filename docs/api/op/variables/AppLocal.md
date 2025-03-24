[**@algorandfoundation/algorand-typescript**](../../README.md)

***

[@algorandfoundation/algorand-typescript](../../README.md) / [op](../README.md) / AppLocal

# Variable: AppLocal

> `const` **AppLocal**: `object`

Defined in: [packages/algo-ts/src/op.ts:255](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L255)

Get or modify Local app state

## Type declaration

### delete()

delete key B from account A's local state of the current application

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

##### b

[`bytes`](../../index/type-aliases/bytes.md)

#### Returns

`void`

#### See

Native TEAL opcode: [`app_local_del`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#app_local_del)
Min AVM version: 2

### getBytes()

local state of the key B in the current application in account A

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

##### b

[`bytes`](../../index/type-aliases/bytes.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

value. The value is zero (of type uint64) if the key does not exist.

#### See

Native TEAL opcode: [`app_local_get`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#app_local_get)
Min AVM version: 2

### getExBytes()

X is the local state of application B, key C in account A. Y is 1 if key existed, else 0

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

##### b

[`uint64`](../../index/type-aliases/uint64.md) | [`Application`](../../index/type-aliases/Application.md)

##### c

[`bytes`](../../index/type-aliases/bytes.md)

#### Returns

readonly \[[`bytes`](../../index/type-aliases/bytes.md), `boolean`\]

did_exist flag (top of the stack, 1 if the application and key existed and 0 otherwise), value. The value is zero (of type uint64) if the key does not exist.

#### See

Native TEAL opcode: [`app_local_get_ex`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#app_local_get_ex)
Min AVM version: 2

### getExUint64()

X is the local state of application B, key C in account A. Y is 1 if key existed, else 0

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

##### b

[`uint64`](../../index/type-aliases/uint64.md) | [`Application`](../../index/type-aliases/Application.md)

##### c

[`bytes`](../../index/type-aliases/bytes.md)

#### Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

did_exist flag (top of the stack, 1 if the application and key existed and 0 otherwise), value. The value is zero (of type uint64) if the key does not exist.

#### See

Native TEAL opcode: [`app_local_get_ex`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#app_local_get_ex)
Min AVM version: 2

### getUint64()

local state of the key B in the current application in account A

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

##### b

[`bytes`](../../index/type-aliases/bytes.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

value. The value is zero (of type uint64) if the key does not exist.

#### See

Native TEAL opcode: [`app_local_get`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#app_local_get)
Min AVM version: 2

### put()

write C to key B in account A's local state of the current application

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

##### b

[`bytes`](../../index/type-aliases/bytes.md)

##### c

[`uint64`](../../index/type-aliases/uint64.md) | [`bytes`](../../index/type-aliases/bytes.md)

#### Returns

`void`

#### See

Native TEAL opcode: [`app_local_put`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#app_local_put)
Min AVM version: 2
