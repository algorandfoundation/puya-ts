[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [op](../README.md) / AcctParams

# Variable: AcctParams

> `const` **AcctParams**: `object`

Defined in: [packages/algo-ts/src/op.ts:51](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/op.ts#L51)

## Type declaration

### acctAuthAddr()

Address the account is rekeyed to.
Min AVM version: 6

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md) | [`Account`](../../../type-aliases/Account.md)

#### Returns

readonly \[[`Account`](../../../type-aliases/Account.md), `boolean`\]

### acctBalance()

Account balance in microalgos
Min AVM version: 6

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md) | [`Account`](../../../type-aliases/Account.md)

#### Returns

readonly \[[`uint64`](../../../type-aliases/uint64.md), `boolean`\]

### acctIncentiveEligible()

Has this account opted into block payouts
Min AVM version: 11

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md) | [`Account`](../../../type-aliases/Account.md)

#### Returns

readonly \[`boolean`, `boolean`\]

### acctLastHeartbeat()

The round number of the last block this account sent a heartbeat.
Min AVM version: 11

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md) | [`Account`](../../../type-aliases/Account.md)

#### Returns

readonly \[[`uint64`](../../../type-aliases/uint64.md), `boolean`\]

### acctLastProposed()

The round number of the last block this account proposed.
Min AVM version: 11

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md) | [`Account`](../../../type-aliases/Account.md)

#### Returns

readonly \[[`uint64`](../../../type-aliases/uint64.md), `boolean`\]

### acctMinBalance()

Minimum required balance for account, in microalgos
Min AVM version: 6

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md) | [`Account`](../../../type-aliases/Account.md)

#### Returns

readonly \[[`uint64`](../../../type-aliases/uint64.md), `boolean`\]

### acctTotalAppsCreated()

The number of existing apps created by this account.
Min AVM version: 8

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md) | [`Account`](../../../type-aliases/Account.md)

#### Returns

readonly \[[`uint64`](../../../type-aliases/uint64.md), `boolean`\]

### acctTotalAppsOptedIn()

The number of apps this account is opted into.
Min AVM version: 8

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md) | [`Account`](../../../type-aliases/Account.md)

#### Returns

readonly \[[`uint64`](../../../type-aliases/uint64.md), `boolean`\]

### acctTotalAssets()

The numbers of ASAs held by this account (including ASAs this account created).
Min AVM version: 8

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md) | [`Account`](../../../type-aliases/Account.md)

#### Returns

readonly \[[`uint64`](../../../type-aliases/uint64.md), `boolean`\]

### acctTotalAssetsCreated()

The number of existing ASAs created by this account.
Min AVM version: 8

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md) | [`Account`](../../../type-aliases/Account.md)

#### Returns

readonly \[[`uint64`](../../../type-aliases/uint64.md), `boolean`\]

### acctTotalBoxBytes()

The total number of bytes used by this account's app's box keys and values.
Min AVM version: 8

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md) | [`Account`](../../../type-aliases/Account.md)

#### Returns

readonly \[[`uint64`](../../../type-aliases/uint64.md), `boolean`\]

### acctTotalBoxes()

The number of existing boxes created by this account's app.
Min AVM version: 8

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md) | [`Account`](../../../type-aliases/Account.md)

#### Returns

readonly \[[`uint64`](../../../type-aliases/uint64.md), `boolean`\]

### acctTotalExtraAppPages()

The number of extra app code pages used by this account.
Min AVM version: 8

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md) | [`Account`](../../../type-aliases/Account.md)

#### Returns

readonly \[[`uint64`](../../../type-aliases/uint64.md), `boolean`\]

### acctTotalNumByteSlice()

The total number of byte array values allocated by this account in Global and Local States.
Min AVM version: 8

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md) | [`Account`](../../../type-aliases/Account.md)

#### Returns

readonly \[[`uint64`](../../../type-aliases/uint64.md), `boolean`\]

### acctTotalNumUint()

The total number of uint64 values allocated by this account in Global and Local States.
Min AVM version: 8

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md) | [`Account`](../../../type-aliases/Account.md)

#### Returns

readonly \[[`uint64`](../../../type-aliases/uint64.md), `boolean`\]
