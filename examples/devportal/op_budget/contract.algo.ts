import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, Contract, ensureBudget, OpUpFeeSource, op, urange } from '@algorandfoundation/algorand-typescript'

/**
 * Demonstrates `ensureBudget`: the standard way to extend the AVM opcode
 * budget for operations that exceed the default 700-op-per-txn cap (besides
 * group pooling).
 *
 * Under the hood `ensureBudget` issues inner application calls to a no-op
 * `OpUp` app, each of which carries its own 700-op budget that this txn
 * can consume. The `OpUpFeeSource` argument controls how the inner txn fees
 * are paid.
 */
export class OpBudget extends Contract {
  // example: ENSURE_BUDGET_BASIC
  @abimethod()
  manyHashes(seed: bytes, rounds: uint64): bytes {
    // Each `op.sha256` costs 35 ops, so chaining many of them consumes budget
    // quickly. `ensureBudget(required)` requests enough additional budget to
    // cover `required` ops. The argument is the *total* op budget you want
    // available, not the delta from the current budget.
    //
    // ~40 ops per iteration (sha256 costs 35, plus loop overhead), plus a
    // 100-op allowance for method routing and returning.
    ensureBudget(rounds * 40 + 100)

    let digest = seed
    for (const _i of urange(rounds)) {
      digest = op.sha256(digest)
    }
    return digest
  }

  // example: ENSURE_BUDGET_BASIC

  // example: ENSURE_BUDGET_FEE_SOURCE
  @abimethod()
  manyHashesGroupCredit(seed: bytes, rounds: uint64): bytes {
    // `OpUpFeeSource.GroupCredit` (the default): the inner OpUp call sets
    // `fee=0` and relies on the outer transaction group having paid extra fees
    // in advance. Callers must include enough excess fee on some other txn in
    // the group to cover the inner OpUp calls. Cheapest when the caller is
    // already paying group fees anyway.
    ensureBudget(rounds * 40 + 100, OpUpFeeSource.GroupCredit)

    let digest = seed
    for (const _i of urange(rounds)) {
      digest = op.sha256(digest)
    }
    return digest
  }

  @abimethod()
  manyHashesAppPays(seed: bytes, rounds: uint64): bytes {
    // `OpUpFeeSource.AppAccount`: the application's own account pays for the
    // inner OpUp calls (their `fee` is set to `Global.minTxnFee`). Use this
    // when the caller cannot or should not over-pay the group fees. Requires
    // the app account to hold enough algos.
    ensureBudget(rounds * 40 + 100, OpUpFeeSource.AppAccount)

    let digest = seed
    for (const _i of urange(rounds)) {
      digest = op.sha256(digest)
    }
    return digest
  }

  @abimethod()
  manyHashesAny(seed: bytes, rounds: uint64): bytes {
    // `OpUpFeeSource.Any`: spend the group's excess fee credit first, then fall
    // back to the app account if more is needed. Most flexible; the right
    // default for contracts that want to be "polite" about fees.
    ensureBudget(rounds * 40 + 100, OpUpFeeSource.Any)

    let digest = seed
    for (const _i of urange(rounds)) {
      digest = op.sha256(digest)
    }
    return digest
  }

  // example: ENSURE_BUDGET_FEE_SOURCE
}
