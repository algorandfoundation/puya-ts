import type { DynamicArray } from '@algorandfoundation/algorand-typescript/arc4'
import { Bool, Struct } from '@algorandfoundation/algorand-typescript/arc4'

// @expect-error type 'A' is part of a cyclic reference
class A extends Struct<{ x: DynamicArray<A> }> {}

type Rec = () => Rec
// @expect-error type 'Rec' is part of a cyclic reference
export function foo(f: Rec) {
  return f
}

type F<T> = () => F<[T]>
// @expect-error type 'F' is part of a cyclic reference
export function bar(f: F<boolean>) {
  return f
}

// @expect-error type 'B' is part of a cyclic reference
class B<T> extends Struct<{ x: B<[T]> }> {}
class C extends B<Bool> {}
