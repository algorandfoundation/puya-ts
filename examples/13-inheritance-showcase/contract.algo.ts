/**
 * Example 13: Inheritance Showcase
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
 * - Multiple inheritance via polytype classes() (combining independent base contracts)
 *
 * Prerequisites: LocalNet
 *
 * @note Educational only — not audited for production use.
 */
import type { uint64 } from '@algorandfoundation/algorand-typescript'
// Contract: ABI-routed base; BaseContract: raw approval/clear; GlobalState: typed global storage
import { BaseContract, Contract, GlobalState, log, Uint64 } from '@algorandfoundation/algorand-typescript'
// polytype: enables multiple inheritance via classes() combinator
import { classes } from 'polytype'

// ────────────────────────────────────────────────────────────────
// Part A: BaseContract hierarchy — abstract class + single inheritance
// ────────────────────────────────────────────────────────────────

// example: INHERITANCE_SHOWCASE
// Abstract class extending BaseContract — cannot be deployed directly
abstract class Auditable extends BaseContract {
  // GlobalState declared in abstract base — inherited by all subclasses
  auditCount = GlobalState({ initialValue: Uint64(0) })

  /** Protected concrete method — callable by subclasses but not externally. */
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

  /**
   * Implements approvalProgram — required by BaseContract hierarchy.
   * @returns true to approve the transaction
   */
  public approvalProgram(): boolean {
    this.recordAudit() // Call inherited protected method from Auditable
    log(this.auditCount.value) // Access inherited state
    return true
  }

  /**
   * Approve unconditionally.
   * @returns true to approve the clear-state call
   */
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

  /** Set the initial owner. */
  public createApplication(): void {
    this.owner.value = 'creator' // Default owner value
  }

  /**
   * Return the version — subclasses will override.
   * @returns the base version number
   */
  public getVersion(): uint64 {
    return Uint64(1) // Hardcoded base version
  }

  /**
   * Return the owner — inherited as-is by all subclasses.
   * @returns the current owner
   */
  public getOwner(): string {
    return this.owner.value // Read level-1 state
  }
}

// Level 2: Adds version tracking — multi-level inheritance (extends level 1)
class Versioned extends Ownable {
  // Additional state at level 2
  version = GlobalState({ initialValue: Uint64(1) })

  /**
   * Override Ownable.getVersion with state-backed version.
   * @returns the current version from state
   */
  public getVersion(): uint64 {
    return this.version.value // Read from state instead of hardcoded
  }

  /**
   * Increment the version and return the new value.
   * @returns the new version number after incrementing
   */
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

  /** Override createApplication — super call chains to Ownable.createApplication. */
  public createApplication(): void {
    super.createApplication() // Super call: sets owner from level 1
    this.label.value = 'initialized' // Additional initialization at level 3
  }

  /**
   * Override getVersion — calls Versioned.getVersion then adds an offset.
   * @returns the version with an added offset of 100
   */
  public getVersion(): uint64 {
    const base: uint64 = super.getVersion() // Super call to level 2
    const enhanced: uint64 = base + 100 // Offset to show override is active
    return enhanced
  }

  /**
   * Return the label from level-3 state.
   * @returns the current label value
   */
  public getLabel(): string {
    return this.label.value
  }

  /**
   * Bump the version via inherited method, then return via own override.
   * @returns the new version after bumping, with offset applied
   */
  public bumpAndGetVersion(): uint64 {
    this.bumpVersion() // Inherited from Versioned (level 2)
    return this.getVersion() // Calls this class's override (level 3)
  }

  /**
   * Override approvalProgram to add custom pre-routing logic while preserving ABI dispatch.
   * @returns the routing result from the parent approvalProgram
   */
  override approvalProgram(): boolean {
    log('routing') // Custom pre-routing logic (BaseContract-style pattern)
    const result = super.approvalProgram() // Delegate to Contract's ABI router
    return result // Return routing result
  }
}

// ────────────────────────────────────────────────────────────────
// Part C: Multiple inheritance via polytype — combining independent bases
// ────────────────────────────────────────────────────────────────

// Independent base: pausable contract with a paused flag
class Pausable extends Contract {
  paused = GlobalState({ initialValue: false })

  /** Initialize the application. */
  public createApplication(): void {
    this.paused.value = false
  }

  /** Set the paused flag to true. */
  public pause(): void {
    this.paused.value = true
  }

  /** Set the paused flag to false. */
  public unpause(): void {
    this.paused.value = false
  }

  /**
   * Return whether the contract is paused.
   * @returns true if the contract is paused
   */
  public isPaused(): boolean {
    return this.paused.value
  }
}

// Independent base: describable contract with a description field
class Describable extends Contract {
  description = GlobalState<string>()

  /** Initialize the application. */
  public createApplication(): void {
    this.description.value = 'none'
  }

  /**
   * Set the description.
   * @param desc - the new description to store
   */
  public setDescription(desc: string): void {
    this.description.value = desc
  }

  /**
   * Return the description.
   * @returns the current description
   */
  public getDescription(): string {
    return this.description.value
  }
}

// Multiple inheritance: combines Pausable and Describable via polytype classes()
// Both base classes contribute state and methods to the derived contract
export class MultiInheritanceShowcase extends classes(Pausable, Describable) {
  /** Override createApplication to initialise both bases. */
  public createApplication(): void {
    this.paused.value = false
    this.description.value = 'multi-inherited'
  }

  /**
   * Return status from both parent classes — paused flag or description.
   * @returns "paused" if paused, otherwise the description
   */
  public getStatus(): string {
    if (this.paused.value) {
      return 'paused'
    }
    return this.description.value
  }
}
// example: INHERITANCE_SHOWCASE
