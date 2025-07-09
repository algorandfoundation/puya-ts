import type { FixedArray, gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { assertMatch, Box, Contract, Global } from '@algorandfoundation/algorand-typescript'
import type { UintN8 } from '@algorandfoundation/algorand-typescript/arc4'

/*
 The purpose of this test is to confirm support for storage values in box storage larger than what is supported
 by a single stack value on the AVM (currently 4096) versus box storage which can hold up to 16KB.

 At the time of writing, this is not currently possible but ideally MAX_ITEMS could be increased so the box data
 is greater than 4096 bytes and the expression `this.storage.value[index]` would make use of box_extract rather than
 box_get
 */
const MAX_ITEMS = 100

const ACCOUNT_BASE_MBR = 100_000
const BOX_BASE_MBR = 2500
const BOX_MBR_PER_BYTE = 400
const BOX_MBR = BOX_BASE_MBR + BOX_MBR_PER_BYTE * (MAX_ITEMS * (8 + 1) + 1)

type Counts = { x: uint64; y: UintN8 }

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
