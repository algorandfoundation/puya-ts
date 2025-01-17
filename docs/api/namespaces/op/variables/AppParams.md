[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [op](../README.md) / AppParams

# Variable: AppParams

> `const` **AppParams**: `object`

Defined in: [packages/algo-ts/src/op.ts:331](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/op.ts#L331)

## Type declaration

### appAddress()

Address for which this application has authority
Min AVM version: 5

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md) | [`Application`](../../../type-aliases/Application.md)

#### Returns

readonly \[[`Account`](../../../type-aliases/Account.md), `boolean`\]

### appApprovalProgram()

Bytecode of Approval Program
Min AVM version: 5

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md) | [`Application`](../../../type-aliases/Application.md)

#### Returns

readonly \[[`bytes`](../../../type-aliases/bytes.md), `boolean`\]

### appClearStateProgram()

Bytecode of Clear State Program
Min AVM version: 5

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md) | [`Application`](../../../type-aliases/Application.md)

#### Returns

readonly \[[`bytes`](../../../type-aliases/bytes.md), `boolean`\]

### appCreator()

Creator address
Min AVM version: 5

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md) | [`Application`](../../../type-aliases/Application.md)

#### Returns

readonly \[[`Account`](../../../type-aliases/Account.md), `boolean`\]

### appExtraProgramPages()

Number of Extra Program Pages of code space
Min AVM version: 5

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md) | [`Application`](../../../type-aliases/Application.md)

#### Returns

readonly \[[`uint64`](../../../type-aliases/uint64.md), `boolean`\]

### appGlobalNumByteSlice()

Number of byte array values allowed in Global State
Min AVM version: 5

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md) | [`Application`](../../../type-aliases/Application.md)

#### Returns

readonly \[[`uint64`](../../../type-aliases/uint64.md), `boolean`\]

### appGlobalNumUint()

Number of uint64 values allowed in Global State
Min AVM version: 5

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md) | [`Application`](../../../type-aliases/Application.md)

#### Returns

readonly \[[`uint64`](../../../type-aliases/uint64.md), `boolean`\]

### appLocalNumByteSlice()

Number of byte array values allowed in Local State
Min AVM version: 5

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md) | [`Application`](../../../type-aliases/Application.md)

#### Returns

readonly \[[`uint64`](../../../type-aliases/uint64.md), `boolean`\]

### appLocalNumUint()

Number of uint64 values allowed in Local State
Min AVM version: 5

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md) | [`Application`](../../../type-aliases/Application.md)

#### Returns

readonly \[[`uint64`](../../../type-aliases/uint64.md), `boolean`\]
