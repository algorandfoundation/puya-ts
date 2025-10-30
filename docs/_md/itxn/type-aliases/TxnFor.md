[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [itxn](../README.md) / TxnFor

# Type Alias: TxnFor\<TFields\>

> **TxnFor**\<`TFields`\> = `TFields` *extends* \[\{ `submit`: `TTxn`; \}, `...(infer TRest extends [...ItxnParams[]])`\] ? \[`TTxn`, `...TxnFor<TRest>`\] : \[\]

Defined in: [packages/algo-ts/src/itxn.ts:971](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L971)

Conditional type which returns the matching InnerTransaction types for a given tuple of ItxnParams types

## Type Parameters

### TFields

`TFields` *extends* \[`...ItxnParams[]`\]
