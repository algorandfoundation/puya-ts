---
title: getByte
type: function
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / getByte

# Function: getByte()

> **getByte**(`a`, `b`): [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [op.ts:973](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L973)

Bth byte of A, as an integer. If B is greater than or equal to the array length, the program fails

## Parameters

### a

[`bytes`](../../index/type-aliases/bytes.md)

### b

[`uint64`](../../index/type-aliases/uint64.md)

## Returns

[`uint64`](../../index/type-aliases/uint64.md)

## See

Native TEAL opcode: [`getbyte`](https://dev.algorand.co/reference/algorand-teal/opcodes#getbyte)
Min AVM version: 3
