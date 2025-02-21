[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [op](../README.md) / mimc

# Function: mimc()

> **mimc**(`c`, `a`): [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/op.ts:3328](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L3328)

MiMC hash of scalars A, using curve and parameters specified by configuration C
A is a list of concatenated 32 byte big-endian unsigned integer scalars.  Fail if A's length is not a multiple of 32 or any element exceeds the curve modulus.
The MiMC hash function has known collisions since any input which is a multiple of the elliptic curve modulus will hash to the same value. MiMC is thus not a general purpose hash function, but meant to be used in zero knowledge applications to match a zk-circuit implementation.

## Parameters

### c

[`MimcConfigurations`](../enumerations/MimcConfigurations.md)

### a

[`bytes`](../../../type-aliases/bytes.md)

## Returns

[`bytes`](../../../type-aliases/bytes.md)

## See

Native TEAL opcode: [`mimc`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#mimc)
Min AVM version: 11
