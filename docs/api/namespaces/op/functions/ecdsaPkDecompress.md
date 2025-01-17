[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [op](../README.md) / ecdsaPkDecompress

# Function: ecdsaPkDecompress()

> **ecdsaPkDecompress**(`v`, `a`): readonly \[[`bytes`](../../../type-aliases/bytes.md), [`bytes`](../../../type-aliases/bytes.md)\]

Defined in: [packages/algo-ts/src/op.ts:829](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/op.ts#L829)

decompress pubkey A into components X, Y
The 33 byte public key in a compressed form to be decompressed into X and Y (top) components. All values are big-endian encoded.

## Parameters

### v

[`Ecdsa`](../enumerations/Ecdsa.md)

### a

[`bytes`](../../../type-aliases/bytes.md)

## Returns

readonly \[[`bytes`](../../../type-aliases/bytes.md), [`bytes`](../../../type-aliases/bytes.md)\]

## See

Native TEAL opcode: [`ecdsa_pk_decompress`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#ecdsa_pk_decompress)
Min AVM version: 5
