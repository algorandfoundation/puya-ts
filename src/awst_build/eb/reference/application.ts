import type { InstanceBuilder, NodeBuilder } from '../index'
import { FunctionBuilder } from '../index'
import type { PType } from '../../ptypes'
import { bytesPType, accountPType } from '../../ptypes'
import { uint64PType } from '../../ptypes'
import { applicationPType } from '../../ptypes'
import type { SourceLocation } from '../../../awst/source-location'
import type { Expression } from '../../../awst/nodes'
import { parseFunctionArgs } from '../util/arg-parsing'
import { nodeFactory } from '../../../awst/node-factory'
import { Uint64BackedReferenceTypeExpressionBuilder } from './base'

export class ApplicationFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
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
