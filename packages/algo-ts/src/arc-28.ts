import { NoImplementation } from './internal/errors'
import { DeliberateAny } from './internal/typescript-helpers'

/**
 * Emit an arc28 event log using either an ARC4Struct type or a named object type.
 * Object types must have an ARC4 equivalent type.
 *
 * Anonymous types cannot be used as the type name is used to determine the event prefix
 * @param event An ARC4Struct instance, or a plain object with a named type
 *
 * @example
 * class Demo extends Struct<{ a: UintN64 }> {}
 * emit(new Demo({ a: new UintN64(123) }))
 *
 * @example
 * type Demo = { a: uint64 }
 * emit<Demo>({a: 123})
 * // or
 * const d: Demo = { a: 123 }
 * emit(d)
 */
export function emit<TEvent extends Record<string, DeliberateAny>>(event: TEvent): void
/**
 * Emit an arc28 event log using an explicit name and inferred property/field types.
 * Property types must be ARC4 or have an ARC4 equivalent type.
 * @param eventName The name of the event (must be a compile time constant)
 * @param eventProps A set of event properties (order is significant)
 *
 * @example
 * emit("Demo", new UintN64(123))
 *
 * @example
 * const a: uint64 = 123
 * emit("Demo", a)
 */
export function emit<TProps extends [...DeliberateAny[]]>(eventName: string, ...eventProps: TProps): void
export function emit<T>(event: T | string, ...eventProps: unknown[]): void {
  throw new NoImplementation()
}
