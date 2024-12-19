import { uint64 } from './primitives'
import { ConstructorFor } from './typescript-helpers'

export abstract class LogicSig {
  abstract program(): boolean | uint64
}

/**
 * Defines optional configuration for a logic signature
 */
type LogicSigOptions = {
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
}

/**
 * The logicsig decorator can be used to specify additional configuration options for a logic signature
 * @param options An object containing the configuration options
 */
export function logicsig(options: LogicSigOptions) {
  return <T extends ConstructorFor<LogicSig>>(logicSig: T) => logicSig
}
