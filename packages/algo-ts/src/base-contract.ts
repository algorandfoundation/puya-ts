import { NoImplementation } from './internal/errors'
import { ConstructorFor } from './internal/typescript-helpers'
import { uint64 } from './primitives'
import { NumberRange } from './util'

export abstract class BaseContract {
  public abstract approvalProgram(): boolean | uint64
  public clearStateProgram(): boolean | uint64 {
    return true
  }
}

/**
 * Options class to manually define the total amount of global and local state contract will use.
 *
 * This is not required when all state is assigned to `this.`, but is required if a
 * contract dynamically interacts with state via `AppGlobal.getBytes` etc, or if you want
 * to reserve additional state storage for future contract updates, since the Algorand protocol
 * doesn't allow increasing them after creation.
 */
export type StateTotals = {
  globalUints?: number
  globalBytes?: number
  localUints?: number
  localBytes?: number
}

export type ContractOptions = {
  /**
   * Determines which AVM version to use, this affects what operations are supported.
   * Defaults to value provided supplied on command line (which defaults to current mainnet version)
   */
  avmVersion?: 10 | 11

  /**
   * Override the name of the logic signature when generating build artifacts.
   * Defaults to the class name
   */
  name?: string
  /**
   * Allows you to mark a slot ID or range of slot IDs as "off limits" to Puya.
   * These slot ID(s) will never be written to or otherwise manipulating by the compiler itself.
   * This is particularly useful in combination with `op.gload_bytes` / `op.gload_uint64`
   * which lets a contract in a group transaction read from the scratch slots of another contract
   * that occurs earlier in the transaction group.
   *
   * In the case of inheritance, scratch slots reserved become cumulative. It is not an error
   * to have overlapping ranges or values either, so if a base class contract reserves slots
   * 0-5 inclusive and the derived contract reserves 5-10 inclusive, then within the derived
   * contract all slots 0-10 will be marked as reserved.
   */
  scratchSlots?: Array<number | NumberRange>
  /**
   * Allows defining what values should be used for global and local uint and bytes storage
   * values when creating a contract. Used when outputting ARC-32 application.json schemas.
   *
   * If left unspecified, the totals will be determined by the compiler based on state
   * variables assigned to `this`.
   *
   * This setting is not inherited, and only applies to the exact `Contract` it is specified
   * on. If a base class does specify this setting, and a derived class does not, a warning
   * will be emitted for the derived class. To resolve this warning, `stateTotals` must be
   * specified. An empty object may be provided in order to indicate that this contract should
   * revert to the default behaviour
   */
  stateTotals?: StateTotals
}

/**
 * The contract decorator can be used to specify additional configuration options for a smart contract
 * @param options An object containing the configuration options
 */
export function contract(options: ContractOptions) {
  return <T extends ConstructorFor<BaseContract>>(contract: T, ctx: ClassDecoratorContext) => {
    throw new NoImplementation()
  }
}
