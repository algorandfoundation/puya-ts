[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [op](../README.md) / VoterParams

# Variable: VoterParams

> `const` **VoterParams**: `object`

Defined in: [packages/algo-ts/src/op.ts:4001](https://github.com/algorandfoundation/puya-ts/blob/14c9827d80da81ff08b4923e997ba22be04aa0db/packages/algo-ts/src/op.ts#L4001)

## Type declaration

### voterBalance()

Online stake in microalgos
Min AVM version: 11

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md) | [`Account`](../../../type-aliases/Account.md)

#### Returns

readonly \[[`uint64`](../../../type-aliases/uint64.md), `boolean`\]

### voterIncentiveEligible()

Had this account opted into block payouts
Min AVM version: 11

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md) | [`Account`](../../../type-aliases/Account.md)

#### Returns

readonly \[`boolean`, `boolean`\]
