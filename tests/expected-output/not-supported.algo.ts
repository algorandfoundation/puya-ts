import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract, Uint64 } from '@algorandfoundation/algorand-typescript'

type uint = ReturnType<typeof Uint64>

// @expect-error Not Supported: The type typescript/lib/lib.es5.d.ts::Promise is not supported
function buildPromise() {
  // @expect-error Not Supported: void expression
  void test2(123)

  // @expect-error Unable to reflect constructor type
  return Promise.resolve()
}

// @expect-error Not Supported: The type typescript/lib/lib.es5.d.ts::Promise is not supported
async function test() {
  // @expect-error Not Supported: await keyword
  await buildPromise()
}

function test2(x: uint): uint {
  // @expect-error Not Supported: typeof expressions are only supported in type expressions
  if (typeof x === 'number') {
    return x * 10
  }

  // @expect-error Expected expression of type uint64, got never
  return x
}

function testDelete() {
  // @expect-error Union types are not valid as a variable, parameter, return, or property type. Expression type is uint64 | undefined
  const x = { a: 12312 as uint | undefined }

  // @expect-error Not Supported: Delete expressions
  delete x.a
}

class BadContract extends Contract {
  // @expect-error Unsupported property type uint64. Only GlobalState, LocalState, and Box proxies can be stored on a contract.
  #myState = Uint64(123)

  test() {
    // @expect-error Not Supported: Accessing member #myState on BadContract
    return this.#myState
  }

  // @expect-error Not Supported: get accessors
  get someValue() {
    // The following is an error, but we don't parse accessor statement bodies
    return this.#myState
  }
  // @expect-error Not Supported: set accessors
  set someValue(v: uint64) {
    // The following is an error, but we don't parse accessor statement bodies
    this.#myState = v
  }
}
// @expect-error Not Supported: function expressions...
const myFunc = function () {}

function notNull(): uint64 {
  // @expect-error Union types are not valid as a variable, parameter, return, or property type. Expression type is uint64 | undefined
  const x: uint64 | undefined = 123

  // @expect-error Not Supported: non null assertions
  return x!
}

// @expect-error Not Supported: The type typescript/lib/lib.es2015.generator.d.ts::Generator is not supported
function* generator() {
  // @expect-error Not Supported: yield expressions
  yield Uint64(1)
}
