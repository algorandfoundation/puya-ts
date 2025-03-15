import type { awst } from '../../awst'
import type { LogicSigReference } from '../../awst/models'
import { ContractReference, OnCompletionAction } from '../../awst/models'
import { nodeFactory } from '../../awst/node-factory'
import type { AppStorageDefinition, ContractMethod, Statement } from '../../awst/nodes'
import { ARC4BareMethodConfig, ARC4CreateOption, StateTotals } from '../../awst/nodes'
import { SourceLocation } from '../../awst/source-location'
import { wtypes } from '../../awst/wtypes'
import { Constants } from '../../constants'
import { logger } from '../../logger'
import type { Props } from '../../typescript-helpers'
import { codeInvariant, invariant, isIn } from '../../util'
import { CustomKeyMap } from '../../util/custom-key-map'
import type { ContractClassPType } from '../ptypes'
import { ClusteredContractClassType } from '../ptypes'
import type { ContractOptionsDecoratorData } from './decorator-data'
import { LogicSigClassModel } from './logic-sig-class-model'
import '../../polyfill/set.prototype.union'

export class ContractClassModel {
  public readonly isAbstract: boolean
  public get id(): ContractReference {
    return ContractReference.fromPType(this.type)
  }
  public readonly type: ContractClassPType
  public get name(): string {
    return this.type.name
  }
  public readonly options: ContractOptionsDecoratorData | undefined
  public readonly description: string | null
  public readonly propertyInitialization: Array<Statement>
  public readonly approvalProgram: ContractMethod | null
  public readonly clearProgram: ContractMethod | null
  public readonly ctor: ContractMethod | null
  public readonly methods: Array<ContractMethod>
  public readonly appState: Array<AppStorageDefinition>
  public readonly sourceLocation: SourceLocation
  constructor(props: Props<Omit<ContractClassModel, 'name' | 'id'>>) {
    this.isAbstract = props.isAbstract
    this.type = props.type
    this.description = props.description
    this.propertyInitialization = props.propertyInitialization
    this.ctor = props.ctor
    this.approvalProgram = props.approvalProgram
    this.clearProgram = props.clearProgram
    this.methods = props.methods
    this.appState = props.appState
    this.sourceLocation = props.sourceLocation
    this.options = props.options
  }

  hasExplicitStateTotals() {
    return this.options?.stateTotals !== undefined
  }

  buildContract(compilationSet: CompilationSet): awst.Contract {
    let approvalProgram: ContractMethod | null = this.approvalProgram
    let clearProgram: ContractMethod | null = this.clearProgram
    const methods: ContractMethod[] = [...this.methods]
    const ctors: ContractMethod[] = this.ctor ? [this.ctor] : []
    const methodResolutionOrder: ContractReference[] = []
    let firstBaseWithStateTotals: ContractClassModel | undefined = undefined
    let reservedScratchSpace = new Set<bigint>()

    const seenContractIds = new Set<string>()

    for (const baseType of this.type.allBases()) {
      const baseClass = this.getModelForClass(compilationSet, baseType)
      if (baseClass.hasExplicitStateTotals() && firstBaseWithStateTotals === undefined) {
        firstBaseWithStateTotals = baseClass
      }
      if (baseClass.options?.scratchSlots) {
        reservedScratchSpace = reservedScratchSpace.union(baseClass.options.scratchSlots)
      }
      methodResolutionOrder.push(baseClass.id)
      if (seenContractIds.has(baseClass.id.toString())) {
        continue
      } else {
        seenContractIds.add(baseClass.id.toString())
      }
      approvalProgram ??= baseClass.approvalProgram
      clearProgram ??= baseClass.clearProgram
      if (baseClass.approvalProgram && baseClass.approvalProgram !== approvalProgram) methods.push(baseClass.approvalProgram)
      if (baseClass.clearProgram && baseClass.clearProgram !== clearProgram) methods.push(baseClass.clearProgram)
      for (const method of baseClass.methods) {
        // Maybe need validation??
        methods.push(method)
      }
      if (baseClass.ctor) ctors.push(baseClass.ctor)
    }
    if (this.type.isARC4) {
      const hasCreate = methods.some((m) => isIn(m.arc4MethodConfig?.create, [ARC4CreateOption.allow, ARC4CreateOption.require]))
      const hasBareNoop = methods.some(
        (m) =>
          m.arc4MethodConfig instanceof ARC4BareMethodConfig && isIn(OnCompletionAction.NoOp, m.arc4MethodConfig.allowedCompletionTypes),
      )

      if (!hasCreate) {
        if (hasBareNoop) {
          logger.error(
            this.sourceLocation,
            `Non-abstract ARC4 contract has no methods which can be called to create the contract. ` +
              `An implicit one could not be inserted as there is already a bare method handling the NoOp on completion action. ` +
              `In order to allow creating the contract specify { onCreate: 'allow' } or { onCreate: 'require' } in an @abimethod or @baremethod decorator above the chosen method.`,
          )
        } else {
          methods.push(this.makeDefaultCreate())
        }
      }
    }

    codeInvariant(approvalProgram, 'must have approval')
    codeInvariant(clearProgram, 'must have clear')

    if (!this.hasExplicitStateTotals && firstBaseWithStateTotals) {
      logger.warn(
        this.options?.sourceLocation ?? this.sourceLocation,
        `Contract extends base contract ${firstBaseWithStateTotals.id} with explicit stateTotals, but does not define its own stateTotals. This could result in insufficient reserved state at run time. An empty object may be provided in order to indicate that this contract should revert to the default behaviour`,
      )
    }

    const stateTotals = new StateTotals({
      globalBytes: this.options?.stateTotals?.globalBytes ?? null,
      globalUints: this.options?.stateTotals?.globalUints ?? null,
      localBytes: this.options?.stateTotals?.localBytes ?? null,
      localUints: this.options?.stateTotals?.localUints ?? null,
    })

    if (this.options?.scratchSlots) {
      reservedScratchSpace = reservedScratchSpace.union(this.options.scratchSlots)
    }

    const hasSignificantConstructor = ctors.length > 1

    return nodeFactory.contract({
      name: this.options?.name ?? this.name,
      id: this.id,
      description: this.description,
      approvalProgram: hasSignificantConstructor ? ContractClassModel.patchApprovalToCallCtor(approvalProgram, methods) : approvalProgram,
      clearProgram,
      methodResolutionOrder,
      methods: [...methods, ...(hasSignificantConstructor ? ctors : [])],
      appState: this.appState,
      stateTotals,
      reservedScratchSpace: reservedScratchSpace,
      sourceLocation: this.sourceLocation,
      avmVersion: this.options?.avmVersion ?? null,
    })
  }

  private getModelForClass(compilationSet: CompilationSet, contractType: ContractClassPType): ContractClassModel {
    if (contractType instanceof ClusteredContractClassType) {
      return this.buildClusteredMetaClass(compilationSet, contractType)
    } else {
      return compilationSet.getContractClass(ContractReference.fromPType(contractType))
    }
  }

  private buildClusteredMetaClass(compilationSet: CompilationSet, clusteredType: ClusteredContractClassType): ContractClassModel {
    const ctor = nodeFactory.contractMethod({
      memberName: Constants.symbolNames.constructorMethodName,
      cref: ContractReference.fromPType(clusteredType),
      documentation: nodeFactory.methodDocumentation({}),
      sourceLocation: SourceLocation.None,
      args: [],
      returnType: wtypes.voidWType,
      body: nodeFactory.block({
        sourceLocation: SourceLocation.None,
      }),
      arc4MethodConfig: null,
      inline: null, // TODO: Expose inline hint option
    })
    const ctorTargets: awst.ContractMethod[] = []
    for (const baseType of clusteredType.baseTypes) {
      for (const b of [baseType, ...baseType.allBases()]) {
        const baseClassModel = this.getModelForClass(compilationSet, b)
        if (baseClassModel.ctor) {
          ctorTargets.push(baseClassModel.ctor)
          break
        }
      }
    }
    ctor.body.body.push(
      ...ctorTargets.map((ct) =>
        nodeFactory.expressionStatement({
          expr: nodeFactory.subroutineCallExpression({
            target: nodeFactory.contractMethodTarget({
              memberName: ct.memberName,
              cref: ct.cref,
            }),
            args: [],
            sourceLocation: SourceLocation.None,
            wtype: wtypes.voidWType,
          }),
        }),
      ),
    )
    return new ContractClassModel({
      appState: [],
      approvalProgram: null,
      clearProgram: null,
      isAbstract: true,
      sourceLocation: SourceLocation.None,
      propertyInitialization: [],
      description: null,
      ctor: ctor,
      methods: [],
      options: undefined,
      type: clusteredType,
    })
  }

  private static patchApprovalToCallCtor(approval: ContractMethod, methods: ContractMethod[]): ContractMethod {
    const callCtorIfNew = nodeFactory.ifElse({
      condition: nodeFactory.not({
        expr: nodeFactory.reinterpretCast({
          expr: nodeFactory.intrinsicCall({
            opCode: 'txn',
            immediates: ['ApplicationID'],
            stackArgs: [],
            sourceLocation: SourceLocation.None,
            wtype: wtypes.uint64WType,
          }),
          sourceLocation: SourceLocation.None,
          wtype: wtypes.boolWType,
        }),
        sourceLocation: SourceLocation.None,
      }),
      ifBranch: nodeFactory.block(
        { sourceLocation: SourceLocation.None },
        nodeFactory.expressionStatement({
          expr: nodeFactory.subroutineCallExpression({
            args: [],
            wtype: wtypes.voidWType,
            target: nodeFactory.instanceMethodTarget({
              memberName: Constants.symbolNames.constructorMethodName,
            }),
            sourceLocation: SourceLocation.None,
          }),
        }),
      ),
      sourceLocation: SourceLocation.None,
      elseBranch: null,
    })

    return nodeFactory.contractMethod({
      ...approval,
      body: nodeFactory.block({ sourceLocation: SourceLocation.None }, callCtorIfNew, approval.body),
    })
  }

  private makeDefaultCreate() {
    return nodeFactory.contractMethod({
      memberName: Constants.symbolNames.defaultCreateMethodName,
      cref: ContractReference.fromPType(this.type),
      args: [],
      arc4MethodConfig: new ARC4BareMethodConfig({
        allowedCompletionTypes: [OnCompletionAction.NoOp],
        create: ARC4CreateOption.require,
        sourceLocation: this.sourceLocation,
      }),
      returnType: wtypes.voidWType,
      documentation: nodeFactory.methodDocumentation({
        description: 'Implicitly generated create method',
      }),
      sourceLocation: this.sourceLocation,
      body: nodeFactory.block({
        sourceLocation: this.sourceLocation,
      }),
      inline: null, // TODO: Expose inline hint option?
    })
  }
}

export class CompilationSet extends CustomKeyMap<ContractReference | LogicSigReference, ContractClassModel | LogicSigClassModel> {
  constructor() {
    super((x) => x.toString())
  }

  get compilationOutputSet() {
    return Array.from(this.entries())
      .filter(([, meta]) => !meta.isAbstract)
      .map(([ref]) => ref)
  }

  getContractClass(cref: ContractReference) {
    const maybeClass = this.get(cref)
    invariant(maybeClass instanceof ContractClassModel, 'Contract reference must resolve to a contract class')
    return maybeClass
  }

  getLogicSig(lref: LogicSigReference) {
    const maybeLogicSig = this.get(lref)
    invariant(maybeLogicSig instanceof LogicSigClassModel, 'Logic sig reference must resolve to a logic signature class')
    return maybeLogicSig
  }
}
