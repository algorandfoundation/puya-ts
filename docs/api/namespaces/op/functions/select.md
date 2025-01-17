[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [op](../README.md) / select

# Function: select()

## Call Signature

> **select**(`a`, `b`, `c`): [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/op.ts:4045](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/op.ts#L4045)

selects one of two values based on top-of-stack: B if C != 0, else A

### Parameters

#### a

[`bytes`](../../../type-aliases/bytes.md)

#### b

[`bytes`](../../../type-aliases/bytes.md)

#### c

[`uint64`](../../../type-aliases/uint64.md)

### Returns

[`bytes`](../../../type-aliases/bytes.md)

## Call Signature

> **select**(`a`, `b`, `c`): [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/op.ts:4050](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/op.ts#L4050)

selects one of two values based on top-of-stack: B if C != 0, else A

### Parameters

#### a

[`uint64`](../../../type-aliases/uint64.md)

#### b

[`uint64`](../../../type-aliases/uint64.md)

#### c

[`uint64`](../../../type-aliases/uint64.md)

### Returns

[`uint64`](../../../type-aliases/uint64.md)
