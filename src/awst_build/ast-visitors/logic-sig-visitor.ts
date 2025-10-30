import type ts from 'typescript'
import type { Subroutine } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { Constants } from '../../constants'
import { CodeError } from '../../errors'
import { logger } from '../../logger'
import { codeInvariant, invariant } from '../../util'
import type { LogicSigOptionsDecoratorData } from '../models/decorator-data'
import { LogicSigClassModel } from '../models/logic-sig-class-model'
import type { LogicSigPType } from '../ptypes'
import { boolPType, FunctionPType, uint64PType } from '../ptypes'
import { ptypeIn } from '../ptypes/util'
import { ClassDefinitionVisitor } from './class-definition-visitor'
import { DecoratorVisitor } from './decorator-visitor'
import { LogicSigProgramVisitor } from './logic-sig-program-visitor'
import { visitInChildContext } from './util'

export class LogicSigVisitor extends ClassDefinitionVisitor {
  throwNotSupported(node: ts.Node, desc: string): never {
    throw new CodeError(`${desc} are not supported in logic signature definitions`, {
      sourceLocation: this.sourceLocation(node),
    })
  }

  static buildLogicSig(classDec: ts.ClassDeclaration, ptype: LogicSigPType) {
    return visitInChildContext(this, classDec, ptype)
  }

  private program?: () => Subroutine
  private readonly metaData: {
    description: string | null
    options: LogicSigOptionsDecoratorData | undefined
    sourceLocation: SourceLocation
  }

  constructor(
    classDec: ts.ClassDeclaration,
    private _logicSigPType: LogicSigPType,
  ) {
    super()
    const sourceLocation = this.sourceLocation(classDec)

    const options = DecoratorVisitor.buildLogicSigData(classDec)

    for (const member of classDec.members) {
      try {
        this.accept(member)
      } catch (e) {
        invariant(e instanceof Error, 'Only errors should be thrown')
        logger.error(e)
      }
    }

    this.metaData = {
      options,
      sourceLocation,
      description: this.getNodeDescription(classDec),
    }
  }

  get result() {
    const { sourceLocation, options, description } = this.metaData

    codeInvariant(this.program, 'Logic signature class must implement a valid program method', sourceLocation)

    const logicSig = new LogicSigClassModel({
      bases: [],
      sourceLocation,
      program: this.program(),
      type: this._logicSigPType,
      description,
      options,
    })

    this.context.addToCompilationSet(logicSig.id, logicSig)
    return logicSig.buildLogicSignature()
  }

  visitMethodDeclaration(node: ts.MethodDeclaration) {
    const sourceLocation = this.sourceLocation(node)
    const methodType = this.context.getPTypeForNode(node)
    invariant(methodType instanceof FunctionPType, 'type of function must be FunctionPType')
    if (methodType.name !== Constants.symbolNames.logicSigProgramMethodName) {
      logger.error(
        sourceLocation,
        `LogicSig classes may only contain a program implementation method named '${Constants.symbolNames.logicSigProgramMethodName}'. Consider making '${methodType.name}' a free subroutine.`,
      )
      return
    }
    if (!ptypeIn(methodType.returnType, uint64PType, boolPType)) {
      logger.error(
        sourceLocation,
        `LogicSig program method must return \`uint64\` or \`boolean\`, found \`${methodType.returnType.name}\` `,
      )
      return
    }
    this.program = LogicSigProgramVisitor.buildLogicSigProgram(node)
  }
}
