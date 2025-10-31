---
title: divmodw
type: function
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / divmodw

# Function: divmodw()

> **divmodw**(`a`, `b`, `c`, `d`): readonly \[[`uint64`](../../index/type-aliases/uint64.md), [`uint64`](../../index/type-aliases/uint64.md), [`uint64`](../../index/type-aliases/uint64.md), [`uint64`](../../index/type-aliases/uint64.md)\]

Defined in: [op.ts:745](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L745)

W,X = (A,B / C,D); Y,Z = (A,B modulo C,D)
The notation J,K indicates that two uint64 values J and K are interpreted as a uint128 value, with J as the high uint64 and K the low.

## Parameters

### a

[`uint64`](../../index/type-aliases/uint64.md)

### b

[`uint64`](../../index/type-aliases/uint64.md)

### c

[`uint64`](../../index/type-aliases/uint64.md)

### d

[`uint64`](../../index/type-aliases/uint64.md)

## Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), [`uint64`](../../index/type-aliases/uint64.md), [`uint64`](../../index/type-aliases/uint64.md), [`uint64`](../../index/type-aliases/uint64.md)\]

## See

Native TEAL opcode: [`divmodw`](https://dev.algorand.co/reference/algorand-teal/opcodes#divmodw)
Min AVM version: 4
