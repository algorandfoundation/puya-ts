import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import type { PType } from '../../ptypes'
import { accountPType, applicationPType, bytesPType, uint64PType } from '../../ptypes'
import type { NodeBuilder } from '../index'
import { FunctionBuilder } from '../index'
import { parseFunctionArgs } from '../util/arg-parsing'
import { Uint64BackedReferenceTypeExpressionBuilder } from './base'

export class ApplicationFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [applicationId],
    } = parseFunctionArgs({
      argSpec: (a) => [a.optional(uint64PType)],
      args,
      typeArgs,
      genericTypeArgs: 0,
      funcName: 'Application',
      callLocation: sourceLocation,
    })

    return new ApplicationExpressionBuilder(
      nodeFactory.reinterpretCast({
        expr: applicationId?.resolve() ?? nodeFactory.uInt64Constant({ value: 0n, sourceLocation }),
        sourceLocation,
        wtype: applicationPType.wtypeOrThrow,
      }),
    )
  }
}

export class ApplicationExpressionBuilder extends Uint64BackedReferenceTypeExpressionBuilder {
  constructor(expr: Expression) {
    super(expr, {
      ptype: applicationPType,
      backingMember: 'id',
      fieldOpCode: 'app_params_get',
      fieldMapping: {
        approvalProgram: ['AppApprovalProgram', bytesPType],
        clearStateProgram: ['AppClearStateProgram', bytesPType],
        globalNumUint: ['AppGlobalNumUint', uint64PType],
        globalNumBytes: ['AppGlobalNumByteSlice', uint64PType],
        localNumUint: ['AppLocalNumUint', uint64PType],
        localNumBytes: ['AppLocalNumByteSlice', uint64PType],
        extraProgramPages: ['AppExtraProgramPages', uint64PType],
        creator: ['AppCreator', accountPType],
        address: ['AppAddress', accountPType],
      },
      fieldBoolComment: 'application exists',
    })
  }
}
