import upath from 'upath'
import { SourceLocation } from '../awst/source-location'
import { logger, LogLevel, LogSource } from '../logger'
import { invariant } from '../util'

function parseString(x: unknown) {
  invariant(typeof x === 'string', `expected string, received ${typeof x}`)
  return x
}
function parseNumber(x: unknown) {
  invariant(typeof x === 'number', `expected number, received ${typeof x}`)
  return x
}
function parseNullOrNumber(x: unknown) {
  if (x === null) return null
  return parseNumber(x)
}
function parseLogLevel(x: unknown) {
  switch (x) {
    case LogLevel.Error:
    case LogLevel.Info:
    case LogLevel.Warning:
    case LogLevel.Debug:
    case LogLevel.Critical:
      return x
    default:
      invariant(false, `expected LogLevel, received ${x}`)
  }
}
function parseSourceLocation(x: unknown) {
  invariant(typeof x === 'object', `expected object, received ${typeof x}`)
  if (x === null) return null
  const obj = x as Record<string, unknown>
  return {
    file: parseString(obj.file),
    line: parseNumber(obj.line),
    end_line: parseNullOrNumber(obj.end_line),
    column: parseNumber(obj.column),
    end_column: parseNullOrNumber(obj.end_column),
  }
}

function parsePuyaLog(x: unknown) {
  invariant(typeof x === 'object' && x !== null, `expected object, received ${typeof x}`)
  const obj = x as Record<string, unknown>
  return {
    level: parseLogLevel(obj.level),
    message: parseString(obj.message),
    location: parseSourceLocation(obj.location),
  }
}

export function deserializeAndLog(logText: string) {
  try {
    const log = parsePuyaLog(JSON.parse(logText))

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
