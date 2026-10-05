import type { Application, uint64 } from '@algorandfoundation/algorand-typescript'
import { BaseContract, Contract } from '@algorandfoundation/algorand-typescript'
import { abiCall } from '@algorandfoundation/algorand-typescript/arc4'

export type Entry = { id: uint64; balance: uint64 }

abstract class Base extends Contract {
  protected abstract empty(id: uint64): Entry
  abstract label(): string

  // Calls through `this` resolve to the concrete contract's implementation
  getEmpty(id: uint64): Entry {
    return this.empty(id)
  }

  describe(): string {
    return this.label()
  }
}

// Abstract subclasses don't need to implement anything
abstract class Intermediate extends Base {}

export class First extends Intermediate {
  protected empty(id: uint64): Entry {
    return { id, balance: 10 }
  }

  label(): string {
    return 'first'
  }
}

// Implementations can be overridden again, and the previous one reached through super
export class Second extends First {
  protected empty(id: uint64): Entry {
    return { id, balance: 20 }
  }

  label(): string {
    return 'second'
  }

  firstLabel(): string {
    return super.label()
  }
}

// Public abstract methods provide an ABI signature that can be called
export class Caller extends Contract {
  callLabel(appId: Application): string {
    return abiCall<typeof Base.prototype.label>({ appId }).returnValue
  }
}

// Program methods can be abstract
abstract class ProgramBase extends BaseContract {
  abstract approvalProgram(): boolean

  clearStateProgram(): boolean {
    return true
  }
}

export class Programs extends ProgramBase {
  approvalProgram(): boolean {
    return true
  }
}

// An inherited method can be redeclared as abstract. A prototype call then reaches the inherited body, as in vanilla ts
class Defaults extends Contract {
  value(): uint64 {
    return 1
  }
}

abstract class RequiresValue extends Defaults {
  abstract override value(): uint64
}

export class ProvidesValue extends RequiresValue {
  value(): uint64 {
    return 2
  }

  fromPrototype(): uint64 {
    return RequiresValue.prototype.value()
  }
}
