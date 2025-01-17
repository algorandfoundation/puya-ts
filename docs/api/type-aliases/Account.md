[**@algorandfoundation/algorand-typescript**](../README.md)

***

[@algorandfoundation/algorand-typescript](../README.md) / Account

# Type Alias: Account

> **Account**: `object`

Defined in: [packages/algo-ts/src/reference.ts:100](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/reference.ts#L100)

## Type declaration

### authAddress

> `readonly` **authAddress**: [`Account`](Account.md)

Address the account is rekeyed to

Account must be an available resource

### balance

> `readonly` **balance**: [`uint64`](uint64.md)

Account balance in microalgos

Account must be an available resource

### bytes

> `readonly` **bytes**: [`bytes`](bytes.md)

### minBalance

> `readonly` **minBalance**: [`uint64`](uint64.md)

Minimum required balance for account, in microalgos

Account must be an available resource

### totalAppsCreated

> `readonly` **totalAppsCreated**: [`uint64`](uint64.md)

The number of existing apps created by this account.

Account must be an available resource

### totalAppsOptedIn

> `readonly` **totalAppsOptedIn**: [`uint64`](uint64.md)

The number of apps this account is opted into.

Account must be an available resource

### totalAssets

> `readonly` **totalAssets**: [`uint64`](uint64.md)

The numbers of ASAs held by this account (including ASAs this account created).

Account must be an available resource

### totalAssetsCreated

> `readonly` **totalAssetsCreated**: [`uint64`](uint64.md)

The number of existing ASAs created by this account.

Account must be an available resource

### totalBoxBytes

> `readonly` **totalBoxBytes**: [`uint64`](uint64.md)

The total number of bytes used by this account's app's box keys and values.

Account must be an available resource

### totalBoxes

> `readonly` **totalBoxes**: [`uint64`](uint64.md)

The number of existing boxes created by this account's app.

Account must be an available resource

### totalExtraAppPages

> `readonly` **totalExtraAppPages**: [`uint64`](uint64.md)

The number of extra app code pages used by this account.

Account must be an available resource

### totalNumByteSlice

> `readonly` **totalNumByteSlice**: [`uint64`](uint64.md)

The total number of byte array values allocated by this account in Global and Local States.

Account must be an available resource

### totalNumUint

> `readonly` **totalNumUint**: [`uint64`](uint64.md)

The total number of uint64 values allocated by this account in Global and Local States.

Account must be an available resource

### isOptedIn()

Returns true if this account is opted in to the specified Asset or Application.
Note: Account and Asset/Application must be an available resource

#### Parameters

##### assetOrApp

[`Asset`](Asset.md) | [`Application`](Application.md)

#### Returns

`boolean`
