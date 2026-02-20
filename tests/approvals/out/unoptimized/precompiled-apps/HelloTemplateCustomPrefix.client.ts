// This file is auto-generated, do not modify
/* eslint-disable */
import { Contract, abimethod, arc4, err } from '@algorandfoundation/algorand-typescript'

export class Greeting extends arc4.Struct<{
  name: arc4.Str
  termination: arc4.Str
}> {}

export abstract class HelloTemplateCustomPrefix extends Contract {
  @abimethod({ onCreate: 'require' })
  create(): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['DeleteApplication'] })
  delete(): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['UpdateApplication'] })
  update(): void {
    err('stub only')
  }

  @abimethod()
  greet(name: arc4.Str): arc4.Str {
    err('stub only')
  }

  @abimethod()
  sendGreetings(a: Greeting): arc4.Str {
    err('stub only')
  }
}
