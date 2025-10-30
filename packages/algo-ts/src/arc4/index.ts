import { BaseContract } from '../base-contract'
import { NoImplementation } from '../internal/errors'
import { AnyFunction, DeliberateAny, InstanceMethod } from '../internal/typescript-helpers'
import { OnCompleteActionStr } from '../on-complete-action'
import { bytes, BytesCompat, uint64 } from '../primitives'
import { ARC4Encoded } from './encoded-types'

export * from './c2c'
export * from './encoded-types'

/**
 * The base type for all ARC4 contracts in Algorand TypeScript
 */
export class Contract extends BaseContract {
  /**
   * Default implementation of an ARC4 approval program, routes transactions to ABI or bare methods based on application
   * args and on completion actions
   */
  override approvalProgram(): boolean {
    throw new NoImplementation()
  }
}

/**
 * Defines conventional routing method names. When used, methods with these names will be implicitly routed to the corresponding
 * application lifecycle event.
 *
 * @remarks This behaviour is independent of a contract explicitly implementing this interface. The interface is provided simply to improve
 * the developer experience of using this feature.
 */
export interface ConventionalRouting {
  /**
   * The function to invoke when closing out of this application
   */
  closeOutOfApplication?: AnyFunction
  /**
   * The function to invoke when creating this application
   */
  createApplication?: AnyFunction
  /**
   * The function to invoke when deleting this application
   */
  deleteApplication?: AnyFunction
  /**
   * The function to invoke when opting in to this application
   */
  optInToApplication?: AnyFunction
  /**
   * The function to invoke when updating this application
   */
  updateApplication?: AnyFunction
}

/**
 * The possible options for a method being available on application create
 *
 * allow: This method CAN be called when the application is being created, but it is not required
 * disallow: This method CANNOT be called when the application is being created
 * require: This method CAN ONLY be called when the application is being created
 */
export type CreateOptions = 'allow' | 'disallow' | 'require'

/**
 * The possible options for the resource encoding to use for the method
 *
 * index: Application, Asset, and Account arguments are included in the transaction's relevant array. The argument value is the uint8 index of the resource in the that array.
 * value: Application, Asset and Account arguments are passed by their uint64 id (Application and Asset) or bytes[32] address (Account).
 */
export type ResourceEncodingOptions = 'index' | 'value'

/**
 * The possible options for validation behaviour for this method
 * args: ABI arguments are validated automatically to ensure they are encoded correctly.
 * unsafe-disabled: No automatic validation occurs. Arguments can instead be validated manually.
 */
export type ValidateEncodingOptions = 'unsafe-disabled' | 'args'

/**
 * Type alias for a default argument schema
 * @typeParam TContract The type of the contract containing the method this default argument is for
 */
export type DefaultArgument<TContract extends Contract> =
  | {
      /**
       * A compile time constant value to be used as a default
       */
      constant: string | boolean | number | bigint
    }
  | {
      /**
       * Retrieve the default value from a member of this contract. The member can be
       *
       * LocalState: The value is retrieved from the calling user's local state before invoking this method
       * GlobalState: The value is retrieved from the specified global state key before invoking this method
       * Method: Any readonly abimethod with no arguments can be used as a source
       */
      from: keyof TContract
    }
/**
 * Configuration options for an abi method
 * @typeParam TContract the type of the contract this method is a part of
 */
export type AbiMethodConfig<TContract extends Contract> = {
  /**
   * Which on complete action(s) are allowed when invoking this method.
   * @default 'NoOp'
   */
  allowActions?: OnCompleteActionStr | OnCompleteActionStr[]
  /**
   * Whether this method should be callable when creating the application.
   * @default 'disallow'
   */
  onCreate?: CreateOptions
  /**
   * Does the method only perform read operations (no mutation of chain state)
   * @default false
   */
  readonly?: boolean
  /**
   * Override the name used to generate the abi method selector
   */
  name?: string
  /**
   * The resource encoding to use for this method. The default is 'value'
   *
   * index: Application, Asset, and Account arguments are included in the transaction's relevant array. The argument value is the uint8 index of the resource in the that array.
   * value: Application, Asset and Account arguments are passed by their uint64 id (Application and Asset) or bytes[32] address (Account).
   *
   * The resource must still be 'available' to this transaction but can take advantage of resource sharing within the transaction group.
   */
  resourceEncoding?: ResourceEncodingOptions

  /**
   * Controls validation behaviour for this method.
   *
   * If "args", then ABI arguments are validated automatically to ensure they are encoded correctly.
   * If "unsafe-disabled", then no automatic validation occurs. Arguments can instead be validated using the validateEncoding(...) function.
   * The default behaviour of this option can be controlled with the --validate-abi-args CLI flag.
   */
  validateEncoding?: ValidateEncodingOptions

  /**
   * Specify default arguments that can be populated by clients calling this method.
   *
   * A map of parameter names to the default argument source
   */
  defaultArguments?: Record<string, DefaultArgument<TContract>>
}

/**
 * Declares the decorated method as an abimethod that is called when the first transaction arg matches the method selector
 * @param config The config for this abi method
 * @typeParam TContract the type of the contract this method is a part of
 */
export function abimethod<TContract extends Contract>(config?: AbiMethodConfig<TContract>) {
  return function <TArgs extends DeliberateAny[], TReturn>(
    target: (this: TContract, ...args: TArgs) => TReturn,
    ctx: ClassMethodDecoratorContext<TContract>,
  ): (this: TContract, ...args: TArgs) => TReturn {
    throw new NoImplementation()
  }
}
/**
 * Declares this abi method does not mutate chain state and can be called using a simulate call to the same effect.
 *
 * Shorthand for `@abimethod({readonly: true})`
 * @typeParam TContract the type of the contract this method is a part of
 */
export function readonly<TContract extends Contract, TArgs extends DeliberateAny[], TReturn>(
  target: (this: TContract, ...args: TArgs) => TReturn,
  ctx: ClassMethodDecoratorContext<TContract>,
): (this: TContract, ...args: TArgs) => TReturn {
  throw new NoImplementation()
}

/**
 * Configuration options for a bare method
 */
export type BareMethodConfig = {
  /**
   * Which on complete action(s) are allowed when invoking this method.
   * @default 'NoOp'
   */
  allowActions?: OnCompleteActionStr | OnCompleteActionStr[]
  /**
   * Whether this method should be callable when creating the application.
   * @default 'disallow'
   */
  onCreate?: CreateOptions
}

/**
 * Declares the decorated method as a baremethod that can only be called with no transaction args
 * @param config The config for this bare method
 * @typeParam TContract the type of the contract this method is a part of
 */
export function baremethod<TContract extends Contract>(config?: BareMethodConfig) {
  return function <TArgs extends DeliberateAny[], TReturn>(
    target: (this: TContract, ...args: TArgs) => TReturn,
    ctx: ClassMethodDecoratorContext<TContract>,
  ): (this: TContract, ...args: TArgs) => TReturn {
    throw new NoImplementation()
  }
}
/**
 * Returns the ARC4 method selector for a given ARC4 method signature. The method selector is the first
 * 4 bytes of the SHA512/256 hash of the method signature.
 * @param methodSignature An ARC4 contract method reference. (Eg. `MyContract.prototype.myMethod`)
 * @returns The ARC4 method selector. Eg. `02BECE11`
 */
export function methodSelector(methodSignature: InstanceMethod<Contract>): bytes<4>
/**
 * Returns the ARC4 method selector for a given ARC4 method signature. The method selector is the first
 * 4 bytes of the SHA512/256 hash of the method signature.
 * @param methodSignature An ARC4 method signature string (Eg. `hello(string)string`.  Must be a compile time constant)
 * @returns The ARC4 method selector. Eg. `02BECE11`
 */
export function methodSelector(methodSignature: string): bytes<4>
export function methodSelector(methodSignature: string | InstanceMethod<Contract>): bytes<4> {
  throw new NoImplementation()
}

/**
 * Interpret the provided bytes as an ARC4 encoded type
 * @param bytes An arc4 encoded bytes value
 * @param options Options for how the bytes should be converted
 * @param options.prefix The prefix (if any), present in the bytes value. This prefix will be validated and removed
 * @param options.strategy The strategy used for converting bytes.
 *         `unsafe-cast`: Reinterpret the value as an ARC4 encoded type without validation
 *         `validate`: Asserts the encoding of the raw bytes matches the expected type
 */
export function convertBytes<T extends ARC4Encoded>(
  bytes: BytesCompat,
  options: { prefix?: 'none' | 'log'; strategy: 'unsafe-cast' | 'validate' },
): T {
  throw new NoImplementation()
}

/**
 * Decode the provided bytes to a native Algorand TypeScript value
 * @param bytes An arc4 encoded bytes value
 * @param prefix The prefix (if any), present in the bytes value. This prefix will be validated and removed
 */
export function decodeArc4<T>(bytes: BytesCompat, prefix: 'none' | 'log' = 'none'): T {
  throw new NoImplementation()
}

/**
 * Encode the provided Algorand TypeScript value as ARC4 bytes
 * @param value Any native Algorand TypeScript value with a supported ARC4 encoding
 */
export function encodeArc4<const T>(value: T): bytes {
  throw new NoImplementation()
}

/**
 * Return the total number of bytes required to store T as bytes.
 *
 * T must represent a type with a fixed length encoding scheme.
 * @typeParam T Any native or arc4 type with a fixed encoding size.
 */
export function sizeOf<T>(): uint64 {
  throw new NoImplementation()
}
