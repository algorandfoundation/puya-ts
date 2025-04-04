[**@algorandfoundation/algorand-typescript**](../../README.md)

***

[@algorandfoundation/algorand-typescript](../../README.md) / [op](../README.md) / btoi

# Function: btoi()

> **btoi**(`a`): [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/op.ts:708](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L708)

converts big-endian byte array A to uint64. Fails if len(A) > 8. Padded by leading 0s if len(A) < 8.
`btoi` fails if the input is longer than 8 bytes.

## Parameters

### a

[`bytes`](../../index/type-aliases/bytes.md)

## Returns

[`uint64`](../../index/type-aliases/uint64.md)

## See

Native TEAL opcode: [`btoi`](https://dev.algorand.co/reference/algorand-teal/opcodes#btoi)
Min AVM version: 1
