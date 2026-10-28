import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, Contract } from '@algorandfoundation/algorand-typescript'
import { classes } from 'polytype'

abstract class Base extends Contract {
  abstract value(): uint64
}

abstract class Other extends Contract {}

class SuperClassCall extends classes(Base, Other) {
  value(): uint64 {
    // @expect-error Base.value is abstract. Call it through `this` so the concrete contract's implementation is used
    return super.class(Base).value()
  }
}

class PrototypeCall extends Base {
  value(): uint64 {
    return 1
  }

  fromPrototype(): uint64 {
    // @expect-error Contract methods cannot be called through a class prototype. Use `this.value()`, `super.value()` or `super.class(...).value()` instead
    return PrototypeCall.prototype.value()
  }
}

// Callers compute the selector of an abstract ABI method from its declaration, so implementations must keep it
abstract class AbiBase extends Contract {
  abstract m(): uint64
}

class Renamed extends AbiBase {
  // @expect-error Renamed.m must keep the ABI name 'm' of the abstract ABI method AbiBase.m, but it uses 'other'
  @abimethod({ name: 'other' })
  m(): uint64 {
    return 1
  }
}

// Allowed: routing options don't change the selector
class Routed extends AbiBase {
  @abimethod({ allowActions: ['NoOp', 'OptIn'] })
  m(): uint64 {
    return 1
  }
}

// With multi-inheritance, the implementation can come from a base unrelated to the declaration
class SiblingImpl extends Contract {
  @abimethod({ name: 'renamed' })
  m(): uint64 {
    return 2
  }
}

// @expect-error SiblingImpl.m must keep the ABI name 'm' of the abstract ABI method AbiBase.m, but it uses 'renamed'
class FromSibling extends classes(AbiBase, SiblingImpl) {}

// Abstract methods can't be decorated, so an abstract override keeps the ABI config of the method it overrides
class CustomName extends Contract {
  @abimethod({ name: 'v' })
  value(): uint64 {
    return 1
  }
}

abstract class RequiresCustomName extends CustomName {
  abstract override value(): uint64
}

class KeepsCustomName extends RequiresCustomName {
  @abimethod({ name: 'v' })
  value(): uint64 {
    return 2
  }
}

class DropsCustomName extends RequiresCustomName {
  // @expect-error DropsCustomName.value must keep the ABI name 'v' of the abstract ABI method RequiresCustomName.value, but it uses 'value'
  value(): uint64 {
    return 3
  }
}
