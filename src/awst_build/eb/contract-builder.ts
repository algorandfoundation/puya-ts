import { nodeFactory } from '../../awst/node-factory'

import type { Expression, LValue } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { wtypes } from '../../awst/wtypes'
import { Constants } from '../../constants'
import { CodeError } from '../../errors'
import { codeInvariant, invariant } from '../../util'
import { AwstBuildContext } from '../context/awst-build-context'
import type { ContractOptionsDecoratorData } from '../models/decorator-data'
import type { PType } from '../ptypes'
import {
  arc4BaseContractType,
  baseContractType,
  ClusteredContractClassType,
  ContractClassPType,
  contractOptionsDecorator,
  numberPType,
  StorageProxyPType,
  stringPType,
} from '../ptypes'

import { instanceEb } from '../type-registry'

import { BaseContractMethodExpressionBuilder, ContractMethodExpressionBuilder } from './free-subroutine-expression-builder'
import { DecoratorDataBuilder, FunctionBuilder, InstanceBuilder, NodeBuilder } from './index'
import { requireLiteralNumber, requireStringConstant } from './util'
import { parseFunctionArgs } from './util/arg-parsing'
import { requireAvmVersion } from './util/avm-version'
import { processScratchRanges } from './util/scratch-slots'
import { VoidExpressionBuilder } from './void-expression-builder'

/**
 * Handles expressions using `this` in the context of a contract
 */
export class ContractThisBuilder extends InstanceBuilder<ContractClassPType> {
  resolve(): Expression {
    throw new CodeError('this keyword is not valid as a value', { sourceLocation: this.sourceLocation })
  }
  resolveLValue(): LValue {
    throw new CodeError('this keyword is not valid as a value', { sourceLocation: this.sourceLocation })
  }
  readonly #ptype: ContractClassPType
  constructor(ptype: ContractClassPType, sourceLocation: SourceLocation) {
    super(sourceLocation)
    this.#ptype = ptype
  }

  get ptype(): ContractClassPType {
    return this.#ptype
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    const property = this.ptype.properties[name]
    if (property) {
      const storageDeclaration = AwstBuildContext.current.getStorageDeclaration(this.ptype, name)
      if (property instanceof StorageProxyPType) {
        codeInvariant(storageDeclaration, `No declaration exists for property ${property}.`, sourceLocation)
        return instanceEb(storageDeclaration.key, property)
      }
    }
    const method = this.ptype.methods[name]
    if (method) {
      return new ContractMethodExpressionBuilder(sourceLocation, method, this.ptype)
    }
    return super.memberAccess(name, sourceLocation)
  }
}

/**
 * Handles expressions using `super` in the context of a contract
 */
export class ContractSuperBuilder extends ContractThisBuilder {
  constructor(ptype: ContractClassPType, sourceLocation: SourceLocation) {
    super(ptype, sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
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
        wtype: wtypes.voidWType,
      }),
    )
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    if (this.ptype instanceof ClusteredContractClassType && name === 'class') {
      return new PolytypeClassSuperMethodBuilder(this.ptype, sourceLocation)
    }

    const method = this.ptype.methods[name]
    if (method) {
      return new BaseContractMethodExpressionBuilder(sourceLocation, method)
    }
    return super.memberAccess(name, sourceLocation)
  }
}

/**
 * Handles calls of `super.class` from polytype library which is used to access the prototype of a specific base type
 */
class PolytypeClassSuperMethodBuilder extends FunctionBuilder {
  constructor(
    public readonly ptype: ClusteredContractClassType,
    sourceLocation: SourceLocation,
  ) {
    super(sourceLocation)
  }
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [contract],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 1,
      callLocation: sourceLocation,
      funcName: 'super.class',
      argSpec: (a) => [a.required(ContractClassPType)],
    })
    const matchedBaseType = this.ptype.baseTypes.find((b) => b.equals(contract.ptype))

    codeInvariant(matchedBaseType, `${contract.ptype} must be a direct base type of this class`)
    return new PolytypeExplicitClassAccessExpressionBuilder(matchedBaseType, sourceLocation)
  }
}

/**
 * Matches polytype's super.class(SomeType) expression
 */
export class PolytypeExplicitClassAccessExpressionBuilder extends InstanceBuilder {
  resolve(): Expression {
    throw new CodeError('Contract class cannot be used as a value')
  }
  resolveLValue(): LValue {
    throw new CodeError('Contract class cannot be used as a value')
  }
  constructor(
    public readonly ptype: ContractClassPType,
    sourceLocation: SourceLocation,
  ) {
    super(sourceLocation)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    const method = this.ptype.methods[name]
    if (method) {
      return new ContractMethodExpressionBuilder(sourceLocation, method, this.ptype)
    }
    if (name in this.ptype.properties) {
      throw new CodeError(`Not Supported: Accessing properties of a specific base type. Instead just use \`this.${name}\``, {
        sourceLocation,
      })
    }
    return super.memberAccess(name, sourceLocation)
  }
}

export class ContractClassBuilder extends InstanceBuilder {
  resolve(): Expression {
    throw new CodeError('Contract class cannot be used as a value')
  }
  resolveLValue(): LValue {
    throw new CodeError('Contract class cannot be used as a value')
  }
  readonly ptype: ContractClassPType
  constructor(sourceLocation: SourceLocation, ptype: PType) {
    super(sourceLocation)
    invariant(ptype instanceof ContractClassPType, 'ptype must be ContractClassPType')
    this.ptype = ptype
  }

  newCall(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    throw new CodeError('Contract class cannot be constructed manually')
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    throw new CodeError('Contract class cannot be called manually')
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'prototype':
        return new ContractClassPrototypeBuilder(sourceLocation, this.ptype)
    }
    return super.memberAccess(name, sourceLocation)
  }
}

class ContractClassPrototypeBuilder extends NodeBuilder {
  constructor(
    sourceLocation: SourceLocation,
    readonly ptype: ContractClassPType,
  ) {
    super(sourceLocation)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    const method = this.ptype.methods[name]
    if (method) {
      return new ContractMethodExpressionBuilder(sourceLocation, method, this.ptype)
    }
    return super.memberAccess(name, sourceLocation)
  }
}

export class ContractOptionsDecoratorBuilder extends FunctionBuilder {
  readonly ptype = contractOptionsDecorator
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [{ avmVersion, name, stateTotals, scratchSlots }],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      callLocation: sourceLocation,
      funcName: this.typeDescription,
      argSpec: (a) => [
        a.obj({
          avmVersion: a.optional(numberPType),
          name: a.optional(stringPType),
          scratchSlots: a.optional(),
          stateTotals: a.optional(),
        }),
      ],
    })

    return new DecoratorDataBuilder(sourceLocation, {
      type: 'contract',
      avmVersion: avmVersion && requireAvmVersion(avmVersion),
      name: name && requireStringConstant(name).value,
      stateTotals: stateTotals && buildStateTotals(stateTotals),
      scratchSlots: scratchSlots && processScratchRanges(scratchSlots),
      sourceLocation,
    })
  }
}

function buildStateTotals(builder: NodeBuilder): ContractOptionsDecoratorData['stateTotals'] {
  function tryGetProp(name: string): bigint | undefined {
    if (builder.hasProperty(name)) {
      return requireLiteralNumber(builder.memberAccess(name, builder.sourceLocation))
    }
    return undefined
  }

  return {
    globalBytes: tryGetProp('globalBytes'),
    globalUints: tryGetProp('globalUints'),
    localBytes: tryGetProp('localBytes'),
    localUints: tryGetProp('localUints'),
  }
}
