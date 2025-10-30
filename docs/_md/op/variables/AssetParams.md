[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / AssetParams

# Variable: AssetParams

> `const` **AssetParams**: `object`

Defined in: [packages/algo-ts/src/op.ts:432](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L432)

## Type declaration

### assetClawback()

Clawback address
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Asset`](../../index/type-aliases/Asset.md)

#### Returns

readonly \[[`Account`](../../index/type-aliases/Account.md), `boolean`\]

### assetCreator()

Creator address
Min AVM version: 5

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Asset`](../../index/type-aliases/Asset.md)

#### Returns

readonly \[[`Account`](../../index/type-aliases/Account.md), `boolean`\]

### assetDecimals()

See AssetParams.Decimals
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Asset`](../../index/type-aliases/Asset.md)

#### Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

### assetDefaultFrozen()

Frozen by default or not
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Asset`](../../index/type-aliases/Asset.md)

#### Returns

readonly \[`boolean`, `boolean`\]

### assetFreeze()

Freeze address
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Asset`](../../index/type-aliases/Asset.md)

#### Returns

readonly \[[`Account`](../../index/type-aliases/Account.md), `boolean`\]

### assetManager()

Manager address
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Asset`](../../index/type-aliases/Asset.md)

#### Returns

readonly \[[`Account`](../../index/type-aliases/Account.md), `boolean`\]

### assetMetadataHash()

Arbitrary commitment
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Asset`](../../index/type-aliases/Asset.md)

#### Returns

readonly \[[`bytes`](../../index/type-aliases/bytes.md), `boolean`\]

### assetName()

Asset name
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Asset`](../../index/type-aliases/Asset.md)

#### Returns

readonly \[[`bytes`](../../index/type-aliases/bytes.md), `boolean`\]

### assetReserve()

Reserve address
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Asset`](../../index/type-aliases/Asset.md)

#### Returns

readonly \[[`Account`](../../index/type-aliases/Account.md), `boolean`\]

### assetTotal()

Total number of units of this asset
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Asset`](../../index/type-aliases/Asset.md)

#### Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

### assetUnitName()

Asset unit name
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Asset`](../../index/type-aliases/Asset.md)

#### Returns

readonly \[[`bytes`](../../index/type-aliases/bytes.md), `boolean`\]

### assetUrl()

URL with additional info about the asset
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Asset`](../../index/type-aliases/Asset.md)

#### Returns

readonly \[[`bytes`](../../index/type-aliases/bytes.md), `boolean`\]
