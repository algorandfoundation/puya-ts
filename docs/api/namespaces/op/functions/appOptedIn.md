[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [op](../README.md) / appOptedIn

# Function: appOptedIn()

> **appOptedIn**(`a`, `b`): `boolean`

Defined in: [packages/algo-ts/src/op.ts:328](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/op.ts#L328)

1 if account A is opted in to application B, else 0

## Parameters

### a

[`uint64`](../../../type-aliases/uint64.md) | [`Account`](../../../type-aliases/Account.md)

### b

[`uint64`](../../../type-aliases/uint64.md) | [`Application`](../../../type-aliases/Application.md)

## Returns

`boolean`

1 if opted in and 0 otherwise.

## See

Native TEAL opcode: [`app_opted_in`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#app_opted_in)
Min AVM version: 2
