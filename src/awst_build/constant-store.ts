import ts, { SymbolFlags } from 'typescript'
import type { Expression } from '../awst/nodes'
import type { SourceLocation } from '../awst/source-location'
import { CodeError } from '../errors'
import { logger } from '../logger'
import { hasFlags, invariant } from '../util'
import { evolve } from '../util/evolve'
import type { InstanceBuilder } from './eb'
import { BigIntLiteralExpressionBuilder } from './eb/literal/big-int-literal-expression-builder'
import { NumericLiteralExpressionBuilder } from './eb/literal/numeric-literal-expression-builder'
import type { PType } from './ptypes'
import { BigIntLiteralPType, NumericLiteralPType } from './ptypes'
import { instanceEb } from './type-registry'

type ConstantData =
  | {
      type: 'expr'
      expr: Expression
      ptype: PType
    }
  | {
      type: 'bigint'
      ptype: BigIntLiteralPType
    }
  | {
      type: 'number'
      ptype: NumericLiteralPType
    }

export class ConstantStore {
  #constants = new Map<ts.Symbol, ConstantData>()
  #typeChecker: ts.TypeChecker
  constructor(program: ts.Program) {
    this.#typeChecker = program.getTypeChecker()
  }

  tryResolveConstant(node: ts.Identifier, sourceLocation: SourceLocation): InstanceBuilder | undefined {
    let symbol = this.#typeChecker.resolveName(node.text, node, SymbolFlags.All, true)
    if (!symbol) return undefined
    if (hasFlags(symbol.flags, ts.SymbolFlags.Alias)) {
      symbol = this.#typeChecker.getAliasedSymbol(symbol)
    }
    const data = this.#constants.get(symbol)
    switch (data?.type) {
      case 'bigint':
        return new BigIntLiteralExpressionBuilder(data.ptype.literalValue, data.ptype, sourceLocation)
      case 'number':
        return new NumericLiteralExpressionBuilder(data.ptype.literalValue, data.ptype, sourceLocation)
      case 'expr':
        return instanceEb(evolve(data.expr, { sourceLocation }), data.ptype)
      default:
        return undefined
    }
  }

  addConstant(identifier: ts.Identifier, builder: InstanceBuilder, constantLocation: SourceLocation) {
    const symbol = this.#typeChecker.resolveName(identifier.text, identifier, ts.SymbolFlags.All, false)
    invariant(symbol, 'Constant identifier must resolve to a symbol')

    if (this.#constants.has(symbol)) {
      logger.error(new CodeError(`Duplicate definitions found for constant ${identifier.text}`, { sourceLocation: constantLocation }))
      return
    }
    const exportSymbol = this.#typeChecker.getExportSymbolOfSymbol(symbol)
    const data = this.buildConstantData(builder)
    this.#constants.set(symbol, data)
    if (exportSymbol !== symbol) this.#constants.set(exportSymbol, data)
  }

  private buildConstantData(builder: InstanceBuilder): ConstantData {
    if (builder instanceof NumericLiteralExpressionBuilder) {
      return {
        type: 'number',
        ptype: new NumericLiteralPType({ literalValue: builder.value }),
      }
    }
    if (builder instanceof BigIntLiteralExpressionBuilder) {
      return {
        type: 'bigint',
        ptype: new BigIntLiteralPType({ literalValue: builder.value }),
      }
    } else {
      return {
        type: 'expr',
        expr: builder.resolve(),
        ptype: builder.ptype,
      }
    }
  }
}
