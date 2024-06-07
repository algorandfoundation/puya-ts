import { Account, bytes } from '@algorandfoundation/algo-ts'

export type AppCallTransaction = {
  type: 'appl'
  sender: Account
  args: bytes[]
}

export type Transaction = AppCallTransaction
