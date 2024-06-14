import { SourceFileContext, UniqueNameResolver } from './context'
import { ModuleStatements } from '../visitor/syntax-names'
import * as awst from '../awst/nodes'
import ts from 'typescript'
import { CodeError } from '../errors'
import { BaseVisitor, Visitor, accept } from '../visitor/visitor'
import { ContractVisitor } from './contract-visitor'
import { FunctionVisitor } from './function-visitor'
import { logger, logPuyaExceptions } from '../logger'
import { CompileTimeConstantVisitor } from './compile-time-constant-visitor'
import { expandMaybeArray } from '../util'
import { nodeFactory } from '../awst/node-factory'

type StatementOrDeferred = awst.ModuleStatement[] | awst.ModuleStatement | (() => awst.ModuleStatement[] | awst.ModuleStatement)

export class SourceFileVisitor extends BaseVisitor<SourceFileContext> implements Visitor<ModuleStatements, StatementOrDeferred> {
  private _moduleStatements: StatementOrDeferred[] = []
  private accept = <TNode extends ts.Node>(node: TNode) => accept<SourceFileVisitor, TNode>(this, node)

  constructor(sourceFile: ts.SourceFile, program: ts.Program) {
    super(new SourceFileContext(sourceFile, program, new UniqueNameResolver()))

    for (const statement of sourceFile.statements) {
      this._moduleStatements.push(this.accept(statement))
    }
  }

  visitTypeAliasDeclaration(_node: ts.TypeAliasDeclaration): StatementOrDeferred {
    // Ignore these for now - but maybe we need to do something with them when it comes to structs
    return []
  }

  visitFunctionDeclaration(node: ts.FunctionDeclaration): StatementOrDeferred {
    return () => logPuyaExceptions(() => FunctionVisitor.buildSubroutine(this.context, node), this.sourceLocation(node))
  }

  public *gatherStatements(): Generator<awst.ModuleStatement, void, void> {
    for (const statements of this._moduleStatements) {
      if (typeof statements === 'function') {
        for (const s of expandMaybeArray(statements())) {
          yield s
        }
      } else {
        for (const s of expandMaybeArray(statements)) {
          yield s
        }
      }
    }
  }

  visitVariableStatement(node: ts.VariableStatement): StatementOrDeferred {
    const sourceLocation = this.sourceLocation(node)
    if (!(node.declarationList.flags & ts.NodeFlags.Const)) {
      logger.error(new CodeError(`Module level variable declarations must use the 'const' keyword.`, { sourceLocation }))
    }

    return node.declarationList.declarations.map((dec) => {
      if (!dec.initializer) {
        throw new CodeError(`Module level variable declarations must be initialized with a value.`, { sourceLocation })
      }
      const value = CompileTimeConstantVisitor.getCompileTimeConstant(this.context, dec.initializer)
      if (!ts.isIdentifier(dec.name)) {
        throw new CodeError(`Module level variable declarations must use plain identifiers.`, { sourceLocation })
      }
      return nodeFactory.constantDeclaration({
        value: value.value,
        sourceLocation,
        name: this.context.resolveVariable(dec.name),
      })
    })
  }
  visitImportDeclaration(_node: ts.ImportDeclaration): StatementOrDeferred {
    return []
  }
  visitClassDeclaration(node: ts.ClassDeclaration): StatementOrDeferred {
    return () => logPuyaExceptions(() => ContractVisitor.buildContract(this.context, node), this.sourceLocation(node))
  }
}
