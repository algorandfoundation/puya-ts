import { describe, it } from 'vitest'

/**
 * This test checks that referencing the algo-ts package doesn't throw any errors.
 *
 * It is expected that invoking anything in the algo-ts package will throw an error; that is the
 * purpose of the algorand-typescript-testing package (to provide an actual implementation), however
 * referencing alone should not throw any errors.
 */
describe('@algorandfoundation/algorand-typescript package', () => {
  it('should be loadable', async () => {
    await import('@algorandfoundation/algorand-typescript')
  })
})
