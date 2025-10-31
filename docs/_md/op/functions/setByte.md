---
title: setByte
type: function
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / setByte

# Function: setByte()

> **setByte**(`a`, `b`, `c`): [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [op.ts:3430](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L3430)

Copy of A with the Bth byte set to small integer (between 0..255) C. If B is greater than or equal to the array length, the program fails

## Parameters

### a

[`bytes`](../../index/type-aliases/bytes.md)

### b

[`uint64`](../../index/type-aliases/uint64.md)

### c

[`uint64`](../../index/type-aliases/uint64.md)

## Returns

[`bytes`](../../index/type-aliases/bytes.md)

## See

Native TEAL opcode: [`setbyte`](https://dev.algorand.co/reference/algorand-teal/opcodes#setbyte)
Min AVM version: 3
