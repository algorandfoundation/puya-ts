import { Uint64 } from '@algorandfoundation/algo-ts'

function test() {
  // @expect-error Native array types are not valid as variable, parameter, return, or property types...
  const myArray = [Uint64(1), Uint64(2)]
}