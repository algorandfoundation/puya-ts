import { InternalError } from '../errors'

export type SemVer = {
  major: number
  minor: number
  rev: number
  formatted: string
}

export function parseSemVer(version: string): SemVer {
  const matched = /^(\d+)\.(\d+)\.(\d+)$/.exec(version)
  if (!matched) {
    throw new InternalError(`Invalid version string: ${version}`)
  }

  return {
    major: Number(matched[1]),
    minor: Number(matched[2]),
    rev: Number(matched[3]),
    formatted: version,
  }
}
