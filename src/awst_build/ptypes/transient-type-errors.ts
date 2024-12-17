type TransientTypeError = {
  usedAsType: string
  usedInExpression: string
}

export const transientTypeErrors = {
  arrays: (typeName) => ({
    usedAsType: `\`${typeName}\` is not valid as a variable, parameter, return, or property type. Please define a static tuple type or use an \`as const\` expression`,
    usedInExpression: `Expression of type \`${typeName}\` cannot be used conditionally`,
  }),
  nativeNumeric: (typeName) => ({
    usedAsType: `\`${typeName}\` is not valid as a variable, parameter, return, or property type. Please use an algo-ts type such as \`biguint\` or \`uint64\``,
    usedInExpression: `Expression of type \`${typeName}\` must be explicitly converted to an algo-ts type, for example by wrapping the expression in \`Uint64(...)\` or \`BigUint(...)\``,
  }),
  unionTypes: (typeName) => ({
    usedAsType: `Union types are not valid as a variable, parameter, return, or property type. Expression type is ${typeName}`,
    usedInExpression: `Union types are only valid in boolean expressions. Expression type is ${typeName}`,
  }),
  intersectionTypes: (typeName) => ({
    usedAsType: `Intersection types are not valid as a variable, parameter, return, or property type. Expression type is ${typeName}`,
    usedInExpression: `Intersection types not valid here. Expression type is ${typeName}`,
  }),
} satisfies Record<string, (typeName: string) => TransientTypeError>
