[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [arc4](../../README.md) / [\<internal\>](../README.md) / IterableIterator

# Interface: IterableIterator\<T, TReturn, TNext\>

Defined in: node\_modules/typescript/lib/lib.es2015.iterable.d.ts:55

Describes a user-defined Iterator that is also iterable.

## Extends

- `Iterator`\<`T`, `TReturn`, `TNext`\>

## Type Parameters

• **T**

• **TReturn** = `any`

• **TNext** = `any`

## Methods

### \[iterator\]()

> **\[iterator\]**(): [`IterableIterator`](IterableIterator.md)\<`T`, `TReturn`, `TNext`\>

Defined in: node\_modules/typescript/lib/lib.es2015.iterable.d.ts:56

#### Returns

[`IterableIterator`](IterableIterator.md)\<`T`, `TReturn`, `TNext`\>

***

### next()

> **next**(...`__namedParameters`): [`IteratorResult`](../../../index/-internal-/type-aliases/IteratorResult.md)\<`T`, `TReturn`\>

Defined in: node\_modules/typescript/lib/lib.es2015.iterable.d.ts:43

#### Parameters

##### \_\_namedParameters

\[\] | \[`TNext`\]

#### Returns

[`IteratorResult`](../../../index/-internal-/type-aliases/IteratorResult.md)\<`T`, `TReturn`\>

#### Inherited from

`Iterator.next`

***

### return()?

> `optional` **return**(`value`?): [`IteratorResult`](../../../index/-internal-/type-aliases/IteratorResult.md)\<`T`, `TReturn`\>

Defined in: node\_modules/typescript/lib/lib.es2015.iterable.d.ts:44

#### Parameters

##### value?

`TReturn`

#### Returns

[`IteratorResult`](../../../index/-internal-/type-aliases/IteratorResult.md)\<`T`, `TReturn`\>

#### Inherited from

`Iterator.return`

***

### throw()?

> `optional` **throw**(`e`?): [`IteratorResult`](../../../index/-internal-/type-aliases/IteratorResult.md)\<`T`, `TReturn`\>

Defined in: node\_modules/typescript/lib/lib.es2015.iterable.d.ts:45

#### Parameters

##### e?

`any`

#### Returns

[`IteratorResult`](../../../index/-internal-/type-aliases/IteratorResult.md)\<`T`, `TReturn`\>

#### Inherited from

`Iterator.throw`
