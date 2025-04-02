import type { Application, uint64 } from '@algorandfoundation/algorand-typescript'
import {
  assert,
  assertMatch,
  Bytes,
  Contract,
  Global,
  GlobalState,
  itxn,
  TransactionType,
  Txn,
  urange,
} from '@algorandfoundation/algorand-typescript'
import { decodeArc4, methodSelector } from '@algorandfoundation/algorand-typescript/arc4'
import { AssetConfigTxn } from '@algorandfoundation/algorand-typescript/gtxn'
import { itob } from '@algorandfoundation/algorand-typescript/op'

export class ItxnDemoContract extends Contract {
  name = GlobalState({ initialValue: Bytes() })

  public createAssets(numToCreate: uint64, verifier: Application) {
    for (const i of urange(numToCreate)) {
      itxn
        .assetConfig({
          total: 1000,
          assetName: this.name.value,
          unitName: Bytes`ass-${itob(i)}`,
          decimals: 3,
          manager: Global.currentApplicationAddress,
          reserve: Global.currentApplicationAddress,
        })
        .stage()
    }

    itxn
      .applicationCall({
        appArgs: [methodSelector(Verifier.prototype.verify)],
        appId: verifier,
      })
      .stage()

    const [last] = itxn.submitStaged(1)

    assert(last.type === TransactionType.ApplicationCall)
    assert(decodeArc4<string>(last.lastLog, 'log') === 'special value')
  }
}

export class Verifier extends Contract {
  verify() {
    for (let i: uint64 = 0; i < Txn.groupIndex; i++) {
      assertMatch(AssetConfigTxn(i), {
        total: 1000,
      })
    }
    assert(Global.groupSize === Txn.groupIndex + 1)
    return 'special value'
  }
}
