import { Contract } from '@algorandfoundation/algorand-typescript'
import { classes } from 'polytype'
import { ContractB } from './b.algo'

class ContractA extends Contract {
  hello() {
    return 'hello'
  }
}

class ContractC extends classes(ContractA, ContractB) {
  helloBoth() {
    return `${this.hello()} ${this.helloFromB()}`
  }
}
