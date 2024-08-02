import type { Expression } from '../../../awst/nodes'
import type { PType } from '../../ptypes'
import { boxRefType, bytesPType } from '../../ptypes'
import type { InstanceBuilder, NodeBuilder } from '../index'
import { FunctionBuilder, InstanceExpressionBuilder } from '../index'
import { BoxMapPType, BoxPType, BoxRefPType } from '../../ptypes'
import { invariant } from '../../../util'
import type { SourceLocation } from '../../../awst/source-location'
import { parseObjArgs, parseTypeArgs, requireExpressionOfType } from '../util'
import { ValueProxy } from './value-proxy'
import { nodeFactory } from '../../../awst/node-factory'
import { typeRegistry } from '../../type-registry'

export class BoxFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const [contentPType] = parseTypeArgs(typeArgs, sourceLocation, 'Box', 1)
    const { key } = parseObjArgs(args, sourceLocation, 'Box', { key: [bytesPType] })
    const ptype = new BoxPType({ content: contentPType })
    return new BoxExpressionBuilder(key, ptype)
  }
}
export class BoxRefFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    parseTypeArgs(typeArgs, sourceLocation, 'BoxRef', 0)
    const { key } = parseObjArgs(args, sourceLocation, 'BoxRef', { key: [bytesPType] })
    return new BoxRefExpressionBuilder(key, boxRefType)
  }
}
export class BoxMapFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const [keyPrefixPType, contentPType] = parseTypeArgs(typeArgs, sourceLocation, 'BoxMap', 2)
    const { keyPrefix } = parseObjArgs(args, sourceLocation, 'BoxMap', { keyPrefix: [bytesPType] })
    const ptype = new BoxMapPType({ content: contentPType, keyPrefix: keyPrefixPType })
    return new BoxMapExpressionBuilder(keyPrefix, ptype)
  }
}

export class BoxMapExpressionBuilder extends InstanceExpressionBuilder<BoxMapPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof BoxMapPType, 'BoxMapExpressionBuilder must be constructed with ptype of BoxMapPType')
    super(expr, ptype)
  }
  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'set':
    }
    return super.memberAccess(name, sourceLocation)
  }
}
export class BoxRefExpressionBuilder extends InstanceExpressionBuilder<BoxRefPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof BoxRefPType, 'BoxRefExpressionBuilder must be constructed with ptype of BoxRefPType')
    super(expr, ptype)
  }
}

export class BoxExpressionBuilder extends InstanceExpressionBuilder<BoxPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof BoxPType, 'BoxExpressionBuilder must be constructed with ptype of BoxPType')
    super(expr, ptype)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'value':
        return new BoxValueExpressionBuilder(
          nodeFactory.boxValueExpression({
            key: this._expr,
            sourceLocation,
            wtype: this.ptype.contentType.wtypeOrThrow,
            existsAssertionMessage: '',
          }),
          this.ptype.contentType,
        )
    }
    return super.memberAccess(name, sourceLocation)
  }
}

/**
 * Wraps the box value expression and watches for certain expressions which can be optimized.
 *
 * For example box.value.bytes.slice(...) can be optimized to use box_extract directly rather
 * than reading the entire box into memory and then slicing it. All unhandled scenarios are proxied
 * through to the underlying builder for the given type.
 */
export class BoxValueExpressionBuilder extends ValueProxy<PType> {
  assign(other: InstanceBuilder, sourceLocation: SourceLocation): InstanceBuilder {
    const value = requireExpressionOfType(other, this.ptype, sourceLocation)
    return typeRegistry.getInstanceEb(
      nodeFactory.assignmentExpression({
        target: this.resolveLValue(),
        value,
        sourceLocation,
        wtype: this.ptype.wtypeOrThrow,
      }),
      this.ptype,
    )
  }
}
