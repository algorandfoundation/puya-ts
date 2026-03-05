/**
 * Example 03: Logic Signature Gate
 *
 * This example demonstrates a LogicSig with template variables and Ed25519 signature verification.
 *
 * Features:
 * - LogicSig (base class for smart signatures)
 * - @logicsig (decorator for LogicSig configuration)
 * - TemplateVar<bytes> (compile-time byte constant substitution)
 * - TemplateVar<uint64> (compile-time uint64 constant substitution)
 * - assert (runtime assertion with error message)
 * - Txn field checks (fee, typeEnum, rekeyTo, closeRemainderTo)
 * - op.ed25519verifyBare (Ed25519 signature verification)
 *
 * Prerequisites: LocalNet
 *
 * @note Educational only — not audited for production use.
 */
import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
// LogicSig: base class for smart signatures; logicsig: config decorator
// TransactionType: enum for transaction type comparison
// assert: runtime check; TemplateVar: compile-time constant injection
// Txn: current transaction fields; op: AVM opcode namespace; Global: network state
import { assert, Global, LogicSig, logicsig, op, TemplateVar, TransactionType, Txn } from '@algorandfoundation/algorand-typescript'

// @logicsig decorator configures the compiled output name
// example: LOGIC_SIG_GATE
@logicsig({ name: 'LogicSigGate' })
export class LogicSigGate extends LogicSig {
  /**
   * The single entry point — returns true to approve the transaction.
   * @returns true if all security checks pass
   */
  program(): boolean {
    // TemplateVar<bytes> injects a compile-time Ed25519 public key (32 bytes)
    const authorityKey = TemplateVar<bytes>('AUTHORITY_KEY')
    // TemplateVar<uint64> injects a compile-time maximum fee threshold
    const maxFee = TemplateVar<uint64>('MAX_FEE')

    // Assert the transaction fee does not exceed the templated maximum
    assert(Txn.fee <= maxFee, 'Fee exceeds maximum')

    // Assert this is a payment transaction using TransactionType enum
    assert(Txn.typeEnum === TransactionType.Payment, 'Must be a payment transaction')

    // Assert the transaction cannot rekey the signing account (Global.zeroAddress = no rekey)
    assert(Txn.rekeyTo === Global.zeroAddress, 'Rekey not allowed')

    // Assert the transaction cannot close out the remaining balance
    assert(Txn.closeRemainderTo === Global.zeroAddress, 'Close remainder not allowed')

    // op.arg(0) retrieves the first argument passed to the logic signature (the signature bytes)
    const signature = op.arg(0)

    // op.ed25519verifyBare verifies an Ed25519 signature over raw data (no domain separation)
    // Verifies that the transaction note was signed by the authority key
    assert(op.ed25519verifyBare(Txn.note, signature, authorityKey), 'Invalid signature')

    return true
  }
}
// example: LOGIC_SIG_GATE
