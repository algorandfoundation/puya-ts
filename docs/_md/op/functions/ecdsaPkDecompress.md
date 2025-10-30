[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / ecdsaPkDecompress

# Function: ecdsaPkDecompress()

> **ecdsaPkDecompress**(`v`, `a`): readonly \[[`bytes`](../../index/type-aliases/bytes.md), [`bytes`](../../index/type-aliases/bytes.md)\]

Defined in: [packages/algo-ts/src/op.ts:830](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L830)

decompress pubkey A into components X, Y
The 33 byte public key in a compressed form to be decompressed into X and Y (top) components. All values are big-endian encoded.

## Parameters

### v

[`Ecdsa`](../enumerations/Ecdsa.md)

### a

[`bytes`](../../index/type-aliases/bytes.md)

## Returns

readonly \[[`bytes`](../../index/type-aliases/bytes.md), [`bytes`](../../index/type-aliases/bytes.md)\]

## See

Native TEAL opcode: [`ecdsa_pk_decompress`](https://dev.algorand.co/reference/algorand-teal/opcodes#ecdsa_pk_decompress)
Min AVM version: 5
