import ts from 'typescript'
import { supportedBinaryOpString } from './supported-binary-op-string'
import { nodeFactory } from './node-factory'
import { DeliberateAny } from '../typescript-helpers'

const factory = ts.factory

const programTransformer = {
  type: 'program',
  factory(program: ts.Program): ts.TransformerFactory<ts.SourceFile> {
    return (context) => {
      return (sourceFile) => {
        if (!sourceFile.fileName.endsWith('.algo.ts')) return sourceFile
        return new SourceFileVisitor(context, sourceFile).result()
      }
    }
  },
}

// Typescript.d.ts typings require a TransformerFactory however rollup plugin supports a program transformer
// https://github.com/rollup/plugins/blob/master/packages/typescript/src/customTransformers.ts
export const puyaTsTransformer: ts.TransformerFactory<ts.SourceFile> = programTransformer as DeliberateAny

type VisitorHelper = {
  additionalStatements: ts.Statement[]
}

class SourceFileVisitor {
  private helper: VisitorHelper = {
    additionalStatements: [],
  }
  constructor(
    private context: ts.TransformationContext,
    private sourceFile: ts.SourceFile,
  ) {}

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
  constructor(
    private context: ts.TransformationContext,
    private helper: VisitorHelper,
    private classDec: ts.ClassDeclaration,
  ) {}

  public result(): ts.ClassDeclaration {
    return this.visit(this.classDec) as ts.ClassDeclaration
  }

  private visit = (node: ts.Node): ts.Node => {
    if (ts.isMethodDeclaration(node)) {
      if (this.classDec.name) {
        this.helper.additionalStatements.push(nodeFactory.attachMetaData(this.classDec.name, node))
      }

      return new MethodDecVisitor(this.context, node).result()
    }

    return ts.visitEachChild(node, this.visit, this.context)
  }
}
