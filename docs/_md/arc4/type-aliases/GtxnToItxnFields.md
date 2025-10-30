[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / GtxnToItxnFields

# Type Alias: GtxnToItxnFields\<T\>

> **GtxnToItxnFields**\<`T`\> = `T` *extends* [`PaymentTxn`](../../gtxn/interfaces/PaymentTxn.md) ? [`PaymentItxnParams`](../../itxn/classes/PaymentItxnParams.md) : `T` *extends* [`KeyRegistrationTxn`](../../gtxn/interfaces/KeyRegistrationTxn.md) ? [`KeyRegistrationItxnParams`](../../itxn/classes/KeyRegistrationItxnParams.md) : `T` *extends* [`AssetConfigTxn`](../../gtxn/interfaces/AssetConfigTxn.md) ? [`AssetConfigItxnParams`](../../itxn/classes/AssetConfigItxnParams.md) : `T` *extends* [`AssetTransferTxn`](../../gtxn/interfaces/AssetTransferTxn.md) ? [`AssetTransferItxnParams`](../../itxn/classes/AssetTransferItxnParams.md) : `T` *extends* [`AssetFreezeTxn`](../../gtxn/interfaces/AssetFreezeTxn.md) ? [`AssetFreezeItxnParams`](../../itxn/classes/AssetFreezeItxnParams.md) : `T` *extends* [`ApplicationCallTxn`](../../gtxn/interfaces/ApplicationCallTxn.md) ? [`ApplicationCallItxnParams`](../../itxn/classes/ApplicationCallItxnParams.md) : [`ItxnParams`](../../itxn/type-aliases/ItxnParams.md)

Defined in: [packages/algo-ts/src/arc4/c2c.ts:22](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/c2c.ts#L22)

Conditional type which given a group transaction type, returns the equivalent inner transaction
params type.

## Type Parameters

### T

`T` *extends* [`Transaction`](../../gtxn/type-aliases/Transaction.md)
