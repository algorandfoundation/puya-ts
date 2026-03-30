---
title: "Intersection Types Support"
---

# Intersection Types Support

-   **Status**: Proposed
-   **Owner**: Ignacio "mega" Losiggio (Algorand Foundation)
-   **Deciders**: TBD
-   **Date created**: 2025-01-24
-   **Date decided**:
-   **Date updated**:

## Context

Algorand TypeScript is a semantically-compatible language subset suitable for static compilation of AVM programs (Smart Contracts and Logic Signatures).
This narrow focus means some parts of the source language are unimplemented and will remain as such.
The reasoning behind this is two-sided.
On one side the AVM is a constrained execution environment where a the whole dynamism available in the source language is too expensive to be useful.
On the other side the security constraints of our application domain make some characteristics of TypeScript into misfeatures (due to their ability to lure bugs into otherwise healthy codebases).

Type intersections is a _mostly_ safe static feature that allows programmers to reuse and combine their type definitions into new ones.
It is the dual of type unions, when looking at value types from a set-thoretic point-of-view these two operations act like their respective set operations.
The original [implementation](https://github.com/microsoft/TypeScript/pull/3622) of type intersections for TypeScript lays out the expected properties of this feature (identity, commutativity, associativity, subtyping relationships, etc).

While type unions require special runtime supporte every type intersection can be _resolved_ into a non-intersection type.
This allows `puya-ys` to desugar of these types into regular WTypes at the frontend level.
A type-equivalence check can be later added to avoid processing the same intersection multiple times.

As with any feature added to `puya-ts` it is important not only to ease the process of writing new contracts but also the process of maintaining them through time.
This constraint acts as the catalyst for the two main questions to be solved by this ADR:
1. Should the instances of struct-shaped intersection types ought to be persisted on-chain?
2. Which runtime representation should be use for struct-shaped intersection type instances?

**Note:** Struct-shaped means intersection types whose underlying representation is that of an object/tuple.
This allows us to differentiate from stuff like `("enumValue1" | "enumValue2" | "enumValue3") & ("enumValue2" | "enumValue4")` whose underlying representation is that of an atomic value with a well-known representation.
On array intersections the "array" part also has a well-know representation: it is the item type that can have a representation not yet decided.

See https://github.com/algorandfoundation/puya-ts/issues/318 for additional discussion.

## Requirements

- An implementation of type intersections that respects the basic typing rules at runtime:
  - Identity: `A & A` is equivalent to `A`.
  - Commutativity: `A & B` is _compatible_ with `B & A` (_compatible_ is a runtime-relaxed version of _equivalent_ described below).
  - Associativity: `A & (B & C)` is _compatible_ with `(A & B) & C`.
  - Supertype collapsing: `A & B` is equivalent to `A` when `A extends B`.

## Principles

- [AlgoKit Guiding Principles](https://github.com/algorandfoundation/algokit-cli/blob/main/docs/algokit.md#guiding-principles) - Specifically Seamless onramp, Meet developers where they are, Sustainable
- [TypeScript PR#3622](https://github.com/microsoft/TypeScript/pull/3622) - Basically a design guide for this feature in our source language.

## Options

### Option 1. Choose the tuple representation. Forbid persistence of intersection-typed values and their usage at ABI boundaries.

The tuple representation is treating `A & B` as "just" a tuple with all of `A`s properties followed by all of `B`s properties.
Common properties remain on `A`s place but have their type changed to the intersection between their `A` and their `B` definition.
Alternatively common properties with differing types can be outright banned.

For this option the specific representation is not important.
Intersection type values are only available at runtime therefore their representation is an implementation detail of our compiler.

Because of the possible upgradeablility nightmares of persisting intersection-typed values we can forbid their use on those circumstances.
This will force Algorand to write well-structured types for any piece of data they ought to store on-chain.
On large contracts composed of smaller pieces this reduces the chances of a type change somewhere breaking type definitions for on-chain data.

**Pros**

- Easy to implement (see https://github.com/algorandfoundation/puya-ts/issues/318).
- Can eventually evolve into any of the other two options if the need arises.
- Delimits a clear barrier between "runtime data" and "onchain data".

**Cons**

- Because desugaring is done at the frontend side some persistability checks that ought to be on the backend end up on the frontend (solvable by refactoring the backend a tiny bit).
- The feature is impaired to avoid undisciplined developers from easy mistakes while making their work more difficult to disciplined ones.

### Option 2. Choose the tuple representation, allow persistence documenting its caveats

Because the tuple representation is the "obvious" one we can allow value persistance and make this implementation detail a promise.
This allows experienced developers to write simpler code while knowing the specific layout they will get in case they need to perform data migration later.

**Pros**

- Easiest option to implement (see https://github.com/algorandfoundation/puya-ts/issues/318).
- Resulting contract code extremely simple if no migrations/multiversion data are required.

**Cons**

- The resulting feature is error prone in the worst of times (when an already successful application has to do updates).
- The tuple representation makes `A & B` distinct from `B & A`: they can be transformed into eachother (_compatible_) but are not _the same_ type.

### Option 3. Choose a stable representation, allow persistence documenting its cost

A stable representation can be devised with some work (prefix with a version, sort property names, put booleans at front, etc).
Can be as flexible as we want, but flexibility requires higher opcode costs.
This can be a useful representation for _all_ instances where data is stored (globalstate/localstate/boxes).

**Pros**

- Starts the road towards a nice maintainability story for Algorand TypeScript contracts.
- Can eventually be used to implement union types.
- Can be implemented at the `puya` level allowing `Algorand Python` to benefit from this work.

**Cons**

- Complex to implement.
- Error cases will be unintuitive even for highly skilled developers.
- On failure of the system writing migration code will be a lot harder for Algorand programmers.

## Preferred option

To be defined.

## Selected option

**To be defined.**
