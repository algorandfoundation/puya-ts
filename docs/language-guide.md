# Algorand TypeScript Language Guide

Algorand TypeScript is a partial implementation of the TypeScript programming language that runs on the Algorand Virtual Machine (AVM). It defines a library of types, classes and functions to facilitate the development of smart contracts and logic signatures for the Algorand blockchain.

As a partial implementation of the TypeScript programming language, it maintains the syntax and semantics of TypeScript. The subset that is implemented may change over time, but it will never be a full implementation due to the restricted nature of the AVM as an execution environment. For example the `async` and `await` keywords do not make sense in a synchronous execution environment, and `try`/`catch` blocks are not possible as the AVM does not provide a mechanism for recovering from errors.

Being a partial implementation of TypeScript means that existing developer tooling such as syntax highlighting, linting, type checking, and auto formatters all work out of the box. Maintaining semantic compatability with the TypeScript language means that it is possible to reason about how an expression written in TypeScript will execute on the AVM. As an example, in the expression `a() || b()`, the function `b` will not execute if the function `a` returns a truthy value. Because we maintain this semantic compatability it is also possible to execute Algorand TypeScript locally in a NodeJs environment for testing and debugging purposes to gain a degree of confidence that the code will perform the same way on the AVM.

Having said that, there are some major limitations to defining a language and programming interface for authoring Algorand smart contracts in TypeScript which is ultimately restricted by what is presently possible EcmaScript. This presented some tradeoffs between maintaining absolute semantic compatibility with TypeScript, and having an unwieldy developer experience; versus a solution that is not strictly executable TypeScript, but is something that _looks_ familiar to a TypeScript developer and the execution can be emulated by transpilation of the source code prior to execution in Node.

A concrete example of this is that EcmaScript (and hence TypeScript) does not support operator overloading (and the [proposal](https://github.com/tc39/proposal-operator-overloading) to add support for this seems dead in the water). As a result, it is not possible to introduce new numeric types in TypeScript which work with native math operators such as `+` and `-`, and existing numeric types (`number` and `BigInt`) in EcmaScript are not compatible with the unsigned integers used by the AVM.

Another example is the equality operator `===`, in EcmaScript this always operates on reference equality for non-primitive types. In Algorand TypeScript, reference equality is not a helpful construct - particularly for introduced types that present as a primitive (eg. binary data). It is beneficial to sacrifice absolute semantic compatability here for the convenience of being able to compare binary data with the `===` operator (and similarly, to be able to use binary values in `switch`/`case` expressions) as we are able to use a transpiler to have the TypeScript code execute on a compatible fashion in Node.

EcmaScript is extremely liberal in its type system when it comes to type coercion in comparison between types. Algorand TypeScript aims to be more restrictive in this regard as this behaviour can often lead to unintended bugs. For example, the comparison between unrelated types in EcmaScript will simply return `false` (or something [barely predicable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality) if using the `==` operator). Algorand TypeScript will instead error as the comparison is likely a bug.

If you are interested in learning about the design of Algorand TypeScript, you can see our [Guiding Principals](lg-guiding-principals.md) for more detail including the Architectural Decision Records (ADRs) which got us here.


## Table of Contents

 - [Program Structure](lg-program-structure.md)
 - [Basic Types](lg-types.md)

