import { arc4, str, Str } from '@algorandfoundation/algo-ts'

abstract class Intermediate extends arc4.Contract {
  public sayBananas(): str {
    return Str`Bananas`
  }
}

export default class HelloWorldContract extends Intermediate {
  public sayHello(name: str, otherName: str): str {
    return Str`Hello ${name}${otherName}`
  }
}
