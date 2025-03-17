import type { ArgumentParser } from 'argparse'
import { enumFromValue } from '../util'

export function addEnumArg<T>(
  parser: ArgumentParser,
  { name, enumType, default: defaultValue, help }: { name: string; enumType: Record<string, string>; default?: T; help: string },
) {
  parser.add_argument(name, {
    type: (v: string) => enumFromValue(v, enumType),
    choices: Array.from(Object.values(enumType)),
    default: defaultValue,
    help,
  })
}

export function convertInt(val: string) {
  const res = Number(val)
  if (isNaN(res) || Math.round(res) !== res) {
    throw new Error(`'${val}' could not be converted to a number`)
  }
  return res
}
