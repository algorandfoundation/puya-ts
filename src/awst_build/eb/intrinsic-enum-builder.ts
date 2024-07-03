import { NodeBuilder } from './index'
import { SourceLocation } from '../../awst/source-location'
import { IntrinsicEnumType, PType } from '../ptypes'
import { CodeError } from '../../errors'
import { invariant } from '../../util'
import { StringExpressionBuilder } from './string-expression-builder'
import { nodeFactory } from '../../awst/node-factory'

export class IntrinsicEnumBuilder extends NodeBuilder {
  public readonly ptype: IntrinsicEnumType
  constructor(sourceLocation: SourceLocation, ptype: PType) {
    super(sourceLocation)
    invariant(ptype instanceof IntrinsicEnumType, 'ptype must be instance of IntrinsicEnumType')
    this.ptype = ptype
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    const matchedMember = this.ptype.members.find(([memberName]) => memberName === name)
    if (matchedMember) {
      return new StringExpressionBuilder(
        nodeFactory.stringConstant({
          value: matchedMember[1],
          sourceLocation,
        }),
      )
    }
    throw new CodeError(`Member ${name} does not exist on ${this.typeDescription}`, { sourceLocation })
  }
}
