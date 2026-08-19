import { Contract, contract, LogicSig, logicsig } from '@algorandfoundation/algorand-typescript'

// The contracts and logic signatures all share the same body, so their compiled programs differ
// only by salting behaviour (`#pragma autosalt` and the trailing intcblock salt once on-curve)

export class DefaultSig extends LogicSig {
  program() {
    return true
  }
}

@logicsig({ autosalt: false })
export class NoSaltSig extends LogicSig {
  program() {
    return true
  }
}

@logicsig({ autosalt: true })
export class ForceSaltSig extends LogicSig {
  program() {
    return true
  }
}

export class DefaultContract extends Contract {
  noop() {}
}

@contract({ autosalt: false })
export class UnsaltedContract extends Contract {
  noop() {}
}

@contract({ autosalt: true })
export class SaltedContract extends Contract {
  noop() {}
}
