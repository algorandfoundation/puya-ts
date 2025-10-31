---
title: mulw
type: function
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / mulw

# Function: mulw()

> **mulw**(`a`, `b`): readonly \[[`uint64`](../../index/type-aliases/uint64.md), [`uint64`](../../index/type-aliases/uint64.md)\]

Defined in: [op.ts:3402](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L3402)

A times B as a 128-bit result in two uint64s. X is the high 64 bits, Y is the low

## Parameters

### a

[`uint64`](../../index/type-aliases/uint64.md)

### b

[`uint64`](../../index/type-aliases/uint64.md)

## Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), [`uint64`](../../index/type-aliases/uint64.md)\]

## See

Native TEAL opcode: [`mulw`](https://dev.algorand.co/reference/algorand-teal/opcodes#mulw)
Min AVM version: 1
