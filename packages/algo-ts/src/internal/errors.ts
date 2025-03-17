/**
 * This error can be used in stub implementations that are expected to be overridden
 * by the testing framework
 */
export class NoImplementation extends Error {
  constructor() {
    super('This method is intentionally not implemented')
  }
}
