import { assert, Bytes, Contract, Global, GlobalState, itxn, op, Txn } from '@algorandfoundation/algorand-typescript'
import { OnCompleteAction } from '@algorandfoundation/algorand-typescript/arc4'

const LOG_1ST_ARG_AND_APPROVE = Bytes.fromHex('09361A00B08101')
const APPROVE = Bytes.fromHex('098101')

export class ItxnDemoContract extends Contract {
  name = GlobalState({ initialValue: Bytes() })

  public test1() {
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
    assert(asset1_txn.createdAsset.name === Bytes('AST1'), 'created asset 1 is correct')
    assert(asset2_txn.createdAsset.name === Bytes('AST2'), 'created asset 2 is correct')

    const appCreateParams = itxn.applicationCall({
      approvalProgram: APPROVE,
      clearStateProgram: APPROVE,
      fee: 0,
    })

    assetParams.set({
      assetName: 'AST3',
    })

    const [appCreateTxn, asset3_txn] = itxn.submitGroup(appCreateParams, assetParams)

    assert(appCreateTxn.createdApp, 'app is created')
    assert(asset3_txn.assetName === Bytes('AST3'), 'asset3_txn is correct')

    appCreateParams.set({
      note: '3rd',
    })
    assetParams.set({
      note: '3rd',
    })
    itxn.submitGroup(appCreateParams, assetParams)
  }

  public test2() {
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

    if (Txn.numAppArgs > 1) {
      const createAppTxn2 = itxn
        .applicationCall({
          approvalProgram: APPROVE,
          clearStateProgram: APPROVE,
          onCompletion: OnCompleteAction.DeleteApplication,
          appArgs: [Bytes('42')],
        })
        .submit()
      assert(createAppTxn2.appArgs(0) === Bytes('42'), 'correct args used 2')
      assert(createAppTxn.note === Bytes('with args param set'))
    }
  }

  public test3() {
    const appTxn1 = itxn.applicationCall({
      approvalProgram: LOG_1ST_ARG_AND_APPROVE,
      clearStateProgram: APPROVE,
      onCompletion: OnCompleteAction.DeleteApplication,
      appArgs: [Bytes('1')],
    })

    const appTxn2 = appTxn1.copy()
    appTxn2.set({ appArgs: [Bytes('2')] })
    const appTxn3 = appTxn1.copy()
    appTxn3.set({ appArgs: [Bytes('3')] })
    const appTxn4 = appTxn1.copy()
    appTxn4.set({ appArgs: [Bytes('4')] })
    const appTxn5 = appTxn1.copy()
    appTxn5.set({ appArgs: [Bytes('5')] })
    const appTxn6 = appTxn1.copy()
    appTxn6.set({ appArgs: [Bytes('6')] })
    const appTxn7 = appTxn1.copy()
    appTxn7.set({ appArgs: [Bytes('7')] })
    const appTxn8 = appTxn1.copy()
    appTxn8.set({ appArgs: [Bytes('8')] })
    const appTxn9 = appTxn1.copy()
    appTxn9.set({ appArgs: [Bytes('9')] })
    const appTxn10 = appTxn1.copy()
    appTxn10.set({ appArgs: [Bytes('10')] })
    const appTxn11 = appTxn1.copy()
    appTxn11.set({ appArgs: [Bytes('11')] })
    const appTxn12 = appTxn1.copy()
    appTxn12.set({ appArgs: [Bytes('12')] })
    const appTxn13 = appTxn1.copy()
    appTxn13.set({ appArgs: [Bytes('13')] })
    const appTxn14 = appTxn1.copy()
    appTxn14.set({ appArgs: [Bytes('14')] })
    const appTxn15 = appTxn1.copy()
    appTxn15.set({ appArgs: [Bytes('15')] })
    const appTxn16 = appTxn1.copy()
    appTxn16.set({ appArgs: [Bytes('16')] })

    const [app1, app2, app3, app4, app5, app6, app7, app8, app9, app10, app11, app12, app13, app14, app15, app16] = itxn.submitGroup(
      appTxn1,
      appTxn2,
      appTxn3,
      appTxn4,
      appTxn5,
      appTxn6,
      appTxn7,
      appTxn8,
      appTxn9,
      appTxn10,
      appTxn11,
      appTxn12,
      appTxn13,
      appTxn14,
      appTxn15,
      appTxn16,
    )

    assert(app1.logs(0) === Bytes('1'))
    assert(app2.logs(0) === Bytes('2'))
    assert(app3.logs(0) === Bytes('3'))
    assert(app4.logs(0) === Bytes('4'))
    assert(app5.logs(0) === Bytes('5'))
    assert(app6.logs(0) === Bytes('6'))
    assert(app7.logs(0) === Bytes('7'))
    assert(app8.logs(0) === Bytes('8'))
    assert(app9.logs(0) === Bytes('9'))
    assert(app10.logs(0) === Bytes('10'))
    assert(app11.logs(0) === Bytes('11'))
    assert(app12.logs(0) === Bytes('12'))
    assert(app13.logs(0) === Bytes('13'))
    assert(app14.logs(0) === Bytes('14'))
    assert(app15.logs(0) === Bytes('15'))
    assert(app16.logs(0) === Bytes('16'))
  }

  public test4() {
    const lotsOfBytes = op.bzero(2044)
    const approval1 = APPROVE
    const approval2 = Bytes.fromHex('80' + 'FC0f')
      .concat(lotsOfBytes)
      .concat(Bytes.fromHex('48'))

    const appTxn1 = itxn.applicationCall({
      approvalProgram: [approval1, approval2, approval2, approval2],
      clearStateProgram: APPROVE,
      onCompletion: OnCompleteAction.DeleteApplication,
      appArgs: [Bytes('1')],
      extraProgramPages: 3,
    })
    const app1 = appTxn1.submit()
    assert(app1.extraProgramPages === 3, 'extra pages = 3')
    assert(app1.numApprovalProgramPages === 2, 'approval pages = 2')
    assert(app1.approvalProgramPages(0) === approval1.concat(approval2).concat(approval2.slice(0, -3)), 'expected approval page 0')
    assert(app1.approvalProgramPages(1) === approval2.slice(-3).concat(approval2), 'expected approval page 1')
    assert(app1.numClearStateProgramPages === 1, 'clear state pages = 1')
    assert(app1.clearStateProgramPages(0) === APPROVE, 'expected clear state page')
  }
}
