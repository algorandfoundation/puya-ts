// This file is auto-generated, do not modify
import { Contract, abimethod, arc4, err } from '@algorandfoundation/algorand-typescript'

export class Greeting extends arc4.Struct<{
  name: arc4.Str
  termination: arc4.Str
}> {}

export abstract class HelloTemplate extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  create(): void {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  delete(): void {
    err('stub only')
  }

  @abimethod({ onCreate: 'require' })
  update(): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  greet(name: arc4.Str): arc4.Str {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  sendGreetings(a: Greeting): arc4.Str {
    err('stub only')
  }
}
