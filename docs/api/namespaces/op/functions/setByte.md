[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [op](../README.md) / setByte

# Function: setByte()

> **setByte**(`a`, `b`, `c`): [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/op.ts:3376](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/op.ts#L3376)

Copy of A with the Bth byte set to small integer (between 0..255) C. If B is greater than or equal to the array length, the program fails

## Parameters

### a

[`bytes`](../../../type-aliases/bytes.md)

### b

[`uint64`](../../../type-aliases/uint64.md)

### c

[`uint64`](../../../type-aliases/uint64.md)

## Returns

[`bytes`](../../../type-aliases/bytes.md)

## See

Native TEAL opcode: [`setbyte`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#setbyte)
Min AVM version: 3
