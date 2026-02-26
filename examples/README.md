# Puya-ts Example Contracts

A progressive suite of 18 Algorand smart contract examples demonstrating puya-ts features, from a basic counter to full DeFi and DAO patterns. Each example compiles to TEAL and deploys to LocalNet.

## Prerequisites

- [Node.js](https://nodejs.org/) >= 20
- [AlgoKit CLI](https://github.com/algorandfoundation/algokit-cli) installed with LocalNet running (`algokit localnet start`)

## Quick Start

```bash
# Build the compiler from the repo root
npm ci
npm run build

# Install example dependencies
cd examples
npm ci

# Run a single example (compiles, deploys, and exercises the contract)
npm run example 01-counter

# Run all 18 examples
./verify-all.sh
```

## Examples

| # | Name | Description | Key Features |
|---|------|-------------|--------------|
| 01 | [Counter](01-counter/) | GlobalState and uint64 arithmetic | `GlobalState<uint64>`, `@abimethod`, uint64 arithmetic, `createApplication` |
| 02 | [Greeter](02-greeter/) | String handling and `@readonly` methods | String params/returns, `@readonly`, JSDoc comments, template literals |
| 03 | [Raw Calculator](03-raw-calculator/) | BaseContract with raw approval program and no ABI routing | `BaseContract`, `approvalProgram()`, `Txn.applicationArgs`, `op.btoi`, free subroutines |
| 04 | [Logic Sig Gate](04-logic-sig-gate/) | LogicSig with template variables and signature verification | `LogicSig`, `@logicsig`, `TemplateVar`, `op.ed25519verifyBare` |
| 05 | [Type Explorer](05-type-explorer/) | Primitive types, conversions, and AVM opcodes | `uint64`/`biguint`/`bytes` conversions, `Bytes.fromHex`, `op.sha256`, `op.addw` |
| 06 | [Membership Registry](06-membership-registry/) | LocalState with opt-in and close-out lifecycle | `GlobalState`, `LocalState`, opt-in/close-out, `Account` properties, `assertMatch` |
| 07 | [ARC-4 Data Structures](07-arc4-data-structures/) | ARC-4 structs, arrays, tuples, and encoding round-trips | `arc4.Struct`, `StaticArray`, `DynamicArray`, `Tuple`, `encodeArc4`/`decodeArc4` |
| 08 | [Key-Value Store](08-key-value-store/) | Box and BoxMap storage with CRUD operations | `Box`, `BoxMap`, `.extract`/`.replace`/`.splice`, `@contract({ stateTotals })` |
| 09 | [Array Playground](09-array-playground/) | Native arrays, FixedArray, ReferenceArray, and iteration | `uint64[]`, `FixedArray`, `ReferenceArray`, `clone()`, `urange()`, `.entries()` |
| 10 | [Object Tuples](10-object-tuples/) | Objects as method params, return values, and state | Type aliases, destructuring, `GlobalState<Object>`, spread operator, `clone()` |
| 11 | [Token Manager](11-token-manager/) | Inner transactions for full ASA lifecycle management | `itxn.assetConfig`, `itxn.assetTransfer`, `itxn.assetFreeze`, `Asset` properties |
| 12 | [Multi-Txn Distributor](12-multi-txn-distributor/) | Grouped inner transactions and outer group access | `itxn.submitGroup`, `itxnCompose`, `gtxn` params, `TransactionType` |
| 13 | [Contract Factory](13-contract-factory/) | Compile, deploy, and call contracts from contracts | `compile`, `compileArc4`, `abiCall`, `methodSelector`, `TemplateVar` |
| 14 | [Event Logger](14-event-logger/) | ARC-28 event emission with structs and positional args | `emit()` with struct/type alias/positional/signature forms |
| 15 | [Inheritance Showcase](15-inheritance-showcase/) | Single and multi-level inheritance with abstract classes | Abstract classes, `super` calls, method overrides, constructor patterns |
| 16 | [Crypto Vault](16-crypto-vault/) | Hash functions, signature verification, and scratch space | `op.sha256`/`op.sha3_256`/`op.keccak256`, `ensureBudget`, `Scratch` |
| 17 | [DEX Pool](17-dex-pool/) | Constant-product AMM with inner transactions and wide math | Reserves, `op.mulw`/`op.divmodw`, `op.bsqrt`, `assertMatch`, `itxn.submitGroup` |
| 18 | [Governance DAO](18-governance-dao/) | Box/BoxMap storage with a full proposal lifecycle | `Box`, `BoxMap`, `arc4.Struct`, `arc4.DynamicArray`, `emit()`, `ensureBudget` |

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
3. Add an `index.ts` that compiles, deploys, and exercises the contract
4. Add the directory name to the `DIRS` array in `verify-all.sh`
5. Add a row to the examples table in this README
