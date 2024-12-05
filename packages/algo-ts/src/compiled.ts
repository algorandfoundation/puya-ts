import { BaseContract } from './base-contract'
import { NoImplementation } from './impl/errors'
import { LogicSig } from './logic-sig'
import { bytes, uint64 } from './primitives'
import { Account } from './reference'
import { ConstructorFor, DeliberateAny } from './typescript-helpers'

/**
 * Provides compiled programs and state allocation values for a Contract. Created by calling `compile(ExampleContractType)`
 */
export type CompiledContract = {
  /**
   * Approval program pages for a contract, after template variables have been replaced and compiled to AVM bytecode
   */
  approvalProgram: [bytes, bytes]
  /**
   * Clear state program pages for a contract, after template variables have been replaced and compiled to AVM bytecode
   */
  clearStateProgram: [bytes, bytes]
  /**
   * By default, provides extra program pages required based on approval and clear state program size, can be overridden when calling `compile(ExampleContractType, { extraProgramPages: ... })`
   */
  extraProgramPages: uint64
  /**
   * By default, provides global num uints based on contract state totals, can be overridden when calling `compile(ExampleContractType, { globalUints: ... })`
   */
  globalUints: uint64
  /**
   * By default, provides global num bytes based on contract state totals, can be overridden when calling `compile(ExampleContractType, { globalBytes: ... })`
   */
  globalBytes: uint64
  /**
   * By default, provides local num uints based on contract state totals, can be overridden when calling `compile(ExampleContractType, { localUints: ... })`
   */
  localUints: uint64
  /**
   * By default, provides local num bytes based on contract state totals, can be overridden  when calling `compile(ExampleContractType, { localBytes: ... })`
   */
  localBytes: uint64
}

/**
 * Provides account for a Logic Signature. Created by calling `compile(LogicSigType)`
 */
export type CompiledLogicSig = {
  /**
   * Address of a logic sig program, after template variables have been replaced and compiled to AVM bytecode
   */
  account: Account
}

/**
 * Options for compiling a contract
 */
type CompileContractOptions = {
  /**
   * Number of extra program pages, defaults to minimum required for contract
   */
  extraProgramPages?: uint64
  /**
   * Number of global uint64s, defaults to value defined for contract
   */
  globalUints?: uint64
  /**
   * Number of global bytes, defaults to value defined for contract
   */
  globalBytes?: uint64
  /**
   * Number of local uint64s, defaults to value defined for contract
   */
  localUints?: uint64
  /**
   * Number of local bytes, defaults to value defined for contract
   */
  localBytes?: uint64
  /**
   * Template variables to substitute into the contract, key should be without the prefix, must evaluate to a compile time constant
   * and match the type of the template var declaration
   */
  templateVars?: Record<string, DeliberateAny>
  /**
   * Prefix to add to provided template vars, defaults to the prefix supplied on command line (which defaults to TMPL_)
   */
  templateVarsPrefix?: string
}

/**
 * Options for compiling a logic signature
 */
type CompileLogicSigOptions = {
  /**
   * Template variables to substitute into the contract, key should be without the prefix, must evaluate to a compile time constant
   * and match the type of the template var declaration
   */
  templateVars?: Record<string, DeliberateAny>
  /**
   * Prefix to add to provided template vars, defaults to the prefix supplied on command line (which defaults to TMPL_)
   */
  templateVarsPrefix?: string
}

/**
 * Compile a contract and return the resulting byte code for approval and clear state programs.
 * @param contract The contract class to compile
 * @param options Options for compiling the contract
 */
export function compile(contract: ConstructorFor<BaseContract>, options?: CompileContractOptions): CompiledContract
/**
 * Compile a logic signature and return an account ready for signing transactions.
 * @param logicSig The logic sig class to compile
 * @param options Options for compiling the logic sig
 */
export function compile(logicSig: ConstructorFor<LogicSig>, options?: CompileLogicSigOptions): CompiledLogicSig
export function compile(artefact: ConstructorFor<BaseContract> | ConstructorFor<LogicSig>): CompiledLogicSig | CompiledContract {
  throw new NoImplementation()
}
