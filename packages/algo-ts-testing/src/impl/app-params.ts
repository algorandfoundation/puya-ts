import { Account, Application, Bytes, bytes, gtxn, internal, Uint64, uint64 } from '@algorandfoundation/algo-ts'
import { lazyContext } from '../context-helpers/internal-context'
import { asMaybeUint64Cls, asUint64 } from '../util'

const resolveAppIndex = (appIdOrIndex: internal.primitives.StubUint64Compat): uint64 => {
  const input = asUint64(appIdOrIndex)
  if (input >= 1001) {
    return input
  }
  const txn = lazyContext.activeGroup.activeTransaction as gtxn.ApplicationTxn
  return txn.apps(input).id
}

const get_app = (app: Application | internal.primitives.StubUint64Compat): Application | undefined => {
  try {
    const appId = asMaybeUint64Cls(app)
    if (appId !== undefined) {
      return lazyContext.ledger.getApplication(resolveAppIndex(appId))
    }
    return app as Application
  } catch {
    return undefined
  }
}

export const AppParams: internal.opTypes.AppParamsType = {
  appApprovalProgram: function (a: Application | internal.primitives.StubUint64Compat): readonly [bytes, boolean] {
    const app = get_app(a)
    return app === undefined ? [Bytes(), false] : [app.approvalProgram, true]
  },
  appClearStateProgram: function (a: Application | internal.primitives.StubUint64Compat): readonly [bytes, boolean] {
    const app = get_app(a)
    return app === undefined ? [Bytes(), false] : [app.clearStateProgram, true]
  },
  appGlobalNumUint: function (a: Application | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const app = get_app(a)
    return app === undefined ? [Uint64(0), false] : [app.globalNumUint, true]
  },
  appGlobalNumByteSlice: function (a: Application | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const app = get_app(a)
    return app === undefined ? [Uint64(0), false] : [app.globalNumBytes, true]
  },
  appLocalNumUint: function (a: Application | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const app = get_app(a)
    return app === undefined ? [Uint64(0), false] : [app.localNumUint, true]
  },
  appLocalNumByteSlice: function (a: Application | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const app = get_app(a)
    return app === undefined ? [Uint64(0), false] : [app.localNumBytes, true]
  },
  appExtraProgramPages: function (a: Application | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const app = get_app(a)
    return app === undefined ? [Uint64(0), false] : [app.extraProgramPages, true]
  },
  appCreator: function (a: Application | internal.primitives.StubUint64Compat): readonly [Account, boolean] {
    const app = get_app(a)
    return app === undefined ? [Account(), false] : [app.creator, true]
  },
  appAddress: function (a: Application | internal.primitives.StubUint64Compat): readonly [Account, boolean] {
    const app = get_app(a)
    return app === undefined ? [Account(), false] : [app.address, true]
  },
}
