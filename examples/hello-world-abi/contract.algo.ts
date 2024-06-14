import { arc4, str, Str } from '@algorandfoundation/algo-ts'
type aliasStr = str

abstract class Intermediate extends arc4.Contract {
  sayBananas(): str {
    return Str`Bananas`
  }
}

export default class HelloWorldContract extends Intermediate {
  sayHello(name: str, otherName: aliasStr): str {
    return Str`Hello ${name}${otherName}`
  }
}
