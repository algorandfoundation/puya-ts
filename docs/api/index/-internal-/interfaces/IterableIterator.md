[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [index](../../README.md) / [\<internal\>](../README.md) / IterableIterator

# Interface: IterableIterator\<T, TReturn, TNext\>

Defined in: node\_modules/typescript/lib/lib.es2015.iterable.d.ts:55

Describes a user-defined Iterator that is also iterable.

## Extends

- `Iterator`\<`T`, `TReturn`, `TNext`\>

## Type Parameters

### T

`T`

### TReturn

`TReturn` = `any`

### TNext

`TNext` = `any`

## Methods

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<`T`, `TReturn`, `TNext`\>

Defined in: node\_modules/typescript/lib/lib.es2015.iterable.d.ts:56

#### Returns

`IterableIterator`\<`T`, `TReturn`, `TNext`\>

***

### next()

> **next**(...`__namedParameters`): [`IteratorResult`](../type-aliases/IteratorResult.md)\<`T`, `TReturn`\>

Defined in: node\_modules/typescript/lib/lib.es2015.iterable.d.ts:43

#### Parameters

##### \_\_namedParameters

\[\] | \[`TNext`\]

#### Returns

[`IteratorResult`](../type-aliases/IteratorResult.md)\<`T`, `TReturn`\>

#### Inherited from

`Iterator.next`

***

### return()?

> `optional` **return**(`value`?): [`IteratorResult`](../type-aliases/IteratorResult.md)\<`T`, `TReturn`\>

Defined in: node\_modules/typescript/lib/lib.es2015.iterable.d.ts:44

#### Parameters

##### value?

`TReturn`

#### Returns

[`IteratorResult`](../type-aliases/IteratorResult.md)\<`T`, `TReturn`\>

#### Inherited from

`Iterator.return`

***

### throw()?

> `optional` **throw**(`e`?): [`IteratorResult`](../type-aliases/IteratorResult.md)\<`T`, `TReturn`\>

Defined in: node\_modules/typescript/lib/lib.es2015.iterable.d.ts:45

#### Parameters

##### e?

`any`

#### Returns

[`IteratorResult`](../type-aliases/IteratorResult.md)\<`T`, `TReturn`\>

#### Inherited from

`Iterator.throw`
