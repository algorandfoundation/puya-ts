import { Contract } from '.'
import { AbiMethodConfig, BareMethodConfig } from './arc4'

export type ExecutionContext = {
  abiMetadata: {
    captureMethodConfig<T extends Contract>(contract: T, methodName: string, config?: AbiMethodConfig<T> | BareMethodConfig): void
  }
}

declare global {
  // eslint-disable-next-line no-var
  var puyaTsExecutionContext: ExecutionContext | undefined
}

export const ctxMgr = {
  set instance(ctx: ExecutionContext) {
    const instance = global.puyaTsExecutionContext
    if (instance != undefined) throw new Error('Execution context has already been set')
    global.puyaTsExecutionContext = ctx
  },
  get instance() {
    const instance = global.puyaTsExecutionContext
    if (instance == undefined) throw new Error('No execution context has been set')
    return instance
  },
  reset() {
    global.puyaTsExecutionContext = undefined
  },
}
