[**@algorandfoundation/algorand-typescript**](../../README.md)

***

[@algorandfoundation/algorand-typescript](../../README.md) / [arc4](../README.md) / GtxnToItxnFields

# Type Alias: GtxnToItxnFields\<T\>

> **GtxnToItxnFields**\<`T`\>: `T` *extends* [`PaymentTxn`](../../index/namespaces/gtxn/interfaces/PaymentTxn.md) ? [`PaymentItxnParams`](../../index/namespaces/itxn/interfaces/PaymentItxnParams.md) : `T` *extends* [`KeyRegistrationTxn`](../../index/namespaces/gtxn/interfaces/KeyRegistrationTxn.md) ? [`KeyRegistrationItxnParams`](../../index/namespaces/itxn/interfaces/KeyRegistrationItxnParams.md) : `T` *extends* [`AssetConfigTxn`](../../index/namespaces/gtxn/interfaces/AssetConfigTxn.md) ? [`AssetConfigItxnParams`](../../index/namespaces/itxn/interfaces/AssetConfigItxnParams.md) : `T` *extends* [`AssetTransferTxn`](../../index/namespaces/gtxn/interfaces/AssetTransferTxn.md) ? [`AssetTransferItxnParams`](../../index/namespaces/itxn/interfaces/AssetTransferItxnParams.md) : `T` *extends* [`AssetFreezeTxn`](../../index/namespaces/gtxn/interfaces/AssetFreezeTxn.md) ? [`AssetFreezeItxnParams`](../../index/namespaces/itxn/interfaces/AssetFreezeItxnParams.md) : `T` *extends* [`ApplicationTxn`](../../index/namespaces/gtxn/interfaces/ApplicationTxn.md) ? [`ApplicationCallItxnParams`](../../index/namespaces/itxn/interfaces/ApplicationCallItxnParams.md) : [`InnerTransaction`](../../index/namespaces/itxn/type-aliases/InnerTransaction.md)

Defined in: [packages/algo-ts/src/arc4/c2c.ts:22](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/c2c.ts#L22)

Conditional type which given a group transaction type, returns the equivalent inner transaction
params type.

## Type Parameters

• **T** *extends* [`Transaction`](../../index/namespaces/gtxn/type-aliases/Transaction.md)
