[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / select

# Function: select()

## Call Signature

> **select**(`a`, `b`, `c`): [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/op.ts:4046](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L4046)

selects one of two values based on top-of-stack: B if C != 0, else A

### Parameters

#### a

[`bytes`](../../index/type-aliases/bytes.md)

#### b

[`bytes`](../../index/type-aliases/bytes.md)

#### c

[`uint64`](../../index/type-aliases/uint64.md)

### Returns

[`bytes`](../../index/type-aliases/bytes.md)

## Call Signature

> **select**(`a`, `b`, `c`): [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/op.ts:4051](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L4051)

selects one of two values based on top-of-stack: B if C != 0, else A

### Parameters

#### a

[`uint64`](../../index/type-aliases/uint64.md)

#### b

[`uint64`](../../index/type-aliases/uint64.md)

#### c

[`uint64`](../../index/type-aliases/uint64.md)

### Returns

[`uint64`](../../index/type-aliases/uint64.md)
