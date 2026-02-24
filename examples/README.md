# puya-ts Example Contracts

A progressive suite of 18 Algorand smart contract examples demonstrating puya-ts features, from basic counter to full DeFi and DAO patterns.

## Examples

| # | Name | Tier | Description | Key Features |
|---|------|------|-------------|--------------|
| 01 | [Counter](01-counter/) | 1 - Fundamentals | Minimal contract with global state and arithmetic | `GlobalState<uint64>`, `@abimethod`, `createApplication`, uint64 arithmetic |
| 02 | [Greeter](02-greeter/) | 1 - Fundamentals | String handling and read-only methods | String params/returns, `@readonly`, JSDoc comments, template literals |
| 03 | [Raw Calculator](03-raw-calculator/) | 1 - Fundamentals | Low-level BaseContract with raw transaction args | `BaseContract`, `approvalProgram()`, `Txn.applicationArgs`, `op.btoi`, free subroutines |
| 04 | [Logic Sig Gate](04-logic-sig-gate/) | 1 - Fundamentals | Smart signature with template variables | `LogicSig`, `@logicsig`, `TemplateVar`, `assert`, `op.ed25519verifyBare` |
| 05 | [Type Explorer](05-type-explorer/) | 1 - Fundamentals | Primitive types, conversions, and low-level ops | `uint64`/`biguint`/`bytes` conversions, `Bytes.fromHex`, `op.sha256`, `op.addw` |
| 06 | [Membership Registry](06-membership-registry/) | 2 - State & Data | Global + local state with opt-in lifecycle | `GlobalState`, `LocalState`, opt-in/close-out, `Account` properties, `assertMatch` |
| 07 | [ARC-4 Data Structures](07-arc4-data-structures/) | 2 - State & Data | All ARC-4 encoded types | `arc4.Struct`, `StaticArray`, `DynamicArray`, `Tuple`, `Address`, `encodeArc4`/`decodeArc4` |
| 08 | [Key-Value Store](08-key-value-store/) | 2 - State & Data | Box storage CRUD and byte-level operations | `Box`, `BoxMap`, `.extract`/`.replace`/`.splice`, `@contract({ stateTotals })` |
| 09 | [Array Playground](09-array-playground/) | 2 - State & Data | Native array types and iteration patterns | `uint64[]`, `FixedArray`, `ReferenceArray`, `clone()`, `urange()`, `.entries()` |
| 10 | [Object Tuples](10-object-tuples/) | 2 - State & Data | Named types, destructuring, objects in state | Type aliases, destructuring, `GlobalState<Object>`, `clone()`, `assertMatch` |
| 11 | [Token Manager](11-token-manager/) | 3 - Transactions | Full ASA lifecycle via inner transactions | `itxn.assetConfig`, `itxn.assetTransfer`, `itxn.assetFreeze`, `Asset` properties |
| 12 | [Multi-Txn Distributor](12-multi-txn-distributor/) | 3 - Transactions | Grouped inner transactions and compose pattern | `itxn.submitGroup`, `itxnCompose`, `gtxn` params, `TransactionType` |
| 13 | [Contract Factory](13-contract-factory/) | 3 - Transactions | Compile, deploy, and call contracts from contracts | `compile`, `compileArc4`, `abiCall`, `methodSelector`, C2C calls, `TemplateVar` |
| 14 | [Event Logger](14-event-logger/) | 3 - Transactions | ARC-28 event emission patterns | `emit()` with struct/type alias/positional/signature forms |
| 15 | [Inheritance Showcase](15-inheritance-showcase/) | 4 - Advanced | Contract inheritance and method overrides | Abstract classes, `super` calls, multi-level inheritance, constructor patterns |
| 16 | [Crypto Vault](16-crypto-vault/) | 4 - Advanced | Cryptographic ops, budget management, scratch space | Hash functions, `ed25519verify`, `ensureBudget`, `Scratch`, `@contract({ avmVersion })` |
| 17 | [DEX Pool](17-dex-pool/) | 4 - Advanced | Constant-product AMM with wide math | Reserves, `op.mulw`/`op.divmodw`, `op.bsqrt`, `assertMatch`, inner transactions |
| 18 | [Governance DAO](18-governance-dao/) | 4 - Advanced | Full governance lifecycle with boxes and events | `Box`, `BoxMap`, `arc4.Struct`, `arc4.DynamicArray`, `emit()`, `ensureBudget` |

## Shared Modules

- [`shared/types.algo.ts`](shared/types.algo.ts) - Reusable `arc4.Struct` definitions (`ProposalId`, `MemberRecord`, `TransferEvent`)
- [`shared/helpers.algo.ts`](shared/helpers.algo.ts) - Free subroutines (`itoa`, `min`, `max`)

## Testing

Compile and deploy all examples:

```bash
npm run test:examples
```

Compile a single example:

```bash
npm run cli -- examples/01-counter/ --out-dir out
```

Compiled output (TEAL, ARC-32, ARC-56) is written to each example's `out/` directory. These outputs are gitignored.
