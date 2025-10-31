---
title: AssetHolding
type: doc
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / AssetHolding

# Variable: AssetHolding

> `const` **AssetHolding**: `object`

Defined in: [op.ts:422](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L422)

## Type declaration

### assetBalance()

> **assetBalance**(`a`, `b`): readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

Amount of the asset unit held by this account
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

##### b

[`uint64`](../../index/type-aliases/uint64.md) | [`Asset`](../../index/type-aliases/Asset.md)

#### Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

### assetFrozen()

> **assetFrozen**(`a`, `b`): readonly \[`boolean`, `boolean`\]

Is the asset frozen or not
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

##### b

[`uint64`](../../index/type-aliases/uint64.md) | [`Asset`](../../index/type-aliases/Asset.md)

#### Returns

readonly \[`boolean`, `boolean`\]
