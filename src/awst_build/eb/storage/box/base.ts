import { nodeFactory } from '../../../../awst/node-factory'
import { type BoxValueExpression, BytesConstant, type Expression } from '../../../../awst/nodes'
import type { SourceLocation } from '../../../../awst/source-location'
import { wtypes } from '../../../../awst/wtypes'
import { codeInvariant } from '../../../../util'
import { AppStorageDeclaration } from '../../../models/app-storage-declaration'
import type { BoxPType, BoxRefPType } from '../../../ptypes'
import { boolPType, BoxMapPType, type ContractClassPType, type PType, uint64PType } from '../../../ptypes'
import { instanceEb } from '../../../type-registry'
import { InstanceExpressionBuilder } from '../../index'
import { ValueProxy } from '../value-proxy'

export abstract class BoxProxyExpressionBuilder<
  TProxyType extends BoxMapPType | BoxRefPType | BoxPType,
> extends InstanceExpressionBuilder<TProxyType> {
  buildStorageDeclaration(
    memberName: string,
    memberLocation: SourceLocation,
    memberDescription: string | null,
    contractType: ContractClassPType,
  ): AppStorageDeclaration {
    codeInvariant(
      this._expr instanceof BytesConstant,
      `key${this.ptype instanceof BoxMapPType ? ' prefix' : ''} must be a compile time constant value if ${this.typeDescription} is assigned to a contract member`,
    )
    return new AppStorageDeclaration({
      sourceLocation: memberLocation,
      ptype: this.ptype,
      memberName: memberName,
      keyOverride: this._expr ?? null,
      description: memberDescription,
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

export function boxLength(box: BoxValueExpression, sourceLocation: SourceLocation) {
  return instanceEb(
    nodeFactory.checkedMaybe({
      expr: nodeFactory.intrinsicCall({
        opCode: 'box_len',
        stackArgs: [box.key],
        wtype: new wtypes.WTuple({ types: [wtypes.uint64WType, wtypes.boolWType], immutable: true }),
        immediates: [],
        sourceLocation,
      }),
      comment: box.existsAssertionMessage ?? 'Box exists',
    }),
    uint64PType,
  )
}

export function boxExists(box: BoxValueExpression, sourceLocation: SourceLocation) {
  return instanceEb(
    nodeFactory.stateExists({
      field: box,
      sourceLocation,
      wtype: wtypes.boolWType,
    }),

    boolPType,
  )
}
