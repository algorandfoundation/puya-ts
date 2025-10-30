import { Str, Struct } from '@algorandfoundation/algorand-typescript/arc4'

class BadStruct extends Struct<{ x: Str }> {
  // @expect-error Property declarations are not supported in ARC4 struct definitions
  static staticProp: string
  // @expect-error Class static block declarations are not supported in ARC4 struct definitions
  static {
    this.staticProp = 'oh noes'
  }

  // @expect-error Constructor declarations are not supported in ARC4 struct definitions
  constructor() {
    super({ x: new Str('hi') })
  }

  // @expect-error Property declarations are not supported in ARC4 struct definitions
  instanceProp: string = ''

  // @expect-error Property declarations are not supported in ARC4 struct definitions
  get readAccessor() {
    return this.instanceProp
  }

  // @expect-error Property declarations are not supported in ARC4 struct definitions
  set writeAccessor(val: string) {
    this.instanceProp = val
  }

  // @expect-error Method declarations are not supported in ARC4 struct definitions
  public someMethod() {
    return this.instanceProp + BadStruct.staticProp
  }
}
