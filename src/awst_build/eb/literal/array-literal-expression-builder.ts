import type { NodeBuilder } from '../index'
import { InstanceBuilder } from '../index'
import type { SourceLocation } from '../../../awst/source-location'
import type { Expression, LValue } from '../../../awst/nodes'
import type { PType } from '../../ptypes'
import { ArrayPType } from '../../ptypes'
import { TuplePType } from '../../ptypes'
import { TupleExpressionBuilder } from '../tuple-expression-builder'
import { nodeFactory } from '../../../awst/node-factory'
import { requireExpressionOfType, requireIntegerConstant } from '../util'
import { codeInvariant } from '../../../util'
import { instanceEb } from '../../type-registry'

export class ArrayLiteralExpressionBuilder extends InstanceBuilder {
  #ptype: TuplePType
  constructor(
    sourceLocation: SourceLocation,
    private readonly items: InstanceBuilder[],
  ) {
    super(sourceLocation)
    this.#ptype = new TuplePType({ items: items.map((i) => i.ptype), immutable: true })
  }

  resolve(): Expression {
    // Resolve object to a tuple using its own inferred types
    return this.toTuple(this.ptype, this.sourceLocation)
  }

  singleEvaluation(): InstanceBuilder {
    return this
  }

  indexAccess(index: InstanceBuilder, sourceLocation: SourceLocation): NodeBuilder {
    const indexNum = Number(requireIntegerConstant(index).value)
    codeInvariant(indexNum < this.items.length, `Index ${indexNum} out of bounds of array`, sourceLocation)
    return this.items[indexNum]
  }

  private toTuple(ptype: TuplePType, sourceLocation: SourceLocation): Expression {
    return nodeFactory.tupleExpression({
      items: this.items.map((item, index) => requireExpressionOfType(item, ptype.items[index])),
      sourceLocation,
    })
  }

  resolveLValue(): LValue {
    return nodeFactory.tupleExpression({
      items: this.items.map((i) => i.resolveLValue()),
      sourceLocation: this.sourceLocation,
    })
  }
  get ptype(): TuplePType {
    return this.#ptype
  }

  resolveToPType(ptype: PType): InstanceBuilder {
    if (ptype instanceof TuplePType) {
      codeInvariant(
        ptype.items.length === this.items.length,
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

  resolvableToPType(ptype: PType): boolean {
    if (this.ptype.equals(ptype)) return true
    if (ptype instanceof TuplePType) {
      return ptype.items.every((itemType, index) => this.items[index].resolvableToPType(itemType))
    }
    if (ptype instanceof ArrayPType) {
      return this.items.every((i) => i.resolveToPType(ptype.itemType))
    }
    return false
  }

  resolveItems(): InstanceBuilder[] {
    return this.items
  }
}
