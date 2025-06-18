import { arc4, assert, Contract, Global, itxn, Txn } from '@algorandfoundation/algorand-typescript'
import { abiCall, compileArc4, methodSelector } from '@algorandfoundation/algorand-typescript/arc4'
import {
  Hello,
  HelloStubbed,
  HelloTemplate,
  HelloTemplateCustomPrefix,
  LargeProgram,
  ReceivesReferenceTypes,
  ReceivesTxns,
} from './precompiled-apps.algo'

class HelloFactory extends Contract {
  test_compile_contract() {
    const compiled = compileArc4(Hello)

    const app = compiled.call.create({
      args: ['hello'],
    }).itxn.createdApp

    const result = compiled.call.greet({
      args: ['world'],
      appId: app,
    }).returnValue
    assert(result === 'hello world')

    const result2 = abiCall(Hello.prototype.greet, {
      appId: app,
      args: ['abi'],
    }).returnValue

    assert(result2 === 'hello abi')

    const result3 = abiCall(HelloStubbed.prototype.greet, {
      appId: app,
      args: ['stubbed'],
    }).returnValue
    assert(result3 === 'hello stubbed')

    const result4 = abiCall(Hello.prototype.sendGreetings, {
      appId: app,
      args: [{ name: 'world', termination: new arc4.Str('!') }],
    }).returnValue

    assert(result4 === 'hello world!')

    compiled.call.delete({
      appId: app,
    })
  }

  test_compile_contract_with_template() {
    const compiled = compileArc4(HelloTemplate, { templateVars: { GREETING: 'hey' } })

    const helloApp = compiled.call.create().itxn.createdApp

    const txn1 = compiled.call.greet({
      args: ['world'],
      appId: helloApp,
    })

    assert(txn1.returnValue === 'hey world')

    const greeting = { name: 'world', termination: new arc4.Str('!') }
    const txn2 = compiled.call.sendGreetings({
      args: [greeting],
      appId: helloApp,
    })

    assert(txn2.returnValue === 'hey world!')

    compiled.call.delete({
      appId: helloApp,
    })
  }

  test_compile_contract_with_template_and_custom_prefix() {
    const compiled = compileArc4(HelloTemplateCustomPrefix, { templateVars: { GREETING: 'bonjour' }, templateVarsPrefix: 'PRFX_' })

    const helloApp = compiled.call.create().itxn.createdApp

    const { returnValue: result } = compiled.call.greet({
      args: ['world'],
      appId: helloApp,
    })

    assert(result === 'bonjour world')

    compiled.call.delete({
      appId: helloApp,
    })
  }

  test_compile_contract_large() {
    const compiled = compileArc4(LargeProgram)

    const largeApp = compiled.bareCreate().createdApp

    const { returnValue: result } = compiled.call.getBigBytesLength({
      appId: largeApp,
    })

    assert(result === 4096)

    compiled.call.delete({
      appId: largeApp,
    })
  }

  test_call_contract_with_transactions() {
    const compiled = compileArc4(ReceivesTxns)

    const appId = compiled.bareCreate().createdApp

    const assetCreate = itxn.assetConfig({
      total: 1,
      unitName: 'T',
      assetName: 'TEST',
    })

    compiled.call.receivesAnyTxn({
      args: [assetCreate],
      appId,
    })

    const appCall = itxn.applicationCall({
      appId,
      appArgs: [methodSelector(ReceivesTxns.prototype.getOne)],
    })

    compiled.call.receivesAnyTxn({
      appId,
      args: [appCall],
    })

    compiled.call.receivesAssetConfig({
      appId,
      args: [assetCreate],
    })

    const pay = itxn.payment({
      receiver: appId.address,
      amount: 100000,
      sender: Global.currentApplicationId.address,
    })

    compiled.call.receivesAssetConfigAndPay({
      appId,
      args: [assetCreate, pay],
    })
  }

  test_call_contract_with_reference_types() {
    const compiled = compileArc4(ReceivesReferenceTypes)

    const appId = compiled.bareCreate().createdApp

    const asset = itxn
      .assetConfig({
        total: 1,
        unitName: 'T',
        assetName: 'TEST',
      })
      .submit().createdAsset

    const result = compiled.call.receivesReferenceTypes({
      args: [Global.currentApplicationId, Txn.sender, asset],
      appId,
    })

    assert(result.itxn.logs(0) === Global.currentApplicationAddress.bytes)
    assert(result.itxn.logs(1) === Txn.sender.bytes)
    assert(result.itxn.logs(2) === asset.name)
  }
}
