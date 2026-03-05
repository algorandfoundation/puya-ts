/**
 * Example 09: Token Manager
 *
 * This example demonstrates inner transactions for full ASA lifecycle management.
 *
 * Features:
 * - itxn.assetConfig (create ASA with full address configuration)
 * - itxn.assetTransfer (opt-in, transfer, clawback)
 * - itxn.assetFreeze (freeze / unfreeze accounts)
 * - Asset reference properties (total, decimals, name, url, creator, manager, freeze, clawback)
 * - Full ASA lifecycle: create → opt-in → transfer → freeze → clawback → destroy
 * - GlobalState<Asset> for storing created asset reference
 * - Bootstrapping guard (assert !hasValue to prevent double-create)
 *
 * Prerequisites: LocalNet
 *
 * @note Educational only — not audited for production use.
 */

import type { Account, Asset, uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, Contract, Global, GlobalState, itxn, log, readonly, Txn, Uint64 } from '@algorandfoundation/algorand-typescript'

// Contract that manages the full lifecycle of an Algorand Standard Asset (ASA)
// example: TOKEN_MANAGER
export class TokenManager extends Contract {
  // Store the managed asset reference in global state
  managedAsset = GlobalState<Asset>()

  // Track total supply minted
  totalMinted = GlobalState<uint64>({ initialValue: Uint64(0) })

  /** Initialize the application — asset is created separately via createToken. */
  public createApplication(): void {}

  /**
   * Create a new ASA via inner transaction.
   * The contract becomes manager, reserve, freeze, and clawback authority.
   * @param name - Full name of the asset
   * @param unitName - Short unit name (e.g. "TKN")
   * @param total - Total supply of the token
   * @param decimals - Decimal places for display
   * @param url - URL with asset metadata
   * @param defaultFrozen - Whether new holders start frozen
   * @returns The created asset ID
   */
  public createToken(name: string, unitName: string, total: uint64, decimals: uint64, url: string, defaultFrozen: boolean): uint64 {
    // Bootstrapping guard — prevent calling createToken more than once
    assert(!this.managedAsset.hasValue, 'Token already created')

    // itxn.assetConfig — issue an inner transaction to create a new asset
    const result = itxn
      .assetConfig({
        total: total, // Total supply of the token
        decimals: decimals, // Decimal places for display
        defaultFrozen: defaultFrozen, // Whether new holders start frozen
        assetName: name, // Full name of the asset
        unitName: unitName, // Short unit name (e.g. "TKN")
        url: url, // URL with asset metadata
        manager: Global.currentApplicationAddress, // This contract manages the asset
        reserve: Global.currentApplicationAddress, // Reserve address
        freeze: Global.currentApplicationAddress, // Freeze authority
        clawback: Global.currentApplicationAddress, // Clawback authority
      })
      .submit()

    // Store the newly created asset in global state
    this.managedAsset.value = result.createdAsset

    // Record total supply
    this.totalMinted.value = total

    // Return the created asset ID
    return result.createdAsset.id
  }

  /**
   * Opt the contract into the managed asset so it can hold tokens.
   * A zero-amount self-transfer is the standard opt-in pattern.
   * @param asset - The managed asset to opt into
   */
  public optInToAsset(asset: Asset): void {
    // Verify the asset matches the managed asset
    assert(asset === this.managedAsset.value, 'Wrong asset')

    // itxn.assetTransfer — zero-amount self-transfer opts in
    itxn
      .assetTransfer({
        assetReceiver: Global.currentApplicationAddress, // Send to self
        xferAsset: asset, // The managed asset
        assetAmount: 0, // Zero amount = opt-in
      })
      .submit()
  }

  /**
   * Transfer tokens from the contract to a receiver.
   * @param asset - The managed asset to transfer
   * @param receiver - Destination account
   * @param amount - Number of tokens to send
   */
  public transfer(asset: Asset, receiver: Account, amount: uint64): void {
    assert(asset === this.managedAsset.value, 'Wrong asset')
    assert(amount > 0, 'Amount must be positive')

    // itxn.assetTransfer — send tokens from contract to receiver
    itxn
      .assetTransfer({
        assetReceiver: receiver, // Destination account
        xferAsset: asset, // The managed asset
        assetAmount: amount, // Number of tokens to send
      })
      .submit()
  }

  /**
   * Clawback tokens from a holder back to the contract.
   * Uses the assetSender field to revoke from the target account.
   * @param asset - The managed asset
   * @param target - Account to clawback from
   * @param amount - Amount to clawback
   */
  public clawback(asset: Asset, target: Account, amount: uint64): void {
    assert(asset === this.managedAsset.value, 'Wrong asset')
    // Only the app creator can perform clawbacks
    assert(Txn.sender === Global.creatorAddress, 'Only creator can clawback')

    // itxn.assetTransfer with assetSender — revoke tokens from target
    itxn
      .assetTransfer({
        assetSender: target, // Account to clawback from
        assetReceiver: Global.currentApplicationAddress, // Tokens return to contract
        xferAsset: asset, // The managed asset
        assetAmount: amount, // Amount to clawback
      })
      .submit()
  }

  /**
   * Freeze or unfreeze an account's holdings of the managed asset.
   * @param asset - The managed asset
   * @param target - Account to freeze/unfreeze
   * @param frozen - true to freeze, false to unfreeze
   */
  public freezeAccount(asset: Asset, target: Account, frozen: boolean): void {
    assert(asset === this.managedAsset.value, 'Wrong asset')
    // Only the app creator can freeze/unfreeze
    assert(Txn.sender === Global.creatorAddress, 'Only creator can freeze')

    // itxn.assetFreeze — update the target's frozen status
    itxn
      .assetFreeze({
        freezeAsset: asset, // The managed asset
        freezeAccount: target, // Account to freeze/unfreeze
        frozen: frozen, // true = freeze, false = unfreeze
      })
      .submit()
  }

  /**
   * Read on-chain asset properties to verify configuration.
   * Demonstrates Asset reference property access.
   * @param asset - The managed asset to verify
   * @returns The total supply of the asset
   */
  @readonly
  public verifyAssetConfig(asset: Asset): uint64 {
    assert(asset === this.managedAsset.value, 'Wrong asset')

    // Asset reference properties — read on-chain metadata
    const total: uint64 = asset.total // Total supply
    const decimals: uint64 = asset.decimals // Decimal places
    const defaultFrozen: boolean = asset.defaultFrozen // Default frozen flag

    // Asset address properties — read management addresses
    const creator: Account = asset.creator // Original creator
    const manager: Account = asset.manager // Current manager
    const freezeAddr: Account = asset.freeze // Freeze authority
    const clawbackAddr: Account = asset.clawback // Clawback authority

    // Asset byte properties — read name/url metadata
    log(asset.name) // Log asset name (bytes)
    log(asset.url) // Log asset URL (bytes)

    // Verify the contract is still managing this asset
    assert(manager === Global.currentApplicationAddress, 'Manager mismatch')
    assert(freezeAddr === Global.currentApplicationAddress, 'Freeze mismatch')
    assert(clawbackAddr === Global.currentApplicationAddress, 'Clawback mismatch')

    // Use the read values to avoid unused-variable warnings
    assert(creator !== Global.zeroAddress, 'No creator')
    assert(decimals < 20, 'Invalid decimals')
    assert(!defaultFrozen || defaultFrozen, 'Tautology check')

    return total
  }

  /**
   * Destroy the managed asset.
   * The creator must hold all units and be the sender.
   * @param asset - The managed asset to destroy
   */
  public destroyToken(asset: Asset): void {
    assert(asset === this.managedAsset.value, 'Wrong asset')
    // Only the app creator can destroy the asset
    assert(Txn.sender === Global.creatorAddress, 'Only creator can destroy')

    // itxn.assetConfig with only configAsset — destroys the asset
    itxn
      .assetConfig({
        configAsset: asset, // Asset to destroy (no other fields = deletion)
      })
      .submit()
  }
}
// example: TOKEN_MANAGER
