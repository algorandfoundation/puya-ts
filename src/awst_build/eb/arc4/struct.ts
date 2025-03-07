import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { invariant } from '../../../util'
import type { PType, PTypeOrClass } from '../../ptypes'
import { ObjectPType } from '../../ptypes'
import { ARC4StructClass, ARC4StructType } from '../../ptypes/arc4-types'
import { instanceEb } from '../../type-registry'
import type { NodeBuilder } from '../index'
import { ClassBuilder, InstanceBuilder } from '../index'
import { Arc4CopyFunctionBuilder } from '../shared/arc4-copy-function-builder'
import { requireExpressionOfType } from '../util'
import { parseFunctionArgs } from '../util/arg-parsing'
import { Arc4EncodedBaseExpressionBuilder } from './base'

export class StructClassBuilder extends ClassBuilder {
  readonly ptype: ARC4StructClass

  constructor(sourceLocation: SourceLocation, ptype: PType) {
    super(sourceLocation)
    invariant(ptype instanceof ARC4StructClass, 'ptype must be ARC4StructClass')
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
    return new StructExpressionBuilder(
      nodeFactory.newStruct({
        wtype: this.ptype.instanceType.wtype,
        values: new Map(structFields),
        sourceLocation,
      }),
      this.ptype.instanceType,
    )
  }
}

export class StructExpressionBuilder extends Arc4EncodedBaseExpressionBuilder<ARC4StructType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof ARC4StructType, 'ptype must be ARC4StructType')
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
          wtype: fieldType.wtype,
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
    if (ptype.equals(this.ptype)) return this

    if (ptype instanceof ObjectPType) {
      const native = this.memberAccess('native', this.sourceLocation)
      if (native instanceof InstanceBuilder) {
        return native.resolveToPType(ptype)
      }
    }
    return super.resolveToPType(ptype)
  }
}
