import { DeliberateAny } from './typescript-helpers'

/**
 * This error can be used in stub implementations that are expected to be overridden
 * by the testing framework
 */
export class NoImplementation extends Error {
  constructor() {
    super(
      [
        'This method is intentionally not implemented.',
        '\n\n',
        'If you are attempting to unit test your contract, check the configuration of your test transformer (see @algorandfoundation/algorand-typescript-testing)',
      ].join(''),
    )
  }

  static value<T>(): T {
    return new Proxy({} as DeliberateAny, {
      get() {
        throw new NoImplementation()
      },
      set() {
        throw new NoImplementation()
      },
      has() {
        throw new NoImplementation()
      },
    })
  }
}
