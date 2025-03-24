[**@algorandfoundation/algorand-typescript**](../../README.md)

***

[@algorandfoundation/algorand-typescript](../../README.md) / [op](../README.md) / concat

# Function: concat()

> **concat**(`a`, `b`): [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/op.ts:727](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L727)

join A and B
`concat` fails if the result would be greater than 4096 bytes.

## Parameters

### a

[`bytes`](../../index/type-aliases/bytes.md)

### b

[`bytes`](../../index/type-aliases/bytes.md)

## Returns

[`bytes`](../../index/type-aliases/bytes.md)

## See

Native TEAL opcode: [`concat`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#concat)
Min AVM version: 2
