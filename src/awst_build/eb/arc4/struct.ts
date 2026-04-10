import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { invariant } from '../../../util'
import type { PType, PTypeOrClass } from '../../ptypes'
import { ImmutableObjectPType } from '../../ptypes'
import { ARC4StructClass, ARC4StructType } from '../../ptypes/arc4-types'
import { instanceEb } from '../../type-registry'
import type { InstanceBuilder, NodeBuilder } from '../index'
import { ClassBuilder } from '../index'
import { requestInstanceBuilder, requireExpressionOfType } from '../util'
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
      argSpec: (a) => [a.required(new ImmutableObjectPType({ properties: this.ptype.instanceType.fields }))],
    })
    const initialSingle = initialValues.singleEvaluation()

    const structFields = this.ptype.instanceType.fields.map(
      ({ name, ptype }) => [name, requireExpressionOfType(initialSingle.memberAccess(name, sourceLocation), ptype)] as const,
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
    return this.ptype.fields.some(({ name: propName }) => propName === name) || super.hasProperty(name)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    const field = this.ptype.fields.find(({ name: propName }) => propName === name)
    if (field !== undefined) {
      return instanceEb(
        nodeFactory.fieldExpression({
          name,
          sourceLocation,
          wtype: field.ptype.wtype,
          base: this._expr,
        }),
        field.ptype,
      )
    }
    return super.memberAccess(name, sourceLocation)
  }

  resolvableToPType(ptype: PTypeOrClass): boolean {
    if (ptype.equals(this.ptype)) return true

    if (ptype instanceof ImmutableObjectPType) {
      return ptype.properties.every(
        ({ name, ptype }) =>
          this.hasProperty(name) && requestInstanceBuilder(this.memberAccess(name, this.sourceLocation))?.resolvableToPType(ptype),
      )
    }
    return false
  }

  resolveToPType(ptype: PTypeOrClass): InstanceBuilder {
    if (ptype.equals(this.ptype)) {
      return this
    }

    if (ptype instanceof ImmutableObjectPType) {
      const single = this.singleEvaluation()
      return instanceEb(
        nodeFactory.tupleExpression({
          items: ptype.properties.map(({ name, ptype }) => requireExpressionOfType(single.memberAccess(name, this.sourceLocation), ptype)),
          sourceLocation: this.sourceLocation,
          wtype: ptype.wtype,
        }),
        ptype,
      )
    }
    return super.resolveToPType(ptype)
  }
}
