[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [index](../../README.md) / [\<internal\>](../README.md) / ClassDecoratorContext

# Interface: ClassDecoratorContext\<Class\>

Defined in: node\_modules/typescript/lib/lib.decorators.d.ts:44

Context provided to a class decorator.

## Type Parameters

• **Class** *extends* (...`args`) => `any` = (...`args`) => `any`

The type of the decorated class associated with this context.

## Properties

### kind

> `readonly` **kind**: `"class"`

Defined in: node\_modules/typescript/lib/lib.decorators.d.ts:48

The kind of element that was decorated.

***

### metadata

> `readonly` **metadata**: [`DecoratorMetadataObject`](../type-aliases/DecoratorMetadataObject.md)

Defined in: node\_modules/typescript/lib/lib.decorators.d.ts:72

***

### name

> `readonly` **name**: `undefined` \| `string`

Defined in: node\_modules/typescript/lib/lib.decorators.d.ts:51

The name of the decorated class.

## Methods

### addInitializer()

> **addInitializer**(`initializer`): `void`

Defined in: node\_modules/typescript/lib/lib.decorators.d.ts:70

Adds a callback to be invoked after the class definition has been finalized.

#### Parameters

##### initializer

(`this`) => `void`

#### Returns

`void`

#### Example

```ts
function customElement(name: string): ClassDecoratorFunction {
  return (target, context) => {
    context.addInitializer(function () {
      customElements.define(name, this);
    });
  }
}

@customElement("my-element")
class MyElement {}
```
