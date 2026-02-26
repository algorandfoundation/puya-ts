/**
 * Example 15: Inheritance Showcase
 *
 * This example demonstrates single and multi-level inheritance with abstract classes.
 *
 * Features:
 * - Single inheritance (extending a base class)
 * - Multi-level inheritance (three levels deep)
 * - Abstract classes (abstract keyword prevents direct instantiation)
 * - Method overrides (replacing parent behaviour in subclasses)
 * - Super calls (super.method() and super() in constructors)
 * - Constructor patterns (state initialization via constructors)
 * - Mixing Contract and BaseContract hierarchies (both in one file + hybrid approvalProgram override)
 *
 * Prerequisites: LocalNet
 */
import type { uint64 } from '@algorandfoundation/algorand-typescript'
// Contract: ABI-routed base; BaseContract: raw approval/clear; GlobalState: typed global storage
import { abimethod, BaseContract, Contract, GlobalState, log, Uint64 } from '@algorandfoundation/algorand-typescript'

// ────────────────────────────────────────────────────────────────
// Part A: BaseContract hierarchy — abstract class + single inheritance
// ────────────────────────────────────────────────────────────────

// Abstract class extending BaseContract — cannot be deployed directly
abstract class Auditable extends BaseContract {
  // GlobalState declared in abstract base — inherited by all subclasses
  auditCount = GlobalState({ initialValue: Uint64(0) })

  // Protected concrete method — callable by subclasses but not externally
  protected recordAudit(): void {
    // uint64 arithmetic requires explicit type annotation
    const next: uint64 = this.auditCount.value + 1
    this.auditCount.value = next
  }
}

// Single inheritance: AuditedProcessor extends the abstract Auditable base
class AuditedProcessor extends Auditable {
  // New state at this level — not present in parent
  callTag = GlobalState<uint64>()

  // Constructor pattern: super() chains to parent, then initialises own state
  constructor() {
    super() // Required super() call in derived constructor
    this.callTag.value = 42 // Initialise level-specific state
  }

  // Implements approvalProgram — required by BaseContract hierarchy
  public approvalProgram(): boolean {
    this.recordAudit() // Call inherited protected method from Auditable
    log(this.auditCount.value) // Access inherited state
    return true
  }

  // clearStateProgram: approve unconditionally
  public clearStateProgram(): boolean {
    return true
  }
}

// ────────────────────────────────────────────────────────────────
// Part B: Contract (ARC4) hierarchy — multi-level + overrides + super
// ────────────────────────────────────────────────────────────────

// Level 1: Abstract ARC4 base with ownership pattern
abstract class Ownable extends Contract {
  // State at level 1 — inherited by all descendants
  owner = GlobalState<string>()

  // Base createApplication — sets initial owner
  @abimethod({ allowActions: 'NoOp', onCreate: 'require' })
  public createApplication(): void {
    this.owner.value = 'creator' // Default owner value
  }

  // Method that subclasses will override
  public getVersion(): uint64 {
    return Uint64(1) // Hardcoded base version
  }

  // Concrete method — inherited as-is by all subclasses
  public getOwner(): string {
    return this.owner.value // Read level-1 state
  }
}

// Level 2: Adds version tracking — multi-level inheritance (extends level 1)
class Versioned extends Ownable {
  // Additional state at level 2
  version = GlobalState({ initialValue: Uint64(1) })

  // Method override: replaces Ownable.getVersion with state-backed version
  public getVersion(): uint64 {
    return this.version.value // Read from state instead of hardcoded
  }

  // New method at level 2 — available to subclasses
  public bumpVersion(): uint64 {
    const next: uint64 = this.version.value + 1 // uint64 arithmetic annotation
    this.version.value = next
    return next
  }
}

// Level 3: Final deployable contract — deepest inheritance level
// Demonstrates super calls, method overrides, and hybrid approvalProgram override
export class InheritanceShowcase extends Versioned {
  // State at level 3
  label = GlobalState<string>()

  // Override createApplication — super call chains to Ownable.createApplication (level 1)
  @abimethod({ allowActions: 'NoOp', onCreate: 'require' })
  public createApplication(): void {
    super.createApplication() // Super call: sets owner from level 1
    this.label.value = 'initialized' // Additional initialization at level 3
  }

  // Method override with super call — calls Versioned.getVersion (level 2) then transforms result
  public getVersion(): uint64 {
    const base: uint64 = super.getVersion() // Super call to level 2
    const enhanced: uint64 = base + 100 // Offset to show override is active
    return enhanced
  }

  // New ABI method accessing level-3 state
  public getLabel(): string {
    return this.label.value
  }

  // Demonstrates calling inherited method from level 2, then own override
  public bumpAndGetVersion(): uint64 {
    this.bumpVersion() // Inherited from Versioned (level 2)
    return this.getVersion() // Calls this class's override (level 3)
  }

  // Hybrid pattern: override approvalProgram to mix BaseContract + Contract behaviour
  // Contract provides ABI routing in approvalProgram; overriding it lets you add
  // custom logic before/after routing while preserving ABI method dispatch
  override approvalProgram(): boolean {
    log('routing') // Custom pre-routing logic (BaseContract-style pattern)
    const result = super.approvalProgram() // Delegate to Contract's ABI router
    return result // Return routing result
  }
}
