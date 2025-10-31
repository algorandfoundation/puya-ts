---
title: divw
type: function
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / divw

# Function: divw()

> **divw**(`a`, `b`, `c`): [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [op.ts:755](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L755)

A,B / C. Fail if C == 0 or if result overflows.
The notation A,B indicates that A and B are interpreted as a uint128 value, with A as the high uint64 and B the low.

## Parameters

### a

[`uint64`](../../index/type-aliases/uint64.md)

### b

[`uint64`](../../index/type-aliases/uint64.md)

### c

[`uint64`](../../index/type-aliases/uint64.md)

## Returns

[`uint64`](../../index/type-aliases/uint64.md)

## See

Native TEAL opcode: [`divw`](https://dev.algorand.co/reference/algorand-teal/opcodes#divw)
Min AVM version: 6
