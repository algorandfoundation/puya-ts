import { arc4, str, Str } from '@algorandfoundation/algo-ts'

export default class HelloWorldContract extends arc4.Arc4Contract {
  sayHello(name: str): str {
    return Str`Hello ${name}`
  }
}
