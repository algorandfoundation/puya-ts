---
title: ConventionalRouting
type: interface
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / ConventionalRouting

# Interface: ConventionalRouting

Defined in: [arc4/index.ts:31](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L31)

Defines conventional routing method names. When used, methods with these names will be implicitly routed to the corresponding
application lifecycle event.

## Remarks

This behaviour is independent of a contract explicitly implementing this interface. The interface is provided simply to improve
the developer experience of using this feature.

## Properties

### closeOutOfApplication?

> `optional` **closeOutOfApplication**: [`AnyFunction`](../-internal-/type-aliases/AnyFunction.md)

Defined in: [arc4/index.ts:35](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L35)

The function to invoke when closing out of this application

***

### createApplication?

> `optional` **createApplication**: [`AnyFunction`](../-internal-/type-aliases/AnyFunction.md)

Defined in: [arc4/index.ts:39](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L39)

The function to invoke when creating this application

***

### deleteApplication?

> `optional` **deleteApplication**: [`AnyFunction`](../-internal-/type-aliases/AnyFunction.md)

Defined in: [arc4/index.ts:43](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L43)

The function to invoke when deleting this application

***

### optInToApplication?

> `optional` **optInToApplication**: [`AnyFunction`](../-internal-/type-aliases/AnyFunction.md)

Defined in: [arc4/index.ts:47](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L47)

The function to invoke when opting in to this application

***

### updateApplication?

> `optional` **updateApplication**: [`AnyFunction`](../-internal-/type-aliases/AnyFunction.md)

Defined in: [arc4/index.ts:51](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L51)

The function to invoke when updating this application
