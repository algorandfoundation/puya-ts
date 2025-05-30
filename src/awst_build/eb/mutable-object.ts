import { nodeFactory } from '../../awst/node-factory'
import type { Expression } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { wtypes } from '../../awst/wtypes'
import { invariant } from '../../util'
import { ObjectPType, type PType, type PTypeOrClass } from '../ptypes'
import { MutableObjectClass, MutableObjectType } from '../ptypes/mutable-object'
import { instanceEb } from '../type-registry'
import { ClassBuilder, InstanceBuilder } from './'
import { Arc4EncodedBaseExpressionBuilder } from './arc4/base'
import type { NodeBuilder } from './index'
import { Arc4CopyFunctionBuilder } from './shared/arc4-copy-function-builder'
import { requireExpressionOfType } from './util'
import { parseFunctionArgs } from './util/arg-parsing'

export class MutableObjectClassBuilder extends ClassBuilder {
  readonly ptype: MutableObjectClass

  constructor(sourceLocation: SourceLocation, ptype: PType) {
    super(sourceLocation)
    invariant(ptype instanceof MutableObjectClass, 'ptype must be MutableObjectClass')
    this.ptype = ptype
  }

  newCall(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    const {
      args: [initialValues],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 1,
      callLocation: sourceLocation,
      funcName: this.typeDescription,
      argSpec: (a) => [a.required(this.ptype.instanceType.nativeType)],
    })
    const initialSingle = initialValues.singleEvaluation()

    const structFields = Object.entries(this.ptype.instanceType.fields).map(
      ([p, t]) => [p, requireExpressionOfType(initialSingle.memberAccess(p, sourceLocation), t)] as const,
    )
    return new MutableObjectExpressionBuilder(
      nodeFactory.newStruct({
        wtype: this.ptype.instanceType.wtype,
        values: new Map(structFields),
        sourceLocation,
      }),
      this.ptype.instanceType,
    )
  }
}

export class MutableObjectExpressionBuilder extends Arc4EncodedBaseExpressionBuilder<MutableObjectType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof MutableObjectType, 'ptype must be MutableObjectType')
    super(expr, ptype)
  }

  hasProperty(name: string): boolean {
    return name in this.ptype.fields || super.hasProperty(name)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'copy':
        return new Arc4CopyFunctionBuilder(this)
    }

    if (name in this.ptype.fields) {
      const fieldType = this.ptype.fields[name]
      return instanceEb(
        nodeFactory.fieldExpression({
          name,
          sourceLocation,
          wtype: fieldType.wtypeOrThrow,
          base: this._expr,
        }),
        fieldType,
      )
    }
    return super.memberAccess(name, sourceLocation)
  }

  resolvableToPType(ptype: PTypeOrClass): boolean {
    if (ptype.equals(this.ptype)) return true

    if (ptype instanceof ObjectPType) {
      const native = this.memberAccess('native', this.sourceLocation)
      if (native instanceof InstanceBuilder) {
        return native.resolvableToPType(ptype)
      }
    }
    return false
  }

  resolveToPType(ptype: PTypeOrClass): InstanceBuilder {
    if (ptype.equals(this.ptype)) {
      // if the ptype is exactly the same, but the expression has WTuple as its wtype,
      // we need to convert it to a struct expression with the correct field types.
      // given the following code:
      // ```
      // class Coordinate extends MutableObject<{ x: uint64; y: uint64; z: biguint }> {}
      // let g: uint64, i: biguint
      // const f = ({ x: g, z: i } = new Coordinate({ x: 1, y: 2, z: 3n }))
      // ```
      // the right most assignment expression (MutableObjectExpressionBuilder._expr) will have a WTuple as its wtype,
      // and we need to convert it to a struct expression.
      if (this._expr.wtype instanceof wtypes.WTuple) {
        const fields = Object.entries(this.ptype.fields).map(
          ([p, t]) => [p, requireExpressionOfType(this.memberAccess(p, this.sourceLocation), t)] as const,
        )
        return instanceEb(
          nodeFactory.newStruct({
            sourceLocation: this.sourceLocation,
            values: new Map(fields),
            wtype: this.ptype.wtype,
          }),
          this.ptype,
        )
      }
      return this
    }

    if (ptype instanceof ObjectPType) {
      const native = this.memberAccess('native', this.sourceLocation)
      if (native instanceof InstanceBuilder) {
        return native.resolveToPType(ptype)
      }
    }
    return super.resolveToPType(ptype)
  }
}
