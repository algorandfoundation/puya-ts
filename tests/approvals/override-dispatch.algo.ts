import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract } from '@algorandfoundation/algorand-typescript'
import { classes } from 'polytype'

abstract class Base extends Contract {
  value(): uint64 {
    return 1
  }

  read(): uint64 {
    return this.value()
  }
}

export class Leaf extends Base {
  // inherited method:
  // Base::read(): uint64 { return this.value() }  // this.value() resolves to Leaf.value

  override value(): uint64 {
    return 2
  }

  // Pinned to Base.value
  fromSuper(): uint64 {
    return super.value()
  }
}

abstract class Other extends Contract {
  value(): uint64 {
    return 3
  }

  readOther(): uint64 {
    return this.value()
  }
}

export class Multiple extends classes(Leaf, Other) {
  // inherited methods:
  // Base::read(): uint64 { return this.value() }  // this.value() resolves to Leaf.value, as Leaf is listed first
  // Other::readOther(): uint64 { return this.value() }  // this.value() resolves to Leaf.value, as Leaf is listed first

  // Pinned to Other.value
  fromOther(): uint64 {
    return super.class(Other).value()
  }
}
