import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, compile, Contract, itxn, OnCompleteAction } from '@algorandfoundation/algorand-typescript'
import { decodeArc4, encodeArc4, methodSelector } from '@algorandfoundation/algorand-typescript/arc4'
import { Hello, HelloTemplate, HelloTemplateCustomPrefix, LargeProgram } from './precompiled-apps.algo'

class HelloFactory extends Contract {
  test_compile_contract() {
    const compiled = compile(Hello)

    const helloApp = itxn
      .applicationCall({
        appArgs: [methodSelector(Hello.prototype.create), encodeArc4('hello')],
        approvalProgram: compiled.approvalProgram,
        clearStateProgram: compiled.clearStateProgram,
        globalNumBytes: 1,
      })
      .submit().createdApp

    const txn = itxn
      .applicationCall({
        appArgs: [methodSelector(Hello.prototype.greet), encodeArc4('world')],
        appId: helloApp,
      })
      .submit()
    const result = decodeArc4<string>(txn.lastLog, 'log')

    assert(result === 'hello world')

    itxn
      .applicationCall({
        appId: helloApp,
        appArgs: [methodSelector(Hello.prototype.delete)],
        onCompletion: OnCompleteAction.DeleteApplication,
      })
      .submit()
  }

  test_compile_contract_with_template() {
    const compiled = compile(HelloTemplate, { templateVars: { GREETING: 'hey' } })

    const helloApp = itxn
      .applicationCall({
        appArgs: [methodSelector('create()void')],
        approvalProgram: compiled.approvalProgram,
        clearStateProgram: compiled.clearStateProgram,
        globalNumBytes: 1,
      })
      .submit().createdApp

    const txn = itxn
      .applicationCall({
        appArgs: [methodSelector('greet(string)string'), encodeArc4('world')],
        appId: helloApp,
      })
      .submit()
    const result = decodeArc4<string>(txn.lastLog, 'log')

    assert(result === 'hey world')

    itxn
      .applicationCall({
        appId: helloApp,
        appArgs: [methodSelector('delete()void')],
        onCompletion: OnCompleteAction.DeleteApplication,
      })
      .submit()
  }

  test_compile_contract_with_template_and_custom_prefix() {
    const compiled = compile(HelloTemplateCustomPrefix, { templateVars: { GREETING: 'bonjour' }, templateVarsPrefix: 'PRFX_' })

    const helloApp = itxn
      .applicationCall({
        appArgs: [methodSelector('create()void')],
        approvalProgram: compiled.approvalProgram,
        clearStateProgram: compiled.clearStateProgram,
        globalNumBytes: 1,
      })
      .submit().createdApp

    const txn = itxn
      .applicationCall({
        appArgs: [methodSelector('greet(string)string'), encodeArc4('world')],
        appId: helloApp,
      })
      .submit()
    const result = decodeArc4<string>(txn.lastLog, 'log')

    assert(result === 'bonjour world')

    itxn
      .applicationCall({
        appId: helloApp,
        appArgs: [methodSelector('delete()void')],
        onCompletion: OnCompleteAction.DeleteApplication,
      })
      .submit()
  }

  test_compile_contract_large() {
    const compiled = compile(LargeProgram)

    const largeApp = itxn
      .applicationCall({
        approvalProgram: compiled.approvalProgram,
        clearStateProgram: compiled.clearStateProgram,
        extraProgramPages: compiled.extraProgramPages,
        globalNumBytes: compiled.globalBytes,
      })
      .submit().createdApp

    const txn = itxn
      .applicationCall({
        appArgs: [methodSelector('getBigBytesLength()uint64')],
        appId: largeApp,
      })
      .submit()
    const result = decodeArc4<uint64>(txn.lastLog, 'log')

    assert(result === 4096)

    itxn
      .applicationCall({
        appId: largeApp,
        appArgs: [methodSelector('delete()void')],
        onCompletion: OnCompleteAction.DeleteApplication,
      })
      .submit()
  }
}
