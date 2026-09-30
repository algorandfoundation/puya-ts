import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract } from '@algorandfoundation/algorand-typescript'
import { classes } from 'polytype'

class DropsParamBase extends Contract {
  protected value(a: uint64, b: uint64): uint64 {
    return a + b
  }

  read(): uint64 {
    return this.value(1, 2)
  }
}

class DropsParamLeaf extends DropsParamBase {
  // inherited method:
  // DropsParamBase::read(): uint64 { return this.value(1, 2) }  // this.value() resolves to DropsParamLeaf.value

  // @expect-error this.value() in DropsParamBase.read resolves to DropsParamLeaf.value in DropsParamLeaf, which has a different signature. Every implementation reached through a call must keep the parameter and return types the call was compiled against
  protected override value(a: uint64): uint64 {
    return a
  }
}

class DropsParamGrandchild extends DropsParamLeaf {
  // inherited method:
  // DropsParamBase::read(): uint64 { return this.value(1, 2) }  // same call and implementation as in DropsParamLeaf, so not reported again
}

type Result = { value: uint64 }
// Wrapper<Result> and Wrapper<{ extra; value }> both compile to a struct named Wrapper, but with different fields
type Wrapper<T> = { item: T }

class GenericAliasBase extends Contract {
  protected value(): Wrapper<Result> {
    return { item: { value: 1 } }
  }

  read(): uint64 {
    return this.value().item.value
  }
}

class GenericAliasLeaf extends GenericAliasBase {
  // inherited method:
  // GenericAliasBase::read(): uint64 { return this.value().item.value }  // this.value() resolves to GenericAliasLeaf.value

  // @expect-error this.value() in GenericAliasBase.read resolves to GenericAliasLeaf.value in GenericAliasLeaf, which has a different signature. Every implementation reached through a call must keep the parameter and return types the call was compiled against
  protected override value(): Wrapper<{ extra: uint64; value: uint64 }> {
    return { item: { extra: 10, value: 2 } }
  }
}

class Reporter extends Contract {
  // @expect-error this.info() in Auditor.audit resolves to Reporter.info in Audited, which has a different signature. Every implementation reached through a call must keep the parameter and return types the call was compiled against
  info(a: uint64): uint64 {
    return a
  }
}

class Auditor extends Contract {
  info(): uint64 {
    return 1
  }

  audit(): uint64 {
    return this.info()
  }
}

class Audited extends classes(Reporter, Auditor) {
  // inherited method:
  // Auditor::audit(): uint64 { return this.info() }  // this.info() resolves to Reporter.info, as Reporter is listed first
}

// ---- Allowed: no call reaches an implementation with a different compiled signature ----

// The only call is compiled against the override itself
class UncalledBase extends Contract {
  value(a: uint64): uint64 {
    return a
  }
}

class UncalledLeaf extends UncalledBase {
  override value(): uint64 {
    return 2
  }

  read(): uint64 {
    return this.value()
  }
}

// A void call site can only discard the result
class VoidReturnBase extends Contract {
  protected run(): void {}

  read(): uint64 {
    this.run()
    return 1
  }
}

class VoidReturnLeaf extends VoidReturnBase {
  // inherited method:
  // VoidReturnBase::read(): uint64 { this.run(); return 1 }  // this.run() resolves to VoidReturnLeaf.run, whose result is discarded

  protected override run(): uint64 {
    return 7
  }
}

// Siblings may differ as long as no call is rebound across them
class First extends Contract {
  set(v: string): string {
    return v
  }
}

class Second extends Contract {
  set(v: uint64): uint64 {
    return v
  }
}

class Both extends classes(First, Second) {
  test(s: string, n: uint64) {
    this.set(s)
    super.class(Second).set(n)
  }
}

// Differently named aliases with the same fields have the same structure
type ResultAlias = { value: uint64 }

class SameStructureBase extends Contract {
  protected record(arg: Result): Result {
    return arg
  }

  read(): uint64 {
    return this.record({ value: 1 }).value
  }
}

class SameStructureLeaf extends SameStructureBase {
  // inherited method:
  // SameStructureBase::read(): uint64 { return this.record({ value: 1 }).value }  // this.record() resolves to SameStructureLeaf.record

  protected override record(arg: ResultAlias): ResultAlias {
    return { value: arg.value + 1 }
  }
}
