import { abimethod, Contract, GlobalState, LogicSig, op, TemplateVar } from '@algorandfoundation/algorand-typescript'

abstract class HelloBase extends Contract {
  greeting = GlobalState({ initialValue: '' })

  @abimethod({ allowActions: 'DeleteApplication' })
  delete() {}

  @abimethod({ allowActions: 'UpdateApplication' })
  update() {}

  greet(name: string): string {
    return `${this.greeting.value} ${name}`
  }
}

export class Hello extends HelloBase {
  @abimethod({ name: 'helloCreate', onCreate: 'require' })
  create(greeting: string) {
    this.greeting.value = greeting
  }
}

export class HelloTemplate extends HelloBase {
  constructor() {
    super()
    this.greeting.value = TemplateVar<string>('GREETING')
  }

  @abimethod({ onCreate: 'require' })
  create() {}
}

export class HelloTemplateCustomPrefix extends HelloBase {
  constructor() {
    super()
    this.greeting.value = TemplateVar<string>('GREETING', 'PRFX_')
  }

  @abimethod({ onCreate: 'require' })
  create() {}
}

function getBigBytes() {
  return op.bzero(4096)
}

export class LargeProgram extends Contract {
  getBigBytesLength() {
    return getBigBytes().length
  }

  @abimethod({ allowActions: 'DeleteApplication' })
  delete() {}
}

/**
 * This logic sig can be used to create a custodial account that will allow any transaction to transfer its
 * funds/assets.
 */
export class TerribleCustodialAccount extends LogicSig {
  program() {
    return true
  }
}
