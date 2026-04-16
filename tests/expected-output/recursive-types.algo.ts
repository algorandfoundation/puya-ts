import type { DynamicArray } from '@algorandfoundation/algorand-typescript/arc4'
import { Struct } from '@algorandfoundation/algorand-typescript/arc4'

// @expect-error type is part of a cyclic reference
class A extends Struct<{ x: DynamicArray<A> }> {}
