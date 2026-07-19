import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract, loggedAssert, loggedErr } from '@algorandfoundation/algorand-typescript'

class LoggedErrorsValidContract extends Contract {
  public testValid(arg: uint64): void {
    loggedAssert(arg !== 1, '01')
    loggedAssert(arg !== 2, '02', {})
    loggedAssert(arg !== 3, '03', { message: 'arg is 3' })
    loggedAssert(arg !== 4, '04', { prefix: 'AER' })
    loggedAssert(arg !== 5, '05', { message: 'arg is 5', prefix: 'AER' })
    loggedAssert(arg !== 6, '06', 'arg is 6')
    loggedAssert(arg !== 13, '13', { desc: 'arg must not be 13' })
    loggedAssert(arg !== 14, '14', { message: 'arg is 14', prefix: 'AER', desc: 'arg must not be 14' })
    if (arg === 7) {
      loggedErr('07')
    }
    if (arg === 8) {
      loggedErr('08', {})
    }
    if (arg === 9) {
      loggedErr('09', { message: 'arg is 9' })
    }
    if (arg === 10) {
      loggedErr('10', { prefix: 'AER' })
    }
    if (arg === 11) {
      loggedErr('11', { message: 'arg is 11', prefix: 'AER' })
    }
    if (arg === 12) {
      loggedErr('12', 'arg is 12')
    }
    if (arg === 15) {
      loggedErr('15', { desc: 'arg must not be 15' })
    }
    if (arg === 16) {
      loggedErr('16', { message: 'arg is 16', prefix: 'AER', desc: 'arg must not be 16' })
    }
  }
}
