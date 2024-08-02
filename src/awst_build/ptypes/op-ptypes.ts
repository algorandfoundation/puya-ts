/* THIS FILE IS GENERATED BY ~/scripts/generate-op-ptypes.ts - DO NOT MODIFY DIRECTLY */
import { IntrinsicEnumType } from './intrinsic-enum-type'

export const base64PType = new IntrinsicEnumType({
  name: 'base64',
  module: '@algorandfoundation/algo-ts/op-types.d.ts',
  members: [
    ['URLEncoding', 'URLEncoding'],
    ['StdEncoding', 'StdEncoding'],
  ],
})
export const ecPType = new IntrinsicEnumType({
  name: 'EC',
  module: '@algorandfoundation/algo-ts/op-types.d.ts',
  members: [
    ['BN254g1', 'BN254g1'],
    ['BN254g2', 'BN254g2'],
    ['BLS12_381g1', 'BLS12_381g1'],
    ['BLS12_381g2', 'BLS12_381g2'],
  ],
})
export const ecdsaPType = new IntrinsicEnumType({
  name: 'ECDSA',
  module: '@algorandfoundation/algo-ts/op-types.d.ts',
  members: [
    ['Secp256k1', 'Secp256k1'],
    ['Secp256r1', 'Secp256r1'],
  ],
})
export const vrfVerifyPType = new IntrinsicEnumType({
  name: 'vrf_verify',
  module: '@algorandfoundation/algo-ts/op-types.d.ts',
  members: [['VrfAlgorand', 'VrfAlgorand']],
})
export const ALL_OP_ENUMS = [base64PType, ecPType, ecdsaPType, vrfVerifyPType]
