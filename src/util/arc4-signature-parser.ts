import type { Parser } from 'arcsecond'
import * as A from 'arcsecond'
import type { ABICompatiblePType, PType } from '../awst_build/ptypes'
import {
  accountPType,
  anyGtxnType,
  applicationCallGtxnType,
  applicationPType,
  assetConfigGtxnType,
  assetFreezeGtxnType,
  assetPType,
  assetTransferGtxnType,
  keyRegistrationGtxnType,
  paymentGtxnType,
  voidPType,
} from '../awst_build/ptypes'
import * as arc4Types from '../awst_build/ptypes/arc4-types'

const peek = A.lookAhead(A.regex(/^./))

const integer = A.regex(/^\d+/).map((x) => BigInt(x))

const uint = A.sequenceOf([A.str('uint'), integer]).map(([_, n]) => new arc4Types.UintNType({ n: n }))
const ufixed = A.sequenceOf([A.str('ufixed'), integer, A.char('x'), integer]).map(([_, n, __, m]) => new arc4Types.UFixedNxMType({ n, m }))

const simpleType = <T extends PType>(name: string, ptype: T) => A.str(name).map(() => ptype)

const methodName = A.regex(/^[^ (]+/)

const scalarType = A.choice([
  uint,
  ufixed,
  simpleType('byte', arc4Types.arc4ByteAlias),
  simpleType('string', arc4Types.arc4StringType),
  simpleType('bool', arc4Types.arc4BooleanType),
  simpleType('address', arc4Types.arc4AddressAlias),
])

const resourceTypes = A.choice([
  simpleType('account', accountPType),
  simpleType('asset', assetPType),
  simpleType('application', applicationPType),
])
const txnTypes = A.choice([
  simpleType('txn', anyGtxnType),
  simpleType('appl', applicationCallGtxnType),
  simpleType('acfg', assetConfigGtxnType),
  simpleType('axfer', assetTransferGtxnType),
  simpleType('afrz', assetFreezeGtxnType),
  simpleType('keyreg', keyRegistrationGtxnType),
  simpleType('pay', paymentGtxnType),
])

class TypeBuilder {
  #stack: arc4Types.ARC4EncodedType[][] = [[]]

  private get workingSet() {
    return this.#stack[this.#stack.length - 1]
  }

  get hasOpenTuple() {
    return this.#stack.length > 1
  }

  enterTuple() {
    this.#stack.push([])
  }
  exitTuple() {
    if (this.#stack.length === 1) {
      throw new Error('Invalid operation, no tuple has been entered')
    }
    const tupleType = new arc4Types.ARC4TupleType({ types: this.workingSet })
    this.#stack.pop()
    this.workingSet.push(tupleType)
  }

  get result(): arc4Types.ARC4EncodedType {
    if (this.#stack.length > 1) {
      throw new Error(`Tuple has not been closed`)
    }
    if (this.workingSet.length === 0) {
      throw new Error('Sequence contained no types')
    }
    if (this.workingSet.length !== 1) {
      throw new Error(`Sequence contained more than one type`)
    }
    return this.workingSet[0]
  }

  push(ptype: arc4Types.ARC4EncodedType) {
    this.workingSet.push(ptype)
  }

  replaceLast(replacer: (lastType: arc4Types.ARC4EncodedType) => arc4Types.ARC4EncodedType) {
    if (this.workingSet.length === 0) {
      throw new Error('Invalid operation, no type to replace')
    }
    const latest = this.workingSet.pop()!
    this.workingSet.push(replacer(latest))
  }
}

const arc4Type = A.coroutine<arc4Types.ARC4EncodedType>((parse) => {
  try {
    enum States {
      BeginTuple,
      EndTuple,
      ArrayBrackets,
      TypeOrBeginTuple,
      AfterType,
    }
    let state = States.TypeOrBeginTuple

    const typeBuilder = new TypeBuilder()
    while (true) {
      const next = parse(A.possibly(peek))
      if (next === null) {
        return typeBuilder.result
      }

      switch (state) {
        case States.TypeOrBeginTuple: {
          if (next === '(') {
            state = States.BeginTuple
          } else {
            const type = parse(scalarType)
            typeBuilder.push(type)
            state = States.AfterType
          }
          break
        }
        case States.BeginTuple: {
          parse(A.char('('))
          typeBuilder.enterTuple()
          state = States.TypeOrBeginTuple
          break
        }
        case States.EndTuple: {
          parse(A.char(')'))
          if (!typeBuilder.hasOpenTuple) {
            return parse(A.fail("Char ')' has no matching opening '('"))
          }
          typeBuilder.exitTuple()
          state = States.AfterType
          break
        }
        case States.ArrayBrackets: {
          parse(A.char('['))
          const size = parse(A.possibly(integer))
          parse(A.char(']'))

          typeBuilder.replaceLast((previous) =>
            size === null
              ? new arc4Types.DynamicArrayType({ elementType: previous })
              : new arc4Types.StaticArrayType({ elementType: previous, arraySize: size }),
          )
          state = States.AfterType
          break
        }
        case States.AfterType: {
          switch (next) {
            case '[':
              state = States.ArrayBrackets
              continue
            case ')':
              if (typeBuilder.hasOpenTuple) {
                state = States.EndTuple
                continue
              }
              break
            case ',':
              if (typeBuilder.hasOpenTuple) {
                parse(A.char(','))
                state = States.TypeOrBeginTuple
                continue
              }
              break
          }
          return typeBuilder.result
        }
      }
    }
  } catch (e) {
    if (e instanceof Error) {
      return parse(A.fail(e.message))
    } else {
      throw e
    }
  }
})
const voidType = simpleType('void', voidPType)
const abiReturn = A.choice([voidType, resourceTypes, arc4Type]).errorMap(updateErrorMessage('ABI return type'))
const abiParam = A.choice([resourceTypes, txnTypes, arc4Type]).errorMap(updateErrorMessage('ABI parameter type'))

type ARC4MethodSignature = { name: string; parameters: ABICompatiblePType[]; returnType: ABICompatiblePType }

const arc4Method = A.coroutine<ARC4MethodSignature>((parse) => {
  try {
    const name = parse(methodName)
    parse(A.str('('))
    const parameters: ABICompatiblePType[] = []
    while (true) {
      const peekNext = parse(A.possibly(peek))
      if (peekNext !== ')') {
        parameters.push(parse(abiParam))
      }
      const readNext = parse(A.choice([A.char(')'), A.char(',')]))
      if (readNext === ')') {
        break
      }
    }

    const returnType = parse(abiReturn)
    return {
      name,
      parameters,
      returnType,
    } satisfies ARC4MethodSignature
  } catch (e) {
    if (e instanceof Error) {
      return parse(A.fail(e.message))
    } else {
      throw e
    }
  }
})

export class Arc4ParseError extends Error {
  constructor(
    message: string,
    public index: number,
  ) {
    super(message)
  }
}

const parseError = A.sequenceOf([
  A.str('ParseError '),
  A.possibly(A.regex(/^'[^']+' /)),
  A.sequenceOf([A.str('(position '), A.digits, A.str('): ')]),
  A.many(A.anyCharExcept(A.char(','))).map((chars) => chars.join('')),
  A.str(', '),
  A.many(A.anyChar).map((chars) => chars.join('')),
]).map((parts) => ({
  expectedMessage: parts[3],
  butGotMessage: parts[5],
}))

function updateErrorMessage(expectedEntity: string) {
  return <D>(error: A.Err<string, D>) => {
    // Error message will generally look like
    // ParserError (position 5): Expected string 'example', but got ...
    return parseError.fork(
      error.error,
      () => error.error,
      (match) => `Expected ${expectedEntity}, ${match.butGotMessage}`,
    )
  }
}

function createParserFunction<T>(parser: Parser<T>): (text: string) => T {
  return (text) => {
    const parseResult = parser.run(text)
    if (parseResult.isError) {
      const maybeErrorMessage = /^ParseError ('[^']+' )?\(position \d+\): (.*)/.exec(parseResult.error)
      const message = maybeErrorMessage ? maybeErrorMessage[2] : parseResult.error
      throw new Arc4ParseError(message, parseResult.index)
    } else {
      return parseResult.result
    }
  }
}

export const parseArc4Type = createParserFunction<arc4Types.ARC4EncodedType>(A.sequenceOf([arc4Type, A.endOfInput]).map(([t]) => t))

export const parseArc4Method = createParserFunction<ARC4MethodSignature>(A.sequenceOf([arc4Method, A.endOfInput]).map(([t]) => t))
