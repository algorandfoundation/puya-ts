import type { DeliberateAny } from '../typescript-helpers'
import {
  ARC4Router,
  ArrayConcat,
  ArrayLength,
  ArrayPop,
  ArrayReplace,
  AssertExpression,
  AssignmentExpression,
  BigUIntBinaryOperation,
  BigUIntPostfixUnaryOperation,
  BooleanBinaryOperation,
  BoxPrefixedKeyExpression,
  BytesComparisonExpression,
  BytesUnaryOperation,
  CheckedMaybe,
  CommaExpression,
  Emit,
  Enumeration,
  ExpressionStatement,
  FieldExpression,
  Not,
  NumericComparisonExpression,
  PuyaLibCall,
  Range,
  Reversed,
  SetInnerTransactionFields,
  SingleEvaluation,
  SizeOf,
  StateExists,
  StateGet,
  StateGetEx,
  SubmitInnerTransaction,
  TupleItemExpression,
  UInt64BinaryOperation,
  UInt64PostfixUnaryOperation,
  UInt64UnaryOperation,
  UpdateInnerTransaction,
  VoidConstant,
} from './nodes'
import { wtypes } from './wtypes'

/* eslint-disable @typescript-eslint/no-unsafe-function-type */

/**
 * Identifies properties which can be safely omitted from serialization in order
 * to decrease the size of the json.
 *
 * These are typically properties which have init=False on the puya end
 */
const doNotSerialize = new Map<Function, string[]>([
  pair(SingleEvaluation, 'wtype'),
  pair(ExpressionStatement, 'sourceLocation'),
  pair(AssertExpression, 'wtype'),
  pair(VoidConstant, 'wtype'),
  pair(ArrayConcat, 'wtype'),
  pair(ArrayPop, 'wtype'),
  pair(ArrayReplace, 'wtype'),
  pair(ArrayLength, 'wtype'),
  pair(SizeOf, 'wtype'),
  pair(UpdateInnerTransaction, 'wtype'),
  pair(CheckedMaybe, 'wtype', 'sourceLocation'),
  pair(TupleItemExpression, 'wtype'),
  pair(SetInnerTransactionFields, 'wtype'),
  pair(SubmitInnerTransaction, 'wtype'),
  pair(FieldExpression, 'wtype'),
  pair(BoxPrefixedKeyExpression, 'wtype'),
  pair(AssignmentExpression, 'wtype'),
  pair(CommaExpression, 'wtype'),
  pair(NumericComparisonExpression, 'wtype'),
  pair(BytesComparisonExpression, 'wtype'),
  pair(PuyaLibCall, 'wtype'),
  pair(UInt64UnaryOperation, 'wtype'),
  pair(UInt64PostfixUnaryOperation, 'wtype'),
  pair(BigUIntPostfixUnaryOperation, 'wtype'),
  pair(BytesUnaryOperation, 'wtype'),
  pair(UInt64BinaryOperation, 'wtype'),
  pair(BigUIntBinaryOperation, 'wtype'),
  pair(BooleanBinaryOperation, 'wtype'),
  pair(Not, 'wtype'),
  pair(Emit, 'wtype'),
  pair(Range, 'wtype'),
  pair(Enumeration, 'wtype'),
  pair(Reversed, 'wtype'),
  pair(StateGet, 'wtype'),
  pair(StateGetEx, 'wtype'),
  pair(StateExists, 'wtype'),
  pair(ARC4Router, 'wtype'),

  pair(wtypes.BytesWType, 'name', 'immutable'),
  pair(wtypes.WEnumeration, 'name'),
  pair(wtypes.ReferenceArray, 'name', 'immutable'),
  pair(wtypes.WTuple, 'immutable'),
  pair(wtypes.ARC4UIntN, 'immutable', 'name'),
  pair(wtypes.ARC4UFixedNxM, 'immutable', 'name'),
  pair(wtypes.ARC4Tuple, 'immutable', 'name', 'arc4Alias'),
  pair(wtypes.ARC4DynamicArray, 'name'),
  pair(wtypes.ARC4StaticArray, 'name'),
  pair(wtypes.ARC4Struct, 'arc4Alias', 'immutable'),
])

/**
 * Helper function which provides type safety when specifying properties to be ignored from a given type
 * @param ctor The constructor of the target type
 * @param excludedKeys A list of keys from that type
 */
function pair<T>(ctor: new (props: DeliberateAny) => T, ...excludedKeys: Array<keyof T & string>): [Function, string[]] {
  return [ctor, excludedKeys]
}

/**
 * Generates an object with all excluded properties for the given type, set to the value undefined.
 * @param nodeOrWType The constructor for the target type
 */
export function generateExcludedPropsObj(nodeOrWType: Function): object {
  const excludedProps = doNotSerialize.get(nodeOrWType)
  if (!excludedProps?.length) return {}
  return Object.fromEntries(excludedProps.map((p) => [p, undefined]))
}
