---
title: Transaction
type: doc
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../../../README.md)

***

[Algorand TypeScript](../../../../modules.md) / [gtxn](../../../README.md) / [gtxn](../README.md) / Transaction

# Type Alias: Transaction

> **Transaction** = [`PaymentTxn`](../interfaces/PaymentTxn.md) \| [`KeyRegistrationTxn`](../interfaces/KeyRegistrationTxn.md) \| [`AssetConfigTxn`](../interfaces/AssetConfigTxn.md) \| [`AssetTransferTxn`](../interfaces/AssetTransferTxn.md) \| [`AssetFreezeTxn`](../interfaces/AssetFreezeTxn.md) \| [`ApplicationCallTxn`](../interfaces/ApplicationCallTxn.md)

Defined in: [gtxn.ts:589](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L589)

Get the nth transaction in the group without verifying its type

## Param

The index of the txn in the group
