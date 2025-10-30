[**Algorand TypeScript**](../../../README.md)

***

[Algorand TypeScript](../../../modules.md) / [index](../../README.md) / [\<internal\>](../README.md) / StateTotals

# Type Alias: StateTotals

> **StateTotals** = `object`

Defined in: [packages/algo-ts/src/base-contract.ts:31](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/base-contract.ts#L31)

Options class to manually define the total amount of global and local state contract will use.

This is not required when all state is assigned to `this.`, but is required if a
contract dynamically interacts with state via `AppGlobal.getBytes` etc, or if you want
to reserve additional state storage for future contract updates, since the Algorand protocol
doesn't allow increasing them after creation.

## Properties

### globalBytes?

> `optional` **globalBytes**: `number`

Defined in: [packages/algo-ts/src/base-contract.ts:33](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/base-contract.ts#L33)

***

### globalUints?

> `optional` **globalUints**: `number`

Defined in: [packages/algo-ts/src/base-contract.ts:32](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/base-contract.ts#L32)

***

### localBytes?

> `optional` **localBytes**: `number`

Defined in: [packages/algo-ts/src/base-contract.ts:35](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/base-contract.ts#L35)

***

### localUints?

> `optional` **localUints**: `number`

Defined in: [packages/algo-ts/src/base-contract.ts:34](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/base-contract.ts#L34)
