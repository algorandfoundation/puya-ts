# Architecture Decision Record - ARC4 by default

- **Status**: Draft
- **Owner:** Tristan Menzel
- **Deciders**: Alessandro Cappellato (Algorand Foundation), Bruno Martins (Algorand Foundation), Rob Moore (MakerX)
- **Date created**: 2024-06-06
- **Date decided**: N/A
- **Date updated**: 2024-06-06

## Context

A smart contract on the Algorand Blockchain consists of an approval program and a clear state program. Smart signatures (also known as logic signatures) consist of only an approval program. For signatures the approval program is run to determine if a transaction signed by the program should be considered valid. For contracts the clear state program is invoked for Application Call (`appl`) transactions which have an on-completion action (`apan`) set to clear state (`3`). The transaction is committed to the chain regardless of the outcome of a clear state program. For all other on completion actions the approval program is invoked. It is up to the approval program to inspect the current transaction's properties to determine the outcome of this transaction.

[ARC4](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0004.md) introduces conventions for encoding data passed to a smart contract, and for routing execution to specific subroutines within the approval program based on key properties of the Application Call transaction (eg. The on completion action and application args). It is the current standard for developing smart contracts on Algorand, but may not always be. There are several other ARCs such as [ARC32](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0032.md), [ARC56](https://github.com/algorandfoundation/ARCs/blob/e540d921502f19c720b64d8df1f09563158ca348/ARCs/arc-0056.md), and [ARC28](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0028.md) which build on, expand, or complement ARC4. 

The term ARC4 and ABI are sometimes used interchangeably however ABI refers to the generic concept of an Application Binary Interface (what ARC4 provides) and ARC4 being the specific implementation we have of an ABI on Algorand at this moment. 


## Requirements

- It must be possible to define a contract with ARC4 routed methods
- It must be possible to define a contract which doesn't use ARC4 routing

## Principles

- **[AlgoKit Guiding Principles](https://github.com/algorandfoundation/algokit-cli/blob/main/docs/algokit.md#guiding-principles)** - specifically Seamless onramp, Leverage existing ecosystem, Meet devs where they are
- **[Algorand Python Principles](https://algorandfoundation.github.io/puya/principles.html#principles)**
- **[Algorand TypeScript Guiding Principles](../README.md#guiding-principals)**

## Options

### Option 1 - ARC4 by default

The approach taken by TealScript is that contracts are ARC4 by default. All public methods are exposed as ABI methods (callable from outside the contract) and one must explicitly decorate a method that should not be ABI routed. Only one non abi routed method can be defined per on completion action and this method is invoked only if no other ABI routed methods handle the call first. It is not necessary to decorate an ABI method unless an on completion action that is not `NoOp` is required. 

```ts
class NonABIExample extends Contract {
   private add(x: uint64, y: uint64): uint64 {
      return x + y;
   }

   abiAdd(x: uint64, y: uint64): uint64 {
      return this.add(x, y);
   }

   @nonABIRouterFallback.call('NoOp')
   nonAbiAdd(): void {
      const x = btoi(this.txn.applicationArgs![0]);
      const y = btoi(this.txn.applicationArgs![1]);
      log(itob(this.add(x, y)));
   }
}
```

Handling of 'other' on completion actions can be done via decorators however the prescribed way in the documentation is to implement a [well-known](https://tealscript.netlify.app/guides/lifecycle/) method on your contract.

Pros:
 - A developer new to Algorand does not need to learn much about ARC4 in order to implement an ARC4 compliant contract.
 - Flexibility exists for advanced devs to 'break out' of the ARC4 default when desired (kind of)

Cons:
 - The current implementation in TealScript outputs a lot of redundant teal in scenarios where an advanced user wants to do their own routing
 - Doesn't give us a low friction path forward if ARC4 were to be replaced, or significantly updated
 - In TypeScript, class members are public by default which could lead to accidentally exposing a method which shouldn't be.


### Option 2 - Minimum Viable Smart Contract by default, ARC4 is opt in

The approach taken by Alogrand Python is that a smart contract which extends the base `algopy.Contract` class will inherit no behaviour beyond that described in the context above (ie. `onComplete == clearState ? clearStateProgram() : approvalProgram()`).  This means the minimum viable smart contract (MVSC) would look something like this:

```python
# Contract which always approves
class MVContract(Contract):
    def approval_program(self) -> bool:
        return True

    def clear_state_program(self) -> bool:
        return True
```

a TypeScript version might look like this:

```ts
export default class HelloWorldContract extends Contract {
   approvalProgram(): boolean {
      return true
   }

   clearState(): boolean {
      return true
   }
}

```

An ARC4 compliant contract would instead extend the `algopy.arc4.ARC4Contract` base class. Each method must be decorated with either `@abimethod` or `@subroutine` to indicate a public or private method. 

```python
class HelloWorldContract(ARC4Contract):
    @arc4.abimethod
    def hello(self, name: String) -> String:
        return "Hello, " + name
```

or in TypeScript

```ts
export default class HelloWorldContract extends arc4.Arc4Contract {
  @arc4.abimethod()
  sayHello(name: str): arc4.Str {
    return new arc4.Str(`Hello ${name}`)
  }
}
```

Pros:
- ARC4 support is built on top of a framework that can function in its own right giving us greater confidence we can support the next ARC if/when it comes, without breaking existing ARC4 support
- MVSC gives power users absolute control without ARC4 getting in the way
- Explicit decorators reduce the likelihood of accidentally exposing a method publicly.

Cons:
- A developer needs to consciously choose ARC4 which means they need to be aware of it beforehand, and require a basic understanding of its workings
- Requiring decorators on all methods adds noise to what might otherwise be a very terse contract.

### Option 3 - Option 2, but use public/private keywords

The specific characteristics of python that lead to mandatory decorators on all methods do not apply to the TypeScript solution. Whilst still keeping the separation of ARC4 from option 2, we could use TypeScript's `public` and `private` keywords to flag an ABI method versus a private subroutine. The decorator would still be used in cases where a non-default on completion action was required but otherwise optional. We can require explicit access keywords (`public`/`private`/`protected`) on all methods to work around the potential security issues of public by default.

```ts
export default class DemoContract extends arc4.Arc4Contract {
   // @arc4.abimethod({ allowActions: ['NoOp'] }) is implied 
   public generalNoOpMethod(): void {}

   @arc4.abimethod({ allowActions: ['NoOp', 'OptIn'] })
   public specificOnCompletion(): void {}

   private privateSubroutine(): void {}
}
```

Pros:
- Access modifier keywords are idiomatic TypeScript

Cons:
- Not as explicit / does this make it harder for newcomers?

## Preferred options

TBD

## Selected option

TBD
