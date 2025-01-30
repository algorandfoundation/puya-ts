import { nodeFactory } from '../../../awst/node-factory'
import type { Expression, LValue } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { CodeError } from '../../../errors'
import { codeInvariant } from '../../../util'
import type { PTypeOrClass } from '../../ptypes'
import { ArrayLiteralPType, ArrayPType, TuplePType } from '../../ptypes'
import type { NodeBuilder } from '../index'
import { InstanceBuilder } from '../index'
import { TupleExpressionBuilder } from '../tuple-expression-builder'
import { requireIntegerConstant } from '../util'

export class ArrayLiteralExpressionBuilder extends InstanceBuilder {
  readonly ptype: ArrayLiteralPType
  constructor(
    sourceLocation: SourceLocation,
    private readonly items: InstanceBuilder[],
  ) {
    super(sourceLocation)
    this.ptype = new ArrayLiteralPType({ items: items.map((i) => i.ptype) })
  }

  resolve(): Expression {
    const arrayType = this.ptype.getArrayType()

    return nodeFactory.newArray({
      sourceLocation: this.sourceLocation,
      values: this.items.map((i) => i.resolve()),
      wtype: arrayType.wtype,
    })
  }

  resolveLValue(): LValue {
    throw new CodeError('Array literal is not a valid lvalue')
  }

  singleEvaluation(): InstanceBuilder {
    return new ArrayLiteralExpressionBuilder(
      this.sourceLocation,
      this.items.map((i) => i.singleEvaluation()),
    )
  }

  indexAccess(index: InstanceBuilder, sourceLocation: SourceLocation): NodeBuilder {
    const indexNum = Number(requireIntegerConstant(index).value)
    codeInvariant(indexNum < this.items.length, `Index ${indexNum} out of bounds of array`, sourceLocation)
    return this.items[indexNum]
  }

  resolveToPType(ptype: PTypeOrClass): InstanceBuilder {
    if (ptype instanceof TuplePType) {
      codeInvariant(
        ptype.items.length <= this.items.length,
        `Value of length ${this.items.length} cannot be resolved to type of length ${ptype.items.length}`,
      )
      return new TupleExpressionBuilder(
        nodeFactory.tupleExpression({
          items: ptype.items.map((itemType, index) => this.items[index].resolveToPType(itemType).resolve()),
          sourceLocation: this.sourceLocation,
        }),
        ptype,
      )
    }
    if (ptype instanceof ArrayPType) {
      return new ArrayLiteralExpressionBuilder(
        this.sourceLocation,
        this.items.map((i) => i.resolveToPType(ptype.itemType)),
      )
    }
    return super.resolveToPType(ptype)
  }

  resolvableToPType(ptype: PTypeOrClass): boolean {
    if (ptype.equals(this.ptype)) return true
    if (ptype instanceof TuplePType) {
      return ptype.items.every((itemType, index) => this.items[index].resolvableToPType(itemType))
    }
    if (ptype instanceof ArrayPType) {
      return this.items.every((i) => i.resolveToPType(ptype.itemType))
    }
    return false
  }

  getItemBuilders(): InstanceBuilder[] {
    return this.items
  }
}
