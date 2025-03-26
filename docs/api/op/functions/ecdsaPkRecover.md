[**@algorandfoundation/algorand-typescript**](../../README.md)

***

[@algorandfoundation/algorand-typescript](../../README.md) / [op](../README.md) / ecdsaPkRecover

# Function: ecdsaPkRecover()

> **ecdsaPkRecover**(`v`, `a`, `b`, `c`, `d`): readonly \[[`bytes`](../../index/type-aliases/bytes.md), [`bytes`](../../index/type-aliases/bytes.md)\]

Defined in: [packages/algo-ts/src/op.ts:840](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L840)

for (data A, recovery id B, signature C, D) recover a public key
S (top) and R elements of a signature, recovery id and data (bottom) are expected on the stack and used to deriver a public key. All values are big-endian encoded. The signed data must be 32 bytes long.

## Parameters

### v

[`Ecdsa`](../enumerations/Ecdsa.md)

### a

[`bytes`](../../index/type-aliases/bytes.md)

### b

[`uint64`](../../index/type-aliases/uint64.md)

### c

[`bytes`](../../index/type-aliases/bytes.md)

### d

[`bytes`](../../index/type-aliases/bytes.md)

## Returns

readonly \[[`bytes`](../../index/type-aliases/bytes.md), [`bytes`](../../index/type-aliases/bytes.md)\]

## See

Native TEAL opcode: [`ecdsa_pk_recover`](https://dev.algorand.co/reference/algorand-teal/opcodes#ecdsa_pk_recover)
Min AVM version: 5
