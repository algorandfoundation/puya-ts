# Algorand TypeScript

Algorand TypeScript is a partial implementation of the TypeScript programming language that runs on the Algorand Virtual Machine (AVM). It includes a statically typed framework for development of Algorand smart contracts and logic signatures, with TypeScript interfaces to underlying AVM functionality that works with standard TypeScript tooling.

It maintains the syntax and semantics of TypeScript such that a developer who knows TypeScript can make safe assumptions
about the behaviour of the compiled code when running on the AVM. Algorand TypeScript is also executable TypeScript that can be run
and debugged on a Node.js virtual machine with transpilation to EcmaScript and run from automated tests.

Algorand TypeScript is compiled for execution on the AVM by PuyaTs, a TypeScript frontend for the [Puya](https://github.com/algorandfoundation/puya) optimising compiler that ensures the resulting AVM bytecode execution semantics that match the given TypeScript code. PuyaTs produces output that is directly compatible with AlgoKit typed clients to make deployment and calling easy.

## Documentation

- [Language Guide](https://algorandfoundation.github.io/algorand-typescript/language-guide/)
- [API Reference](https://algorandfoundation.github.io/algorand-typescript/api/)
- [CLI Guide](https://algorandfoundation.github.io/algorand-typescript/cli/)
- [Migration Guides](https://algorandfoundation.github.io/algorand-typescript/migration-guides/)
- [Release Notes](https://github.com/algorandfoundation/puya-ts/releases)
- [Contribution Guide](CONTRIBUTING.md)

For developing the documentation site locally, see the [docs README](docs/README.md).
