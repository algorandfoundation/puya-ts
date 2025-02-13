[**@algorandfoundation/algorand-typescript**](../README.md)

***

[@algorandfoundation/algorand-typescript](../README.md) / TemplateVar

# Function: TemplateVar()

> **TemplateVar**\<`T`\>(`variableName`, `prefix`): `T`

Defined in: [packages/algo-ts/src/template-var.ts:10](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/template-var.ts#L10)

Declare a template variable which can be replaced at compile time with an environment specific value.

The final variable name will be `prefix + variableName`

## Type Parameters

• **T**

## Parameters

### variableName

`string`

The key used to identify the variable.

### prefix

`string` = `'TMPL_'`

The prefix to apply the variable name (Defaults to 'TMPL_')

## Returns

`T`
