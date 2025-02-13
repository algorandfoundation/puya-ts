[**@algorandfoundation/algorand-typescript**](../README.md)

***

[@algorandfoundation/algorand-typescript](../README.md) / Asset

# Type Alias: Asset

> **Asset**: `object`

Defined in: [packages/algo-ts/src/reference.ts:106](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/reference.ts#L106)

An Asset on the Algorand network.

## Type declaration

### clawback

> `readonly` **clawback**: [`Account`](Account.md)

Clawback address

### creator

> `readonly` **creator**: [`Account`](Account.md)

Creator address

### decimals

> `readonly` **decimals**: [`uint64`](uint64.md)

#### See

AssetParams.decimals

### defaultFrozen

> `readonly` **defaultFrozen**: `boolean`

Frozen by default or not

### freeze

> `readonly` **freeze**: [`Account`](Account.md)

Freeze address

### id

> `readonly` **id**: [`uint64`](uint64.md)

Returns the id of the Asset

### manager

> `readonly` **manager**: [`Account`](Account.md)

Manager address

### metadataHash

> `readonly` **metadataHash**: [`bytes`](bytes.md)

Arbitrary commitment

### name

> `readonly` **name**: [`bytes`](bytes.md)

Asset name

### reserve

> `readonly` **reserve**: [`Account`](Account.md)

Reserve address

### total

> `readonly` **total**: [`uint64`](uint64.md)

Total number of units of this asset

### unitName

> `readonly` **unitName**: [`bytes`](bytes.md)

Asset unit name

### url

> `readonly` **url**: [`bytes`](bytes.md)

URL with additional info about the asset

### balance()

Amount of the asset unit held by this account. Fails if the account has not
opted in to the asset.
Asset and supplied Account must be an available resource

#### Parameters

##### account

[`Account`](Account.md)

Account

#### Returns

[`uint64`](uint64.md)

balance: uint64

### frozen()

Is the asset frozen or not. Fails if the account has not
opted in to the asset.
Asset and supplied Account must be an available resource

#### Parameters

##### account

[`Account`](Account.md)

Account

#### Returns

`boolean`

isFrozen: boolean
