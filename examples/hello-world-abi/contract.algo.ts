import { arc4 } from '@algorandfoundation/algo-ts'

abstract class Intermediate extends arc4.Contract {
  @arc4.abimethod({ allowActions: ['NoOp'] })
  public sayBananas(): string {
    return `Bananas`
  }
}

export default class HelloWorldContract extends Intermediate {
  public sayHello(name: string, otherName: string): string {
    return `Hello ${name}${otherName}`
  }
}
