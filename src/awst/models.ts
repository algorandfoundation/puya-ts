import type { ContractClassPType, LogicSigPType } from '../awst_build/ptypes'

export enum OnCompletionAction {
  NoOp = 0,
  OptIn = 1,
  CloseOut = 2,
  ClearState = 3,
  UpdateApplication = 4,
  DeleteApplication = 5,
}

class ModelBase {
  /**
   * This field prevents us from accidentally passing an object literal with structural equality to
   * a model class instead of any instance of the class, which would stuff up the serialization
   * @private
   */
  #isModel = true
}

export class ContractReference extends ModelBase {
  constructor({ className, moduleName }: { className: string; moduleName: string }) {
    super()
    this.className = className
    this.moduleName = moduleName
  }
  readonly className: string
  readonly moduleName: string

  get id() {
    return `${this.moduleName}::${this.className}`
  }

  toString(): string {
    return this.id
  }

  static fromPType(contractPType: ContractClassPType): ContractReference {
    return new ContractReference({
      className: contractPType.name,
      moduleName: contractPType.module,
    })
  }
}
export class LogicSigReference extends ModelBase {
  constructor({ name, moduleName }: { name: string; moduleName: string }) {
    super()
    this.name = name
    this.moduleName = moduleName
  }
  readonly name: string
  readonly moduleName: string

  get id() {
    return `${this.moduleName}::${this.name}`
  }

  toString(): string {
    return this.id
  }

  static fromPType(logicSigPType: LogicSigPType): LogicSigReference {
    return new LogicSigReference({
      name: logicSigPType.name,
      moduleName: logicSigPType.module,
    })
  }
}

export enum TransactionKind {
  pay = 1,
  keyreg = 2,
  acfg = 3,
  axfer = 4,
  afrz = 5,
  appl = 6,
}
