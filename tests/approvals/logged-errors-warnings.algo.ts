import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract, loggedAssert, loggedErr } from '@algorandfoundation/algorand-typescript'

export class LoggedErrorsWarningsContract extends Contract {
  public testInvalidCode(arg: uint64): void {
    loggedAssert(arg !== 1, 'not-alnum!')
    loggedErr('not-alnum!')
  }

  public testCamelCaseCode(arg: uint64): void {
    loggedAssert(arg !== 1, 'MyCode')
    loggedErr('MyCode')
  }

  public testAERPrefix(arg: uint64): void {
    loggedAssert(arg !== 1, '01', undefined, 'AER')
    loggedErr('01', undefined, 'AER')
  }

  public testLongMessage(arg: uint64): void {
    loggedAssert(arg !== 1, '01', 'I will now provide a succint description of the error. I guess it all started when I was 5...')
    loggedErr('01', 'I will now provide a succint description of the error. I guess it all started when I was 5...')
  }

  public test8ByteMessage(arg: uint64): void {
    loggedAssert(arg !== 1, 'abcd')
    loggedErr('abcd')
  }

  public test32ByteMessage(arg: uint64): void {
    loggedAssert(arg !== 1, '01', 'aaaaaaaaaaaaaaaaaaaaaaaaa')
    loggedErr('01', 'aaaaaaaaaaaaaaaaaaaaaaaaa')
  }
}
