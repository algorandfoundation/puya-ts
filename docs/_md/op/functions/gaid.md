---
title: gaid
type: function
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / gaid

# Function: gaid()

> **gaid**(`a`): [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [op.ts:954](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L954)

ID of the asset or application created in the Ath transaction of the current group
`gaids` fails unless the requested transaction created an asset or application and A < GroupIndex.

## Parameters

### a

[`uint64`](../../index/type-aliases/uint64.md)

## Returns

[`uint64`](../../index/type-aliases/uint64.md)

## See

Native TEAL opcode: [`gaids`](https://dev.algorand.co/reference/algorand-teal/opcodes#gaids)
Min AVM version: 4
