import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract, loggedAssert, loggedErr } from '@algorandfoundation/algorand-typescript'

class LoggedErrorsValidContract extends Contract {
  public testValid(arg: uint64): void {
    loggedAssert(arg !== 1, '01')
    loggedAssert(arg !== 2, '02', 'arg is two')
    loggedAssert(arg !== 3, '03', 'AER')
    loggedAssert(arg !== 4, '04', 'arg is 4', 'AER')
    if (arg === 5) {
      loggedErr('05')
    }
    if (arg === 6) {
      loggedErr('06', 'arg was 6')
    }
    if (arg === 7) {
      loggedErr('07', 'AER')
    }
    if (arg === 8) {
      loggedErr('08', 'arg is eight (08)', 'AER')
    }
  }
}
