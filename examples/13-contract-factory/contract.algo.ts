/**
 * Example 13 — Contract Factory
 * Tier: 3 — Transactions & Interactions
 *
 * Features demonstrated:
 *   - compile() — compile a child contract class, get CompiledContract properties
 *   - compileArc4() — typed compilation returning a ContractProxy for typed c2c calls
 *   - abiCall() — contract-to-contract ABI method invocation with return values
 *   - methodSelector() — get 4-byte ARC4 method selector (method reference + string overloads)
 *   - TemplateVar — compile-time template variable substitution in child contract
 *   - CompiledContract properties (approvalProgram, clearStateProgram, extraProgramPages, globalUints, globalBytes, localUints, localBytes)
 *   - Contract-to-contract calls via inner transactions
 */

import type { Application, uint64 } from '@algorandfoundation/algorand-typescript'
import {
  abimethod,
  assert,
  compile,
  Contract,
  GlobalState,
  itxn,
  OnCompleteAction,
  TemplateVar,
} from '@algorandfoundation/algorand-typescript'
import { abiCall, compileArc4, decodeArc4, encodeArc4, methodSelector } from '@algorandfoundation/algorand-typescript/arc4'

// ═══════════════════════════════════════════════════════════════════
// Child Contract — a simple greeter deployed by the factory
// ═══════════════════════════════════════════════════════════════════

export class GreeterChild extends Contract {
  // GlobalState to hold the greeting prefix
  greeting = GlobalState({ initialValue: '' })

  constructor() {
    super()
    // TemplateVar — value injected at compile time via compile()/compileArc4() templateVars option
    this.greeting.value = TemplateVar<string>('GREETING')
  }

  // Create handler — required for deployment; greeting is set by TemplateVar in constructor
  @abimethod({ onCreate: 'require' })
  public create(): void {}

  // Return a personalized greeting combining stored state with the given name
  public greet(name: string): string {
    return `${this.greeting.value} ${name}`
  }

  // Allow deletion of this app (used by factory cleanup)
  @abimethod({ allowActions: 'DeleteApplication' })
  public delete(): void {}
}

// ═══════════════════════════════════════════════════════════════════
// Factory Contract — deploys and manages GreeterChild instances
// ═══════════════════════════════════════════════════════════════════

export class GreeterFactory extends Contract {
  // Track the most recently deployed child app
  lastChild = GlobalState<Application>()

  @abimethod({ allowActions: 'NoOp', onCreate: 'require' })
  public createApplication(): void {}

  /**
   * Deploy a child using compile() — manual inner transaction approach.
   * Demonstrates compile(), CompiledContract properties, methodSelector(), and encodeArc4.
   * Note: templateVars values must be compile-time constants.
   */
  public deployManual(): Application {
    // compile() — compiles GreeterChild with template variable substitution
    const compiled = compile(GreeterChild, {
      templateVars: { GREETING: 'hello' }, // TemplateVar values must be compile-time constants
    })

    // CompiledContract properties — access compiled program bytecode and state schema
    const approval = compiled.approvalProgram       // Approval program pages (readonly [bytes, bytes])
    const clear = compiled.clearStateProgram         // Clear state program pages (readonly [bytes, bytes])
    const extras = compiled.extraProgramPages         // Extra program pages needed (uint64)
    const gUints = compiled.globalUints               // Global uint64 slots reserved (uint64)
    const gBytes = compiled.globalBytes               // Global bytes slots reserved (uint64)
    const lUints = compiled.localUints                // Local uint64 slots reserved (uint64)
    const lBytes = compiled.localBytes                // Local bytes slots reserved (uint64)

    // methodSelector() with method reference — type-safe 4-byte ARC4 selector
    const createSelector = methodSelector(GreeterChild.prototype.create)

    // Deploy child via inner transaction using compiled programs and state schema
    const childApp = itxn
      .applicationCall({
        appArgs: [createSelector],             // ARC4 method selector as first arg
        approvalProgram: approval,             // Compiled approval program
        clearStateProgram: clear,              // Compiled clear state program
        extraProgramPages: extras,             // Additional program pages if needed
        globalNumUint: gUints,                 // Reserve global uint64 state slots
        globalNumBytes: gBytes,                // Reserve global bytes state slots
        localNumUint: lUints,                  // Reserve local uint64 state slots
        localNumBytes: lBytes,                 // Reserve local bytes state slots
      })
      .submit().createdApp                           // Get the created Application reference

    // Store reference to the deployed child
    this.lastChild.value = childApp

    return childApp
  }

  /**
   * Deploy a child using compileArc4() — typed contract proxy approach.
   * Demonstrates compileArc4() and its typed call interface.
   */
  public deployTyped(): Application {
    // compileArc4() — returns a ContractProxy with typed .call methods matching the child's ABI
    const compiled = compileArc4(GreeterChild, {
      templateVars: { GREETING: 'hi' }, // Different constant greeting for this deployment
    })

    // Typed call — compiled.call.create() dispatches a correctly-formed inner txn
    const childApp = compiled.call.create().itxn.createdApp

    // Store reference to the deployed child
    this.lastChild.value = childApp

    return childApp
  }

  /**
   * Call a deployed child's greet() method using abiCall().
   * Demonstrates abiCall() with method reference, args, and return value extraction.
   */
  public callChildGreet(app: Application, name: string): string {
    // abiCall() — invoke an ABI method on another contract, returns typed result
    const { returnValue } = abiCall({
      method: GreeterChild.prototype.greet, // Method reference for type-safe c2c call
      appId: app,                           // Target application to call
      args: [name],                         // ABI method arguments
    })

    return returnValue
  }

  /**
   * Call a deployed child using manual itxn + methodSelector + encode/decode.
   * Demonstrates methodSelector() string overload and manual ARC4 encoding.
   */
  public callChildManual(app: Application, name: string): string {
    // methodSelector() with method reference — type-safe selector from prototype
    const selectorFromRef = methodSelector(GreeterChild.prototype.greet)

    // methodSelector() with string signature — useful when contract source is unavailable
    const selectorFromStr = methodSelector('greet(string)string')

    // Both overloads produce the same 4-byte ARC4 selector
    assert(selectorFromRef === selectorFromStr, 'Selectors must match')

    // Manual c2c call: build inner txn with methodSelector + encodeArc4
    const txn = itxn
      .applicationCall({
        appId: app,                                          // Target app
        appArgs: [selectorFromRef, encodeArc4(name)],        // Selector + ABI-encoded argument
      })
      .submit()

    // decodeArc4() — extract the typed return value from the inner txn's last log entry
    const result = decodeArc4<string>(txn.lastLog, 'log')

    return result
  }

  /**
   * Delete a deployed child contract using abiCall() with OnCompleteAction.
   */
  public deleteChild(app: Application): void {
    // abiCall() with onCompletion — invoke delete with DeleteApplication action
    abiCall({
      method: GreeterChild.prototype.delete,              // Method reference to child's delete()
      appId: app,                                         // Target application
      onCompletion: OnCompleteAction.DeleteApplication,   // Required on-completion action for delete
    })
  }

  /**
   * Inspect all CompiledContract properties.
   * Returns extraProgramPages as a simple verification value.
   */
  @abimethod({ readonly: true })
  public inspectCompiled(): uint64 {
    // compile() — get CompiledContract with all schema properties
    const compiled = compile(GreeterChild, {
      templateVars: { GREETING: 'test' }, // Constant value for inspection
    })

    // Access every CompiledContract property for demonstration
    const _approval = compiled.approvalProgram    // readonly [bytes, bytes] — two program pages
    const _clear = compiled.clearStateProgram      // readonly [bytes, bytes] — two program pages
    const extras = compiled.extraProgramPages       // uint64 — extra pages for large programs
    const _gUints = compiled.globalUints            // uint64 — global uint64 state slots
    const _gBytes = compiled.globalBytes            // uint64 — global bytes state slots
    const _lUints = compiled.localUints             // uint64 — local uint64 state slots
    const _lBytes = compiled.localBytes             // uint64 — local bytes state slots

    return extras
  }
}
