import { nodeFactory } from '../../awst/node-factory'
import type { Expression } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { invariant } from '../../util'
import { ObjectPType, type PType, type PTypeOrClass } from '../ptypes'
import { MutableObjectClass, MutableObjectType } from '../ptypes/mutable-object'
import { instanceEb } from '../type-registry'
import type { InstanceBuilder } from './'
import { ClassBuilder } from './'
import { Arc4EncodedBaseExpressionBuilder } from './arc4/base'
import type { NodeBuilder } from './index'
import { requestInstanceBuilder, requireExpressionOfType } from './util'
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
      return ptype
        .orderedProperties()
        .every(
          ([prop, propType]) =>
            this.hasProperty(prop) && requestInstanceBuilder(this.memberAccess(prop, this.sourceLocation))?.resolvableToPType(propType),
        )
    }
    return false
  }

  resolveToPType(ptype: PTypeOrClass): InstanceBuilder {
    if (ptype.equals(this.ptype)) {
      return this
    }

    if (ptype instanceof ObjectPType) {
      const single = this.singleEvaluation()
      return instanceEb(
        nodeFactory.tupleExpression({
          items: ptype
            .orderedProperties()
            .map(([prop, propType]) => requireExpressionOfType(single.memberAccess(prop, this.sourceLocation), propType)),
          sourceLocation: this.sourceLocation,
          wtype: ptype.wtype,
        }),
        ptype,
      )
    }
    return super.resolveToPType(ptype)
  }
}
