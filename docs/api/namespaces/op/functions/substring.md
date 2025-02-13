[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [op](../README.md) / substring

# Function: substring()

> **substring**(`a`, `b`, `c`): [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/op.ts:3439](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/op.ts#L3439)

A range of bytes from A starting at B up to but not including C. If C < B, or either is larger than the array length, the program fails

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

Native TEAL opcode: [`substring3`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#substring3)
Min AVM version: 2
