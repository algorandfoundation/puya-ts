import { Contract, Global, itxn, OnCompleteAction } from '@algorandfoundation/algorand-typescript'
import { methodSelector } from '@algorandfoundation/algorand-typescript/arc4'

class ItxnAlgo extends Contract {
  test1() {
    itxn
      .applicationCall({
        appId: 1,
        onCompletion: OnCompleteAction.NoOp,
        appArgs: [
          methodSelector('optInToAsset(pay)void'),
          // @expect-error Transaction parameters should not be passed as application args, instead include them in the same transaction group, immediately preceding this call.
          itxn.payment({
            receiver: Global.zeroAddress,
            amount: Global.assetOptInMinBalance,
            fee: 0,
          }),
          // @expect-error String value must be explicitly converted to `bytes` or `arc4.Str` using `Bytes(value)` `new arc4.Str(value)`
          'abc',
        ],
        fee: 0,
      })
      .submit()
  }
}
