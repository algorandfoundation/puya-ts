import type { NodeBuilder } from './index'
import { InstanceBuilder } from './index'
import type { SourceLocation } from '../../awst/source-location'
import type { ContractClassPType } from '../ptypes'
import { GlobalStateType } from '../ptypes'
import { ContractMethodExpressionBuilder } from './free-subroutine-expression-builder'
import { GlobalStateExpressionBuilder } from './storage/global-state'
import type { Expression, LValue } from '../../awst/nodes'
import type { AwstBuildContext } from '../context/awst-build-context'
import { codeInvariant } from '../../util'
import { CodeError } from '../../errors'

export class ContractThisBuilder extends InstanceBuilder<ContractClassPType> {
  resolve(): Expression {
    throw new CodeError('this keyword is not valid as a value', { sourceLocation: this.sourceLocation })
  }
  resolveLValue(): LValue {
    throw new CodeError('this keyword is not valid as a value', { sourceLocation: this.sourceLocation })
  }
  readonly #ptype: ContractClassPType
  constructor(
    ptype: ContractClassPType,
    sourceLocation: SourceLocation,
    private context: AwstBuildContext,
  ) {
    super(sourceLocation)
    this.#ptype = ptype
  }

  get ptype(): ContractClassPType {
    return this.#ptype
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    const property = this.ptype.properties[name]
    if (property) {
      const storageDeclaration = this.context.getStorageDeclaration(this.ptype, name)
      if (property instanceof GlobalStateType) {
        codeInvariant(storageDeclaration, `No declaration exists for property ${property}.`, sourceLocation)

        return new GlobalStateExpressionBuilder(storageDeclaration.key, property)
      }
    }
    const method = this.ptype.methods[name]
    if (method) {
      return new ContractMethodExpressionBuilder(sourceLocation, method)
    }
    return super.memberAccess(name, sourceLocation)
  }
}

export class ContractSuperBuilder extends ContractThisBuilder {
  constructor(ptype: ContractClassPType, sourceLocation: SourceLocation, context: AwstBuildContext) {
    super(ptype, sourceLocation, context)
  }
}
