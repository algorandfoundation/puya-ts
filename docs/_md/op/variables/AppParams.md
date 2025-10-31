---
title: AppParams
type: doc
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / AppParams

# Variable: AppParams

> `const` **AppParams**: `object`

Defined in: [op.ts:332](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L332)

## Type declaration

### appAddress()

> **appAddress**(`a`): readonly \[[`Account`](../../index/type-aliases/Account.md), `boolean`\]

Address for which this application has authority
Min AVM version: 5

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Application`](../../index/type-aliases/Application.md)

#### Returns

readonly \[[`Account`](../../index/type-aliases/Account.md), `boolean`\]

### appApprovalProgram()

> **appApprovalProgram**(`a`): readonly \[[`bytes`](../../index/type-aliases/bytes.md), `boolean`\]

Bytecode of Approval Program
Min AVM version: 5

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Application`](../../index/type-aliases/Application.md)

#### Returns

readonly \[[`bytes`](../../index/type-aliases/bytes.md), `boolean`\]

### appClearStateProgram()

> **appClearStateProgram**(`a`): readonly \[[`bytes`](../../index/type-aliases/bytes.md), `boolean`\]

Bytecode of Clear State Program
Min AVM version: 5

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Application`](../../index/type-aliases/Application.md)

#### Returns

readonly \[[`bytes`](../../index/type-aliases/bytes.md), `boolean`\]

### appCreator()

> **appCreator**(`a`): readonly \[[`Account`](../../index/type-aliases/Account.md), `boolean`\]

Creator address
Min AVM version: 5

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Application`](../../index/type-aliases/Application.md)

#### Returns

readonly \[[`Account`](../../index/type-aliases/Account.md), `boolean`\]

### appExtraProgramPages()

> **appExtraProgramPages**(`a`): readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

Number of Extra Program Pages of code space
Min AVM version: 5

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Application`](../../index/type-aliases/Application.md)

#### Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

### appGlobalNumByteSlice()

> **appGlobalNumByteSlice**(`a`): readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

Number of byte array values allowed in Global State
Min AVM version: 5

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Application`](../../index/type-aliases/Application.md)

#### Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

### appGlobalNumUint()

> **appGlobalNumUint**(`a`): readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

Number of uint64 values allowed in Global State
Min AVM version: 5

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Application`](../../index/type-aliases/Application.md)

#### Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

### appLocalNumByteSlice()

> **appLocalNumByteSlice**(`a`): readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

Number of byte array values allowed in Local State
Min AVM version: 5

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Application`](../../index/type-aliases/Application.md)

#### Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

### appLocalNumUint()

> **appLocalNumUint**(`a`): readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

Number of uint64 values allowed in Local State
Min AVM version: 5

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Application`](../../index/type-aliases/Application.md)

#### Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

### appVersion()

> **appVersion**(`a`): readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

Version of the app, incremented each time the approval or clear program changes
Min AVM version: 12

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Application`](../../index/type-aliases/Application.md)

#### Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]
