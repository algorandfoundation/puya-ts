[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [op](../README.md) / EllipticCurve

# Variable: EllipticCurve

> `const` **EllipticCurve**: `object`

Defined in: [packages/algo-ts/src/op.ts:753](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L753)

Elliptic Curve functions

## Type declaration

### add()

for curve points A and B, return the curve point A + B
A and B are curve points in affine representation: field element X concatenated with field element Y. Field element `Z` is encoded as follows.
For the base field elements (Fp), `Z` is encoded as a big-endian number and must be lower than the field modulus.
For the quadratic field extension (Fp2), `Z` is encoded as the concatenation of the individual encoding of the coefficients. For an Fp2 element of the form `Z = Z0 + Z1 i`, where `i` is a formal quadratic non-residue, the encoding of Z is the concatenation of the encoding of `Z0` and `Z1` in this order. (`Z0` and `Z1` must be less than the field modulus).
The point at infinity is encoded as `(X,Y) = (0,0)`.
Groups G1 and G2 are denoted additively.
Fails if A or B is not in G.
A and/or B are allowed to be the point at infinity.
Does _not_ check if A and B are in the main prime-order subgroup.

#### Parameters

##### g

[`Ec`](../enumerations/Ec.md)

##### a

[`bytes`](../../../type-aliases/bytes.md)

##### b

[`bytes`](../../../type-aliases/bytes.md)

#### Returns

[`bytes`](../../../type-aliases/bytes.md)

#### See

Native TEAL opcode: [`ec_add`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#ec_add)
Min AVM version: 10

### mapTo()

maps field element A to group G
BN254 points are mapped by the SVDW map. BLS12-381 points are mapped by the SSWU map.
G1 element inputs are base field elements and G2 element inputs are quadratic field elements, with nearly the same encoding rules (for field elements) as defined in `ec_add`. There is one difference of encoding rule: G1 element inputs do not need to be 0-padded if they fit in less than 32 bytes for BN254 and less than 48 bytes for BLS12-381. (As usual, the empty byte array represents 0.) G2 elements inputs need to be always have the required size.

#### Parameters

##### g

[`Ec`](../enumerations/Ec.md)

##### a

[`bytes`](../../../type-aliases/bytes.md)

#### Returns

[`bytes`](../../../type-aliases/bytes.md)

#### See

Native TEAL opcode: [`ec_map_to`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#ec_map_to)
Min AVM version: 10

### pairingCheck()

1 if the product of the pairing of each point in A with its respective point in B is equal to the identity element of the target group Gt, else 0
A and B are concatenated points, encoded and checked as described in `ec_add`. A contains points of the group G, B contains points of the associated group (G2 if G is G1, and vice versa). Fails if A and B have a different number of points, or if any point is not in its described group or outside the main prime-order subgroup - a stronger condition than other opcodes. AVM values are limited to 4096 bytes, so `ec_pairing_check` is limited by the size of the points in the groups being operated upon.

#### Parameters

##### g

[`Ec`](../enumerations/Ec.md)

##### a

[`bytes`](../../../type-aliases/bytes.md)

##### b

[`bytes`](../../../type-aliases/bytes.md)

#### Returns

`boolean`

#### See

Native TEAL opcode: [`ec_pairing_check`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#ec_pairing_check)
Min AVM version: 10

### scalarMul()

for curve point A and scalar B, return the curve point BA, the point A multiplied by the scalar B.
A is a curve point encoded and checked as described in `ec_add`. Scalar B is interpreted as a big-endian unsigned integer. Fails if B exceeds 32 bytes.

#### Parameters

##### g

[`Ec`](../enumerations/Ec.md)

##### a

[`bytes`](../../../type-aliases/bytes.md)

##### b

[`bytes`](../../../type-aliases/bytes.md)

#### Returns

[`bytes`](../../../type-aliases/bytes.md)

#### See

Native TEAL opcode: [`ec_scalar_mul`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#ec_scalar_mul)
Min AVM version: 10

### scalarMulMulti()

for curve points A and scalars B, return curve point B0A0 + B1A1 + B2A2 + ... + BnAn
A is a list of concatenated points, encoded and checked as described in `ec_add`. B is a list of concatenated scalars which, unlike ec_scalar_mul, must all be exactly 32 bytes long.
The name `ec_multi_scalar_mul` was chosen to reflect common usage, but a more consistent name would be `ec_multi_scalar_mul`. AVM values are limited to 4096 bytes, so `ec_multi_scalar_mul` is limited by the size of the points in the group being operated upon.

#### Parameters

##### g

[`Ec`](../enumerations/Ec.md)

##### a

[`bytes`](../../../type-aliases/bytes.md)

##### b

[`bytes`](../../../type-aliases/bytes.md)

#### Returns

[`bytes`](../../../type-aliases/bytes.md)

#### See

Native TEAL opcode: [`ec_multi_scalar_mul`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#ec_multi_scalar_mul)
Min AVM version: 10

### subgroupCheck()

1 if A is in the main prime-order subgroup of G (including the point at infinity) else 0. Program fails if A is not in G at all.

#### Parameters

##### g

[`Ec`](../enumerations/Ec.md)

##### a

[`bytes`](../../../type-aliases/bytes.md)

#### Returns

`boolean`

#### See

Native TEAL opcode: [`ec_subgroup_check`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#ec_subgroup_check)
Min AVM version: 10
