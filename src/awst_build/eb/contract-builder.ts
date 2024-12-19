import { nodeFactory } from '../../awst/node-factory'

import type { Expression, LValue } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { wtypes } from '../../awst/wtypes'
import { Constants } from '../../constants'
import { CodeError } from '../../errors'
import { codeInvariant, invariant } from '../../util'
import type { AwstBuildContext } from '../context/awst-build-context'
import type { ContractOptionsDecoratorData } from '../models/decorator-data'
import type { PType } from '../ptypes'
import {
  arc4BaseContractType,
  baseContractType,
  ContractClassPType,
  contractOptionsDecorator,
  numberPType,
  StorageProxyPType,
  stringPType,
} from '../ptypes'

import { instanceEb } from '../type-registry'

import { BaseContractMethodExpressionBuilder, ContractMethodExpressionBuilder } from './free-subroutine-expression-builder'
import type { NodeBuilder } from './index'
import { DecoratorDataBuilder, FunctionBuilder, InstanceBuilder } from './index'
import { ArrayLiteralExpressionBuilder } from './literal/array-literal-expression-builder'
import { BigIntLiteralExpressionBuilder } from './literal/big-int-literal-expression-builder'
import { requireStringConstant } from './util'
import { parseFunctionArgs } from './util/arg-parsing'
import { requireAvmVersion } from './util/avm-version'
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
    protected context: AwstBuildContext,
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
    const method = this.ptype.methods[name]
    if (method) {
      return new BaseContractMethodExpressionBuilder(sourceLocation, method, this.ptype)
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

function getRangeProp(builder: NodeBuilder, name: string): bigint {
  if (builder.hasProperty(name)) {
    return getLiteralNumber(builder.memberAccess(name, builder.sourceLocation))
  }
  throw new CodeError('Scratch slot reservations should be either a single slot or an object containing a from and to property', {
    sourceLocation: builder.sourceLocation,
  })
}

function getLiteralNumber(builder: NodeBuilder) {
  codeInvariant(builder instanceof BigIntLiteralExpressionBuilder, 'Expected numeric literal', builder.sourceLocation)
  return builder.value
}

function processScratchRanges(builder: NodeBuilder): Set<bigint> {
  codeInvariant(
    builder instanceof ArrayLiteralExpressionBuilder,
    'Scratch ranges should be specified in an array literal',
    builder.sourceLocation,
  )
  const slots = new Set<bigint>()
  for (const item of builder.getItemBuilders()) {
    if (item.resolvableToPType(numberPType)) {
      slots.add(getLiteralNumber(item))
    } else {
      const from = getRangeProp(item, 'from')
      const to = getRangeProp(item, 'to')
      for (let i = from; i <= to; i++) {
        slots.add(i)
      }
    }
  }

  return slots
}

function buildStateTotals(builder: NodeBuilder): ContractOptionsDecoratorData['stateTotals'] {
  function tryGetProp(name: string): bigint | undefined {
    if (builder.hasProperty(name)) {
      return getLiteralNumber(builder.memberAccess(name, builder.sourceLocation))
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
