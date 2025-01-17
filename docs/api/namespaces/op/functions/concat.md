[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [op](../README.md) / concat

# Function: concat()

> **concat**(`a`, `b`): [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/op.ts:726](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/op.ts#L726)

join A and B
`concat` fails if the result would be greater than 4096 bytes.

## Parameters

### a

[`bytes`](../../../type-aliases/bytes.md)

### b

[`bytes`](../../../type-aliases/bytes.md)

## Returns

[`bytes`](../../../type-aliases/bytes.md)

## See

Native TEAL opcode: [`concat`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#concat)
Min AVM version: 2
