# Puya-ts Example Contracts

A progressive suite of 16 Algorand smart contract examples demonstrating puya-ts features, from a basic counter to full DeFi and DAO patterns. Each example compiles to TEAL and deploys to LocalNet.

## Prerequisites

- [Node.js](https://nodejs.org/) >= 20
- [AlgoKit CLI](https://github.com/algorandfoundation/algokit-cli) installed with LocalNet running (`algokit localnet start`)

## Quick Start

```bash
# Build the compiler from the repo root
npm ci
npm run build

# Install example dependencies
cd examples/puya-ts
npm ci

# Run a single example (compiles, deploys, and exercises the contract)
npm run example 01-counter

# Run all 16 examples
./verify-all.sh
```

## Examples

| # | Name | Description | Key Features |
|---|------|-------------|--------------|
| 01 | [Counter](01-counter/) | GlobalState and uint64 arithmetic | `GlobalState<uint64>`, uint64 arithmetic (`+=`, `-=`), `createApplication` |
| 02 | [Greeter](02-greeter/) | String handling and `@readonly` methods | String params/returns, `@readonly`, JSDoc comments, template literals |
| 03 | [Logic Sig Gate](03-logic-sig-gate/) | LogicSig with template variables and Ed25519 signature verification | `LogicSig`, `@logicsig`, `TemplateVar`, `op.ed25519verifyBare` |
| 04 | [Type Explorer](04-type-explorer/) | `uint64`, `biguint`, and `bytes` types with AVM opcodes and wide math | `uint64`/`biguint`/`bytes` conversions, `Bytes.fromHex`, `op.sha256`, `op.addw` |
| 05 | [Membership Registry](05-membership-registry/) | Local state management with opt-in and close-out lifecycle | `GlobalState`, `LocalState`, opt-in/close-out, `Account` properties, `assertMatch` |
| 06 | [Key-Value Store](06-key-value-store/) | Box and BoxMap storage with CRUD operations | `Box`, `BoxMap`, `.extract`/`.replace`/`.splice`, `@contract({ stateTotals })` |
| 07 | [Array Playground](07-array-playground/) | Native arrays, FixedArray, ReferenceArray, and iteration patterns | `uint64[]`, `FixedArray`, `ReferenceArray`, `clone()`, `urange()`, `.entries()` |
| 08 | [Object Tuples](08-object-tuples/) | Objects as method params, return values, and state | Type aliases, destructuring, `GlobalState<Object>`, spread operator, `clone()` |
| 09 | [Token Manager](09-token-manager/) | Inner transactions for full ASA lifecycle management | `itxn.assetConfig`, `itxn.assetTransfer`, `itxn.assetFreeze`, bootstrapping guard |
| 10 | [Multi-Txn Distributor](10-multi-txn-distributor/) | Grouped inner transactions and outer group transaction access | `itxn.submitGroup`, `itxnCompose`, `gtxn` params, `TransactionType` |
| 11 | [Contract Factory](11-contract-factory/) | `compile`, `compileArc4`, and contract-to-contract calls | `compile`, `compileArc4`, `abiCall`, `methodSelector`, `TemplateVar` |
| 12 | [Event Logger](12-event-logger/) | ARC-28 event emission with native types and positional args | `emit<T>()` with native type aliases, positional and signature forms |
| 13 | [Inheritance Showcase](13-inheritance-showcase/) | Single and multi-level inheritance with abstract classes | Abstract classes, `super` calls, method overrides, polytype `classes()` |
| 14 | [Crypto Vault](14-crypto-vault/) | Hash functions, signature verification, and scratch space | `op.sha256`/`op.sha3_256`/`op.keccak256`, `ensureBudget`, `Scratch` |
| 15 | [DEX Pool](15-dex-pool/) | Constant-product AMM (x·y=k) with inner transactions and wide math | Reserves, `op.mulw`/`op.divmodw`, `op.bsqrt`, `assertMatch`, `itxn.submitGroup` |
| 16 | [Governance DAO](16-governance-dao/) | Full DAO proposal lifecycle using Box/BoxMap storage and ARC-28 events | `Box`, `BoxMap`, `arc4.Struct`, `arc4.DynamicArray`, `emit()`, `ensureBudget` |

## Shared Modules

- [`shared/utils.ts`](shared/utils.ts) — Runtime helpers for compilation, app-spec loading, assertions, and console output

## Troubleshooting

**LocalNet not running**
```
Error: connect ECONNREFUSED 127.0.0.1:4001
```
Start LocalNet with `algokit localnet start` and verify with `algokit localnet status`.

**Compiler build errors**
Make sure you ran `npm ci && npm run build` from the repo root before running examples.

**Stale LocalNet state**
If examples fail after a previous run, reset LocalNet to clear all deployed apps and accounts:
```bash
algokit localnet reset
```

**Type errors in contract files**
Contract files (`*.algo.ts`) use puya-ts types that are resolved by the compiler, not `tsc`. Type errors in your IDE for these files are expected and do not affect compilation.

## Development — Adding New Examples

1. Create a new directory following the naming convention: `NN-kebab-case-name/`
2. Add a `contract.algo.ts` with a JSDoc header describing what the example demonstrates:
   ```ts
   /**
    * Example: Your Example Name
    * Demonstrates ...
    * - Feature one
    * - Feature two
    * Prerequisites: LocalNet
    */
   ```
3. Wrap the contract class with `// example: UPPER_SNAKE_CASE` markers:
   ```ts
   // example: YOUR_EXAMPLE_NAME
   export class YourContract extends Contract {
     ...
   }
   // example: YOUR_EXAMPLE_NAME
   ```
4. Add an `index.ts` that compiles, deploys, and exercises the contract
5. Add the directory name to the `DIRS` array in `verify-all.sh`
6. Add a row to the examples table in this README
