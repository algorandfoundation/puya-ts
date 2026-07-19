import type { uint64 } from '@algorandfoundation/algorand-typescript'

function test(someArray: uint64[]) {
  // @expect-warning The non-null assertion operator "!" has no effect (no-op) on non-optional types
  const notNeeded = someArray[0]!

  // @expect-error This expression requires a non-null assertion operator "!" immediately proceeding it
  someArray.pop()
}
