import { ConstructorFor } from './internal/typescript-helpers'
import { uint64 } from './primitives'

/**
 * Base class for Algorand TypeScript Logic Signatures (also known as Smart Signatures)
 */
export abstract class LogicSig {
  /**
   * The logic signature program logic
   */
  abstract program(): boolean | uint64
}

/**
 * Alias for a numeric range specification.
 */
type NumberRange = {
  /**
   * The start point of the range (inclusive)
   */
  from: number
  /**
   * The end point of the range (inclusive)
   */
  to: number
}

/**
 * Defines optional configuration for a logic signature
 */
type LogicSigOptions = {
  /**
   * Determines which AVM version to use, this affects what operations are supported.
   * Defaults to value provided supplied on command line (which defaults to current mainnet version)
   */
  avmVersion?: 10 | 11 | 12 | 13
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
   */
  scratchSlots?: Array<number | NumberRange>
}

/**
 * The logicsig decorator can be used to specify additional configuration options for a logic signature
 * @param options An object containing the configuration options
 */
export function logicsig(options: LogicSigOptions) {
  return <T extends ConstructorFor<LogicSig>>(logicSig: T) => logicSig
}
