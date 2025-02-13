[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [op](../README.md) / gaid

# Function: gaid()

> **gaid**(`a`): [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/op.ts:932](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/op.ts#L932)

ID of the asset or application created in the Ath transaction of the current group
`gaids` fails unless the requested transaction created an asset or application and A < GroupIndex.

## Parameters

### a

[`uint64`](../../../type-aliases/uint64.md)

## Returns

[`uint64`](../../../type-aliases/uint64.md)

## See

Native TEAL opcode: [`gaids`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#gaids)
Min AVM version: 4
