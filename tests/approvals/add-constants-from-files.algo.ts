import { Contract } from '@algorandfoundation/algorand-typescript'
import { a, b } from './constant-a.algo'
import { d } from './constant-b.algo'

export class HelloWorld extends Contract {
  public getHello(): string {
    const c = a + b + d // Concatenating strings from different files
    return `Hello ${c}`
  }
}
