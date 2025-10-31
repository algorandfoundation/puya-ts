---
title: extract
type: function
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / extract

# Function: extract()

## Call Signature

> **extract**(`a`, `b`): [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [op.ts:4094](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L4094)

A range of bytes from A starting at B up to the end of the sequence

### Parameters

#### a

[`bytes`](../../index/type-aliases/bytes.md)

#### b

[`uint64`](../../index/type-aliases/uint64.md)

### Returns

[`bytes`](../../index/type-aliases/bytes.md)

## Call Signature

> **extract**(`a`, `b`, `c`): [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [op.ts:4099](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L4099)

A range of bytes from A starting at B up to but not including B+C. If B+C is larger than the array length, the program fails

### Parameters

#### a

[`bytes`](../../index/type-aliases/bytes.md)

#### b

[`uint64`](../../index/type-aliases/uint64.md)

#### c

[`uint64`](../../index/type-aliases/uint64.md)

### Returns

[`bytes`](../../index/type-aliases/bytes.md)
