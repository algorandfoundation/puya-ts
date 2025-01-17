[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [op](../README.md) / divw

# Function: divw()

> **divw**(`a`, `b`, `c`): [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/op.ts:746](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/op.ts#L746)

A,B / C. Fail if C == 0 or if result overflows.
The notation A,B indicates that A and B are interpreted as a uint128 value, with A as the high uint64 and B the low.

## Parameters

### a

[`uint64`](../../../type-aliases/uint64.md)

### b

[`uint64`](../../../type-aliases/uint64.md)

### c

[`uint64`](../../../type-aliases/uint64.md)

## Returns

[`uint64`](../../../type-aliases/uint64.md)

## See

Native TEAL opcode: [`divw`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#divw)
Min AVM version: 6
