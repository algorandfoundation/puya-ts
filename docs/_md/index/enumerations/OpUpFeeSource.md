---
title: OpUpFeeSource
type: enum
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / OpUpFeeSource

# Enumeration: OpUpFeeSource

Defined in: [util.ts:130](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/util.ts#L130)

Defines the source of fees for the OpUp utility

## Enumeration Members

### Any

> **Any**: `2`

Defined in: [util.ts:142](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/util.ts#L142)

First the excess will be used, then remaining fees taken from the app account

***

### AppAccount

> **AppAccount**: `1`

Defined in: [util.ts:138](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/util.ts#L138)

The app's account will cover all fees (itxn.fee = Global.minTxFee)

***

### GroupCredit

> **GroupCredit**: `0`

Defined in: [util.ts:134](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/util.ts#L134)

Only the excess fee (credit) on the outer group should be used (itxn.fee = 0)
