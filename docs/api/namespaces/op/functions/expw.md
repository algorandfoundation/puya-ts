[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [op](../README.md) / expw

# Function: expw()

> **expw**(`a`, `b`): readonly \[[`uint64`](../../../type-aliases/uint64.md), [`uint64`](../../../type-aliases/uint64.md)\]

Defined in: [packages/algo-ts/src/op.ts:886](https://github.com/algorandfoundation/puya-ts/blob/14c9827d80da81ff08b4923e997ba22be04aa0db/packages/algo-ts/src/op.ts#L886)

A raised to the Bth power as a 128-bit result in two uint64s. X is the high 64 bits, Y is the low. Fail if A == B == 0 or if the results exceeds 2^128-1

## Parameters

### a

[`uint64`](../../../type-aliases/uint64.md)

### b

[`uint64`](../../../type-aliases/uint64.md)

## Returns

readonly \[[`uint64`](../../../type-aliases/uint64.md), [`uint64`](../../../type-aliases/uint64.md)\]

## See

Native TEAL opcode: [`expw`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#expw)
Min AVM version: 4
