[**@algorandfoundation/algorand-typescript**](../README.md)

***

[@algorandfoundation/algorand-typescript](../README.md) / urange

# Function: urange()

## Call Signature

> **urange**(`stop`): `IterableIterator`\<[`uint64`](../type-aliases/uint64.md)\>

Defined in: [packages/algo-ts/src/util.ts:138](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/util.ts#L138)

Generates an iterable sequence from 0...stop inclusive

### Parameters

#### stop

[`Uint64Compat`](../type-aliases/Uint64Compat.md)

The stop number of the sequence

### Returns

`IterableIterator`\<[`uint64`](../type-aliases/uint64.md)\>

## Call Signature

> **urange**(`start`, `stop`): `IterableIterator`\<[`uint64`](../type-aliases/uint64.md)\>

Defined in: [packages/algo-ts/src/util.ts:144](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/util.ts#L144)

Generates an iterable sequence from start...stop inclusive

### Parameters

#### start

[`Uint64Compat`](../type-aliases/Uint64Compat.md)

The start number of the sequence

#### stop

[`Uint64Compat`](../type-aliases/Uint64Compat.md)

The stop number of the sequence

### Returns

`IterableIterator`\<[`uint64`](../type-aliases/uint64.md)\>

## Call Signature

> **urange**(`start`, `stop`, `step`): `IterableIterator`\<[`uint64`](../type-aliases/uint64.md)\>

Defined in: [packages/algo-ts/src/util.ts:151](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/util.ts#L151)

Generates an iterable sequence from start...stop inclusive with increments of size step

### Parameters

#### start

[`Uint64Compat`](../type-aliases/Uint64Compat.md)

The start number of the sequence

#### stop

[`Uint64Compat`](../type-aliases/Uint64Compat.md)

The stop number of the sequence

#### step

[`Uint64Compat`](../type-aliases/Uint64Compat.md)

The step size of the sequence

### Returns

`IterableIterator`\<[`uint64`](../type-aliases/uint64.md)\>
