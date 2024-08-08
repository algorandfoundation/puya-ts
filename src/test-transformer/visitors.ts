import ts from 'typescript'
import { nodeFactory } from './node-factory'
import { supportedBinaryOpString } from './supported-binary-op-string'
import { TypeResolver } from '../awst_build/type-resolver'
import { SourceLocation } from '../awst/source-location'
import type { PType } from '../awst_build/ptypes'
import { anyPType } from '../awst_build/ptypes'
import { FunctionPType } from '../awst_build/ptypes'
import { ContractClassPType } from '../awst_build/ptypes'

const { factory } = ts

type VisitorHelper = {
  additionalStatements: ts.Statement[]
  resolveType(node: ts.Node): PType
  sourceLocation(node: ts.Node): SourceLocation
}

export class SourceFileVisitor {
  private helper: VisitorHelper
  constructor(
    private context: ts.TransformationContext,
    private sourceFile: ts.SourceFile,
    program: ts.Program,
  ) {
    const typeResolver = new TypeResolver(program.getTypeChecker(), program.getCurrentDirectory())

    this.helper = {
      additionalStatements: [],
      resolveType(node: ts.Node): PType {
        try {
          return typeResolver.resolve(node, this.sourceLocation(node))
        } catch (e) {
          return anyPType
        }
      },
      sourceLocation(node: ts.Node): SourceLocation {
        return SourceLocation.fromNode(sourceFile, node, program.getCurrentDirectory())
      },
    }
  }

  public result(): ts.SourceFile {
    const updatedSourceFile = ts.visitNode(this.sourceFile, this.visit) as ts.SourceFile

    return factory.updateSourceFile(updatedSourceFile, [
      nodeFactory.importHelpers(),
      ...updatedSourceFile.statements,
      ...this.helper.additionalStatements,
    ])
  }

  private visit = (node: ts.Node): ts.Node => {
    if (ts.isFunctionDeclaration(node)) {
      return new FunctionDecVisitor(this.context, node).result()
    }
    if (ts.isClassDeclaration(node)) {
      return new ClassVisitor(this.context, this.helper, node).result()
    }

    return ts.visitEachChild(node, this.visit, this.context)
  }
}

class FunctionOrMethodVisitor {
  constructor(protected context: ts.TransformationContext) {}
  protected visit = (node: ts.Node): ts.Node => {
    return ts.visitEachChild(this.updateNode(node), this.visit, this.context)
  }

  protected updateNode(node: ts.Node): ts.Node {
    if (ts.isSwitchStatement(node)) {
      return factory.updateSwitchStatement(node, nodeFactory.switchableValue(node.expression), node.caseBlock)
    }

    if (ts.isCaseClause(node)) {
      return factory.updateCaseClause(node, nodeFactory.switchableValue(node.expression), node.statements)
    }

    if (ts.isBinaryExpression(node)) {
      const tokenText = supportedBinaryOpString(node.operatorToken.kind)
      if (tokenText) {
        return nodeFactory.binaryOp(node.left, node.right, tokenText)
      }
    }
    return node
  }
}

class FunctionDecVisitor extends FunctionOrMethodVisitor {
  constructor(
    context: ts.TransformationContext,
    private funcNode: ts.FunctionDeclaration,
  ) {
    super(context)
  }

  public result(): ts.FunctionDeclaration {
    return ts.visitNode(this.funcNode, this.visit) as ts.FunctionDeclaration
  }
}
class MethodDecVisitor extends FunctionOrMethodVisitor {
  constructor(
    context: ts.TransformationContext,
    private methodNode: ts.MethodDeclaration,
  ) {
    super(context)
  }

  public result(): ts.MethodDeclaration {
    return ts.visitNode(this.methodNode, this.visit) as ts.MethodDeclaration
  }
}

class ClassVisitor {
  private isArc4: boolean
  constructor(
    private context: ts.TransformationContext,
    private helper: VisitorHelper,
    private classDec: ts.ClassDeclaration,
  ) {
    const classType = helper.resolveType(classDec)

    this.isArc4 = classType instanceof ContractClassPType && classType.isARC4
  }

  public result(): ts.ClassDeclaration {
    return this.visit(this.classDec) as ts.ClassDeclaration
  }

  private visit = (node: ts.Node): ts.Node => {
    if (ts.isMethodDeclaration(node)) {
      if (this.classDec.name && this.isArc4) {
        const methodType = this.helper.resolveType(node)
        if (methodType instanceof FunctionPType) {
          this.helper.additionalStatements.push(nodeFactory.attachMetaData(this.classDec.name, node, methodType))
        }
      }

      return new MethodDecVisitor(this.context, node).result()
    }

    return ts.visitEachChild(node, this.visit, this.context)
  }
}
