import { assert, BaseContract, Bytes, Global, GlobalState, itxn, Txn } from '@algorandfoundation/algorand-typescript'
import { OnCompleteAction } from '@algorandfoundation/algorand-typescript/arc4'

const LOG_1ST_ARG_AND_APPROVE = Bytes('\x09\x36\x1A\x00\xB0\x91\x01')
const APPROVE = Bytes('\x09\x81\x01')

export class ItxnDemoContract extends BaseContract {
  name = GlobalState({ initialValue: Bytes() })

  public approvalProgram(): boolean {
    if (Txn.numAppArgs) {
      switch (Txn.applicationArgs(0)) {
        case Bytes('test1'):
          this.test1()
          break
        case Bytes('test2'):
          this.test2()
          break
        case Bytes('test3'):
        case Bytes('test4'):
          break
      }
    }
    return true
  }

  private test1() {
    this.name.value = Bytes('AST1')

    const assetParams = itxn.assetConfig({
      total: 1000,
      assetName: this.name.value,
      unitName: 'unit',
      decimals: 3,
      manager: Global.currentApplicationAddress,
      reserve: Global.currentApplicationAddress,
    })

    this.name.value = Bytes('AST2')
    const asset1_txn = assetParams.submit()
    assetParams.set({
      assetName: this.name.value,
    })
    const asset2_txn = assetParams.submit()

    assert(asset1_txn.assetName === Bytes('AST1'), 'asset1_txn is correct')
    assert(asset2_txn.assetName === Bytes('AST2'), 'asset2_txn is correct')
    assert(asset1_txn.configAsset.name === Bytes('AST1'), 'created asset 1 is correct')
    assert(asset1_txn.configAsset.name === Bytes('AST2'), 'created asset 2 is correct')

    const appCreateParams = itxn.applicationCall({
      approvalProgram: Bytes.fromHex('098101'),
      clearStateProgram: Bytes.fromHex('098101'),
      fee: 0,
    })

    assetParams.set({
      assetName: 'AST3',
    })

    const [appCreateTxn, asset3_txn] = itxn.submitGroup(appCreateParams, assetParams)

    assert(appCreateTxn.appId, 'app is created')
    assert(asset3_txn.assetName === Bytes('AST3'), 'asset3_txn is correct')

    appCreateParams.set({
      note: '3rd',
    })
    assetParams.set({
      note: '3rd',
    })
    itxn.submitGroup(appCreateParams, assetParams)
  }

  private test2() {
    let createAppParams: itxn.ApplicationCallItxnParams
    if (Txn.numAppArgs) {
      const args = [Bytes('1'), Bytes('2')] as const
      createAppParams = itxn.applicationCall({
        approvalProgram: APPROVE,
        clearStateProgram: APPROVE,
        appArgs: args,
        onCompletion: OnCompleteAction.NoOp,
        note: 'with args param set',
      })
    } else {
      createAppParams = itxn.applicationCall({
        approvalProgram: APPROVE,
        clearStateProgram: APPROVE,
        appArgs: [Bytes('3'), '4', Bytes('5')],
        note: 'no args param set',
      })
    }
    const createAppTxn = createAppParams.submit()
    assert(createAppTxn.appArgs(0) === Bytes('1'), 'correct args used 1')
    assert(createAppTxn.appArgs(1) === Bytes('2'), 'correct args used 2')
    assert(createAppTxn.note === Bytes('with args param set'))
  }
}
