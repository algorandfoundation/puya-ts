import { LogicSigReference } from '../../awst/models'
import { nodeFactory } from '../../awst/node-factory'
import type { LogicSignature, Subroutine } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import type { Props } from '../../typescript-helpers'
import type { LogicSigPType } from '../ptypes'
import type { LogicSigOptionsDecoratorData } from './decorator-data'

export class LogicSigClassModel {
  public readonly isAbstract = false
  public get id(): LogicSigReference {
    return LogicSigReference.fromPType(this.type)
  }
  public readonly type: LogicSigPType
  public get name(): string {
    return this.type.name
  }
  public readonly description: string | null
  public readonly bases: Array<LogicSigReference>
  public readonly options: LogicSigOptionsDecoratorData | undefined
  public readonly program: Subroutine
  public readonly sourceLocation: SourceLocation
  constructor(props: Props<Omit<LogicSigClassModel, 'name' | 'id' | 'isAbstract'>>) {
    this.type = props.type
    this.description = props.description
    this.program = props.program
    this.bases = props.bases
    this.sourceLocation = props.sourceLocation
    this.options = props.options
  }

  public buildLogicSignature(): LogicSignature {
    return nodeFactory.logicSignature({
      id: this.id,
      shortName: this.options?.name ?? this.name,
      program: this.program,
      sourceLocation: this.sourceLocation,
      docstring: this.description,
      avmVersion: this.options?.avmVersion ?? null,
    })
  }
}
