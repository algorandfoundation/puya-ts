---
title: Scratch
type: doc
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / Scratch

# Variable: Scratch

> `const` **Scratch**: `object`

Defined in: [op.ts:3346](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L3346)

Load or store scratch values

## Type declaration

### loadBytes()

> **loadBytes**(`a`): [`bytes`](../../index/type-aliases/bytes.md)

Ath scratch space value.  All scratch spaces are 0 at program start.

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

#### See

Native TEAL opcode: [`loads`](https://dev.algorand.co/reference/algorand-teal/opcodes#loads)
Min AVM version: 5

### loadUint64()

> **loadUint64**(`a`): [`uint64`](../../index/type-aliases/uint64.md)

Ath scratch space value.  All scratch spaces are 0 at program start.

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

#### See

Native TEAL opcode: [`loads`](https://dev.algorand.co/reference/algorand-teal/opcodes#loads)
Min AVM version: 5

### store()

> **store**(`a`, `b`): `void`

store B to the Ath scratch space

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

##### b

[`uint64`](../../index/type-aliases/uint64.md) | [`bytes`](../../index/type-aliases/bytes.md)

#### Returns

`void`

#### See

Native TEAL opcode: [`stores`](https://dev.algorand.co/reference/algorand-teal/opcodes#stores)
Min AVM version: 5
