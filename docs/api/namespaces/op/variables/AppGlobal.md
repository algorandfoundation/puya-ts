[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [op](../README.md) / AppGlobal

# Variable: AppGlobal

> `const` **AppGlobal**: `object`

Defined in: [packages/algo-ts/src/op.ts:185](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L185)

Get or modify Global app state

## Type declaration

### delete()

delete key A from the global state of the current application

#### Parameters

##### a

[`bytes`](../../../type-aliases/bytes.md)

#### Returns

`void`

#### See

Native TEAL opcode: [`app_global_del`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#app_global_del)
Min AVM version: 2

### getBytes()

global state of the key A in the current application

#### Parameters

##### a

[`bytes`](../../../type-aliases/bytes.md)

#### Returns

[`bytes`](../../../type-aliases/bytes.md)

value. The value is zero (of type uint64) if the key does not exist.

#### See

Native TEAL opcode: [`app_global_get`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#app_global_get)
Min AVM version: 2

### getExBytes()

X is the global state of application A, key B. Y is 1 if key existed, else 0

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md) | [`Application`](../../../type-aliases/Application.md)

##### b

[`bytes`](../../../type-aliases/bytes.md)

#### Returns

readonly \[[`bytes`](../../../type-aliases/bytes.md), `boolean`\]

did_exist flag (top of the stack, 1 if the application and key existed and 0 otherwise), value. The value is zero (of type uint64) if the key does not exist.

#### See

Native TEAL opcode: [`app_global_get_ex`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#app_global_get_ex)
Min AVM version: 2

### getExUint64()

X is the global state of application A, key B. Y is 1 if key existed, else 0

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md) | [`Application`](../../../type-aliases/Application.md)

##### b

[`bytes`](../../../type-aliases/bytes.md)

#### Returns

readonly \[[`uint64`](../../../type-aliases/uint64.md), `boolean`\]

did_exist flag (top of the stack, 1 if the application and key existed and 0 otherwise), value. The value is zero (of type uint64) if the key does not exist.

#### See

Native TEAL opcode: [`app_global_get_ex`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#app_global_get_ex)
Min AVM version: 2

### getUint64()

global state of the key A in the current application

#### Parameters

##### a

[`bytes`](../../../type-aliases/bytes.md)

#### Returns

[`uint64`](../../../type-aliases/uint64.md)

value. The value is zero (of type uint64) if the key does not exist.

#### See

Native TEAL opcode: [`app_global_get`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#app_global_get)
Min AVM version: 2

### put()

write B to key A in the global state of the current application

#### Parameters

##### a

[`bytes`](../../../type-aliases/bytes.md)

##### b

[`uint64`](../../../type-aliases/uint64.md) | [`bytes`](../../../type-aliases/bytes.md)

#### Returns

`void`

#### See

Native TEAL opcode: [`app_global_put`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#app_global_put)
Min AVM version: 2
