[**@algorandfoundation/algorand-typescript**](../../README.md)

***

[@algorandfoundation/algorand-typescript](../../README.md) / [op](../README.md) / AppGlobal

# Variable: AppGlobal

> `const` **AppGlobal**: `object`

Defined in: [packages/algo-ts/src/op.ts:186](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L186)

Get or modify Global app state

## Type declaration

### delete()

delete key A from the global state of the current application

#### Parameters

##### a

[`bytes`](../../index/type-aliases/bytes.md)

#### Returns

`void`

#### See

Native TEAL opcode: [`app_global_del`](https://dev.algorand.co/reference/algorand-teal/opcodes#app_global_del)
Min AVM version: 2

### getBytes()

global state of the key A in the current application

#### Parameters

##### a

[`bytes`](../../index/type-aliases/bytes.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

value. The value is zero (of type uint64) if the key does not exist.

#### See

Native TEAL opcode: [`app_global_get`](https://dev.algorand.co/reference/algorand-teal/opcodes#app_global_get)
Min AVM version: 2

### getExBytes()

X is the global state of application A, key B. Y is 1 if key existed, else 0

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Application`](../../index/type-aliases/Application.md)

##### b

[`bytes`](../../index/type-aliases/bytes.md)

#### Returns

readonly \[[`bytes`](../../index/type-aliases/bytes.md), `boolean`\]

did_exist flag (top of the stack, 1 if the application and key existed and 0 otherwise), value. The value is zero (of type uint64) if the key does not exist.

#### See

Native TEAL opcode: [`app_global_get_ex`](https://dev.algorand.co/reference/algorand-teal/opcodes#app_global_get_ex)
Min AVM version: 2

### getExUint64()

X is the global state of application A, key B. Y is 1 if key existed, else 0

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Application`](../../index/type-aliases/Application.md)

##### b

[`bytes`](../../index/type-aliases/bytes.md)

#### Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

did_exist flag (top of the stack, 1 if the application and key existed and 0 otherwise), value. The value is zero (of type uint64) if the key does not exist.

#### See

Native TEAL opcode: [`app_global_get_ex`](https://dev.algorand.co/reference/algorand-teal/opcodes#app_global_get_ex)
Min AVM version: 2

### getUint64()

global state of the key A in the current application

#### Parameters

##### a

[`bytes`](../../index/type-aliases/bytes.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

value. The value is zero (of type uint64) if the key does not exist.

#### See

Native TEAL opcode: [`app_global_get`](https://dev.algorand.co/reference/algorand-teal/opcodes#app_global_get)
Min AVM version: 2

### put()

write B to key A in the global state of the current application

#### Parameters

##### a

[`bytes`](../../index/type-aliases/bytes.md)

##### b

[`uint64`](../../index/type-aliases/uint64.md) | [`bytes`](../../index/type-aliases/bytes.md)

#### Returns

`void`

#### See

Native TEAL opcode: [`app_global_put`](https://dev.algorand.co/reference/algorand-teal/opcodes#app_global_put)
Min AVM version: 2
