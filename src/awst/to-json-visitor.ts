import type {
  ConstantDeclaration,
  ContractFragment,
  ContractMethod,
  LogicSignature,
  ModuleStatement,
  ModuleStatementVisitor,
  StructureDefinition,
  Subroutine,
} from './nodes'
import { SourceLocation } from './source-location'
import { WType } from './wtypes'

export class ToJsonVisitor implements ModuleStatementVisitor<string> {
  private asJson(moduleStatement: ModuleStatement): string {
    return JSON.stringify(
      moduleStatement,
      (_key: string, value: unknown) => {
        if (typeof value === 'bigint') {
          return `${value}n`
        }
        if (value instanceof SourceLocation) {
          return `${value.file}[${value.line}:${value.column}-${value.endLine}:${value.endColumn}]`
        }
        if (value instanceof WType) {
          return value.name
        }
        if (value instanceof Object && !this._ignoreTheseTypes.includes(value.constructor.name)) {
          return {
            _type: value.constructor.name,
            ...value,
          }
        }
        if (value instanceof Uint8Array) {
          return `0x${Buffer.from(value).toString('hex')}`
        }
        return value
      },
      2,
    )
  }

  visitConstantDeclaration(moduleStatement: ConstantDeclaration): string {
    return this.asJson(moduleStatement)
  }
  visitSubroutine(moduleStatement: Subroutine): string {
    return this.asJson(moduleStatement)
  }
  visitContractMethod(moduleStatement: ContractMethod): string {
    return this.asJson(moduleStatement)
  }
  visitLogicSignature(moduleStatement: LogicSignature): string {
    return this.asJson(moduleStatement)
  }
  visitContractFragment(moduleStatement: ContractFragment): string {
    return this.asJson(moduleStatement)
  }
  visitStructureDefinition(moduleStatement: StructureDefinition): string {
    return this.asJson(moduleStatement)
  }

  _ignoreTheseTypes = ['Object', 'Map', 'Array', 'Set']
}
