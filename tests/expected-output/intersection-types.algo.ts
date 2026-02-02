import { type Account, Contract, Txn } from '@algorandfoundation/algorand-typescript'
import { Uint32 } from '@algorandfoundation/algorand-typescript/arc4'

type MyAccount = {
  account: Account
}

type WithId = { id: Uint32 }

type MyAccountWithId = MyAccount & WithId

// @expect-error Intersection types are not valid as a variable, parameter, return, or property type. Expression type is {account:Account} & {id:Uint<32>}
export class HelloWorld extends Contract {
  hello(name: string): MyAccountWithId {
    // @expect-error Intersection types are not valid as a variable, parameter, return, or property type. Expression type is {account:Account} & {id:Uint<32>}
    const account: MyAccountWithId = {
      account: Txn.sender,
      id: new Uint32(13),
    }
    // @expect-error Intersection types are not valid as a variable, parameter, return, or property type. Expression type is {account:Account} & {id:Uint<32>}
    return account
  }
}
