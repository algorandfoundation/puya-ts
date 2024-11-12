import type { awst } from '../../awst'
import type { LogicSigReference } from '../../awst/models'
import { ARC4BareMethodConfig, ARC4CreateOption, ContractReference, OnCompletionAction } from '../../awst/models'
import { nodeFactory } from '../../awst/node-factory'
import type { AppStorageDefinition, ContractMethod, Statement, StateTotals } from '../../awst/nodes'
import { SourceLocation } from '../../awst/source-location'
import { wtypes } from '../../awst/wtypes'
import { Constants } from '../../constants'
import { logger } from '../../logger'
import type { Props } from '../../typescript-helpers'
import { codeInvariant, invariant, isIn } from '../../util'
import { CustomKeyMap } from '../../util/custom-key-map'
import type { ContractClassPType } from '../ptypes'
import { LogicSigClassModel } from './logic-sig-class-model'

export class ContractClassModel {
  public readonly isAbstract: boolean
  public get id(): ContractReference {
    return ContractReference.fromPType(this.type)
  }
  public readonly type: ContractClassPType
  public get name(): string {
    return this.type.name
  }
  public readonly description: string | null
  public readonly bases: Array<ContractReference>
  public readonly propertyInitialization: Array<Statement>
  public readonly approvalProgram: ContractMethod | null
  public readonly clearProgram: ContractMethod | null
  public readonly ctor: ContractMethod
  public readonly methods: Array<ContractMethod>
  public readonly appState: Array<AppStorageDefinition>
  public readonly stateTotals: StateTotals | null
  public readonly reservedScratchSpace: Set<bigint>
  public readonly sourceLocation: SourceLocation
  constructor(props: Props<Omit<ContractClassModel, 'name' | 'id'>>) {
    this.isAbstract = props.isAbstract
    this.type = props.type
    this.description = props.description
    this.propertyInitialization = props.propertyInitialization
    this.bases = props.bases
    this.ctor = props.ctor
    this.approvalProgram = props.approvalProgram
    this.clearProgram = props.clearProgram
    this.methods = props.methods
    this.appState = props.appState
    this.stateTotals = props.stateTotals
    this.sourceLocation = props.sourceLocation
    this.reservedScratchSpace = props.reservedScratchSpace
  }

  buildContract(compilationSet: CompilationSet): awst.Contract {
    let approvalProgram: ContractMethod | null = this.approvalProgram
    let clearProgram: ContractMethod | null = this.clearProgram
    const methods: ContractMethod[] = [...this.methods, this.ctor]
    const methodResolutionOrder: ContractReference[] = []
    for (const baseType of this.type.allBases()) {
      const cref = ContractReference.fromPType(baseType)
      const baseClass = compilationSet.getContractClass(cref)
      methodResolutionOrder.push(cref)
      approvalProgram ??= baseClass.approvalProgram
      clearProgram ??= baseClass.clearProgram
      if (baseClass.approvalProgram && baseClass.approvalProgram !== approvalProgram) methods.push(baseClass.approvalProgram)
      if (baseClass.clearProgram && baseClass.clearProgram !== clearProgram) methods.push(baseClass.clearProgram)
      for (const method of baseClass.methods) {
        // Maybe need validation??
        methods.push(method)
      }
      methods.push(baseClass.ctor)
    }
    if (this.type.isARC4) {
      const hasCreate = methods.some((m) => isIn(m.arc4MethodConfig?.create, [ARC4CreateOption.Allow, ARC4CreateOption.Require]))
      const hasBareNoop = methods.some(
        (m) => m.arc4MethodConfig?.isBare === true && isIn(OnCompletionAction.NoOp, m.arc4MethodConfig.allowedCompletionTypes),
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
    return nodeFactory.contract({
      name: this.name,
      id: this.id,
      description: this.description,
      approvalProgram: this.patchApprovalToCallCtor(approvalProgram),
      clearProgram,
      methodResolutionOrder,
      methods,
      appState: this.appState, // TODO: Tally from base
      stateTotals: this.stateTotals, // TODO: Tally
      reservedScratchSpace: this.reservedScratchSpace,
      sourceLocation: this.sourceLocation,
      avmVersion: null, // TODO: Allow this to be set with class decorator
    })
  }

  private patchApprovalToCallCtor(approval: ContractMethod): ContractMethod {
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
              memberName: Constants.constructorMethodName,
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
      memberName: Constants.defaultCreateMethodName,
      cref: ContractReference.fromPType(this.type),
      args: [],
      arc4MethodConfig: new ARC4BareMethodConfig({
        allowedCompletionTypes: [OnCompletionAction.NoOp],
        create: ARC4CreateOption.Require,
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
