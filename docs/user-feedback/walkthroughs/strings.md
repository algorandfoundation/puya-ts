# Walkthrough: Strings

This walkthrough will cover how strings are handled in Algorand TypeScript.

# TypeScript Equivalent

```ts
getValueAtIndex(str: string, idx: number): string {
    return `The value at ${idx} is ${str[idx]}`;
}

helloWorld(): string {
    return "Hello, World!";
}

concatStrings(str1: string, str2: string): string {
    return str1 + str2;
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
getValueAtIndex(str: string, idx: number): string {
    return `The value at ${idx} is ${str[idx]}`; // Compiler Error: Algorand TypeScript does not support usage of [] on strings
}

helloWorld(): string {
    return "Hello, World!";
}

concatStrings(str1: string, str2: string): string {
    return str1 + str2;
}
```

### Using Byte-Based Prototype Functions

```ts
getValueAtIndex(str: string, idx: number): string {
    return `The value at ${idx} is ${str.getByte(idx)}`;
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
getValueAtIndex(str: string, idx: number): string {
    return `The value at ${idx} is ${str[idx]}`; // Compiler Error: string is not supported by Algorand TypeScript
}

helloWorld(): string {
    return "Hello, World!"; // Compiler Error: string is not supported by Algorand TypeScript
}

concatStrings(str1: string, str2: string): string {
    return str1 + str2; // Compiler Error: string is not supported by Algorand TypeScript
}
```

### Using Custom Class

```ts
getValueAtIndex(str: str, idx: str): str {
    return Str`The value at ${idx} is ${str[idx]}`;
}

helloWorld(): string {
    return Str`Hello, World!`;
}

concatStrings(str1: str, str2: str): string {
    return concat(str1, str2);
}
```

### Questions

- How do you feel about not being able to use the `string` class or string literals?

# Corresponding ADR(s)

- [Primitive Bytes and Strings](../../architecture-decisions/2024-05-21_primitive-bytes-and-strings.md)
