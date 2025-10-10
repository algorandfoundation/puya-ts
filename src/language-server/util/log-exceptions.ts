import type { DeliberateAny } from '../../typescript-helpers'
import { logger } from '../../logger'

export function LogExceptions<TThis, TArgs extends DeliberateAny[], TReturn>(target: (this: TThis, ...args: TArgs) => TReturn) {
  return function (this: TThis, ...args: TArgs): TReturn {
    try {
      const result = target.apply(this, args)
      if (result instanceof Promise) {
        return result.catch((e: unknown) => {
          logCaughtExpression(e)
          process.exit(1)
        }) as TReturn
      }
      return result
    } catch (e) {
      logCaughtExpression(e)
      process.exit(1)
    }
  }
}

export function logCaughtExpression(e: unknown) {
  if (e instanceof Error) {
    logger.error(e)
  } else {
    logger.error(undefined, `Unknown error ${e}`)
  }
}
