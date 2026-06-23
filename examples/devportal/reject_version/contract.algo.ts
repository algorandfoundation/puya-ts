import type { Application, uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, arc4, assert, Contract, contract } from '@algorandfoundation/algorand-typescript'

/**
 * A minimal external target for RejectVersion to call into: an ARC-4
 * `hello(string)string` app. Not part of the rendered example snippets — it exists so
 * the on-chain tests have a real callee whose version can be pinned against.
 */
export class Hello extends Contract {
  @abimethod()
  hello(name: string): string {
    return `Hello, ${name}`
  }
}

/**
 * Demonstrates `rejectVersion`: an AVM v12 field on every application call
 * transaction that pins the caller to a maximum acceptable callee version.
 *
 * The callee's app version is incremented every time its approval or clear
 * program is updated. If `rejectVersion > 0` and the callee's current
 * version is **>=** `rejectVersion`, the AVM rejects the call before any
 * bytecode executes. Setting `rejectVersion = N + 1` means "I accept
 * versions 0..N inclusive; refuse if newer".
 *
 * Some use cases:
 *   - Defend against silent upgrades of an integrated dependency.
 *   - Lock a one-time interaction to a specific audited version.
 *   - Check (or make sure that) a contract has been properly updated.
 */
@contract({ avmVersion: 12 })
export class RejectVersion extends Contract {
  // example: REJECT_VERSION_INNER_CALL
  /**
   * Send an inner ApplicationCall that refuses to execute if `target`
   * has been upgraded past `maxVersion`.
   *
   * `rejectVersion = maxVersion + 1` means "fail unless the callee's
   * version is <= maxVersion". This is the canonical pattern for
   * pinning to "the version I audited", forward-compatible with whatever
   * version number the caller has actually audited.
   */
  @abimethod()
  callPinned(target: Application, maxVersion: uint64): string {
    const { returnValue } = arc4.abiCall({
      method: Hello.prototype.hello,
      args: ['World'],
      appId: target,
      rejectVersion: maxVersion + 1,
      fee: 0,
    })
    return returnValue
  }
  // example: REJECT_VERSION_INNER_CALL

  // example: REJECT_VERSION_CHECK_BEFORE_CALL
  /**
   * Check `target.version` explicitly, then call. It reads the same
   * counter that `rejectVersion` is compared against (`target` must be
   * an available resource; fails if the app does not exist).
   *
   * We use it here to enforce a `minVersion`, i.e. make sure a
   * contract was actually updated.
   */
  @abimethod()
  callChecked(target: Application, unsafeVersion: uint64): string {
    assert(target.version > unsafeVersion, 'target bug has not been patched yet')

    const { returnValue } = arc4.abiCall({
      method: Hello.prototype.hello,
      args: ['World'],
      appId: target,
      fee: 0,
    })
    return returnValue
  }
  // example: REJECT_VERSION_CHECK_BEFORE_CALL
}
