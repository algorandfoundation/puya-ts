import { intrinsicFactory } from '../../../awst/intrinsic-factory'
import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import { BytesConstant, StringConstant } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { Constants } from '../../../constants'
import { wrapInCodeError } from '../../../errors'
import { logger } from '../../../logger'

import { base32ToUint8Array, bigIntToUint8Array, codeInvariant, invariant } from '../../../util'
import type { PType } from '../../ptypes'
import { accountPType, bytesPType, IterableIteratorGeneric, NumericLiteralPType, stringPType, TuplePType, uint64PType } from '../../ptypes'
import {
  AddressClass,
  arc4AddressAlias,
  ARC4EncodedType,
  DynamicArrayGeneric,
  DynamicArrayType,
  DynamicBytesConstructor,
  DynamicBytesType,
  StaticArrayGeneric,
  StaticArrayType,
  StaticBytesGeneric,
} from '../../ptypes/arc4-types'
import { instanceEb } from '../../type-registry'
import type { InstanceBuilder, NodeBuilder } from '../index'
import { ClassBuilder, FunctionBuilder } from '../index'
import { IterableIteratorExpressionBuilder } from '../iterable-iterator-expression-builder'
import { AtFunctionBuilder } from '../shared/at-function-builder'
import { ArrayPopFunctionBuilder } from '../shared/pop-function-builder'
import { ArrayPushFunctionBuilder } from '../shared/push-function-builder'
import { SliceFunctionBuilder } from '../shared/slice-function-builder'
import { UInt64ExpressionBuilder } from '../uint64-expression-builder'
import { requireExpressionOfType } from '../util'
import { parseFunctionArgs } from '../util/arg-parsing'
import { concatArrays } from '../util/array/concat'
import { indexAccess } from '../util/array/index-access'
import { arrayLength } from '../util/array/length'
import { resolveCompatExpression } from '../util/resolve-compat-builder'
import { Arc4EncodedBaseExpressionBuilder } from './base'

export class DynamicArrayClassBuilder extends ClassBuilder {
  readonly ptype = DynamicArrayGeneric

  newCall(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    const {
      args: [...initialItems],
      ptypes: [elementType],
    } = parseFunctionArgs({
      args,
      typeArgs,
      callLocation: sourceLocation,
      funcName: 'DynamicArray constructor',
      genericTypeArgs: 1,
      argSpec: (a) => args.map((_) => a.required()),
    })
    codeInvariant(elementType instanceof ARC4EncodedType, 'Element type must be an ARC4 encoded type', sourceLocation)
    const initialItemExprs = initialItems.map((i) => requireExpressionOfType(i, elementType))
    const ptype = this.ptype.parameterise([elementType])
    return new DynamicArrayExpressionBuilder(
      nodeFactory.newArray({
        values: initialItemExprs,
        wtype: ptype.wtype,
        sourceLocation,
      }),
      ptype,
    )
  }
}
export class StaticArrayClassBuilder extends ClassBuilder {
  readonly ptype = StaticArrayGeneric

  newCall(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    const {
      args: [...initialItems],
      ptypes: [elementType, arraySize],
    } = parseFunctionArgs({
      args,
      typeArgs,
      callLocation: sourceLocation,
      funcName: 'StaticArray constructor',
      genericTypeArgs: 2,
      argSpec: (a) => args.map((_) => a.required()),
    })
    codeInvariant(elementType instanceof ARC4EncodedType, 'Element type must be an ARC4 encoded type', sourceLocation)
    codeInvariant(
      arraySize instanceof NumericLiteralPType,
      `Array size type parameter of ${this.typeDescription} must be a literal number. Inferred type is ${arraySize.name}`,
      sourceLocation,
    )
    const ptype = this.ptype.parameterise([elementType, arraySize])
    if (initialItems.length === 0) {
      codeInvariant(ptype.fixedByteSize !== null, 'Zero arg constructor can only be used for static arrays with a fixed size encoding.')
      return new StaticArrayExpressionBuilder(
        intrinsicFactory.bzero({ size: ptype.fixedByteSize, wtype: ptype.wtype, sourceLocation }),
        ptype,
      )
    }

    codeInvariant(
      BigInt(initialItems.length) === arraySize.literalValue,
      `Static array of size ${arraySize.literalValue} must be initialized with ${arraySize.literalValue} values`,
      sourceLocation,
    )

    return new StaticArrayExpressionBuilder(
      nodeFactory.newArray({
        values: initialItems.map((i) => requireExpressionOfType(i, elementType)),
        wtype: ptype.wtype,
        sourceLocation,
      }),
      ptype,
    )
  }
}
export class AddressClassBuilder extends ClassBuilder {
  readonly ptype = AddressClass

  newCall(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    const {
      args: [accountOrAddressOrBytes],
    } = parseFunctionArgs({
      args,
      typeArgs,
      callLocation: sourceLocation,
      funcName: 'Address constructor',
      genericTypeArgs: 0,
      argSpec: (a) => [a.optional(accountPType, stringPType, bytesPType)],
    })
    if (!accountOrAddressOrBytes) {
      return new AddressExpressionBuilder(
        nodeFactory.addressConstant({
          value: Constants.algo.zeroAddressB32,
          sourceLocation,
          wtype: arc4AddressAlias.wtype,
        }),
        arc4AddressAlias,
      )
    }

    if (accountOrAddressOrBytes.ptype.equals(accountPType)) {
      return new AddressExpressionBuilder(
        nodeFactory.reinterpretCast({
          expr: accountOrAddressOrBytes.resolve(),
          sourceLocation,
          wtype: arc4AddressAlias.wtype,
        }),
        arc4AddressAlias,
      )
    } else if (accountOrAddressOrBytes.ptype.equals(stringPType)) {
      const value = accountOrAddressOrBytes.resolve()
      if (value instanceof StringConstant) {
        wrapInCodeError(() => base32ToUint8Array(value.value), value.sourceLocation)
        return new AddressExpressionBuilder(
          nodeFactory.addressConstant({
            value: value.value,
            sourceLocation,
            wtype: arc4AddressAlias.wtype,
          }),
          arc4AddressAlias,
        )
      }
      logger.error(
        value.sourceLocation,
        `Invalid address literal. Addresses should be ${Constants.algo.encodedAddressLength} characters and not include base32 padding`,
      )
    }
    return new AddressExpressionBuilder(
      nodeFactory.reinterpretCast({
        expr: accountOrAddressOrBytes.resolve(),
        sourceLocation,
        wtype: arc4AddressAlias.wtype,
      }),
      arc4AddressAlias,
    )
  }
}
export class StaticBytesClassBuilder extends ClassBuilder {
  readonly ptype = StaticBytesGeneric

  newCall(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    const {
      ptypes: [length],
      args: [initialValue],
    } = parseFunctionArgs({
      args,
      typeArgs,
      callLocation: sourceLocation,
      funcName: `${this.ptype.name} constructor`,
      genericTypeArgs: 1,
      argSpec: (a) => [a.optional(bytesPType, stringPType)],
    })
    const resultPType = this.ptype.parameterise([length])

    codeInvariant(length instanceof NumericLiteralPType, 'length must be numeric literal', sourceLocation)
    const byteLength = Number(length.literalValue)
    if (!initialValue) {
      return instanceEb(
        nodeFactory.bytesConstant({
          value: new Uint8Array(byteLength),
          sourceLocation,
          wtype: resultPType.wtype,
        }),
        resultPType,
      )
    }
    const value = resolveCompatExpression(initialValue, bytesPType)
    if (value instanceof BytesConstant) {
      codeInvariant(value.value.length === byteLength, `Value should have byte length of ${byteLength}`, sourceLocation)
      return instanceEb(
        nodeFactory.bytesConstant({
          value: value.value,
          wtype: resultPType.wtype,
          sourceLocation,
        }),
        resultPType,
      )
    } else {
      return instanceEb(
        nodeFactory.aRC4Encode({
          value: initialValue.resolve(),
          sourceLocation,
          wtype: resultPType.wtype,
        }),
        resultPType,
      )
    }
  }
}
export class DynamicBytesClassBuilder extends ClassBuilder {
  readonly ptype = DynamicBytesConstructor

  newCall(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    const {
      args: [initialValue],
    } = parseFunctionArgs({
      args,
      typeArgs,
      callLocation: sourceLocation,
      funcName: `${this.ptype.name} constructor`,
      genericTypeArgs: 0,
      argSpec: (a) => [a.optional(bytesPType, stringPType)],
    })
    const resultPType = DynamicBytesType

    if (!initialValue) {
      return instanceEb(
        nodeFactory.bytesConstant({
          value: new Uint8Array([0, 0]),
          sourceLocation,
          wtype: resultPType.wtype,
        }),
        resultPType,
      )
    }

    const value = resolveCompatExpression(initialValue, bytesPType)
    if (value instanceof BytesConstant) {
      return instanceEb(
        nodeFactory.bytesConstant({
          value: new Uint8Array([...bigIntToUint8Array(BigInt(value.value.length), 2), ...value.value]),
          sourceLocation,
          wtype: resultPType.wtype,
        }),
        resultPType,
      )
    } else {
      return instanceEb(
        nodeFactory.aRC4Encode({
          value,
          sourceLocation,
          wtype: resultPType.wtype,
        }),
        resultPType,
      )
    }
  }
}

export abstract class ArrayExpressionBuilder<
  TArrayType extends DynamicArrayType | StaticArrayType,
> extends Arc4EncodedBaseExpressionBuilder<TArrayType> {
  iterate(): Expression {
    return this.resolve()
  }

  indexAccess(index: InstanceBuilder, sourceLocation: SourceLocation): NodeBuilder {
    return indexAccess(this, index, sourceLocation)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'length':
        return arrayLength(this, sourceLocation)
      case 'at':
        return new AtFunctionBuilder(
          this.resolve(),
          this.ptype.elementType,
          this.ptype instanceof StaticArrayType
            ? this.ptype.arraySize
            : requireExpressionOfType(this.memberAccess('length', sourceLocation), uint64PType),
        )
      case 'entries':
        return new EntriesFunctionBuilder(this)
      case 'concat':
        return new ConcatFunctionBuilder(this)
      case 'slice': {
        const sliceResult =
          this.ptype instanceof StaticArrayType ? new DynamicArrayType({ elementType: this.ptype.elementType }) : this.ptype
        return new SliceFunctionBuilder(this.resolve(), sliceResult)
      }
      case 'native':
        return instanceEb(
          nodeFactory.aRC4Decode({
            value: this.resolve(),
            wtype: this.ptype.nativeType.wtypeOrThrow,
            sourceLocation,
          }),
          this.ptype.nativeType,
        )
    }
    return super.memberAccess(name, sourceLocation)
  }
}

class ConcatFunctionBuilder extends FunctionBuilder {
  constructor(private arrayBuilder: ArrayExpressionBuilder<DynamicArrayType | StaticArrayType>) {
    super(arrayBuilder.sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [other],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      argSpec: (a) => [a.required()],
      funcName: 'concat',
      callLocation: sourceLocation,
    })
    return concatArrays(this.arrayBuilder, other, sourceLocation)
  }
}
class EntriesFunctionBuilder extends FunctionBuilder {
  constructor(private arrayBuilder: ArrayExpressionBuilder<DynamicArrayType | StaticArrayType>) {
    super(arrayBuilder.sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    parseFunctionArgs({ args, typeArgs, callLocation: sourceLocation, argSpec: (_) => [], genericTypeArgs: 0, funcName: 'entries' })
    const iteratorType = IterableIteratorGeneric.parameterise([
      new TuplePType({ items: [uint64PType, this.arrayBuilder.ptype.elementType] }),
    ])
    return new IterableIteratorExpressionBuilder(
      nodeFactory.enumeration({
        expr: this.arrayBuilder.iterate(),
        sourceLocation,
        wtype: iteratorType.wtype,
      }),
      iteratorType,
    )
  }
}

export class DynamicArrayExpressionBuilder extends ArrayExpressionBuilder<DynamicArrayType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof DynamicArrayType, 'ptype must be instance of DynamicArrayType')
    super(expr, ptype)
  }
  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'push':
        return new ArrayPushFunctionBuilder(this)
      case 'pop':
        return new ArrayPopFunctionBuilder(this)
    }
    return super.memberAccess(name, sourceLocation)
  }
}

export class StaticArrayExpressionBuilder extends ArrayExpressionBuilder<StaticArrayType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof StaticArrayType, 'ptype must be instance of StaticArrayType')
    super(expr, ptype)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'native':
        return instanceEb(
          nodeFactory.aRC4Decode({
            value: this.resolve(),
            wtype: this.ptype.nativeType.wtypeOrThrow,
            sourceLocation,
          }),
          this.ptype.nativeType,
        )
    }
    return super.memberAccess(name, sourceLocation)
  }
}

export class DynamicBytesExpressionBuilder extends DynamicArrayExpressionBuilder {}
export class StaticBytesExpressionBuilder extends StaticArrayExpressionBuilder {}

export class AddressExpressionBuilder extends ArrayExpressionBuilder<StaticArrayType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof StaticArrayType, 'ptype must be instance of StaticArrayType')
    invariant(ptype.equals(arc4AddressAlias), 'ptype must be arc4AddressAlias')
    super(expr, ptype)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'length':
        return new UInt64ExpressionBuilder(nodeFactory.uInt64Constant({ value: this.ptype.arraySize, sourceLocation }))
    }
    return super.memberAccess(name, sourceLocation)
  }
}
