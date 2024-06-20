# Walkthrough: Strings

This walkthrough will cover how strings are handled in Algorand TypeScript.

# TypeScript Equivalent

```ts
getValueAtIndex(input: string, idx: number): string {
    return `The value at ${idx} is ${input[idx]}`;
}

helloWorld(): string {
    return "Hello, World!";
}

concatStrings(a: string, b: string): string {
    return a + b;
}
```

# Problems

One of the [guiding principles](../../README.md#guiding-principals) for Algorand TypeScript is to maintain familiarity with TypeScript. This means ideally we natively support all of the features of `string`. The AVM, however, does not support character-based operations on strings. Implementing string-based operations in the AVM would be very inefficient and does not make sense in most smart contract contexts. If we did support indexing into strings, Algorand Type would have to be byte-based thus the same code in TypeScript would result in different output in Algorand TypeScript which could result in unexpected behavior.

## Example

### TypeScript

```ts
getValueAtIndex("👍", 0); // "The value at 0 is 👍"
```

### Algorand TypeScript

```ts
getValueAtIndex("👍", 0); // "The value at 0 is \xF0"
```

The same can be said for other character-based operations, such as `length`, `slice`, `splice`, etc.

# Proposed Solutions

## Option 5: Extended string prototype

This option proposes to support the `string` type but only support a subset of the prototype methods. In paticular, any character-based method would not be supported. Instead we would extend the `String` prototype with byte-based functions. For example:

| Native TypeScript | Algorand TypeScript |
| ----------------- | ------------------- |
| `[]`              | `getByte`           |
| `length`          | `byteLength`        |
| `slice`           | `sliceBytes`        |

### Questions

- How do you feel about not being able to use the `[]` operator (and other character-based functions) on strings?

## Option 4: Custom Class

Rather than having a partially implemented `string` class, we could create a custom class that represents a string. This class would have a constructor and tagged literal.

| Native TypeScript         | Algorand TypeScript             |
| ------------------------- | ------------------------------- |
| `helloName(name: string)` | `helloName(name: str)`          |
| `"Hello, World!"`         | <pre>Str\`Hello, World!\`</pre> |

**Note:** The exact type name may be anything. Some examples: `str`, `utf8`, `utf8String`. In the examples, `str` is used

### Questions

- How do you feel about not being able to use the `string` class or string literals?

# Feature Comparison

| Feature                     | Benefit                                                 | Option 5: Extended String Prototype | Option 4: Custom Class |
| --------------------------- | ------------------------------------------------------- | ----------------------------------- | ---------------------- |
| `string` support            | Can use the native `string` type they are familiar with | ✅                                  | ❌                     |
| String literals             | Can use `"` or `'` for literal string values            | ✅                                  | ❌                     |
| Fully-implemented prototype | IDEs **MAY\*** not show unsupported methods             | ❌                                  | ✅                     |
| Concatenation with `+`      | Can use `+` to concatenate two strings                  | ✅                                  | ❌                     |

\* TypeScript does have a [plugins feature](https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin#whats-a-language-service-plugin) that would enable us to modify the IDE experience, but it may be non-trivial for users to set up.

# Code Comparison

### Attempting Regular TypeScript

<table>
<tr>
<th>Option 5</th>
<th>Option 4</th>
</tr>

<tr>
<td>

```ts
getValueAtIndex(input: string, idx: number): string {
    // Error: [] not supported, use .getByte instead
    return `The value at ${idx} is ${input[idx]}`;
}

// The following functions work as-is

helloWorld(): string {
    return "Hello, World!";
}

concatStrings(a: string, b: string): string {
    return a + b;
}
```

</td>
<td>

```ts
// Error: string not supported, use str instead
getValueAtIndex(input: string, idx: number): string {
    // Error: Template literals not supported, use Str tag instead
    return `The value at ${idx} is ${input[idx]}`;
}

// Error: string not supported, use str instead
helloWorld(): string {
    // Error: String literals not supported, use Str tag instead
    return "Hello, World!";
}

// Error: string not supported, use str instead
concatStrings(a: string, b: string): string {
    // Error: + not supported on strings, use Str tag instead
    return a + b;
}
```

</td>

</tr>
</table>

### Algorand TypeScript

<table>
<tr>
<th>Option 5: Extended String Prototype</th>
<th>Option 4: Custom Class</th>
</tr>

<tr>
<td>

```ts
getValueAtIndex(input: string, idx: number): string {
    // Note use of .getByte instead of []
    return `The value at ${idx} is ${input.getByte(idx)}`;
}

helloWorld(): string {
    return "Hello, World!";
}

concatStrings(a: string, b: string): string {
    return a + b;
}

```

</td>
<td>

```ts
getValueAtIndex(input: str, idx: uint64): str {
    // Instead of string literals, we used a tagged template
    return Str`The value at ${idx} is ${input[idx]}`;
}

helloWorld(): string {
    return Str`Hello, World!`;
}

concatStrings(a: str, b: str): string {
    // Instead of using the `+` operator, we used a custom function
    return concat(a, b);
}
```

</td>

</tr>
</table>

## General Questions

- Would seeing errors in your IDE change your opinion on the proposed solutions?
- Would the IDE hiding unsupported methods change your opinions on the proposed solutions?
