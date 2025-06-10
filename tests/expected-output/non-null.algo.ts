import type { uint64 } from '@algorandfoundation/algorand-typescript'

function test(someArray: uint64[]) {
  // @expect-error The non-null assertion operator "!" is not valid here. It is only valid in limited scenarios where built in types require it. Eg. Array.prototype.pop
  const notNeeded = someArray[0]!

  // @expect-error This expression requires a non-null assertion operator "!" immediately proceeding it
  someArray.pop()
}
