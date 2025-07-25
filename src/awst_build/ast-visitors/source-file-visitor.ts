import ts from 'typescript'
import type * as awst from '../../awst/nodes'
import { CodeError } from '../../errors'
import { logger, patchErrorLocation } from '../../logger'
import { codeInvariant, expandMaybeArray, invariant } from '../../util'
import type { ModuleStatements } from '../../visitor/syntax-names'
import type { Visitor } from '../../visitor/visitor'
import { accept } from '../../visitor/visitor'
import { requireInstanceBuilder } from '../eb/util'
import { ContractClassPType, LogicSigPType } from '../ptypes'
import { ARC4StructType } from '../ptypes/arc4-types'
import { BaseVisitor } from './base-visitor'
import { ContractVisitor } from './contract-visitor'
import { LogicSigVisitor } from './logic-sig-visitor'
import { StructVisitor } from './struct-visitor'
import { SubroutineVisitor } from './subroutine-visitor'

type NodeOrDeferred = awst.AWST[] | awst.AWST | (() => awst.AWST[] | awst.AWST)

export class SourceFileVisitor extends BaseVisitor implements Visitor<ModuleStatements, NodeOrDeferred> {
  private _moduleStatements: NodeOrDeferred[] = []
  private accept = <TNode extends ts.Node>(node: TNode) => accept<SourceFileVisitor, TNode>(this, node)

  constructor(sourceFile: ts.SourceFile) {
    super()
    for (const statement of sourceFile.statements) {
      try {
        this._moduleStatements.push(this.accept(statement))
      } catch (e) {
        invariant(e instanceof Error, 'Only errors should be thrown')
        logger.error(e)
      }
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
    const sourceLocation = this.sourceLocation(node)
    return this.context.runInChildContext(() => patchErrorLocation(SubroutineVisitor.buildSubroutine(node), sourceLocation))
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
        invariant(e instanceof Error, 'Only errors should be thrown')
        logger.error(e)
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

      const initializerBuilder = this.accept(dec.initializer)

      if (ptype.singleton) {
        // Likely aliasing of an algo-ts type - eg const MyArray = FixedArray<uint64>
        invariant(initializerBuilder.ptype?.equals(ptype), 'Initializer type must match target type')
        return []
      }
      const maybeConst = requireInstanceBuilder(initializerBuilder)

      codeInvariant(maybeConst.isConstant, 'Module level assignments must be compile time constants')

      this.context.addConstant(dec.name, maybeConst)

      return []
    })
  }
  visitImportDeclaration(node: ts.ImportDeclaration): NodeOrDeferred {
    return []
  }
  visitClassDeclaration(node: ts.ClassDeclaration): NodeOrDeferred {
    const sourceLocation = this.sourceLocation(node)
    const ptype = this.context.getPTypeForNode(node)

    if (ptype instanceof ContractClassPType) {
      return patchErrorLocation(ContractVisitor.buildContract(node, ptype), sourceLocation)
    } else if (ptype instanceof ARC4StructType) {
      return patchErrorLocation(() => StructVisitor.buildStructDef(node, ptype), sourceLocation)()
    } else if (ptype instanceof LogicSigPType) {
      return patchErrorLocation(LogicSigVisitor.buildLogicSig(node, ptype), sourceLocation)
    } else {
      logger.warn(sourceLocation, `Ignoring class declaration ${ptype.fullName}`)
      return []
    }
  }
}
