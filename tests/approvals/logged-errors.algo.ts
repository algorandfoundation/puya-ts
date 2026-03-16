import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract, loggedAssert, loggedErr } from '@algorandfoundation/algorand-typescript'

class LoggedErrorsValidContract extends Contract {
  public testValid(arg: uint64): void {
    loggedAssert(arg !== 1, '01')
    loggedAssert(arg !== 2, '02', {})
    loggedAssert(arg !== 3, '03', { message: 'arg is 3' })
    loggedAssert(arg !== 4, '04', { prefix: 'AER' })
    loggedAssert(arg !== 5, '05', { message: 'arg is 5', prefix: 'AER' })
    if (arg === 6) {
      loggedErr('06')
    }
    if (arg === 7) {
      loggedErr('07', {})
    }
    if (arg === 8) {
      loggedErr('08', { message: 'arg is 8' })
    }
    if (arg === 9) {
      loggedErr('09', { prefix: 'AER' })
    }
    if (arg === 10) {
      loggedErr('10', { message: 'arg is 10', prefix: 'AER' })
    }
  }
}
