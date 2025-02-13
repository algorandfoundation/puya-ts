[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [op](../README.md) / divmodw

# Function: divmodw()

> **divmodw**(`a`, `b`, `c`, `d`): readonly \[[`uint64`](../../../type-aliases/uint64.md), [`uint64`](../../../type-aliases/uint64.md), [`uint64`](../../../type-aliases/uint64.md), [`uint64`](../../../type-aliases/uint64.md)\]

Defined in: [packages/algo-ts/src/op.ts:736](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/op.ts#L736)

W,X = (A,B / C,D); Y,Z = (A,B modulo C,D)
The notation J,K indicates that two uint64 values J and K are interpreted as a uint128 value, with J as the high uint64 and K the low.

## Parameters

### a

[`uint64`](../../../type-aliases/uint64.md)

### b

[`uint64`](../../../type-aliases/uint64.md)

### c

[`uint64`](../../../type-aliases/uint64.md)

### d

[`uint64`](../../../type-aliases/uint64.md)

## Returns

readonly \[[`uint64`](../../../type-aliases/uint64.md), [`uint64`](../../../type-aliases/uint64.md), [`uint64`](../../../type-aliases/uint64.md), [`uint64`](../../../type-aliases/uint64.md)\]

## See

Native TEAL opcode: [`divmodw`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#divmodw)
Min AVM version: 4
