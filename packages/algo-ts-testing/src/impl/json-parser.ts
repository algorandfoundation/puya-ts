// regexpxs extracted from
// (c) BSD-3-Clause
// clone of https://github.com/sidorares/json-bigint/blob/master/lib/parse.js with some modifications to match AVM behavior

import { DeliberateAny } from '../typescript-helpers'

interface Options {
  /**
   * @default false
   */
  strict?: boolean | undefined
  /**
   * @default false
   */
  storeAsString?: boolean | undefined
  /**
   * @default false
   */
  alwaysParseAsBig?: boolean | undefined
  /**
   * @default 'error'
   */
  protoAction?: 'error' | 'ignore' | 'preserve' | undefined
  /**
   * @default 'error'
   */
  constructorAction?: 'error' | 'ignore' | 'preserve' | undefined
}
// https://github.com/fastify/secure-json-parse/graphs/contributors and https://github.com/hapijs/bourne/graphs/contributors
const suspectProtoRx =
  /(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])/
const suspectConstructorRx =
  /(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)/

const jsonParse = function (options: Options) {
  // This is a function that can parse a JSON text, producing a JavaScript
  // data structure. It is a simple, recursive descent parser. It does not use
  // eval or regular expressions, so it can be used as a model for implementing
  // a JSON parser in other languages.

  // We are defining the function inside of another function to avoid creating
  // global variables.

  // Default options one can override by passing options to the parse()
  const _options = {
    strict: false, // not being strict means do not generate syntax errors for "duplicate key"
    storeAsString: false, // toggles whether the values should be stored as BigNumber (default) or a string
    alwaysParseAsBig: false, // toggles whether all numbers should be Big
    protoAction: 'error',
    constructorAction: 'error',
  }

  // If there are options, then use them to override the default _options
  if (options !== undefined && options !== null) {
    if (options.strict === true) {
      _options.strict = true
    }
    if (options.storeAsString === true) {
      _options.storeAsString = true
    }
    _options.alwaysParseAsBig = options.alwaysParseAsBig === true ? options.alwaysParseAsBig : false

    if (typeof options.constructorAction !== 'undefined') {
      if (options.constructorAction === 'error' || options.constructorAction === 'ignore' || options.constructorAction === 'preserve') {
        _options.constructorAction = options.constructorAction
      } else {
        throw new Error(
          `Incorrect value for constructorAction option, must be "error", "ignore" or undefined but passed ${options.constructorAction}`,
        )
      }
    }

    if (typeof options.protoAction !== 'undefined') {
      if (options.protoAction === 'error' || options.protoAction === 'ignore' || options.protoAction === 'preserve') {
        _options.protoAction = options.protoAction
      } else {
        throw new Error(`Incorrect value for protoAction option, must be "error", "ignore" or undefined but passed ${options.protoAction}`)
      }
    }
  }

  let at: number, // The index of the current character
    ch: string, // The current character
    text: string

  const escapee = {
      '"': '"',
      '\\': '\\',
      '/': '/',
      b: '\b',
      f: '\f',
      n: '\n',
      r: '\r',
      t: '\t',
    },
    error = function (m: string) {
      // Call error when something is wrong.

      throw {
        name: 'SyntaxError',
        message: m,
        at: at,
        text: text,
      }
    },
    next = function (c?: string) {
      // If a c parameter is provided, verify that it matches the current character.

      if (c && c !== ch) {
        error(`Expected '${c}' instead of '${ch}'`)
      }

      // Get the next character. When there are no more characters,
      // return the empty string.

      ch = text.charAt(at)
      at += 1
      return ch
    },
    number = function () {
      // Parse a number value.

      let string = ''

      if (ch === '-') {
        string = '-'
        next('-')
      }
      while (ch >= '0' && ch <= '9') {
        string += ch
        next()
      }
      if (ch === '.') {
        string += '.'
        while (next() && ch >= '0' && ch <= '9') {
          string += ch
        }
      }
      if (ch === 'e' || ch === 'E') {
        string += ch
        ch = next()
        if (ch === '-' || ch === '+') {
          string += ch
          next()
        }
        while (ch >= '0' && ch <= '9') {
          string += ch
          next()
        }
      }
      const result = +string
      if (!isFinite(result)) {
        error('Bad number')
      } else {
        // if the input is in exponential notation, return it as string to match AVM behaviour
        if (/[.eE]/.test(string)) return string
        if (Number.isSafeInteger(result)) return !_options.alwaysParseAsBig ? result : BigInt(result)
        // Number with fractional part should be treated as number(double) including big integers in scientific notation, i.e 1.79e+308
        else return _options.storeAsString ? string : /[.eE]/.test(string) ? result : BigInt(string)
      }
    },
    string = function (level?: number) {
      // Parse a string value.

      let hex,
        i,
        string = '',
        uffff,
        u

      // When parsing for string values, we must look for " and \ characters.

      if (ch === '"') {
        let startAt = at
        while (next()) {
          if (ch === '"') {
            if (at - 1 > startAt) string += text.substring(startAt, at - 1)
            next()
            return string
          }
          if (ch === '\\') {
            if (at - 1 > startAt) string += text.substring(startAt, at - 1)
            next()
            if (ch === 'u') {
              uffff = 0
              const utf = ['\\', 'u']
              for (i = 0; i < 4; i += 1) {
                utf.push((u = next()))
                hex = parseInt(u, 16)
                if (!isFinite(hex)) {
                  break
                }
                uffff = uffff * 16 + hex
              }
              string += level === 0 || level === 1 ? String.fromCharCode(uffff) : utf.join('')
            } else if (typeof escapee[ch] === 'string') {
              string += escapee[ch]
            } else {
              break
            }
            startAt = at
          }
        }
      }
      error('Bad string')
    },
    white = function () {
      // Skip whitespace.
      const whiteSpaces = [ch]
      while (ch && ch <= ' ') {
        whiteSpaces.push(next())
      }
      whiteSpaces.pop()
      return whiteSpaces.join('')
    },
    word = function () {
      // true, false, or null.

      switch (ch) {
        case 't':
          next('t')
          next('r')
          next('u')
          next('e')
          return true
        case 'f':
          next('f')
          next('a')
          next('l')
          next('s')
          next('e')
          return false
        case 'n':
          next('n')
          next('u')
          next('l')
          next('l')
          return null
      }
      error(`Unexpected '${ch}'`)
    },
    array = function () {
      // Parse an array value.

      const array: DeliberateAny[] = []

      if (ch === '[') {
        ch = next('[')
        white()
        if (ch === ']') {
          next(']')
          return array // empty array
        }
        while (ch) {
          array.push(value())
          white()
          if (ch === ']') {
            next(']')
            return array
          }
          next(',')
          white()
        }
      }
      error('Bad array')
    },
    object = function (level?: number) {
      // Parse an object value.

      let key
      const object = Object.create(null)
      const asStringArray = [ch]
      const nextLevel = level === 0 ? 1 : undefined

      if (ch === '{') {
        asStringArray.push((ch = next('{')))
        asStringArray.push(white())
        if (ch === '}') {
          asStringArray.push(next('}'))
          return level === 0 ? object : asStringArray.join('') // empty object
        }
        while (ch) {
          asStringArray.push(Object.keys(object).length ? ',"' : '', (key = string() ?? ''), '"', ':')
          asStringArray.push(white())
          next(':')
          if ((_options.strict === true || level === 0) && Object.hasOwnProperty.call(object, key ?? '')) {
            error(`Duplicate key "${key}"`)
          }

          if (suspectProtoRx.test(key ?? '') === true) {
            if (_options.protoAction === 'error') {
              error('Object contains forbidden prototype property')
            } else if (_options.protoAction === 'ignore') {
              asStringArray.push(value(nextLevel).toString())
            } else {
              asStringArray.push((object[key ?? ''] = value(nextLevel)).toString())
            }
          } else if (suspectConstructorRx.test(key ?? '') === true) {
            if (_options.constructorAction === 'error') {
              error('Object contains forbidden constructor property')
            } else if (_options.constructorAction === 'ignore') {
              asStringArray.push(value(nextLevel).toString())
            } else {
              asStringArray.push((object[key ?? ''] = value(nextLevel)).toString())
            }
          } else {
            asStringArray.push((object[key ?? ''] = value(nextLevel)).toString())
          }

          asStringArray.push(white())
          if (ch === '}') {
            next('}')
            asStringArray.push('}')
            return level === 0 ? object : asStringArray.join('')
          }
          next(',')
          asStringArray.push(white())
        }
      }
      error('Bad object')
    },
    value = function (level?: number) {
      // Parse a JSON value. It could be an object, an array, a string, a number,
      // or a word.

      white()
      switch (ch) {
        case '{':
          return object(level)
        case '[':
          return array()
        case '"':
          return level === 0 || level === 1 ? string(level) : `"${string()}"`
        case '-':
          return number()
        default:
          return ch >= '0' && ch <= '9' ? number() : word()
      }
    }

  // Return the json_parse function. It will have access to all of the above
  // functions and variables.

  return function (source: string, reviver?: (key: string, value: DeliberateAny) => DeliberateAny) {
    text = `${source}`
    at = 0
    ch = ' '
    const result = value(0)
    white()
    if (ch) {
      error('Syntax error')
    }

    // If there is a reviver function, we recursively walk the new structure,
    // passing each name/value pair to the reviver function for possible
    // transformation, starting with a temporary root object that holds the result
    // in an empty key. If there is not a reviver function, we simply return the
    // result.

    return typeof reviver === 'function'
      ? (function walk(holder: { [k: string]: DeliberateAny }, key) {
          const value = holder[key]
          let v
          if (value && typeof value === 'object') {
            Object.keys(value).forEach(function (k) {
              v = walk(value, k)
              if (v !== undefined) {
                value[k] = v
              } else {
                delete value[k]
              }
            })
          }
          return reviver.call(holder, key, value)
        })({ '': result }, '')
      : result
  }
}

export const JSONParser = { parse: jsonParse({}) }
