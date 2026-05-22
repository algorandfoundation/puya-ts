import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import {
  abimethod,
  Contract,
  ensureBudget,
  OpUpFeeSource,
  op,
  urange,
} from '@algorandfoundation/algorand-typescript'

export class OpBudget extends Contract {
  // example: ENSURE_BUDGET_BASIC
  @abimethod()
  manyHashes(seed: bytes, rounds: uint64): bytes {
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
    ensureBudget(rounds * 40 + 100, OpUpFeeSource.GroupCredit)

    let digest = seed
    for (const _i of urange(rounds)) {
      digest = op.sha256(digest)
    }
    return digest
  }

  @abimethod()
  manyHashesAppPays(seed: bytes, rounds: uint64): bytes {
    ensureBudget(rounds * 40 + 100, OpUpFeeSource.AppAccount)

    let digest = seed
    for (const _i of urange(rounds)) {
      digest = op.sha256(digest)
    }
    return digest
  }

  @abimethod()
  manyHashesAny(seed: bytes, rounds: uint64): bytes {
    ensureBudget(rounds * 40 + 100, OpUpFeeSource.Any)

    let digest = seed
    for (const _i of urange(rounds)) {
      digest = op.sha256(digest)
    }
    return digest
  }

  // example: ENSURE_BUDGET_FEE_SOURCE
}
