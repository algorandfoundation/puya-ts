[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / AssetHolding

# Variable: AssetHolding

> `const` **AssetHolding**: `object`

Defined in: [packages/algo-ts/src/op.ts:414](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L414)

## Type declaration

### assetBalance()

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

Is the asset frozen or not
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

##### b

[`uint64`](../../index/type-aliases/uint64.md) | [`Asset`](../../index/type-aliases/Asset.md)

#### Returns

readonly \[`boolean`, `boolean`\]
