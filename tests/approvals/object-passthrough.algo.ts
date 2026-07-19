import { Contract, abimethod, type uint64 } from '@algorandfoundation/algorand-typescript'

interface DescPraise {
  /** such a lovely `x` */
  x: uint64
}

interface DescDisparage {
  /** such a distasteful `x` */
  x: uint64
}

/** a type-level description, no field-level description */
interface DescTypeLevel {
  x: uint64
}

export class FieldDocMismatchContract extends Contract {
  @abimethod({ validateEncoding: 'unsafe-disabled' })
  forward(a: DescPraise): DescDisparage {
    return a
  }
}

export class DescSameContract extends Contract {
  @abimethod({ validateEncoding: 'unsafe-disabled' })
  forward(a: DescPraise): DescPraise {
    return a
  }
}

export class TypeLevelDocMismatchContract extends Contract {
  @abimethod({ validateEncoding: 'unsafe-disabled' })
  forward(a: DescPraise): DescTypeLevel {
    return a
  }
}
