[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / appOptedIn

# Function: appOptedIn()

> **appOptedIn**(`a`, `b`): `boolean`

Defined in: [packages/algo-ts/src/op.ts:329](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L329)

1 if account A is opted in to application B, else 0

## Parameters

### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

### b

[`uint64`](../../index/type-aliases/uint64.md) | [`Application`](../../index/type-aliases/Application.md)

## Returns

`boolean`

1 if opted in and 0 otherwise.

## See

Native TEAL opcode: [`app_opted_in`](https://dev.algorand.co/reference/algorand-teal/opcodes#app_opted_in)
Min AVM version: 2
