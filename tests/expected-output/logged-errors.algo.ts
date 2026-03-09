import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract, loggedAssert, loggedErr } from '@algorandfoundation/algorand-typescript'

class LoggedErrorsInvalidContract extends Contract {
  public testColonInCode(arg: uint64): void {
    // @expect-error error code must not contain domain separator ':'
    loggedAssert(arg !== 1, 'bad:code')
  }

  public testColonInMessage(arg: uint64): void {
    // @expect-error error message must not contain domain separator ':'
    loggedAssert(arg !== 1, '01', 'bad:msg')
  }

  public testInvalidPrefix(arg: uint64): void {
    // @expect-error error prefix must be one of AER, ERR
    loggedAssert(arg !== 1, '01', undefined, 'BAD' as 'ERR')
  }

  public testErrColonInCode(arg: uint64): void {
    // @expect-error error code must not contain domain separator ':'
    loggedErr('bad:code')
  }

  public testErrColonInMessage(arg: uint64): void {
    // @expect-error error message must not contain domain separator ':'
    loggedErr('01', 'bad:msg')
  }

  public testErrInvalidPrefix(arg: uint64): void {
    // @expect-error error prefix must be one of AER, ERR
    loggedErr('01', undefined, 'BAD' as 'ERR')
  }
}
