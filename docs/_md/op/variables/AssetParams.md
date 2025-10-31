---
title: AssetParams
type: doc
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / AssetParams

# Variable: AssetParams

> `const` **AssetParams**: `object`

Defined in: [op.ts:440](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L440)

## Type declaration

### assetClawback()

> **assetClawback**(`a`): readonly \[[`Account`](../../index/type-aliases/Account.md), `boolean`\]

Clawback address
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Asset`](../../index/type-aliases/Asset.md)

#### Returns

readonly \[[`Account`](../../index/type-aliases/Account.md), `boolean`\]

### assetCreator()

> **assetCreator**(`a`): readonly \[[`Account`](../../index/type-aliases/Account.md), `boolean`\]

Creator address
Min AVM version: 5

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Asset`](../../index/type-aliases/Asset.md)

#### Returns

readonly \[[`Account`](../../index/type-aliases/Account.md), `boolean`\]

### assetDecimals()

> **assetDecimals**(`a`): readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

See AssetParams.Decimals
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Asset`](../../index/type-aliases/Asset.md)

#### Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

### assetDefaultFrozen()

> **assetDefaultFrozen**(`a`): readonly \[`boolean`, `boolean`\]

Frozen by default or not
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Asset`](../../index/type-aliases/Asset.md)

#### Returns

readonly \[`boolean`, `boolean`\]

### assetFreeze()

> **assetFreeze**(`a`): readonly \[[`Account`](../../index/type-aliases/Account.md), `boolean`\]

Freeze address
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Asset`](../../index/type-aliases/Asset.md)

#### Returns

readonly \[[`Account`](../../index/type-aliases/Account.md), `boolean`\]

### assetManager()

> **assetManager**(`a`): readonly \[[`Account`](../../index/type-aliases/Account.md), `boolean`\]

Manager address
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Asset`](../../index/type-aliases/Asset.md)

#### Returns

readonly \[[`Account`](../../index/type-aliases/Account.md), `boolean`\]

### assetMetadataHash()

> **assetMetadataHash**(`a`): readonly \[[`bytes`](../../index/type-aliases/bytes.md)\<`32`\>, `boolean`\]

Arbitrary commitment
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Asset`](../../index/type-aliases/Asset.md)

#### Returns

readonly \[[`bytes`](../../index/type-aliases/bytes.md)\<`32`\>, `boolean`\]

### assetName()

> **assetName**(`a`): readonly \[[`bytes`](../../index/type-aliases/bytes.md), `boolean`\]

Asset name
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Asset`](../../index/type-aliases/Asset.md)

#### Returns

readonly \[[`bytes`](../../index/type-aliases/bytes.md), `boolean`\]

### assetReserve()

> **assetReserve**(`a`): readonly \[[`Account`](../../index/type-aliases/Account.md), `boolean`\]

Reserve address
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Asset`](../../index/type-aliases/Asset.md)

#### Returns

readonly \[[`Account`](../../index/type-aliases/Account.md), `boolean`\]

### assetTotal()

> **assetTotal**(`a`): readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

Total number of units of this asset
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Asset`](../../index/type-aliases/Asset.md)

#### Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

### assetUnitName()

> **assetUnitName**(`a`): readonly \[[`bytes`](../../index/type-aliases/bytes.md), `boolean`\]

Asset unit name
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Asset`](../../index/type-aliases/Asset.md)

#### Returns

readonly \[[`bytes`](../../index/type-aliases/bytes.md), `boolean`\]

### assetUrl()

> **assetUrl**(`a`): readonly \[[`bytes`](../../index/type-aliases/bytes.md), `boolean`\]

URL with additional info about the asset
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Asset`](../../index/type-aliases/Asset.md)

#### Returns

readonly \[[`bytes`](../../index/type-aliases/bytes.md), `boolean`\]
