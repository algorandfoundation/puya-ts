import * as A from 'arcsecond'
import { hexToUint8Array, utf8ToUint8Array } from './index'

export const TemplateVarNameRegex = /^[A-Z\d_]+/

const templateVarName = A.regex(TemplateVarNameRegex)

const hexBytes = A.sequenceOf([A.str('0x'), A.regex(/^([A-F0-9]{2})*/)]).map(([prefix, chars]) => hexToUint8Array(chars))

const integer = A.regex(/^\d+/).map((x) => BigInt(x))

const string = A.regex(/^.*/).map(utf8ToUint8Array)

const templateVarValue = A.choice([hexBytes, integer, string])

const templateVar = A.coroutine((parse) => {
  const name = parse(templateVarName)
  parse(A.char('='))
  const value = parse(templateVarValue)
  parse(A.endOfInput)
  return [name, value] as const
})

export const parseCliTemplateVar = (text: string): readonly [string, Uint8Array | bigint] => {
  const result = templateVar.run(text)
  if (result.isError) {
    throw new Error('Cannot parse cli template var. Make sure it is in the form VAR_NAME={value}', { cause: result.error })
  } else {
    return result.result
  }
}
