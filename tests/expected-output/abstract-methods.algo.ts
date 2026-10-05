import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract } from '@algorandfoundation/algorand-typescript'

abstract class Base extends Contract {
  abstract value(): uint64
}

// TypeScript rejects `super.value()` and missing implementations, but not calls through the prototype
class PrototypeCall extends Base {
  value(): uint64 {
    return 1
  }

  fromPrototype(): uint64 {
    // @expect-error Base.value is abstract and has no implementation to call. Call it through `this` so the concrete contract's implementation is used
    return Base.prototype.value()
  }
}
