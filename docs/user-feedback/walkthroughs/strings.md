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

```ts
helloWorld(); // "Hello, World!"
getValueAtIndex("¡Hola!", 0); // "The value at 0 is ¡"
concatStrings("Hello, ", "World!"); // "Hello, World!"
```

# Reasons for Deviation

TypeScript strings are UTF-16 encoded and can be indexed by character. The AVM does not natively support character-based operations and they would be too expensive to implement. Instead, we need to use byte-based operations. This means that the above function call would work differently in Algorand TypeScript.

## TypeScript

```ts
getValueAtIndex("¡Hola!", 0); // "The value at 0 is ¡"
```

## Algorand TypeScript

```ts
getValueAtIndex("¡Hola!", 0); // "The value at 0 is \xC2"
```

The same can be said for other character-based operations, such as `length`, `slice`, `splice`, etc.

# Proposed Solutions

## Option 5: Extended string prototype with branding

### Attempting Regular TypeScript

```ts
getValueAtIndex(input: string, idx: number): string {
    return `The value at ${idx} is ${input[idx]}`; // IDE & Compiler Error: Algorand TypeScript does not support usage of [] on strings
}

// The following functions work as-is

helloWorld(): string {
    return "Hello, World!";
}

concatStrings(a: string, b: string): string {
    return a + b;
}
```

### Using Byte-Based Prototype Functions

```ts
getValueAtIndex(input: string, idx: number): string {
    // Note use of .getByte instead of []
    return `The value at ${idx} is ${input.getByte(idx)}`;
}
```

```ts
getValueAtIndex("¡Hola!", 0); // "The value at 0 is \xC2"
```

### Questions

- How do you feel about not being able to use the `[]` operator (and other character-based functions) on strings?

## Option 4: Custom Class

### Attempting Regular TypeScript

```ts
getValueAtIndex(input: string, idx: number): string {
    return `The value at ${idx} is ${input[idx]}`; // IDE & Compiler Error: string is not supported by Algorand TypeScript
}

helloWorld(): string {
    return "Hello, World!"; // IDE & Compiler Error: string is not supported by Algorand TypeScript
}

concatStrings(a: string, b: string): string {
    return a + b; // IDE & Compiler Error: string is not supported by Algorand TypeScript
}
```

### Using Custom Class

**Note:** The exact type name may be anything. Some examples: `str`, `utf8`, `utf8String`. In the examples, `str` is used

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

### Questions

- How do you feel about not being able to use the `string` class or string literals?
