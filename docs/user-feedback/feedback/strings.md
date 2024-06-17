# Feedback: Strings

Feedback for the [strings walkthrough](./../walkthroughs/strings.md).

The corresponding ADR is [here](../../architecture-decisions/2024-05-21_primitive-bytes-and-strings.md).

## Joe Polny (@joe-p)

### Option 5: Extended String Prototype With Branding

- I like being able to use the `string` type and string literals
- Ideally would want to be able to use character-based functions, but I understand the limitations
- I definitely prefer the explicit byte-based functions over semantic incompatability
- I find compiler/IDE errors on string functions acceptable, especially since there are many other limitations with Algorand TypeScript

### Option 4: Custom Class

- I don't like not being able to use string literals
- I don't like not being able to use `+` for concatenation (although I acknowledge this is minor)
- This feels rather foreign and verbose

### Overall Feedback

- I prefer option 5 due to familiarity with TypeScript even with the limitations
- I also like option 5 due to it being less of a breaking change coming from TEALScript
