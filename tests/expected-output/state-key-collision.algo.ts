import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Box, Contract, GlobalState, LocalState } from '@algorandfoundation/algorand-typescript'

class CollisionBase extends Contract {
  rootCounter = GlobalState<uint64>({ key: 'c' })
  ownerBox = Box<uint64>({ key: 'b' })
}

export class CollidesWithInheritedKey extends CollisionBase {
  // @expect-error Storage key "c" is used by more than one member: ...
  creationRound = GlobalState<uint64>({ key: 'c' })
}

export class CollidesWithDefaultKey extends Contract {
  // @expect-error Storage key "beta" is used by more than one member: ...
  alpha = GlobalState<uint64>({ key: 'beta' })
  beta = GlobalState<uint64>()
}

export class SameKeyDifferentKinds extends Contract {
  // The same key in global state, local state and a box does not collide
  globalValue = GlobalState<uint64>({ key: 'k' })
  localValue = LocalState<uint64>({ key: 'k' })
  boxValue = Box<uint64>({ key: 'k' })
}

export class DistinctKeys extends CollisionBase {
  other = GlobalState<uint64>({ key: 'd' })
}
