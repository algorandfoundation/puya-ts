---
title: GtxnToItxnFields
type: doc
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / GtxnToItxnFields

# Type Alias: GtxnToItxnFields\<T\>

> **GtxnToItxnFields**\<`T`\> = `T` *extends* [`PaymentTxn`](../../gtxn/namespaces/gtxn/interfaces/PaymentTxn.md) ? [`PaymentItxnParams`](../../itxn/namespaces/itxn/classes/PaymentItxnParams.md) : `T` *extends* [`KeyRegistrationTxn`](../../gtxn/namespaces/gtxn/interfaces/KeyRegistrationTxn.md) ? [`KeyRegistrationItxnParams`](../../itxn/namespaces/itxn/classes/KeyRegistrationItxnParams.md) : `T` *extends* [`AssetConfigTxn`](../../gtxn/namespaces/gtxn/interfaces/AssetConfigTxn.md) ? [`AssetConfigItxnParams`](../../itxn/namespaces/itxn/classes/AssetConfigItxnParams.md) : `T` *extends* [`AssetTransferTxn`](../../gtxn/namespaces/gtxn/interfaces/AssetTransferTxn.md) ? [`AssetTransferItxnParams`](../../itxn/namespaces/itxn/classes/AssetTransferItxnParams.md) : `T` *extends* [`AssetFreezeTxn`](../../gtxn/namespaces/gtxn/interfaces/AssetFreezeTxn.md) ? [`AssetFreezeItxnParams`](../../itxn/namespaces/itxn/classes/AssetFreezeItxnParams.md) : `T` *extends* [`ApplicationCallTxn`](../../gtxn/namespaces/gtxn/interfaces/ApplicationCallTxn.md) ? [`ApplicationCallItxnParams`](../../itxn/namespaces/itxn/classes/ApplicationCallItxnParams.md) : [`ItxnParams`](../../itxn/namespaces/itxn/type-aliases/ItxnParams.md)

Defined in: [arc4/c2c.ts:21](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/c2c.ts#L21)

Conditional type which given a group transaction type, returns the equivalent inner transaction
params type.

## Type Parameters

### T

`T` *extends* [`Transaction`](../../gtxn/namespaces/gtxn/type-aliases/Transaction.md)
