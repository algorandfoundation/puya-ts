import { type Account, Contract, Txn } from '@algorandfoundation/algorand-typescript'
import { Uint32 } from '@algorandfoundation/algorand-typescript/arc4'

type MyAccount = {
  account: Account
}

type WithId = { id: Uint32 }

type MyAccountWithId = MyAccount & WithId

export class HelloWorld extends Contract {
  // @expect-error unsupported type intersection
  hello(name: string): MyAccountWithId {
    const account: MyAccountWithId = {
      account: Txn.sender,
      id: new Uint32(13),
    }
    return account
  }
}
