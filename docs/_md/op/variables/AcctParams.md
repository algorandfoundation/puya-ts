---
title: AcctParams
type: doc
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / AcctParams

# Variable: AcctParams

> `const` **AcctParams**: `object`

Defined in: [op.ts:52](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L52)

## Type declaration

### acctAuthAddr()

> **acctAuthAddr**(`a`): readonly \[[`Account`](../../index/type-aliases/Account.md), `boolean`\]

Address the account is rekeyed to.
Min AVM version: 6

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

#### Returns

readonly \[[`Account`](../../index/type-aliases/Account.md), `boolean`\]

### acctBalance()

> **acctBalance**(`a`): readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

Account balance in microalgos
Min AVM version: 6

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

#### Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

### acctIncentiveEligible()

> **acctIncentiveEligible**(`a`): readonly \[`boolean`, `boolean`\]

Has this account opted into block payouts
Min AVM version: 11

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

#### Returns

readonly \[`boolean`, `boolean`\]

### acctLastHeartbeat()

> **acctLastHeartbeat**(`a`): readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

The round number of the last block this account sent a heartbeat.
Min AVM version: 11

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

#### Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

### acctLastProposed()

> **acctLastProposed**(`a`): readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

The round number of the last block this account proposed.
Min AVM version: 11

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

#### Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

### acctMinBalance()

> **acctMinBalance**(`a`): readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

Minimum required balance for account, in microalgos
Min AVM version: 6

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

#### Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

### acctTotalAppsCreated()

> **acctTotalAppsCreated**(`a`): readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

The number of existing apps created by this account.
Min AVM version: 8

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

#### Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

### acctTotalAppsOptedIn()

> **acctTotalAppsOptedIn**(`a`): readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

The number of apps this account is opted into.
Min AVM version: 8

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

#### Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

### acctTotalAssets()

> **acctTotalAssets**(`a`): readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

The numbers of ASAs held by this account (including ASAs this account created).
Min AVM version: 8

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

#### Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

### acctTotalAssetsCreated()

> **acctTotalAssetsCreated**(`a`): readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

The number of existing ASAs created by this account.
Min AVM version: 8

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

#### Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

### acctTotalBoxBytes()

> **acctTotalBoxBytes**(`a`): readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

The total number of bytes used by this account's app's box keys and values.
Min AVM version: 8

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

#### Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

### acctTotalBoxes()

> **acctTotalBoxes**(`a`): readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

The number of existing boxes created by this account's app.
Min AVM version: 8

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

#### Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

### acctTotalExtraAppPages()

> **acctTotalExtraAppPages**(`a`): readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

The number of extra app code pages used by this account.
Min AVM version: 8

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

#### Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

### acctTotalNumByteSlice()

> **acctTotalNumByteSlice**(`a`): readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

The total number of byte array values allocated by this account in Global and Local States.
Min AVM version: 8

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

#### Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

### acctTotalNumUint()

> **acctTotalNumUint**(`a`): readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

The total number of uint64 values allocated by this account in Global and Local States.
Min AVM version: 8

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

#### Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]
