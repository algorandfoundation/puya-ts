[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / BareMethodConfig

# Type Alias: BareMethodConfig

> **BareMethodConfig** = `object`

Defined in: [packages/algo-ts/src/arc4/index.ts:134](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L134)

Configuration options for a bare method

## Properties

### allowActions?

> `optional` **allowActions**: [`OnCompleteActionStr`](../../index/type-aliases/OnCompleteActionStr.md) \| [`OnCompleteActionStr`](../../index/type-aliases/OnCompleteActionStr.md)[]

Defined in: [packages/algo-ts/src/arc4/index.ts:139](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L139)

Which on complete action(s) are allowed when invoking this method.

#### Default

```ts
'NoOp'
```

***

### onCreate?

> `optional` **onCreate**: [`CreateOptions`](CreateOptions.md)

Defined in: [packages/algo-ts/src/arc4/index.ts:144](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L144)

Whether this method should be callable when creating the application.

#### Default

```ts
'disallow'
```
