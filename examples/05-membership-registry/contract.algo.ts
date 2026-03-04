/**
 * Example 05: Membership Registry
 *
 * This example demonstrates local state management with opt-in and close-out lifecycle.
 *
 * Features:
 * - GlobalState<uint64> for tracking member counts
 * - LocalState<uint64> for per-member registration data
 * - Opt-in lifecycle (@abimethod({ allowActions: 'OptIn' }))
 * - Close-out lifecycle (@abimethod({ allowActions: 'CloseOut' }))
 * - Account properties (.balance, .minBalance)
 * - Txn.sender and Global.round
 *
 * Prerequisites: LocalNet
 *
 * @note Educational only — not audited for production use.
 */
import type { Account, uint64 } from '@algorandfoundation/algorand-typescript'
// Contract: ABI-routed base class; GlobalState/LocalState: typed storage proxies
// abimethod: decorator for ABI methods with action control; Uint64: factory for uint64 constants
import { abimethod, assert, Contract, Global, GlobalState, LocalState, Txn, Uint64 } from '@algorandfoundation/algorand-typescript'

// Minimum algo balance (in microalgos) required to register as a member
const MIN_BALANCE_REQUIREMENT = Uint64(100_000)

// Membership registry contract — users opt in to register and close out to leave
// example: MEMBERSHIP_REGISTRY
export class MembershipRegistry extends Contract {
  // GlobalState tracking the total number of registered members
  totalMembers = GlobalState<uint64>()

  // GlobalState tracking the cumulative number of registrations (never decremented)
  totalRegistrations = GlobalState<uint64>()

  // LocalState storing the round number when the member joined
  joinedAtRound = LocalState<uint64>()

  // LocalState storing the member's balance snapshot at registration time
  balanceAtJoin = LocalState<uint64>()

  /** Initialise global counters to zero on app creation. */
  public createApplication(): void {
    // Set both global counters to zero using Uint64() factory
    this.totalMembers.value = Uint64(0)
    this.totalRegistrations.value = Uint64(0)
  }

  /** Opt-in handler — registers the caller as a member. */
  @abimethod({ allowActions: 'OptIn' })
  public register(): void {
    // Verify sender's account meets minimum balance requirement
    assert(Txn.sender.balance >= MIN_BALANCE_REQUIREMENT)

    // Store the current global round in the sender's local state via LocalState proxy
    this.joinedAtRound(Txn.sender).value = Global.round

    // Snapshot the sender's balance at registration using Account.balance property
    this.balanceAtJoin(Txn.sender).value = Txn.sender.balance

    // Increment global member count (uint64 arithmetic — annotate result type)
    const newTotal: uint64 = this.totalMembers.value + Uint64(1)
    this.totalMembers.value = newTotal

    // Increment cumulative registration counter
    const newRegistrations: uint64 = this.totalRegistrations.value + Uint64(1)
    this.totalRegistrations.value = newRegistrations
  }

  /** Close-out handler — removes the caller from the registry. */
  @abimethod({ allowActions: 'CloseOut' })
  public deregister(): void {
    // Decrement global member count on close-out
    const newTotal: uint64 = this.totalMembers.value - Uint64(1)
    this.totalMembers.value = newTotal
  }

  /**
   * Read the caller's membership info (joined round and balance snapshot).
   * @param member - the account to look up
   * @returns joined round, balance snapshot, current balance, and min balance
   */
  public getMemberInfo(member: Account): MemberInfo {
    return {
      // Read the joined-at round from member's local state
      joinedAtRound: this.joinedAtRound(member).value,
      // Read the balance snapshot from member's local state
      balanceAtJoin: this.balanceAtJoin(member).value,
      // Account.balance — current live balance of the member
      currentBalance: member.balance,
      // Account.minBalance — minimum required balance to keep the account open
      currentMinBalance: member.minBalance,
    }
  }

  /**
   * Check whether a member account meets the minimum balance requirement.
   * @param member - the account to check
   * @returns true if the member's balance meets the minimum requirement
   */
  public isMemberInGoodStanding(member: Account): boolean {
    // Verify the member still meets the balance threshold
    assert(member.balance >= MIN_BALANCE_REQUIREMENT)
    return true
  }
}

// Return type for getMemberInfo — plain object with uint64 fields
type MemberInfo = {
  joinedAtRound: uint64
  balanceAtJoin: uint64
  currentBalance: uint64
  currentMinBalance: uint64
}
// example: MEMBERSHIP_REGISTRY
