---
title: BareMethodConfig
type: doc
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / BareMethodConfig

# Type Alias: BareMethodConfig

> **BareMethodConfig** = `object`

Defined in: [arc4/index.ts:179](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L179)

Configuration options for a bare method

## Properties

### allowActions?

> `optional` **allowActions**: [`OnCompleteActionStr`](../../index/type-aliases/OnCompleteActionStr.md) \| [`OnCompleteActionStr`](../../index/type-aliases/OnCompleteActionStr.md)[]

Defined in: [arc4/index.ts:184](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L184)

Which on complete action(s) are allowed when invoking this method.

#### Default

```ts
'NoOp'
```

***

### onCreate?

> `optional` **onCreate**: [`CreateOptions`](CreateOptions.md)

Defined in: [arc4/index.ts:189](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L189)

Whether this method should be callable when creating the application.

#### Default

```ts
'disallow'
```
