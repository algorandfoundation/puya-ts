import { nodeFactory } from '../../../../awst/node-factory'
import { type BoxValueExpression, BytesConstant, type Expression } from '../../../../awst/nodes'
import type { SourceLocation } from '../../../../awst/source-location'
import { codeInvariant } from '../../../../util'
import { AppStorageDeclaration } from '../../../contract-data'
import type { BoxPType, BoxRefPType } from '../../../ptypes'
import { BoxMapPType, type ContractClassPType, type PType } from '../../../ptypes'
import { typeRegistry } from '../../../type-registry'
import { type InstanceBuilder, InstanceExpressionBuilder } from '../../index'
import { requireExpressionOfType } from '../../util'
import { ValueProxy } from '../value-proxy'

export abstract class BoxProxyExpressionBuilder<
  TProxyType extends BoxMapPType | BoxRefPType | BoxPType,
> extends InstanceExpressionBuilder<TProxyType> {
  buildStorageDeclaration(memberName: string, memberLocation: SourceLocation, contractType: ContractClassPType): AppStorageDeclaration {
    codeInvariant(
      this._expr instanceof BytesConstant,
      `key${this.ptype instanceof BoxMapPType ? ' prefix' : ''} must be a compile time constant value if ${this.typeDescription} is assigned to a contract member`,
    )
    return new AppStorageDeclaration({
      sourceLocation: memberLocation,
      ptype: this.ptype,
      memberName: memberName,
      keyOverride: this._expr ?? null,
      description: null,
      definedIn: contractType,
    })
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
  constructor(boxValue: BoxValueExpression, ptype: PType) {
    super(boxValue, ptype)
  }
  assign(other: InstanceBuilder, sourceLocation: SourceLocation): InstanceBuilder {
    const value = requireExpressionOfType(other, this.ptype)
    return typeRegistry.getInstanceEb(
      nodeFactory.assignmentExpression({
        target: this.resolveLValue(),
        value,
        sourceLocation,
      }),
      this.ptype,
    )
  }
}

export function boxValue({
  key,
  sourceLocation,
  contentType,
}: {
  key: Expression
  sourceLocation: SourceLocation
  contentType: PType
}): BoxValueExpression {
  return nodeFactory.boxValueExpression({
    key,
    sourceLocation,
    wtype: contentType.wtypeOrThrow,
    existsAssertionMessage: 'Box must have value',
  })
}
