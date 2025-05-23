import { nodeFactory } from '../../awst/node-factory'
import type { Expression } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { invariant } from '../../util'
import type { LibClassType, PType } from '../ptypes'
import { MutableArrayConstructor, MutableArrayGeneric, MutableArrayType } from '../ptypes'
import type { InstanceBuilder, NodeBuilder } from './index'
import { ClassBuilder, InstanceExpressionBuilder } from './index'
import { Arc4CopyFunctionBuilder } from './shared/arc4-copy-function-builder'
import { AtFunctionBuilder } from './shared/at-function-builder'
import { ArrayPopFunctionBuilder } from './shared/pop-function-builder'
import { ArrayPushFunctionBuilder } from './shared/push-function-builder'
import { requireExpressionOfType } from './util'
import { parseFunctionArgs } from './util/arg-parsing'
import { indexAccess } from './util/array/index-access'
import { arrayLength } from './util/array/length'

export class MutableArrayClassBuilder extends ClassBuilder {
  ptype: LibClassType = MutableArrayConstructor
  newCall(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    const {
      args: [...initialValues],
      ptypes: [itemType],
    } = parseFunctionArgs({
      args,
      typeArgs,
      callLocation: sourceLocation,
      funcName: this.typeDescription,
      genericTypeArgs: 1,
      argSpec: (a) => args.map((_) => a.required()),
    })
    const arrayType = MutableArrayGeneric.parameterise([itemType])
    return new MutableArrayExpressionBuilder(
      nodeFactory.newArray({
        values: initialValues.map((iv) => requireExpressionOfType(iv, itemType)),
        sourceLocation,
        wtype: arrayType.wtype,
      }),
      MutableArrayGeneric.parameterise([itemType]),
    )
  }
}

export class MutableArrayExpressionBuilder extends InstanceExpressionBuilder<MutableArrayType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof MutableArrayType, 'ptype must be MutableArrayType')
    super(expr, ptype)
  }

  iterate(sourceLocation: SourceLocation): Expression {
    return this.resolve()
  }

  indexAccess(index: InstanceBuilder, sourceLocation: SourceLocation): NodeBuilder {
    return indexAccess(this, index, sourceLocation)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'push':
        return new ArrayPushFunctionBuilder(this)
      case 'pop':
        return new ArrayPopFunctionBuilder(this)
      case 'length':
        return arrayLength(this, sourceLocation)
      case 'copy':
        return new Arc4CopyFunctionBuilder(this)
      case 'at':
        return new AtFunctionBuilder(this._expr, this.ptype.elementType, arrayLength(this, sourceLocation).resolve())
    }
    return super.memberAccess(name, sourceLocation)
  }
}
