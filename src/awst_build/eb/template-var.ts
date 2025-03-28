import { nodeFactory } from '../../awst/node-factory'
import type { SourceLocation } from '../../awst/source-location'
import { logger } from '../../logger'
import { TemplateVarNameRegex } from '../../util/template-var-cli-parser'
import type { PType } from '../ptypes'
import { stringPType, TemplateVarFunction } from '../ptypes'
import { instanceEb } from '../type-registry'
import type { NodeBuilder } from './index'
import { FunctionBuilder } from './index'
import { requireStringConstant } from './util'
import { parseFunctionArgs } from './util/arg-parsing'

export class TemplateVarFunctionBuilder extends FunctionBuilder {
  readonly ptype = TemplateVarFunction

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [name, prefix],
      ptypes: [varType],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 1,
      callLocation: sourceLocation,
      funcName: this.typeDescription,
      argSpec: (a) => [a.required(stringPType), a.optional(stringPType)],
    })

    const nameStr = requireStringConstant(name).value
    const validName = TemplateVarNameRegex.exec(nameStr)
    if (validName?.[0] !== nameStr) {
      logger.error(
        name.sourceLocation,
        'Invalid name. Template variable names must only contain capital letters A-Z, numbers 0-9, and underscores',
      )
    }

    const prefixStr = prefix ? requireStringConstant(prefix).value : 'TMPL_'

    return instanceEb(
      nodeFactory.templateVar({
        name: `${prefixStr}${nameStr}`,
        wtype: varType.wtypeOrThrow,
        sourceLocation,
      }),
      varType,
    )
  }
}
