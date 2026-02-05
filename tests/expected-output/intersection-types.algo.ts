import { type Account, Box, BoxMap, Bytes, Contract, emit, GlobalState, LocalState, Txn } from '@algorandfoundation/algorand-typescript'
import { Uint32 } from '@algorandfoundation/algorand-typescript/arc4'

type WithAccount = { account: Account }
type WithId = { id: Uint32 }

type IntersectionType = WithAccount & WithId

export class HelloWorld extends Contract {
  // @expect-error Type {account:Account,id:Uint<32>} cannot be used for storage
  globalVar = GlobalState<IntersectionType>()
  // @expect-error Type {account:Account,id:Uint<32>} cannot be used for storage
  localVar = LocalState<IntersectionType>()
  // @expect-error Type {account:Account,id:Uint<32>} cannot be used for storage
  boxVar = Box<IntersectionType>({ key: Bytes('box') })
  // @expect-error Type {account:Account,id:Uint<32>} cannot be used for storage
  boxMapVar = BoxMap<Account, IntersectionType>({ keyPrefix: Bytes('map') })
  // @expect-error {account:Account,id:Uint<32>} cannot be used as an ABI return type
  cannotUseAsReturn(): IntersectionType {
    const account: IntersectionType = {
      account: Txn.sender,
      id: new Uint32(13),
    }
    return account
  }
  // @expect-error {account:Account,id:Uint<32>} cannot be used as an ABI param type
  cannotUseAsParameter(param: IntersectionType): void {}
  cannotBeLogged(): void {
    const account: IntersectionType = {
      account: Txn.sender,
      id: new Uint32(13),
    }
    // @expect-error {account:Account,id:Uint<32>} cannot be encoded to an ARC4 type
    emit(account)
  }
}
