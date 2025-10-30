import type { FixedArray, gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { assertMatch, Box, Contract, Global } from '@algorandfoundation/algorand-typescript'
import type { Uint8 } from '@algorandfoundation/algorand-typescript/arc4'

const MAX_ITEMS = 800

const ACCOUNT_BASE_MBR = 100_000
const BOX_BASE_MBR = 2500
const BOX_MBR_PER_BYTE = 400
const BOX_MBR = BOX_BASE_MBR + BOX_MBR_PER_BYTE * (MAX_ITEMS * (8 + 1) + 1)

type Counts = { x: uint64; y: Uint8 }

class LargeObjectsInStateAlgo extends Contract {
  storage = Box<FixedArray<Counts, typeof MAX_ITEMS>>({ key: 'x' })

  getMbr(): uint64 {
    return BOX_MBR + ACCOUNT_BASE_MBR
  }

  bootstrap(pay: gtxn.PaymentTxn) {
    assertMatch(pay, {
      amount: BOX_MBR + ACCOUNT_BASE_MBR,
      receiver: Global.currentApplicationAddress,
    })
    this.storage.create()
  }

  increaseXCount(index: uint64, xCount: uint64) {
    this.storage.value[index].x += xCount
  }

  getCounts(index: uint64) {
    return this.storage.value[index]
  }
}
