---
title: VoterParams
type: doc
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / VoterParams

# Variable: VoterParams

> `const` **VoterParams**: `object`

Defined in: [op.ts:4063](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L4063)

## Type declaration

### voterBalance()

> **voterBalance**(`a`): readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

Online stake in microalgos
Min AVM version: 11

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

#### Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), `boolean`\]

### voterIncentiveEligible()

> **voterIncentiveEligible**(`a`): readonly \[`boolean`, `boolean`\]

Had this account opted into block payouts
Min AVM version: 11

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

#### Returns

readonly \[`boolean`, `boolean`\]
