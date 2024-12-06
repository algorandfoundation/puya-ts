import { logicsig, LogicSig } from '@algorandfoundation/algorand-typescript'

@logicsig({ name: 'BadLogicSig' })
// @expect-error Only one decorator is allowed per logic signature.
@logicsig({ name: 'BadLogicSig' })
class BadLogicSig extends LogicSig {
  // @expect-error Property declarations are not supported in logic signature definitions
  static staticProp: string
  // @expect-error Class static block declarations are not supported in logic signature definitions
  static {
    this.staticProp = 'oh noes'
  }

  program(): boolean {
    return true
  }

  // @expect-error Constructor declarations are not supported in logic signature definitions
  constructor() {
    super()
  }

  // @expect-error Property declarations are not supported in logic signature definitions
  instanceProp: string = ''

  // @expect-error Property declarations are not supported in logic signature definitions
  get readAccessor() {
    return this.instanceProp
  }

  // @expect-error Property declarations are not supported in logic signature definitions
  set writeAccessor(val: string) {
    this.instanceProp = val
  }

  // @expect-error LogicSig classes may only contain a program implementation method named 'program'. Consider making 'someMethod' a free subroutine.
  public someMethod() {
    return this.instanceProp + BadLogicSig.staticProp
  }
}
