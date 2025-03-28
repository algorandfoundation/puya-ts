[**@algorandfoundation/algorand-typescript**](../../README.md)

***

[@algorandfoundation/algorand-typescript](../../README.md) / [arc4](../README.md) / BareMethodConfig

# Type Alias: BareMethodConfig

> **BareMethodConfig** = `object`

Defined in: [packages/algo-ts/src/arc4/index.ts:104](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L104)

Configuration options for a bare method

## Properties

### allowActions?

> `optional` **allowActions**: [`OnCompleteActionStr`](../../index/type-aliases/OnCompleteActionStr.md) \| [`OnCompleteActionStr`](../../index/type-aliases/OnCompleteActionStr.md)[]

Defined in: [packages/algo-ts/src/arc4/index.ts:109](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L109)

Which on complete action(s) are allowed when invoking this method.

#### Default

```ts
'NoOp'
```

***

### onCreate?

> `optional` **onCreate**: [`CreateOptions`](CreateOptions.md)

Defined in: [packages/algo-ts/src/arc4/index.ts:114](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L114)

Whether this method should be callable when creating the application.

#### Default

```ts
'disallow'
```
