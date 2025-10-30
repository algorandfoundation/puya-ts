[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / Asset

# Type Alias: Asset

> **Asset** = `object`

Defined in: [packages/algo-ts/src/reference.ts:128](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L128)

An Asset on the Algorand network.

## Properties

### clawback

> `readonly` **clawback**: [`Account`](Account.md)

Defined in: [packages/algo-ts/src/reference.ts:199](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L199)

Clawback address

***

### creator

> `readonly` **creator**: [`Account`](Account.md)

Defined in: [packages/algo-ts/src/reference.ts:204](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L204)

Creator address

***

### decimals

> `readonly` **decimals**: [`uint64`](uint64.md)

Defined in: [packages/algo-ts/src/reference.ts:154](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L154)

#### See

AssetParams.decimals

***

### defaultFrozen

> `readonly` **defaultFrozen**: `boolean`

Defined in: [packages/algo-ts/src/reference.ts:159](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L159)

Frozen by default or not

***

### freeze

> `readonly` **freeze**: [`Account`](Account.md)

Defined in: [packages/algo-ts/src/reference.ts:194](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L194)

Freeze address

***

### id

> `readonly` **id**: [`uint64`](uint64.md)

Defined in: [packages/algo-ts/src/reference.ts:144](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L144)

Returns the id of the Asset

***

### manager

> `readonly` **manager**: [`Account`](Account.md)

Defined in: [packages/algo-ts/src/reference.ts:184](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L184)

Manager address

***

### metadataHash

> `readonly` **metadataHash**: [`bytes`](bytes.md)

Defined in: [packages/algo-ts/src/reference.ts:179](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L179)

Arbitrary commitment

***

### name

> `readonly` **name**: [`bytes`](bytes.md)

Defined in: [packages/algo-ts/src/reference.ts:169](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L169)

Asset name

***

### reserve

> `readonly` **reserve**: [`Account`](Account.md)

Defined in: [packages/algo-ts/src/reference.ts:189](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L189)

Reserve address

***

### total

> `readonly` **total**: [`uint64`](uint64.md)

Defined in: [packages/algo-ts/src/reference.ts:149](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L149)

Total number of units of this asset

***

### unitName

> `readonly` **unitName**: [`bytes`](bytes.md)

Defined in: [packages/algo-ts/src/reference.ts:164](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L164)

Asset unit name

***

### url

> `readonly` **url**: [`bytes`](bytes.md)

Defined in: [packages/algo-ts/src/reference.ts:174](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L174)

URL with additional info about the asset

## Methods

### balance()

> **balance**(`account`): [`uint64`](uint64.md)

Defined in: [packages/algo-ts/src/reference.ts:213](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L213)

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

***

### frozen()

> **frozen**(`account`): `boolean`

Defined in: [packages/algo-ts/src/reference.ts:222](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L222)

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
