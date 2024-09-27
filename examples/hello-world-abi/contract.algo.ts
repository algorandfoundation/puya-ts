import { arc4, log } from '@algorandfoundation/algorand-typescript'

abstract class Intermediate extends arc4.Contract {
  @arc4.abimethod({ allowActions: ['NoOp'], readonly: true })
  public sayBananas(): string {
    const result = `Bananas`
    log(result)
    return result
  }
}

export default class HelloWorldContract extends Intermediate {
  public sayHello(firstName: string, lastName: string): string {
    const result = `Hello ${firstName} ${lastName}`
    log(result)
    return result
  }
}
