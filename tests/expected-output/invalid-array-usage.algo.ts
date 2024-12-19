import { Uint64 } from '@algorandfoundation/algorand-typescript'

function test() {
  // @expect-error `Array<uint64>` is not valid as a variable, parameter, return, or property type. Please define a static tuple type or use an `as const` expression
  const myArray = [Uint64(1), Uint64(2)]
}
