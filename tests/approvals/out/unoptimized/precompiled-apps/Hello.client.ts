// This file is auto-generated, do not modify
import { Contract, abimethod, arc4, err } from '@algorandfoundation/algorand-typescript'

export class Greeting extends arc4.Struct<{
  name: arc4.Str
  termination: arc4.Str
}> {}

export abstract class Hello extends Contract {
  @abimethod({ onCreate: 'require' })
  helloCreate(greeting: arc4.Str): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['DeleteApplication'], onCreate: 'require' })
  delete(): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['UpdateApplication'], onCreate: 'require' })
  update(): void {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  greet(name: arc4.Str): arc4.Str {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  sendGreetings(a: Greeting): arc4.Str {
    err('stub only')
  }
}
