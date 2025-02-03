[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [arc4](../README.md) / BareMethodConfig

# Type Alias: BareMethodConfig

> **BareMethodConfig**: `object`

Defined in: [packages/algo-ts/src/arc4/index.ts:66](https://github.com/algorandfoundation/puya-ts/blob/14c9827d80da81ff08b4923e997ba22be04aa0db/packages/algo-ts/src/arc4/index.ts#L66)

## Type declaration

### allowActions?

> `optional` **allowActions**: [`OnCompleteActionStr`](OnCompleteActionStr.md) \| [`OnCompleteActionStr`](OnCompleteActionStr.md)[]

Which on complete action(s) are allowed when invoking this method.

#### Default

```ts
'NoOp'
```

### onCreate?

> `optional` **onCreate**: [`CreateOptions`](CreateOptions.md)

Whether this method should be callable when creating the application.

#### Default

```ts
'disallow'
```
