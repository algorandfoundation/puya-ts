import { Contract } from '@algorandfoundation/algorand-typescript'

export class ContractB extends Contract {
  helloFromB() {
    return 'Hello from b'
  }
}
