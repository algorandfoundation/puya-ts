import { assert, Contract } from '@algorandfoundation/algorand-typescript'
import { abiCall, compileArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { Hello, HelloTemplate, HelloTemplateCustomPrefix, LargeProgram } from './precompiled-apps.algo'

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

    compiled.call.delete({
      appId: app,
    })
  }

  test_compile_contract_with_template() {
    const compiled = compileArc4(HelloTemplate, { templateVars: { GREETING: 'hey' } })

    const helloApp = compiled.call.create().itxn.createdApp

    const txn = compiled.call.greet({
      args: ['world'],
      appId: helloApp,
    })

    assert(txn.returnValue === 'hey world')

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
}
