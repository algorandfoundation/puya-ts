/**
 * Tracks the context in which expressions should be evaluated.
 *
 * A boolean context is more lenient with mixed expression types as it is only concerned with truthy-ness
 */
export class EvaluationContext {
  #isBoolean: boolean = false

  get isBoolean() {
    return this.#isBoolean
  }

  enterBooleanContext(): Disposable {
    const previous = this.#isBoolean
    this.#isBoolean = true
    return {
      [Symbol.dispose]: () => {
        this.#isBoolean = previous
      },
    }
  }
  leaveBooleanContext(): Disposable {
    const previous = this.#isBoolean
    this.#isBoolean = false
    return {
      [Symbol.dispose]: () => {
        this.#isBoolean = previous
      },
    }
  }
}
