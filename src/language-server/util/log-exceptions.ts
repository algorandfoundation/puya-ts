import type { DeliberateAny } from '../../typescript-helpers'
import type { LsLogger } from '../ls-logger'

type ClassWithLogger = {
  logger: LsLogger
}

export function LogExceptions<TThis extends ClassWithLogger, TArgs extends DeliberateAny[], TReturn>(
  target: (this: TThis, ...args: TArgs) => TReturn,
) {
  return function (this: TThis, ...args: TArgs): TReturn {
    try {
      const result = target.apply(this, args)
      if (result instanceof Promise) {
        return result.catch((e) => {
          this.logger.error(`Unhandled exception ${e}`)
          process.exit(1)
        }) as TReturn
      }
      return result
    } catch (e) {
      this.logger.error(`Unhandled exception ${e}`)
      process.exit(1)
    }
  }
}
