[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [itxn](../README.md) / TxnFor

# Type Alias: TxnFor\<TFields\>

> **TxnFor**\<`TFields`\>: `TFields` *extends* \[[`InnerTransaction`](InnerTransaction.md)\<`DeliberateAny`, infer TTxn\>, `...(infer TRest extends InnerTxnList)`\] ? \[`TTxn`, `...TxnFor<TRest>`\] : \[\]

Defined in: [packages/algo-ts/src/itxn.ts:168](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L168)

## Type Parameters

• **TFields** *extends* [`InnerTxnList`](InnerTxnList.md)
