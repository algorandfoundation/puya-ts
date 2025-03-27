[**@algorandfoundation/algorand-typescript**](../../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../../README.md) / [index](../../../README.md) / [itxn](../README.md) / TxnFor

# Type Alias: TxnFor\<TFields\>

> **TxnFor**\<`TFields`\>: `TFields` *extends* \[\{ `submit`: `TTxn`; \}, `...(infer TRest extends InnerTxnList)`\] ? \[`TTxn`, `...TxnFor<TRest>`\] : \[\]

Defined in: [packages/algo-ts/src/itxn.ts:973](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L973)

## Type Parameters

• **TFields** *extends* [`InnerTxnList`](InnerTxnList.md)
