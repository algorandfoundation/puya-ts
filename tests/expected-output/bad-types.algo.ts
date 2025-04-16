import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract } from '@algorandfoundation/algorand-typescript'

type WithMethod = {
  x: uint64
  y(): uint64
}

class BadTypesAlgo extends Contract {
  x = 3

  test(arg: WithMethod) {}
}
