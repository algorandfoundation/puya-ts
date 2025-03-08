# Walkthrough: Math

This walkthrough will cover how strings are handled in Algorand TypeScript.

# Native TypeScript Baseline

```ts
addNumbers(): number {
    const a = 1;
    const b = 255;

    const sum = a + b;

    return sum;
}
```

# Problems

In Algorand, there are multiple ways to encode numbers with ARC4. The AVM natively supports `uint64`, but other widths can be encoded as byte arrays. For example, you can define smaller uints such as `uint8` or larger uints such as `uint256`. When developers use these specific-width integers, there may be certain expcetations for overlow checks. For example, ensuring a `uint8` does not exceed 255 (2^8 - 1). Doing these sort of overflow checks within the AVM can be rather expensive, so it's ideal to not do it on every operation. As such, we need to figure out when and how these overflow checks are performed.

# Proposed Solutions

## Overflow Checks at Boundaries

This option allows you to perform math operations directly on any uint variable. Overflow checks, however, will not be performed directly at the time of the operation. Instead, it will only occur when the value is used externally. For example, returned, logged, or stored.

## Explicit Encoding

This option requires developers to explicitly encode and decode the non-`uint64` numbers. Widths > 64 bits will need to be coverted to bytes to perform byte math operations and widths < 64 bits will need to be converted to `uint64` to perform math operations. Eventually, the developer will need to re-encode the value back to the desire width via a constructor or type definition.

# Feature Comparison

| Feature                  | Benefit                                                                            | Overflow Check at Boundaries | Explicit Encoding |
| ------------------------ | ---------------------------------------------------------------------------------- | ---------------------------- | ----------------- |
| Direct operation support | Math operations (ie. `+`, `-`, `*`, `/`) can be performed directly on the variable | ✅                           | ❌                |
| Number construction      | The developer has direct control over when overflow checks are performed           | ❌                           | ✅                |

# Code Comparison

<table>
<tr>
<th>Extended String Prototype</th>
<th>Custom Class</th>
</tr>

<tr>
<td>

```ts
addNumbers(): uint8 {
    const a: uint8 = 1;
    const b: uint8 = 255;

    const sum = a + b;

    // Runtime Error: Overflow
    return sum;
}
```

</td>
<td>

```ts
addNumbers(): uint8 {
    const a = Uint8(1);
    const b = Uint8(255);

    // Runtime Error: Overflow
    const sum = Uint8(a.uint64() + b.uint64());

    return sum;
}
```

</td>

</tr>
</table>

## General Questions

- How significant is potentially having a `uintN` variable being larger than `2^N - 1` during runtime before it's actually used?
- How important is to to be able to do overflow checks prior to the value being used?
