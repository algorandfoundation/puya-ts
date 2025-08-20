import upath from 'upath'
import { z } from 'zod'
import { SourceLocation } from '../awst/source-location'
import { logger, LogLevel, LogSource } from '../logger'

const puyaLog = z.object({
  level: z.nativeEnum(LogLevel),
  location: z
    .object({
      file: z.string(),
      line: z.number(),
      end_line: z.number().or(z.null()),
      column: z.number(),
      end_column: z.number().or(z.null()),
    })
    .or(z.null()),
  message: z.string(),
})

export function deserializeAndLog(logText: string) {
  try {
    const log = puyaLog.parse(JSON.parse(logText))

    const sourceLocation = log.location
      ? new SourceLocation({
          file: upath.normalize(log.location.file),
          line: log.location.line,
          endLine: log.location.end_line ?? log.location.line + 1,
          column: log.location.column,
          endColumn: log.location.end_column ?? log.location.column,
          scope: 'range',
          node: undefined,
        })
      : undefined
    logger.addLog({ ...log, sourceLocation, logSource: LogSource.Puya })
  } catch (e) {
    logger.error(undefined, `Could not parse log output from puya cli ${e}`)
  }
}
