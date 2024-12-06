import type ts from 'typescript'
import { LogicSigReference } from '../../awst/models'
import type * as awst from '../../awst/nodes'
import type { Subroutine } from '../../awst/nodes'
import { Constants } from '../../constants'
import { AwstBuildFailureError, CodeError } from '../../errors'
import { logger } from '../../logger'
import { invariant } from '../../util'
import type { ClassElements } from '../../visitor/syntax-names'
import type { Visitor } from '../../visitor/visitor'
import { accept } from '../../visitor/visitor'
import type { AwstBuildContext } from '../context/awst-build-context'
import { LogicSigClassModel } from '../models/logic-sig-class-model'
import type { LogicSigPType } from '../ptypes'
import { boolPType, FunctionPType, uint64PType } from '../ptypes'
import { ptypeIn } from '../ptypes/util'
import { BaseVisitor } from './base-visitor'
import { DecoratorVisitor } from './decorator-visitor'
import { LogicSigProgramVisitor } from './logic-sig-program-visitor'

export class LogicSigVisitor extends BaseVisitor implements Visitor<ClassElements, void> {
  public accept = <TNode extends ts.Node>(node: TNode) => accept<LogicSigVisitor, TNode>(this, node)

  private getLogicSig(): [] | [awst.LogicSignature] {
    const logicSigClass = this.context.compilationSet.getLogicSig(LogicSigReference.fromPType(this._logicSigPType))
    return [logicSigClass.buildLogicSignature()]
  }

  static buildLogicSig(ctx: AwstBuildContext, classDec: ts.ClassDeclaration, ptype: LogicSigPType) {
    return new LogicSigVisitor(ctx, classDec, ptype).getLogicSig()
  }

  private program: Subroutine | null = null

  constructor(
    ctx: AwstBuildContext,
    classDec: ts.ClassDeclaration,
    private _logicSigPType: LogicSigPType,
  ) {
    super(ctx)
    const sourceLocation = this.sourceLocation(classDec)

    const options = DecoratorVisitor.buildLogicSigData(ctx, classDec)

    for (const member of classDec.members) {
      try {
        this.accept(member)
      } catch (e) {
        // Ignore this error and continue visiting other members, so we can show additional errors
        if (!(e instanceof AwstBuildFailureError)) {
          throw e
        }
      }
    }

    if (!this.program) {
      throw new CodeError('Logic signature class must implement a valid program method', { sourceLocation })
    }

    const logicSig = new LogicSigClassModel({
      bases: [],
      sourceLocation,
      program: this.program,
      type: this._logicSigPType,
      description: this.getNodeDescription(classDec),
      options,
    })

    this.context.addToCompilationSet(logicSig.id, logicSig)
  }

  private throwLogicSigNotSupported(node: ts.Node, desc: string): never {
    throw new CodeError(`${desc} are not supported in logic signature definitions`, {
      sourceLocation: this.sourceLocation(node),
    })
  }

  visitClassStaticBlockDeclaration(node: ts.ClassStaticBlockDeclaration) {
    this.throwLogicSigNotSupported(node, 'Class static block declarations')
  }
  visitConstructor(node: ts.ConstructorDeclaration) {
    this.throwLogicSigNotSupported(node, 'Constructor declarations')
  }
  visitGetAccessor(node: ts.GetAccessorDeclaration) {
    this.throwLogicSigNotSupported(node, 'Property declarations')
  }
  visitIndexSignature(node: ts.IndexSignatureDeclaration) {
    this.throwLogicSigNotSupported(node, 'Index signature declarations')
  }
  visitMethodDeclaration(node: ts.MethodDeclaration) {
    const sourceLocation = this.sourceLocation(node)
    const methodType = this.context.getPTypeForNode(node)
    invariant(methodType instanceof FunctionPType, 'type of function must be FunctionPType')
    if (methodType.name !== Constants.logicSigProgramMethodName) {
      logger.error(
        sourceLocation,
        `LogicSig classes may only contain a program implementation method named '${Constants.logicSigProgramMethodName}'. Consider making '${methodType.name}' a free subroutine.`,
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
    this.program = LogicSigProgramVisitor.buildLogicSigProgram(this.context.createChildContext(), node)
  }
  visitPropertyDeclaration(node: ts.PropertyDeclaration) {
    this.throwLogicSigNotSupported(node, 'Property declarations')
  }
  visitSemicolonClassElement(node: ts.SemicolonClassElement) {
    // Ignore
  }
  visitSetAccessor(node: ts.SetAccessorDeclaration) {
    this.throwLogicSigNotSupported(node, 'Property declarations')
  }
}
