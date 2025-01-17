[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [op](../README.md) / AssetHolding

# Variable: AssetHolding

> `const` **AssetHolding**: `object`

Defined in: [packages/algo-ts/src/op.ts:413](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/op.ts#L413)

## Type declaration

### assetBalance()

Amount of the asset unit held by this account
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md) | [`Account`](../../../type-aliases/Account.md)

##### b

[`uint64`](../../../type-aliases/uint64.md) | [`Asset`](../../../type-aliases/Asset.md)

#### Returns

readonly \[[`uint64`](../../../type-aliases/uint64.md), `boolean`\]

### assetFrozen()

Is the asset frozen or not
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md) | [`Account`](../../../type-aliases/Account.md)

##### b

[`uint64`](../../../type-aliases/uint64.md) | [`Asset`](../../../type-aliases/Asset.md)

#### Returns

readonly \[`boolean`, `boolean`\]
