type ClientBytes = Uint8Array | string
type ClientNumber = number | bigint
export type AppCallTransaction = {
  type: 'appl'
  sender: ClientBytes
  args: Array<ClientBytes | ClientNumber>
}

export type Transaction = AppCallTransaction
