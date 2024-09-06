import type { ModuleStatements } from '../visitor/syntax-names'
import type * as awst from '../awst/nodes'
import ts from 'typescript'
import { AwstBuildFailureError, CodeError } from '../errors'
import type { Visitor } from '../visitor/visitor'
import { accept } from '../visitor/visitor'
import { ContractVisitor } from './contract-visitor'
import { FunctionVisitor } from './function-visitor'
import { logger, logPuyaExceptions } from '../logger'
import { expandMaybeArray } from '../util'
import { BaseVisitor } from './base-visitor'
import { ContractClassPType } from './ptypes'
import { requireConstantOfType } from './eb/util'

import { buildContextForSourceFile } from './context/base-context'

type NodeOrDeferred = awst.AWST[] | awst.AWST | (() => awst.AWST[] | awst.AWST)

export class SourceFileVisitor extends BaseVisitor implements Visitor<ModuleStatements, NodeOrDeferred> {
  private _moduleStatements: NodeOrDeferred[] = []
  private accept = <TNode extends ts.Node>(node: TNode) => accept<SourceFileVisitor, TNode>(this, node)

  constructor(
    private readonly sourceFile: ts.SourceFile,
    program: ts.Program,
  ) {
    super(buildContextForSourceFile(sourceFile, program))

    for (const statement of sourceFile.statements) {
      this._moduleStatements.push(this.accept(statement))
    }
  }

  visitInterfaceDeclaration(node: ts.InterfaceDeclaration): NodeOrDeferred {
    // Ignore these for now
    return []
  }

  visitTypeAliasDeclaration(_node: ts.TypeAliasDeclaration): NodeOrDeferred {
    // Ignore these for now - but maybe we need to do something with them when it comes to structs
    return []
  }

  visitFunctionDeclaration(node: ts.FunctionDeclaration): NodeOrDeferred {
    return () => logPuyaExceptions(() => FunctionVisitor.buildSubroutine(this.context, node), this.sourceLocation(node))
  }

  buildModule(): awst.AWST[] {
    return Array.from(this.gatherStatements())
  }

  private *gatherStatements(): Generator<awst.AWST, void, void> {
    for (const statements of this._moduleStatements) {
      try {
        if (typeof statements === 'function') {
          for (const s of expandMaybeArray(statements())) {
            yield s
          }
        } else {
          for (const s of expandMaybeArray(statements)) {
            yield s
          }
        }
      } catch (e) {
        // Ignore this error and continue visiting other statements, so we can show additional errors
        if (!(e instanceof AwstBuildFailureError)) {
          throw e
        }
      }
    }
  }

  visitVariableStatement(node: ts.VariableStatement): NodeOrDeferred {
    const sourceLocation = this.sourceLocation(node)
    if (!(node.declarationList.flags & ts.NodeFlags.Const)) {
      logger.error(new CodeError(`Module level variable declarations must use the 'const' keyword.`, { sourceLocation }))
    }

    return node.declarationList.declarations.flatMap((dec) => {
      if (!dec.initializer) {
        throw new CodeError(`Module level variable declarations must be initialized with a value.`, { sourceLocation })
      }
      if (!ts.isIdentifier(dec.name)) {
        throw new CodeError(`Module level variable declarations must use plain identifiers.`, { sourceLocation })
      }
      const ptype = this.context.getPTypeForNode(dec.name)

      //const value = CompileTimeConstantVisitor.getCompileTimeConstant(this.context, dec.initializer, ptype)
      const value = requireConstantOfType(
        this.accept(dec.initializer),
        ptype,
        sourceLocation,
        'Module level assignments must be compile time constants',
      )
      const constantName = this.context.resolveVariableName(dec.name)
      this.context.addConstant(constantName, value)

      return []
    })
  }
  visitImportDeclaration(_node: ts.ImportDeclaration): NodeOrDeferred {
    return []
  }
  visitClassDeclaration(node: ts.ClassDeclaration): NodeOrDeferred {
    const sourceLocation = this.sourceLocation(node)
    const ptype = this.context.getPTypeForNode(node)
    if (ptype instanceof ContractClassPType) {
      return () => logPuyaExceptions(() => ContractVisitor.buildContract(this.context, node), sourceLocation)
    } else {
      logger.warn(sourceLocation, `Ignoring class declaration ${ptype.fullName}`)
      return []
    }
  }
}
