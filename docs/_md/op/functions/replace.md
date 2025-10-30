[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / replace

# Function: replace()

> **replace**(`a`, `b`, `c`): [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/op.ts:3368](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L3368)

Copy of A with the bytes starting at B replaced by the bytes of C. Fails if B+len(C) exceeds len(A)
`replace3` can be called using `replace` with no immediates.

## Parameters

### a

[`bytes`](../../index/type-aliases/bytes.md)

### b

[`uint64`](../../index/type-aliases/uint64.md)

### c

[`bytes`](../../index/type-aliases/bytes.md)

## Returns

[`bytes`](../../index/type-aliases/bytes.md)

## See

Native TEAL opcode: [`replace3`](https://dev.algorand.co/reference/algorand-teal/opcodes#replace3)
Min AVM version: 7
