import type { Account, Application } from '@algorandfoundation/algorand-typescript'
import { abimethod, assert, contract, Contract } from '@algorandfoundation/algorand-typescript'
import { abiCall } from '@algorandfoundation/algorand-typescript/arc4'

@contract({ resourceEncoding: 'foreign_index' })
class BaseForeign extends Contract {
  /**
   * Should inherit encoding from contract decorator
   * @param account
   */
  testBaseForeign(account: Account) {
    return account.balance
  }
}

@contract({ resourceEncoding: 'value' })
class BaseValue extends Contract {
  /**
   * Should inherit encoding from contract decorator
   * @param account
   */
  testBaseValue(account: Account) {
    return account.balance
  }
}

class Foreign extends BaseForeign {
  @abimethod({ resourceEncoding: 'foreign_index' })
  testExplicitForeign(account: Account) {
    return account.balance
  }

  /**
   * Should implicitly use 'value' encoding inherited from the compiler options (and not inherit from the base contract)
   * @param account
   */
  testImplicitValue(account: Account) {
    return account.balance
  }
}

class ByValue extends BaseValue {
  @abimethod({ resourceEncoding: 'value' })
  testExplicitValue(account: Account) {
    return account.balance
  }
}

class C2C extends Contract {
  testCallToForeign(account: Account, appId: Application) {
    const { returnValue: res1 } = abiCall(Foreign.prototype.testExplicitForeign, {
      appId,
      args: [account],
    })

    assert(res1 === account.balance)
  }
  testCallToValue(account: Account, appId: Application) {
    const { returnValue: res1 } = abiCall(ByValue.prototype.testExplicitValue, {
      appId,
      args: [account],
    })

    assert(res1 === account.balance)
  }
}
