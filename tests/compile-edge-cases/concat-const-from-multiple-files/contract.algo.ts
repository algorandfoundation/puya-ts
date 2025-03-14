import { Contract } from '@algorandfoundation/algorand-typescript'
import { a, b } from './test.algo'
import { d } from './test1.algo'

export class HelloWorld extends Contract {
  public getHello(): string {
    const c = a + b + d // Concatenating strings from different files
    return `Hello ${c}`
  }
}
