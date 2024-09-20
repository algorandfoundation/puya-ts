import { nodeFactory } from '../../awst/node-factory'

import type { Expression, LValue } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { voidWType } from '../../awst/wtypes'
import { Constants } from '../../constants'
import { CodeError } from '../../errors'
import { codeInvariant } from '../../util'
import type { AwstBuildContext } from '../context/awst-build-context'
import type { ContractClassPType, PType } from '../ptypes'
import { arc4BaseContractType, baseContractType, StorageProxyPType } from '../ptypes'

import { instanceEb } from '../type-registry'

import { ContractMethodExpressionBuilder } from './free-subroutine-expression-builder'
import type { NodeBuilder } from './index'
import { InstanceBuilder } from './index'
import { VoidExpressionBuilder } from './void-expression-builder'

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
      if (property instanceof StorageProxyPType) {
        codeInvariant(storageDeclaration, `No declaration exists for property ${property}.`, sourceLocation)
        return instanceEb(storageDeclaration.key, property)
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

  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    if (this.ptype.equals(baseContractType) || this.ptype.equals(arc4BaseContractType)) {
      // Contract base types have no code to execute so we can just return void
      return new VoidExpressionBuilder(nodeFactory.voidConstant({ sourceLocation }))
    }
    codeInvariant(args.length === 0, 'Constructor arguments are not supported', sourceLocation)
    codeInvariant(typeArgs.length === 0, 'Super calls cannot be generic', sourceLocation)
    return new VoidExpressionBuilder(
      nodeFactory.subroutineCallExpression({
        target: nodeFactory.instanceSuperMethodTarget({
          memberName: Constants.constructorMethodName,
        }),
        args: [],
        sourceLocation,
        wtype: voidWType,
      }),
    )
  }
}
