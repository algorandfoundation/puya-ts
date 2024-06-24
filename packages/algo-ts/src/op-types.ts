import { bytes, BytesCompat, uint64, Uint64Compat, biguint } from './primitives'
import { Account, Application, Asset } from './reference'

export enum Base64 {
  URLEncoding = 'URLEncoding',
  StdEncoding = 'StdEncoding',
}
export enum Ec {
  BN254g1 = 'BN254g1',
  BN254g2 = 'BN254g2',
  BLS12_381g1 = 'BLS12_381g1',
  BLS12_381g2 = 'BLS12_381g2',
}
export enum Ecdsa {
  Secp256k1 = 'Secp256k1',
  Secp256r1 = 'Secp256r1',
}
export enum JsonRef {
  JSONString = 'JSONString',
  JSONUint64 = 'JSONUint64',
  JSONObject = 'JSONObject',
}
export enum VrfVerify {
  VrfAlgorand = 'VrfAlgorand',
} /**
 *
 */
export type AcctParamsType = {
  /**
   * Account balance in microalgos
   */
  acctBalance(a: Account | uint64): readonly [uint64, boolean]
  /**
   * Minimum required balance for account, in microalgos
   */
  acctMinBalance(a: Account | uint64): readonly [uint64, boolean]
  /**
   * Address the account is rekeyed to.
   */
  acctAuthAddr(a: Account | uint64): readonly [Account, boolean]
  /**
   * The total number of uint64 values allocated by this account in Global and Local States.
   */
  acctTotalNumUint(a: Account | uint64): readonly [uint64, boolean]
  /**
   * The total number of byte array values allocated by this account in Global and Local States.
   */
  acctTotalNumByteSlice(a: Account | uint64): readonly [uint64, boolean]
  /**
   * The number of extra app code pages used by this account.
   */
  acctTotalExtraAppPages(a: Account | uint64): readonly [uint64, boolean]
  /**
   * The number of existing apps created by this account.
   */
  acctTotalAppsCreated(a: Account | uint64): readonly [uint64, boolean]
  /**
   * The number of apps this account is opted into.
   */
  acctTotalAppsOptedIn(a: Account | uint64): readonly [uint64, boolean]
  /**
   * The number of existing ASAs created by this account.
   */
  acctTotalAssetsCreated(a: Account | uint64): readonly [uint64, boolean]
  /**
   * The numbers of ASAs held by this account (including ASAs this account created).
   */
  acctTotalAssets(a: Account | uint64): readonly [uint64, boolean]
  /**
   * The number of existing boxes created by this account's app.
   */
  acctTotalBoxes(a: Account | uint64): readonly [uint64, boolean]
  /**
   * The total number of bytes used by this account's app's box keys and values.
   */
  acctTotalBoxBytes(a: Account | uint64): readonly [uint64, boolean]
}
/**
 * A plus B as a 128-bit result. X is the carry-bit, Y is the low-order 64 bits.
 * @see Native TEAL opcode: [`addw`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#addw)
 */
export type AddwType = (a: uint64, b: uint64) => readonly [uint64, uint64]
/**
 * Get or modify Global app state
 */
export type AppGlobalType = {
  /**
   * delete key A from the global state of the current application
   * @param state key.
   * Deleting a key which is already absent has no effect on the application global state. (In particular, it does _not_ cause the program to fail.)
   * @see Native TEAL opcode: [`app_global_del`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#app_global_del)
   */
  delete(a: bytes): void
  /**
   * global state of the key A in the current application
   * @param state key.
   *  * @return value. The value is zero (of type uint64) if the key does not exist.
   * @see Native TEAL opcode: [`app_global_get`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#app_global_get)
   */
  getBytes(a: bytes): bytes
  /**
   * global state of the key A in the current application
   * @param state key.
   *  * @return value. The value is zero (of type uint64) if the key does not exist.
   * @see Native TEAL opcode: [`app_global_get`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#app_global_get)
   */
  getUint64(a: bytes): uint64
  /**
   * X is the global state of application A, key B. Y is 1 if key existed, else 0
   * @param Txn.ForeignApps offset (or, since v4, an _available_ application id), state key.
   *  * @return did_exist flag (top of the stack, 1 if the application and key existed and 0 otherwise), value. The value is zero (of type uint64) if the key does not exist.
   * @see Native TEAL opcode: [`app_global_get_ex`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#app_global_get_ex)
   */
  getExBytes(a: Application, b: bytes): readonly [bytes, boolean]
  /**
   * X is the global state of application A, key B. Y is 1 if key existed, else 0
   * @param Txn.ForeignApps offset (or, since v4, an _available_ application id), state key.
   *  * @return did_exist flag (top of the stack, 1 if the application and key existed and 0 otherwise), value. The value is zero (of type uint64) if the key does not exist.
   * @see Native TEAL opcode: [`app_global_get_ex`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#app_global_get_ex)
   */
  getExUint64(a: Application, b: bytes): readonly [uint64, boolean]
  /**
   * write B to key A in the global state of the current application
   * @see Native TEAL opcode: [`app_global_put`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#app_global_put)
   */
  put(a: bytes, b: uint64 | bytes): void
}
/**
 * Get or modify Local app state
 */
export type AppLocalType = {
  /**
   * delete key B from account A's local state of the current application
   * @param Txn.Accounts offset (or, since v4, an _available_ account address), state key.
   * Deleting a key which is already absent has no effect on the application local state. (In particular, it does _not_ cause the program to fail.)
   * @see Native TEAL opcode: [`app_local_del`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#app_local_del)
   */
  delete(a: Account | uint64, b: bytes): void
  /**
   * local state of the key B in the current application in account A
   * @param Txn.Accounts offset (or, since v4, an _available_ account address), state key.
   *  * @return value. The value is zero (of type uint64) if the key does not exist.
   * @see Native TEAL opcode: [`app_local_get`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#app_local_get)
   */
  getBytes(a: Account | uint64, b: bytes): bytes
  /**
   * local state of the key B in the current application in account A
   * @param Txn.Accounts offset (or, since v4, an _available_ account address), state key.
   *  * @return value. The value is zero (of type uint64) if the key does not exist.
   * @see Native TEAL opcode: [`app_local_get`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#app_local_get)
   */
  getUint64(a: Account | uint64, b: bytes): uint64
  /**
   * X is the local state of application B, key C in account A. Y is 1 if key existed, else 0
   * @param Txn.Accounts offset (or, since v4, an _available_ account address), _available_ application id (or, since v4, a Txn.ForeignApps offset), state key.
   *  * @return did_exist flag (top of the stack, 1 if the application and key existed and 0 otherwise), value. The value is zero (of type uint64) if the key does not exist.
   * @see Native TEAL opcode: [`app_local_get_ex`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#app_local_get_ex)
   */
  getExBytes(a: Account | uint64, b: Application, c: bytes): readonly [bytes, boolean]
  /**
   * X is the local state of application B, key C in account A. Y is 1 if key existed, else 0
   * @param Txn.Accounts offset (or, since v4, an _available_ account address), _available_ application id (or, since v4, a Txn.ForeignApps offset), state key.
   *  * @return did_exist flag (top of the stack, 1 if the application and key existed and 0 otherwise), value. The value is zero (of type uint64) if the key does not exist.
   * @see Native TEAL opcode: [`app_local_get_ex`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#app_local_get_ex)
   */
  getExUint64(a: Account | uint64, b: Application, c: bytes): readonly [uint64, boolean]
  /**
   * write C to key B in account A's local state of the current application
   * @param Txn.Accounts offset (or, since v4, an _available_ account address), state key, value.
   * @see Native TEAL opcode: [`app_local_put`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#app_local_put)
   */
  put(a: Account | uint64, b: bytes, c: uint64 | bytes): void
}
/**
 * 1 if account A is opted in to application B, else 0
 * @param Txn.Accounts offset (or, since v4, an _available_ account address), _available_ application id (or, since v4, a Txn.ForeignApps offset).
 *  * @return 1 if opted in and 0 otherwise.
 * @see Native TEAL opcode: [`app_opted_in`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#app_opted_in)
 */
export type AppOptedInType = (a: Account | uint64, b: Application) => boolean
/**
 *
 */
export type AppParamsType = {
  /**
   * Bytecode of Approval Program
   */
  appApprovalProgram(a: Application): readonly [bytes, boolean]
  /**
   * Bytecode of Clear State Program
   */
  appClearStateProgram(a: Application): readonly [bytes, boolean]
  /**
   * Number of uint64 values allowed in Global State
   */
  appGlobalNumUint(a: Application): readonly [uint64, boolean]
  /**
   * Number of byte array values allowed in Global State
   */
  appGlobalNumByteSlice(a: Application): readonly [uint64, boolean]
  /**
   * Number of uint64 values allowed in Local State
   */
  appLocalNumUint(a: Application): readonly [uint64, boolean]
  /**
   * Number of byte array values allowed in Local State
   */
  appLocalNumByteSlice(a: Application): readonly [uint64, boolean]
  /**
   * Number of Extra Program Pages of code space
   */
  appExtraProgramPages(a: Application): readonly [uint64, boolean]
  /**
   * Creator address
   */
  appCreator(a: Application): readonly [Account, boolean]
  /**
   * Address for which this application has authority
   */
  appAddress(a: Application): readonly [Account, boolean]
}
/**
 * Ath LogicSig argument
 * @see Native TEAL opcode: [`args`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#args)
 */
export type ArgType = (a: uint64) => bytes
/**
 *
 */
export type AssetHoldingType = {
  /**
   * Amount of the asset unit held by this account
   */
  assetBalance(a: Account | uint64, b: Asset): readonly [uint64, boolean]
  /**
   * Is the asset frozen or not
   */
  assetFrozen(a: Account | uint64, b: Asset): readonly [boolean, boolean]
}
/**
 *
 */
export type AssetParamsType = {
  /**
   * Total number of units of this asset
   */
  assetTotal(a: Asset): readonly [uint64, boolean]
  /**
   * See AssetParams.Decimals
   */
  assetDecimals(a: Asset): readonly [uint64, boolean]
  /**
   * Frozen by default or not
   */
  assetDefaultFrozen(a: Asset): readonly [boolean, boolean]
  /**
   * Asset unit name
   */
  assetUnitName(a: Asset): readonly [bytes, boolean]
  /**
   * Asset name
   */
  assetName(a: Asset): readonly [bytes, boolean]
  /**
   * URL with additional info about the asset
   */
  assetUrl(a: Asset): readonly [bytes, boolean]
  /**
   * Arbitrary commitment
   */
  assetMetadataHash(a: Asset): readonly [bytes, boolean]
  /**
   * Manager address
   */
  assetManager(a: Asset): readonly [Account, boolean]
  /**
   * Reserve address
   */
  assetReserve(a: Asset): readonly [Account, boolean]
  /**
   * Freeze address
   */
  assetFreeze(a: Asset): readonly [Account, boolean]
  /**
   * Clawback address
   */
  assetClawback(a: Asset): readonly [Account, boolean]
  /**
   * Creator address
   */
  assetCreator(a: Asset): readonly [Account, boolean]
}
/**
 * balance for account A, in microalgos. The balance is observed after the effects of previous transactions in the group, and after the fee for the current transaction is deducted. Changes caused by inner transactions are observable immediately following `itxn_submit`
 * @param Txn.Accounts offset (or, since v4, an _available_ account address), _available_ application id (or, since v4, a Txn.ForeignApps offset).
 *  * @return value.
 * @see Native TEAL opcode: [`balance`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#balance)
 */
export type BalanceType = (a: Account | uint64) => uint64
/**
 * decode A which was base64-encoded using _encoding_ E. Fail if A is not base64 encoded with encoding E
 * *Warning*: Usage should be restricted to very rare use cases. In almost all cases, smart contracts should directly handle non-encoded byte-strings.	This opcode should only be used in cases where base64 is the only available option, e.g. interoperability with a third-party that only signs base64 strings.
 *  Decodes A using the base64 encoding E. Specify the encoding with an immediate arg either as URL and Filename Safe (`URLEncoding`) or Standard (`StdEncoding`). See [RFC 4648 sections 4 and 5](https://rfc-editor.org/rfc/rfc4648.html#section-4). It is assumed that the encoding ends with the exact number of `=` padding characters as required by the RFC. When padding occurs, any unused pad bits in the encoding must be set to zero or the decoding will fail. The special cases of `\n` and `\r` are allowed but completely ignored. An error will result when attempting to decode a string with a character that is not in the encoding alphabet or not one of `=`, `\r`, or `\n`.
 * @see Native TEAL opcode: [`base64_decode`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#base64_decode)
 */
export type Base64DecodeType = (e: Base64, a: bytes) => bytes
/**
 * The highest set bit in A. If A is a byte-array, it is interpreted as a big-endian unsigned integer. bitlen of 0 is 0, bitlen of 8 is 4
 * bitlen interprets arrays as big-endian integers, unlike setbit/getbit
 * @see Native TEAL opcode: [`bitlen`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#bitlen)
 */
export type BitLengthType = (a: uint64 | bytes) => uint64
/**
 *
 */
export type BlockType = {
  /**
   *
   */
  blkSeed(a: uint64): bytes
  /**
   *
   */
  blkTimestamp(a: uint64): uint64
}
/**
 * Get or modify box state
 */
export type BoxType = {
  /**
   * create a box named A, of length B. Fail if the name A is empty or B exceeds 32,768. Returns 0 if A already existed, else 1
   * Newly created boxes are filled with 0 bytes. `box_create` will fail if the referenced box already exists with a different size. Otherwise, existing boxes are unchanged by `box_create`.
   * @see Native TEAL opcode: [`box_create`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#box_create)
   */
  create(a: bytes, b: uint64): boolean
  /**
   * delete box named A if it exists. Return 1 if A existed, 0 otherwise
   * @see Native TEAL opcode: [`box_del`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#box_del)
   */
  delete(a: bytes): boolean
  /**
   * read C bytes from box A, starting at offset B. Fail if A does not exist, or the byte range is outside A's size.
   * @see Native TEAL opcode: [`box_extract`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#box_extract)
   */
  extract(a: bytes, b: uint64, c: uint64): bytes
  /**
   * X is the contents of box A if A exists, else ''. Y is 1 if A exists, else 0.
   * For boxes that exceed 4,096 bytes, consider `box_create`, `box_extract`, and `box_replace`
   * @see Native TEAL opcode: [`box_get`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#box_get)
   */
  get(a: bytes): readonly [bytes, boolean]
  /**
   * X is the length of box A if A exists, else 0. Y is 1 if A exists, else 0.
   * @see Native TEAL opcode: [`box_len`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#box_len)
   */
  length(a: bytes): readonly [uint64, boolean]
  /**
   * replaces the contents of box A with byte-array B. Fails if A exists and len(B) != len(box A). Creates A if it does not exist
   * For boxes that exceed 4,096 bytes, consider `box_create`, `box_extract`, and `box_replace`
   * @see Native TEAL opcode: [`box_put`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#box_put)
   */
  put(a: bytes, b: bytes): void
  /**
   * write byte-array C into box A, starting at offset B. Fail if A does not exist, or the byte range is outside A's size.
   * @see Native TEAL opcode: [`box_replace`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#box_replace)
   */
  replace(a: bytes, b: uint64, c: bytes): void
  /**
   * change the size of box named A to be of length B, adding zero bytes to end or removing bytes from the end, as needed. Fail if the name A is empty, A is not an existing box, or B exceeds 32,768.
   * @see Native TEAL opcode: [`box_resize`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#box_resize)
   */
  resize(a: bytes, b: uint64): void
  /**
   * set box A to contain its previous bytes up to index B, followed by D, followed by the original bytes of A that began at index B+C.
   * Boxes are of constant length. If C < len(D), then len(D)-C bytes will be removed from the end. If C > len(D), zero bytes will be appended to the end to reach the box length.
   * @see Native TEAL opcode: [`box_splice`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#box_splice)
   */
  splice(a: bytes, b: uint64, c: uint64, d: bytes): void
}
/**
 * The largest integer I such that I^2 <= A. A and I are interpreted as big-endian unsigned integers
 * @see Native TEAL opcode: [`bsqrt`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#bsqrt)
 */
export type BsqrtType = (a: biguint) => biguint
/**
 * converts big-endian byte array A to uint64. Fails if len(A) > 8. Padded by leading 0s if len(A) < 8.
 * `btoi` fails if the input is longer than 8 bytes.
 * @see Native TEAL opcode: [`btoi`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#btoi)
 */
export type BtoiType = (a: bytes) => uint64
/**
 * zero filled byte-array of length A
 * @see Native TEAL opcode: [`bzero`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#bzero)
 */
export type BzeroType = (a: uint64) => bytes
/**
 * join A and B
 * `concat` fails if the result would be greater than 4096 bytes.
 * @see Native TEAL opcode: [`concat`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#concat)
 */
export type ConcatType = (a: bytes, b: bytes) => bytes
/**
 * W,X = (A,B / C,D); Y,Z = (A,B modulo C,D)
 * The notation J,K indicates that two uint64 values J and K are interpreted as a uint128 value, with J as the high uint64 and K the low.
 * @see Native TEAL opcode: [`divmodw`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#divmodw)
 */
export type DivmodwType = (a: uint64, b: uint64, c: uint64, d: uint64) => readonly [uint64, uint64, uint64, uint64]
/**
 * A,B / C. Fail if C == 0 or if result overflows.
 * The notation A,B indicates that A and B are interpreted as a uint128 value, with A as the high uint64 and B the low.
 * @see Native TEAL opcode: [`divw`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#divw)
 */
export type DivwType = (a: uint64, b: uint64, c: uint64) => uint64
/**
 * Elliptic Curve functions
 */
export type EllipticCurveType = {
  /**
   * for curve points A and B, return the curve point A + B
   * A and B are curve points in affine representation: field element X concatenated with field element Y. Field element `Z` is encoded as follows.
   * For the base field elements (Fp), `Z` is encoded as a big-endian number and must be lower than the field modulus.
   * For the quadratic field extension (Fp2), `Z` is encoded as the concatenation of the individual encoding of the coefficients. For an Fp2 element of the form `Z = Z0 + Z1 i`, where `i` is a formal quadratic non-residue, the encoding of Z is the concatenation of the encoding of `Z0` and `Z1` in this order. (`Z0` and `Z1` must be less than the field modulus).
   * The point at infinity is encoded as `(X,Y) = (0,0)`.
   * Groups G1 and G2 are denoted additively.
   * Fails if A or B is not in G.
   * A and/or B are allowed to be the point at infinity.
   * Does _not_ check if A and B are in the main prime-order subgroup.
   * @see Native TEAL opcode: [`ec_add`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#ec_add)
   */
  add(g: Ec, a: bytes, b: bytes): bytes
  /**
   * maps field element A to group G
   * BN254 points are mapped by the SVDW map. BLS12-381 points are mapped by the SSWU map.
   * G1 element inputs are base field elements and G2 element inputs are quadratic field elements, with nearly the same encoding rules (for field elements) as defined in `ec_add`. There is one difference of encoding rule: G1 element inputs do not need to be 0-padded if they fit in less than 32 bytes for BN254 and less than 48 bytes for BLS12-381. (As usual, the empty byte array represents 0.) G2 elements inputs need to be always have the required size.
   * @see Native TEAL opcode: [`ec_map_to`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#ec_map_to)
   */
  mapTo(g: Ec, a: bytes): bytes
  /**
   * for curve points A and scalars B, return curve point B0A0 + B1A1 + B2A2 + ... + BnAn
   * A is a list of concatenated points, encoded and checked as described in `ec_add`. B is a list of concatenated scalars which, unlike ec_scalar_mul, must all be exactly 32 bytes long.
   * The name `ec_multi_scalar_mul` was chosen to reflect common usage, but a more consistent name would be `ec_multi_scalar_mul`. AVM values are limited to 4096 bytes, so `ec_multi_scalar_mul` is limited by the size of the points in the group being operated upon.
   * @see Native TEAL opcode: [`ec_multi_scalar_mul`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#ec_multi_scalar_mul)
   */
  scalarMulMulti(g: Ec, a: bytes, b: bytes): bytes
  /**
   * 1 if the product of the pairing of each point in A with its respective point in B is equal to the identity element of the target group Gt, else 0
   * A and B are concatenated points, encoded and checked as described in `ec_add`. A contains points of the group G, B contains points of the associated group (G2 if G is G1, and vice versa). Fails if A and B have a different number of points, or if any point is not in its described group or outside the main prime-order subgroup - a stronger condition than other opcodes. AVM values are limited to 4096 bytes, so `ec_pairing_check` is limited by the size of the points in the groups being operated upon.
   * @see Native TEAL opcode: [`ec_pairing_check`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#ec_pairing_check)
   */
  pairingCheck(g: Ec, a: bytes, b: bytes): boolean
  /**
   * for curve point A and scalar B, return the curve point BA, the point A multiplied by the scalar B.
   * A is a curve point encoded and checked as described in `ec_add`. Scalar B is interpreted as a big-endian unsigned integer. Fails if B exceeds 32 bytes.
   * @see Native TEAL opcode: [`ec_scalar_mul`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#ec_scalar_mul)
   */
  scalarMul(g: Ec, a: bytes, b: bytes): bytes
  /**
   * 1 if A is in the main prime-order subgroup of G (including the point at infinity) else 0. Program fails if A is not in G at all.
   * @see Native TEAL opcode: [`ec_subgroup_check`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#ec_subgroup_check)
   */
  subgroupCheck(g: Ec, a: bytes): boolean
}
/**
 * decompress pubkey A into components X, Y
 * The 33 byte public key in a compressed form to be decompressed into X and Y (top) components. All values are big-endian encoded.
 * @see Native TEAL opcode: [`ecdsa_pk_decompress`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#ecdsa_pk_decompress)
 */
export type EcdsaPkDecompressType = (v: Ecdsa, a: bytes) => readonly [bytes, bytes]
/**
 * for (data A, recovery id B, signature C, D) recover a public key
 * S (top) and R elements of a signature, recovery id and data (bottom) are expected on the stack and used to deriver a public key. All values are big-endian encoded. The signed data must be 32 bytes long.
 * @see Native TEAL opcode: [`ecdsa_pk_recover`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#ecdsa_pk_recover)
 */
export type EcdsaPkRecoverType = (v: Ecdsa, a: bytes, b: uint64, c: bytes, d: bytes) => readonly [bytes, bytes]
/**
 * for (data A, signature B, C and pubkey D, E) verify the signature of the data against the pubkey => {0 or 1}
 * The 32 byte Y-component of a public key is the last element on the stack, preceded by X-component of a pubkey, preceded by S and R components of a signature, preceded by the data that is fifth element on the stack. All values are big-endian encoded. The signed data must be 32 bytes long, and signatures in lower-S form are only accepted.
 * @see Native TEAL opcode: [`ecdsa_verify`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#ecdsa_verify)
 */
export type EcdsaVerifyType = (v: Ecdsa, a: bytes, b: bytes, c: bytes, d: bytes, e: bytes) => boolean
/**
 * for (data A, signature B, pubkey C) verify the signature of ("ProgData" || program_hash || data) against the pubkey => {0 or 1}
 * The 32 byte public key is the last element on the stack, preceded by the 64 byte signature at the second-to-last element on the stack, preceded by the data which was signed at the third-to-last element on the stack.
 * @see Native TEAL opcode: [`ed25519verify`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#ed25519verify)
 */
export type Ed25519verifyType = (a: bytes, b: bytes, c: bytes) => boolean
/**
 * for (data A, signature B, pubkey C) verify the signature of the data against the pubkey => {0 or 1}
 * @see Native TEAL opcode: [`ed25519verify_bare`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#ed25519verify_bare)
 */
export type Ed25519verifyBareType = (a: bytes, b: bytes, c: bytes) => boolean
/**
 * A raised to the Bth power. Fail if A == B == 0 and on overflow
 * @see Native TEAL opcode: [`exp`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#exp)
 */
export type ExpType = (a: uint64, b: uint64) => uint64
/**
 * A raised to the Bth power as a 128-bit result in two uint64s. X is the high 64 bits, Y is the low. Fail if A == B == 0 or if the results exceeds 2^128-1
 * @see Native TEAL opcode: [`expw`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#expw)
 */
export type ExpwType = (a: uint64, b: uint64) => readonly [uint64, uint64]
/**
 * A range of bytes from A starting at B up to but not including B+C. If B+C is larger than the array length, the program fails
 * `extract3` can be called using `extract` with no immediates.
 * @see Native TEAL opcode: [`extract3`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#extract3)
 */
export type ExtractType = (a: bytes, b: uint64, c: uint64) => bytes
/**
 * A uint16 formed from a range of big-endian bytes from A starting at B up to but not including B+2. If B+2 is larger than the array length, the program fails
 * @see Native TEAL opcode: [`extract_uint16`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#extract_uint16)
 */
export type ExtractUint16Type = (a: bytes, b: uint64) => uint64
/**
 * A uint32 formed from a range of big-endian bytes from A starting at B up to but not including B+4. If B+4 is larger than the array length, the program fails
 * @see Native TEAL opcode: [`extract_uint32`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#extract_uint32)
 */
export type ExtractUint32Type = (a: bytes, b: uint64) => uint64
/**
 * A uint64 formed from a range of big-endian bytes from A starting at B up to but not including B+8. If B+8 is larger than the array length, the program fails
 * @see Native TEAL opcode: [`extract_uint64`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#extract_uint64)
 */
export type ExtractUint64Type = (a: bytes, b: uint64) => uint64
/**
 * ID of the asset or application created in the Ath transaction of the current group
 * `gaids` fails unless the requested transaction created an asset or application and A < GroupIndex.
 * @see Native TEAL opcode: [`gaids`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#gaids)
 */
export type GaidType = (a: uint64) => Application
/**
 * Bth bit of (byte-array or integer) A. If B is greater than or equal to the bit length of the value (8*byte length), the program fails
 * see explanation of bit ordering in setbit
 * @see Native TEAL opcode: [`getbit`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#getbit)
 */
export type GetBitType = (a: uint64 | bytes, b: uint64) => uint64
/**
 * Bth byte of A, as an integer. If B is greater than or equal to the array length, the program fails
 * @see Native TEAL opcode: [`getbyte`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#getbyte)
 */
export type GetBytesType = (a: bytes, b: uint64) => uint64
/**
 * Get values for inner transaction in the last group submitted
 */
export type GITxnType = {
  /**
   * 32 byte address
   */
  sender(t: uint64): Account
  /**
   * microalgos
   */
  fee(t: uint64): uint64
  /**
   * round number
   */
  firstValid(t: uint64): uint64
  /**
   * UNIX timestamp of block before txn.FirstValid. Fails if negative
   */
  firstValidTime(t: uint64): uint64
  /**
   * round number
   */
  lastValid(t: uint64): uint64
  /**
   * Any data up to 1024 bytes
   */
  note(t: uint64): bytes
  /**
   * 32 byte lease value
   */
  lease(t: uint64): bytes
  /**
   * 32 byte address
   */
  receiver(t: uint64): Account
  /**
   * microalgos
   */
  amount(t: uint64): uint64
  /**
   * 32 byte address
   */
  closeRemainderTo(t: uint64): Account
  /**
   * 32 byte address
   */
  votePk(t: uint64): bytes
  /**
   * 32 byte address
   */
  selectionPk(t: uint64): bytes
  /**
   * The first round that the participation key is valid.
   */
  voteFirst(t: uint64): uint64
  /**
   * The last round that the participation key is valid.
   */
  voteLast(t: uint64): uint64
  /**
   * Dilution for the 2-level participation key
   */
  voteKeyDilution(t: uint64): uint64
  /**
   * Transaction type as bytes
   */
  type(t: uint64): bytes
  /**
   * Transaction type as integer
   */
  typeEnum(t: uint64): uint64
  /**
   * Asset ID
   */
  xferAsset(t: uint64): Asset
  /**
   * value in Asset's units
   */
  assetAmount(t: uint64): uint64
  /**
   * 32 byte address. Source of assets if Sender is the Asset's Clawback address.
   */
  assetSender(t: uint64): Account
  /**
   * 32 byte address
   */
  assetReceiver(t: uint64): Account
  /**
   * 32 byte address
   */
  assetCloseTo(t: uint64): Account
  /**
   * Position of this transaction within an atomic transaction group. A stand-alone transaction is implicitly element 0 in a group of 1
   */
  groupIndex(t: uint64): uint64
  /**
   * The computed ID for this transaction. 32 bytes.
   */
  txId(t: uint64): bytes
  /**
   * ApplicationID from ApplicationCall transaction
   */
  applicationId(t: uint64): Application
  /**
   * ApplicationCall transaction on completion action
   */
  onCompletion(t: uint64): uint64
  /**
   * Arguments passed to the application in the ApplicationCall transaction
   */
  applicationArgs(t: uint64, a: uint64): bytes
  /**
   * Number of ApplicationArgs
   */
  numAppArgs(t: uint64): uint64
  /**
   * Accounts listed in the ApplicationCall transaction
   */
  accounts(t: uint64, a: uint64): Account
  /**
   * Number of Accounts
   */
  numAccounts(t: uint64): uint64
  /**
   * Approval program
   */
  approvalProgram(t: uint64): bytes
  /**
   * Clear state program
   */
  clearStateProgram(t: uint64): bytes
  /**
   * 32 byte Sender's new AuthAddr
   */
  rekeyTo(t: uint64): Account
  /**
   * Asset ID in asset config transaction
   */
  configAsset(t: uint64): Asset
  /**
   * Total number of units of this asset created
   */
  configAssetTotal(t: uint64): uint64
  /**
   * Number of digits to display after the decimal place when displaying the asset
   */
  configAssetDecimals(t: uint64): uint64
  /**
   * Whether the asset's slots are frozen by default or not, 0 or 1
   */
  configAssetDefaultFrozen(t: uint64): boolean
  /**
   * Unit name of the asset
   */
  configAssetUnitName(t: uint64): bytes
  /**
   * The asset name
   */
  configAssetName(t: uint64): bytes
  /**
   * URL
   */
  configAssetUrl(t: uint64): bytes
  /**
   * 32 byte commitment to unspecified asset metadata
   */
  configAssetMetadataHash(t: uint64): bytes
  /**
   * 32 byte address
   */
  configAssetManager(t: uint64): Account
  /**
   * 32 byte address
   */
  configAssetReserve(t: uint64): Account
  /**
   * 32 byte address
   */
  configAssetFreeze(t: uint64): Account
  /**
   * 32 byte address
   */
  configAssetClawback(t: uint64): Account
  /**
   * Asset ID being frozen or un-frozen
   */
  freezeAsset(t: uint64): Asset
  /**
   * 32 byte address of the account whose asset slot is being frozen or un-frozen
   */
  freezeAssetAccount(t: uint64): Account
  /**
   * The new frozen value, 0 or 1
   */
  freezeAssetFrozen(t: uint64): boolean
  /**
   * Foreign Assets listed in the ApplicationCall transaction
   */
  assets(t: uint64, a: uint64): Asset
  /**
   * Number of Assets
   */
  numAssets(t: uint64): uint64
  /**
   * Foreign Apps listed in the ApplicationCall transaction
   */
  applications(t: uint64, a: uint64): Application
  /**
   * Number of Applications
   */
  numApplications(t: uint64): uint64
  /**
   * Number of global state integers in ApplicationCall
   */
  globalNumUint(t: uint64): uint64
  /**
   * Number of global state byteslices in ApplicationCall
   */
  globalNumByteSlice(t: uint64): uint64
  /**
   * Number of local state integers in ApplicationCall
   */
  localNumUint(t: uint64): uint64
  /**
   * Number of local state byteslices in ApplicationCall
   */
  localNumByteSlice(t: uint64): uint64
  /**
   * Number of additional pages for each of the application's approval and clear state programs. An ExtraProgramPages of 1 means 2048 more total bytes, or 1024 for each program.
   */
  extraProgramPages(t: uint64): uint64
  /**
   * Marks an account nonparticipating for rewards
   */
  nonparticipation(t: uint64): boolean
  /**
   * Log messages emitted by an application call (only with `itxn` in v5). Application mode only
   */
  logs(t: uint64, a: uint64): bytes
  /**
   * Number of Logs (only with `itxn` in v5). Application mode only
   */
  numLogs(t: uint64): uint64
  /**
   * Asset ID allocated by the creation of an ASA (only with `itxn` in v5). Application mode only
   */
  createdAssetId(t: uint64): Asset
  /**
   * ApplicationID allocated by the creation of an application (only with `itxn` in v5). Application mode only
   */
  createdApplicationId(t: uint64): Application
  /**
   * The last message emitted. Empty bytes if none were emitted. Application mode only
   */
  lastLog(t: uint64): bytes
  /**
   * 64 byte state proof public key
   */
  stateProofPk(t: uint64): bytes
  /**
   * Approval Program as an array of pages
   */
  approvalProgramPages(t: uint64, a: uint64): bytes
  /**
   * Number of Approval Program pages
   */
  numApprovalProgramPages(t: uint64): uint64
  /**
   * ClearState Program as an array of pages
   */
  clearStateProgramPages(t: uint64, a: uint64): bytes
  /**
   * Number of ClearState Program pages
   */
  numClearStateProgramPages(t: uint64): uint64
}
/**
 * Bth scratch space value of the Ath transaction in the current group
 * @see Native TEAL opcode: [`gloadss`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#gloadss)
 */
export type GloadBytesType = (a: uint64, b: uint64) => bytes
/**
 * Bth scratch space value of the Ath transaction in the current group
 * @see Native TEAL opcode: [`gloadss`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#gloadss)
 */
export type GloadUint64Type = (a: uint64, b: uint64) => uint64
/**
 *
 */
export type GlobalType = {
  /**
   * microalgos
   */
  get minTxnFee(): uint64
  /**
   * microalgos
   */
  get minBalance(): uint64
  /**
   * rounds
   */
  get maxTxnLife(): uint64
  /**
   * 32 byte address of all zero bytes
   */
  get zeroAddress(): Account
  /**
   * Number of transactions in this atomic transaction group. At least 1
   */
  get groupSize(): uint64
  /**
   * Maximum supported version
   */
  get logicSigVersion(): uint64
  /**
   * Current round number. Application mode only.
   */
  get round(): uint64
  /**
   * Last confirmed block UNIX timestamp. Fails if negative. Application mode only.
   */
  get latestTimestamp(): uint64
  /**
   * ID of current application executing. Application mode only.
   */
  get currentApplicationId(): Application
  /**
   * Address of the creator of the current application. Application mode only.
   */
  get creatorAddress(): Account
  /**
   * Address that the current application controls. Application mode only.
   */
  get currentApplicationAddress(): Account
  /**
   * ID of the transaction group. 32 zero bytes if the transaction is not part of a group.
   */
  get groupId(): bytes
  /**
   * The remaining cost that can be spent by opcodes in this program.
   */
  get opcodeBudget(): uint64
  /**
   * The application ID of the application that called this application. 0 if this application is at the top-level. Application mode only.
   */
  get callerApplicationId(): uint64
  /**
   * The application address of the application that called this application. ZeroAddress if this application is at the top-level. Application mode only.
   */
  get callerApplicationAddress(): Account
  /**
   * The additional minimum balance required to create (and opt-in to) an asset.
   */
  get assetCreateMinBalance(): uint64
  /**
   * The additional minimum balance required to opt-in to an asset.
   */
  get assetOptInMinBalance(): uint64
  /**
   * The Genesis Hash for the network.
   */
  get genesisHash(): bytes
}
/**
 * Get values for transactions in the current group
 */
export type GTxnType = {
  /**
   * 32 byte address
   */
  sender(t: uint64): Account
  /**
   * microalgos
   */
  fee(t: uint64): uint64
  /**
   * round number
   */
  firstValid(t: uint64): uint64
  /**
   * UNIX timestamp of block before txn.FirstValid. Fails if negative
   */
  firstValidTime(t: uint64): uint64
  /**
   * round number
   */
  lastValid(t: uint64): uint64
  /**
   * Any data up to 1024 bytes
   */
  note(t: uint64): bytes
  /**
   * 32 byte lease value
   */
  lease(t: uint64): bytes
  /**
   * 32 byte address
   */
  receiver(t: uint64): Account
  /**
   * microalgos
   */
  amount(t: uint64): uint64
  /**
   * 32 byte address
   */
  closeRemainderTo(t: uint64): Account
  /**
   * 32 byte address
   */
  votePk(t: uint64): bytes
  /**
   * 32 byte address
   */
  selectionPk(t: uint64): bytes
  /**
   * The first round that the participation key is valid.
   */
  voteFirst(t: uint64): uint64
  /**
   * The last round that the participation key is valid.
   */
  voteLast(t: uint64): uint64
  /**
   * Dilution for the 2-level participation key
   */
  voteKeyDilution(t: uint64): uint64
  /**
   * Transaction type as bytes
   */
  type(t: uint64): bytes
  /**
   * Transaction type as integer
   */
  typeEnum(t: uint64): uint64
  /**
   * Asset ID
   */
  xferAsset(t: uint64): Asset
  /**
   * value in Asset's units
   */
  assetAmount(t: uint64): uint64
  /**
   * 32 byte address. Source of assets if Sender is the Asset's Clawback address.
   */
  assetSender(t: uint64): Account
  /**
   * 32 byte address
   */
  assetReceiver(t: uint64): Account
  /**
   * 32 byte address
   */
  assetCloseTo(t: uint64): Account
  /**
   * Position of this transaction within an atomic transaction group. A stand-alone transaction is implicitly element 0 in a group of 1
   */
  groupIndex(t: uint64): uint64
  /**
   * The computed ID for this transaction. 32 bytes.
   */
  txId(t: uint64): bytes
  /**
   * ApplicationID from ApplicationCall transaction
   */
  applicationId(t: uint64): Application
  /**
   * ApplicationCall transaction on completion action
   */
  onCompletion(t: uint64): uint64
  /**
   * Arguments passed to the application in the ApplicationCall transaction
   */
  applicationArgs(a: uint64, b: uint64): bytes
  /**
   * Number of ApplicationArgs
   */
  numAppArgs(t: uint64): uint64
  /**
   * Accounts listed in the ApplicationCall transaction
   */
  accounts(a: uint64, b: uint64): Account
  /**
   * Number of Accounts
   */
  numAccounts(t: uint64): uint64
  /**
   * Approval program
   */
  approvalProgram(t: uint64): bytes
  /**
   * Clear state program
   */
  clearStateProgram(t: uint64): bytes
  /**
   * 32 byte Sender's new AuthAddr
   */
  rekeyTo(t: uint64): Account
  /**
   * Asset ID in asset config transaction
   */
  configAsset(t: uint64): Asset
  /**
   * Total number of units of this asset created
   */
  configAssetTotal(t: uint64): uint64
  /**
   * Number of digits to display after the decimal place when displaying the asset
   */
  configAssetDecimals(t: uint64): uint64
  /**
   * Whether the asset's slots are frozen by default or not, 0 or 1
   */
  configAssetDefaultFrozen(t: uint64): boolean
  /**
   * Unit name of the asset
   */
  configAssetUnitName(t: uint64): bytes
  /**
   * The asset name
   */
  configAssetName(t: uint64): bytes
  /**
   * URL
   */
  configAssetUrl(t: uint64): bytes
  /**
   * 32 byte commitment to unspecified asset metadata
   */
  configAssetMetadataHash(t: uint64): bytes
  /**
   * 32 byte address
   */
  configAssetManager(t: uint64): Account
  /**
   * 32 byte address
   */
  configAssetReserve(t: uint64): Account
  /**
   * 32 byte address
   */
  configAssetFreeze(t: uint64): Account
  /**
   * 32 byte address
   */
  configAssetClawback(t: uint64): Account
  /**
   * Asset ID being frozen or un-frozen
   */
  freezeAsset(t: uint64): Asset
  /**
   * 32 byte address of the account whose asset slot is being frozen or un-frozen
   */
  freezeAssetAccount(t: uint64): Account
  /**
   * The new frozen value, 0 or 1
   */
  freezeAssetFrozen(t: uint64): boolean
  /**
   * Foreign Assets listed in the ApplicationCall transaction
   */
  assets(a: uint64, b: uint64): Asset
  /**
   * Number of Assets
   */
  numAssets(t: uint64): uint64
  /**
   * Foreign Apps listed in the ApplicationCall transaction
   */
  applications(a: uint64, b: uint64): Application
  /**
   * Number of Applications
   */
  numApplications(t: uint64): uint64
  /**
   * Number of global state integers in ApplicationCall
   */
  globalNumUint(t: uint64): uint64
  /**
   * Number of global state byteslices in ApplicationCall
   */
  globalNumByteSlice(t: uint64): uint64
  /**
   * Number of local state integers in ApplicationCall
   */
  localNumUint(t: uint64): uint64
  /**
   * Number of local state byteslices in ApplicationCall
   */
  localNumByteSlice(t: uint64): uint64
  /**
   * Number of additional pages for each of the application's approval and clear state programs. An ExtraProgramPages of 1 means 2048 more total bytes, or 1024 for each program.
   */
  extraProgramPages(t: uint64): uint64
  /**
   * Marks an account nonparticipating for rewards
   */
  nonparticipation(t: uint64): boolean
  /**
   * Log messages emitted by an application call (only with `itxn` in v5). Application mode only
   */
  logs(a: uint64, b: uint64): bytes
  /**
   * Number of Logs (only with `itxn` in v5). Application mode only
   */
  numLogs(t: uint64): uint64
  /**
   * Asset ID allocated by the creation of an ASA (only with `itxn` in v5). Application mode only
   */
  createdAssetId(t: uint64): Asset
  /**
   * ApplicationID allocated by the creation of an application (only with `itxn` in v5). Application mode only
   */
  createdApplicationId(t: uint64): Application
  /**
   * The last message emitted. Empty bytes if none were emitted. Application mode only
   */
  lastLog(t: uint64): bytes
  /**
   * 64 byte state proof public key
   */
  stateProofPk(t: uint64): bytes
  /**
   * Approval Program as an array of pages
   */
  approvalProgramPages(a: uint64, b: uint64): bytes
  /**
   * Number of Approval Program pages
   */
  numApprovalProgramPages(t: uint64): uint64
  /**
   * ClearState Program as an array of pages
   */
  clearStateProgramPages(a: uint64, b: uint64): bytes
  /**
   * Number of ClearState Program pages
   */
  numClearStateProgramPages(t: uint64): uint64
}
/**
 * converts uint64 A to big-endian byte array, always of length 8
 * @see Native TEAL opcode: [`itob`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#itob)
 */
export type ItobType = (a: uint64) => bytes
/**
 * Get values for the last inner transaction
 */
export type ITxnType = {
  /**
   * 32 byte address
   */
  get sender(): Account
  /**
   * microalgos
   */
  get fee(): uint64
  /**
   * round number
   */
  get firstValid(): uint64
  /**
   * UNIX timestamp of block before txn.FirstValid. Fails if negative
   */
  get firstValidTime(): uint64
  /**
   * round number
   */
  get lastValid(): uint64
  /**
   * Any data up to 1024 bytes
   */
  get note(): bytes
  /**
   * 32 byte lease value
   */
  get lease(): bytes
  /**
   * 32 byte address
   */
  get receiver(): Account
  /**
   * microalgos
   */
  get amount(): uint64
  /**
   * 32 byte address
   */
  get closeRemainderTo(): Account
  /**
   * 32 byte address
   */
  get votePk(): bytes
  /**
   * 32 byte address
   */
  get selectionPk(): bytes
  /**
   * The first round that the participation key is valid.
   */
  get voteFirst(): uint64
  /**
   * The last round that the participation key is valid.
   */
  get voteLast(): uint64
  /**
   * Dilution for the 2-level participation key
   */
  get voteKeyDilution(): uint64
  /**
   * Transaction type as bytes
   */
  get type(): bytes
  /**
   * Transaction type as integer
   */
  get typeEnum(): uint64
  /**
   * Asset ID
   */
  get xferAsset(): Asset
  /**
   * value in Asset's units
   */
  get assetAmount(): uint64
  /**
   * 32 byte address. Source of assets if Sender is the Asset's Clawback address.
   */
  get assetSender(): Account
  /**
   * 32 byte address
   */
  get assetReceiver(): Account
  /**
   * 32 byte address
   */
  get assetCloseTo(): Account
  /**
   * Position of this transaction within an atomic transaction group. A stand-alone transaction is implicitly element 0 in a group of 1
   */
  get groupIndex(): uint64
  /**
   * The computed ID for this transaction. 32 bytes.
   */
  get txId(): bytes
  /**
   * ApplicationID from ApplicationCall transaction
   */
  get applicationId(): Application
  /**
   * ApplicationCall transaction on completion action
   */
  get onCompletion(): uint64
  /**
   * Arguments passed to the application in the ApplicationCall transaction
   */
  applicationArgs(a: uint64): bytes
  /**
   * Number of ApplicationArgs
   */
  get numAppArgs(): uint64
  /**
   * Accounts listed in the ApplicationCall transaction
   */
  accounts(a: uint64): Account
  /**
   * Number of Accounts
   */
  get numAccounts(): uint64
  /**
   * Approval program
   */
  get approvalProgram(): bytes
  /**
   * Clear state program
   */
  get clearStateProgram(): bytes
  /**
   * 32 byte Sender's new AuthAddr
   */
  get rekeyTo(): Account
  /**
   * Asset ID in asset config transaction
   */
  get configAsset(): Asset
  /**
   * Total number of units of this asset created
   */
  get configAssetTotal(): uint64
  /**
   * Number of digits to display after the decimal place when displaying the asset
   */
  get configAssetDecimals(): uint64
  /**
   * Whether the asset's slots are frozen by default or not, 0 or 1
   */
  get configAssetDefaultFrozen(): boolean
  /**
   * Unit name of the asset
   */
  get configAssetUnitName(): bytes
  /**
   * The asset name
   */
  get configAssetName(): bytes
  /**
   * URL
   */
  get configAssetUrl(): bytes
  /**
   * 32 byte commitment to unspecified asset metadata
   */
  get configAssetMetadataHash(): bytes
  /**
   * 32 byte address
   */
  get configAssetManager(): Account
  /**
   * 32 byte address
   */
  get configAssetReserve(): Account
  /**
   * 32 byte address
   */
  get configAssetFreeze(): Account
  /**
   * 32 byte address
   */
  get configAssetClawback(): Account
  /**
   * Asset ID being frozen or un-frozen
   */
  get freezeAsset(): Asset
  /**
   * 32 byte address of the account whose asset slot is being frozen or un-frozen
   */
  get freezeAssetAccount(): Account
  /**
   * The new frozen value, 0 or 1
   */
  get freezeAssetFrozen(): boolean
  /**
   * Foreign Assets listed in the ApplicationCall transaction
   */
  assets(a: uint64): Asset
  /**
   * Number of Assets
   */
  get numAssets(): uint64
  /**
   * Foreign Apps listed in the ApplicationCall transaction
   */
  applications(a: uint64): Application
  /**
   * Number of Applications
   */
  get numApplications(): uint64
  /**
   * Number of global state integers in ApplicationCall
   */
  get globalNumUint(): uint64
  /**
   * Number of global state byteslices in ApplicationCall
   */
  get globalNumByteSlice(): uint64
  /**
   * Number of local state integers in ApplicationCall
   */
  get localNumUint(): uint64
  /**
   * Number of local state byteslices in ApplicationCall
   */
  get localNumByteSlice(): uint64
  /**
   * Number of additional pages for each of the application's approval and clear state programs. An ExtraProgramPages of 1 means 2048 more total bytes, or 1024 for each program.
   */
  get extraProgramPages(): uint64
  /**
   * Marks an account nonparticipating for rewards
   */
  get nonparticipation(): boolean
  /**
   * Log messages emitted by an application call (only with `itxn` in v5). Application mode only
   */
  logs(a: uint64): bytes
  /**
   * Number of Logs (only with `itxn` in v5). Application mode only
   */
  get numLogs(): uint64
  /**
   * Asset ID allocated by the creation of an ASA (only with `itxn` in v5). Application mode only
   */
  get createdAssetId(): Asset
  /**
   * ApplicationID allocated by the creation of an application (only with `itxn` in v5). Application mode only
   */
  get createdApplicationId(): Application
  /**
   * The last message emitted. Empty bytes if none were emitted. Application mode only
   */
  get lastLog(): bytes
  /**
   * 64 byte state proof public key
   */
  get stateProofPk(): bytes
  /**
   * Approval Program as an array of pages
   */
  approvalProgramPages(a: uint64): bytes
  /**
   * Number of Approval Program pages
   */
  get numApprovalProgramPages(): uint64
  /**
   * ClearState Program as an array of pages
   */
  clearStateProgramPages(a: uint64): bytes
  /**
   * Number of ClearState Program pages
   */
  get numClearStateProgramPages(): uint64
}
/**
 * Create inner transactions
 */
export type ITxnCreateType = {
  /**
   * begin preparation of a new inner transaction in a new transaction group
   * `itxn_begin` initializes Sender to the application address; Fee to the minimum allowable, taking into account MinTxnFee and credit from overpaying in earlier transactions; FirstValid/LastValid to the values in the invoking transaction, and all other fields to zero or empty values.
   * @see Native TEAL opcode: [`itxn_begin`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#itxn_begin)
   */
  begin(): void
  /**
   * 32 byte address
   */
  setSender(a: Account): void
  /**
   * microalgos
   */
  setFee(a: uint64): void
  /**
   * Any data up to 1024 bytes
   */
  setNote(a: bytes): void
  /**
   * 32 byte address
   */
  setReceiver(a: Account): void
  /**
   * microalgos
   */
  setAmount(a: uint64): void
  /**
   * 32 byte address
   */
  setCloseRemainderTo(a: Account): void
  /**
   * 32 byte address
   */
  setVotePk(a: bytes): void
  /**
   * 32 byte address
   */
  setSelectionPk(a: bytes): void
  /**
   * The first round that the participation key is valid.
   */
  setVoteFirst(a: uint64): void
  /**
   * The last round that the participation key is valid.
   */
  setVoteLast(a: uint64): void
  /**
   * Dilution for the 2-level participation key
   */
  setVoteKeyDilution(a: uint64): void
  /**
   * Transaction type as bytes
   */
  setType(a: bytes): void
  /**
   * Transaction type as integer
   */
  setTypeEnum(a: uint64): void
  /**
   * Asset ID
   */
  setXferAsset(a: Asset): void
  /**
   * value in Asset's units
   */
  setAssetAmount(a: uint64): void
  /**
   * 32 byte address. Source of assets if Sender is the Asset's Clawback address.
   */
  setAssetSender(a: Account): void
  /**
   * 32 byte address
   */
  setAssetReceiver(a: Account): void
  /**
   * 32 byte address
   */
  setAssetCloseTo(a: Account): void
  /**
   * ApplicationID from ApplicationCall transaction
   */
  setApplicationId(a: Application): void
  /**
   * ApplicationCall transaction on completion action
   */
  setOnCompletion(a: uint64): void
  /**
   * Arguments passed to the application in the ApplicationCall transaction
   */
  setApplicationArgs(a: bytes): void
  /**
   * Accounts listed in the ApplicationCall transaction
   */
  setAccounts(a: Account): void
  /**
   * Approval program
   */
  setApprovalProgram(a: bytes): void
  /**
   * Clear state program
   */
  setClearStateProgram(a: bytes): void
  /**
   * 32 byte Sender's new AuthAddr
   */
  setRekeyTo(a: Account): void
  /**
   * Asset ID in asset config transaction
   */
  setConfigAsset(a: Asset): void
  /**
   * Total number of units of this asset created
   */
  setConfigAssetTotal(a: uint64): void
  /**
   * Number of digits to display after the decimal place when displaying the asset
   */
  setConfigAssetDecimals(a: uint64): void
  /**
   * Whether the asset's slots are frozen by default or not, 0 or 1
   */
  setConfigAssetDefaultFrozen(a: boolean): void
  /**
   * Unit name of the asset
   */
  setConfigAssetUnitName(a: bytes): void
  /**
   * The asset name
   */
  setConfigAssetName(a: bytes): void
  /**
   * URL
   */
  setConfigAssetUrl(a: bytes): void
  /**
   * 32 byte commitment to unspecified asset metadata
   */
  setConfigAssetMetadataHash(a: bytes): void
  /**
   * 32 byte address
   */
  setConfigAssetManager(a: Account): void
  /**
   * 32 byte address
   */
  setConfigAssetReserve(a: Account): void
  /**
   * 32 byte address
   */
  setConfigAssetFreeze(a: Account): void
  /**
   * 32 byte address
   */
  setConfigAssetClawback(a: Account): void
  /**
   * Asset ID being frozen or un-frozen
   */
  setFreezeAsset(a: Asset): void
  /**
   * 32 byte address of the account whose asset slot is being frozen or un-frozen
   */
  setFreezeAssetAccount(a: Account): void
  /**
   * The new frozen value, 0 or 1
   */
  setFreezeAssetFrozen(a: boolean): void
  /**
   * Foreign Assets listed in the ApplicationCall transaction
   */
  setAssets(a: uint64): void
  /**
   * Foreign Apps listed in the ApplicationCall transaction
   */
  setApplications(a: uint64): void
  /**
   * Number of global state integers in ApplicationCall
   */
  setGlobalNumUint(a: uint64): void
  /**
   * Number of global state byteslices in ApplicationCall
   */
  setGlobalNumByteSlice(a: uint64): void
  /**
   * Number of local state integers in ApplicationCall
   */
  setLocalNumUint(a: uint64): void
  /**
   * Number of local state byteslices in ApplicationCall
   */
  setLocalNumByteSlice(a: uint64): void
  /**
   * Number of additional pages for each of the application's approval and clear state programs. An ExtraProgramPages of 1 means 2048 more total bytes, or 1024 for each program.
   */
  setExtraProgramPages(a: uint64): void
  /**
   * Marks an account nonparticipating for rewards
   */
  setNonparticipation(a: boolean): void
  /**
   * 64 byte state proof public key
   */
  setStateProofPk(a: bytes): void
  /**
   * Approval Program as an array of pages
   */
  setApprovalProgramPages(a: bytes): void
  /**
   * ClearState Program as an array of pages
   */
  setClearStateProgramPages(a: bytes): void
  /**
   * begin preparation of a new inner transaction in the same transaction group
   * `itxn_next` initializes the transaction exactly as `itxn_begin` does
   * @see Native TEAL opcode: [`itxn_next`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#itxn_next)
   */
  next(): void
  /**
   * execute the current inner transaction group. Fail if executing this group would exceed the inner transaction limit, or if any transaction in the group fails.
   * `itxn_submit` resets the current transaction so that it can not be resubmitted. A new `itxn_begin` is required to prepare another inner transaction.
   * @see Native TEAL opcode: [`itxn_submit`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#itxn_submit)
   */
  submit(): void
}
/**
 *
 */
export type JsonRefType = {
  /**
   *
   */
  jsonString(a: bytes, b: bytes): bytes
  /**
   *
   */
  jsonUint64(a: bytes, b: bytes): uint64
  /**
   *
   */
  jsonObject(a: bytes, b: bytes): bytes
}
/**
 * Keccak256 hash of value A, yields [32]byte
 * @see Native TEAL opcode: [`keccak256`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#keccak256)
 */
export type Keccak256Type = (a: bytes) => bytes
/**
 * yields length of byte value A
 * @see Native TEAL opcode: [`len`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#len)
 */
export type LenType = (a: bytes) => uint64
/**
 * minimum required balance for account A, in microalgos. Required balance is affected by ASA, App, and Box usage. When creating or opting into an app, the minimum balance grows before the app code runs, therefore the increase is visible there. When deleting or closing out, the minimum balance decreases after the app executes. Changes caused by inner transactions or box usage are observable immediately following the opcode effecting the change.
 * @param Txn.Accounts offset (or, since v4, an _available_ account address), _available_ application id (or, since v4, a Txn.ForeignApps offset).
 *  * @return value.
 * @see Native TEAL opcode: [`min_balance`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#min_balance)
 */
export type MinBalanceType = (a: Account | uint64) => uint64
/**
 * A times B as a 128-bit result in two uint64s. X is the high 64 bits, Y is the low
 * @see Native TEAL opcode: [`mulw`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#mulw)
 */
export type MulwType = (a: uint64, b: uint64) => readonly [uint64, uint64]
/**
 * Copy of A with the bytes starting at B replaced by the bytes of C. Fails if B+len(C) exceeds len(A)
 * `replace3` can be called using `replace` with no immediates.
 * @see Native TEAL opcode: [`replace3`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#replace3)
 */
export type ReplaceType = (a: bytes, b: uint64, c: bytes) => bytes
/**
 * selects one of two values based on top-of-stack: B if C != 0, else A
 * @see Native TEAL opcode: [`select`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#select)
 */
export type SelectBytesType = (a: uint64 | bytes, b: uint64 | bytes, c: boolean) => bytes
/**
 * selects one of two values based on top-of-stack: B if C != 0, else A
 * @see Native TEAL opcode: [`select`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#select)
 */
export type SelectUint64Type = (a: uint64 | bytes, b: uint64 | bytes, c: boolean) => uint64
/**
 * Copy of (byte-array or integer) A, with the Bth bit set to (0 or 1) C. If B is greater than or equal to the bit length of the value (8*byte length), the program fails
 * When A is a uint64, index 0 is the least significant bit. Setting bit 3 to 1 on the integer 0 yields 8, or 2^3. When A is a byte array, index 0 is the leftmost bit of the leftmost byte. Setting bits 0 through 11 to 1 in a 4-byte-array of 0s yields the byte array 0xfff00000. Setting bit 3 to 1 on the 1-byte-array 0x00 yields the byte array 0x10.
 * @see Native TEAL opcode: [`setbit`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#setbit)
 */
export type SetBitBytesType = (a: uint64 | bytes, b: uint64, c: uint64) => bytes
/**
 * Copy of (byte-array or integer) A, with the Bth bit set to (0 or 1) C. If B is greater than or equal to the bit length of the value (8*byte length), the program fails
 * When A is a uint64, index 0 is the least significant bit. Setting bit 3 to 1 on the integer 0 yields 8, or 2^3. When A is a byte array, index 0 is the leftmost bit of the leftmost byte. Setting bits 0 through 11 to 1 in a 4-byte-array of 0s yields the byte array 0xfff00000. Setting bit 3 to 1 on the 1-byte-array 0x00 yields the byte array 0x10.
 * @see Native TEAL opcode: [`setbit`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#setbit)
 */
export type SetBitUint64Type = (a: uint64 | bytes, b: uint64, c: uint64) => uint64
/**
 * Copy of A with the Bth byte set to small integer (between 0..255) C. If B is greater than or equal to the array length, the program fails
 * @see Native TEAL opcode: [`setbyte`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#setbyte)
 */
export type SetBytesType = (a: bytes, b: uint64, c: uint64) => bytes
/**
 * SHA256 hash of value A, yields [32]byte
 * @see Native TEAL opcode: [`sha256`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#sha256)
 */
export type Sha256Type = (a: bytes) => bytes
/**
 * SHA3_256 hash of value A, yields [32]byte
 * @see Native TEAL opcode: [`sha3_256`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#sha3_256)
 */
export type Sha3_256Type = (a: bytes) => bytes
/**
 * SHA512_256 hash of value A, yields [32]byte
 * @see Native TEAL opcode: [`sha512_256`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#sha512_256)
 */
export type Sha512_256Type = (a: bytes) => bytes
/**
 * A times 2^B, modulo 2^64
 * @see Native TEAL opcode: [`shl`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#shl)
 */
export type ShlType = (a: uint64, b: uint64) => uint64
/**
 * A divided by 2^B
 * @see Native TEAL opcode: [`shr`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#shr)
 */
export type ShrType = (a: uint64, b: uint64) => uint64
/**
 * The largest integer I such that I^2 <= A
 * @see Native TEAL opcode: [`sqrt`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#sqrt)
 */
export type SqrtType = (a: uint64) => uint64
/**
 * A range of bytes from A starting at B up to but not including C. If C < B, or either is larger than the array length, the program fails
 * @see Native TEAL opcode: [`substring3`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#substring3)
 */
export type SubstringType = (a: bytes, b: uint64, c: uint64) => bytes
/**
 * Get values for the current executing transaction
 */
export type TxnType = {
  /**
   * 32 byte address
   */
  get sender(): Account
  /**
   * microalgos
   */
  get fee(): uint64
  /**
   * round number
   */
  get firstValid(): uint64
  /**
   * UNIX timestamp of block before txn.FirstValid. Fails if negative
   */
  get firstValidTime(): uint64
  /**
   * round number
   */
  get lastValid(): uint64
  /**
   * Any data up to 1024 bytes
   */
  get note(): bytes
  /**
   * 32 byte lease value
   */
  get lease(): bytes
  /**
   * 32 byte address
   */
  get receiver(): Account
  /**
   * microalgos
   */
  get amount(): uint64
  /**
   * 32 byte address
   */
  get closeRemainderTo(): Account
  /**
   * 32 byte address
   */
  get votePk(): bytes
  /**
   * 32 byte address
   */
  get selectionPk(): bytes
  /**
   * The first round that the participation key is valid.
   */
  get voteFirst(): uint64
  /**
   * The last round that the participation key is valid.
   */
  get voteLast(): uint64
  /**
   * Dilution for the 2-level participation key
   */
  get voteKeyDilution(): uint64
  /**
   * Transaction type as bytes
   */
  get type(): bytes
  /**
   * Transaction type as integer
   */
  get typeEnum(): uint64
  /**
   * Asset ID
   */
  get xferAsset(): Asset
  /**
   * value in Asset's units
   */
  get assetAmount(): uint64
  /**
   * 32 byte address. Source of assets if Sender is the Asset's Clawback address.
   */
  get assetSender(): Account
  /**
   * 32 byte address
   */
  get assetReceiver(): Account
  /**
   * 32 byte address
   */
  get assetCloseTo(): Account
  /**
   * Position of this transaction within an atomic transaction group. A stand-alone transaction is implicitly element 0 in a group of 1
   */
  get groupIndex(): uint64
  /**
   * The computed ID for this transaction. 32 bytes.
   */
  get txId(): bytes
  /**
   * ApplicationID from ApplicationCall transaction
   */
  get applicationId(): Application
  /**
   * ApplicationCall transaction on completion action
   */
  get onCompletion(): uint64
  /**
   * Arguments passed to the application in the ApplicationCall transaction
   */
  applicationArgs(a: uint64): bytes
  /**
   * Number of ApplicationArgs
   */
  get numAppArgs(): uint64
  /**
   * Accounts listed in the ApplicationCall transaction
   */
  accounts(a: uint64): Account
  /**
   * Number of Accounts
   */
  get numAccounts(): uint64
  /**
   * Approval program
   */
  get approvalProgram(): bytes
  /**
   * Clear state program
   */
  get clearStateProgram(): bytes
  /**
   * 32 byte Sender's new AuthAddr
   */
  get rekeyTo(): Account
  /**
   * Asset ID in asset config transaction
   */
  get configAsset(): Asset
  /**
   * Total number of units of this asset created
   */
  get configAssetTotal(): uint64
  /**
   * Number of digits to display after the decimal place when displaying the asset
   */
  get configAssetDecimals(): uint64
  /**
   * Whether the asset's slots are frozen by default or not, 0 or 1
   */
  get configAssetDefaultFrozen(): boolean
  /**
   * Unit name of the asset
   */
  get configAssetUnitName(): bytes
  /**
   * The asset name
   */
  get configAssetName(): bytes
  /**
   * URL
   */
  get configAssetUrl(): bytes
  /**
   * 32 byte commitment to unspecified asset metadata
   */
  get configAssetMetadataHash(): bytes
  /**
   * 32 byte address
   */
  get configAssetManager(): Account
  /**
   * 32 byte address
   */
  get configAssetReserve(): Account
  /**
   * 32 byte address
   */
  get configAssetFreeze(): Account
  /**
   * 32 byte address
   */
  get configAssetClawback(): Account
  /**
   * Asset ID being frozen or un-frozen
   */
  get freezeAsset(): Asset
  /**
   * 32 byte address of the account whose asset slot is being frozen or un-frozen
   */
  get freezeAssetAccount(): Account
  /**
   * The new frozen value, 0 or 1
   */
  get freezeAssetFrozen(): boolean
  /**
   * Foreign Assets listed in the ApplicationCall transaction
   */
  assets(a: uint64): Asset
  /**
   * Number of Assets
   */
  get numAssets(): uint64
  /**
   * Foreign Apps listed in the ApplicationCall transaction
   */
  applications(a: uint64): Application
  /**
   * Number of Applications
   */
  get numApplications(): uint64
  /**
   * Number of global state integers in ApplicationCall
   */
  get globalNumUint(): uint64
  /**
   * Number of global state byteslices in ApplicationCall
   */
  get globalNumByteSlice(): uint64
  /**
   * Number of local state integers in ApplicationCall
   */
  get localNumUint(): uint64
  /**
   * Number of local state byteslices in ApplicationCall
   */
  get localNumByteSlice(): uint64
  /**
   * Number of additional pages for each of the application's approval and clear state programs. An ExtraProgramPages of 1 means 2048 more total bytes, or 1024 for each program.
   */
  get extraProgramPages(): uint64
  /**
   * Marks an account nonparticipating for rewards
   */
  get nonparticipation(): boolean
  /**
   * Log messages emitted by an application call (only with `itxn` in v5). Application mode only
   */
  logs(a: uint64): bytes
  /**
   * Number of Logs (only with `itxn` in v5). Application mode only
   */
  get numLogs(): uint64
  /**
   * Asset ID allocated by the creation of an ASA (only with `itxn` in v5). Application mode only
   */
  get createdAssetId(): Asset
  /**
   * ApplicationID allocated by the creation of an application (only with `itxn` in v5). Application mode only
   */
  get createdApplicationId(): Application
  /**
   * The last message emitted. Empty bytes if none were emitted. Application mode only
   */
  get lastLog(): bytes
  /**
   * 64 byte state proof public key
   */
  get stateProofPk(): bytes
  /**
   * Approval Program as an array of pages
   */
  approvalProgramPages(a: uint64): bytes
  /**
   * Number of Approval Program pages
   */
  get numApprovalProgramPages(): uint64
  /**
   * ClearState Program as an array of pages
   */
  clearStateProgramPages(a: uint64): bytes
  /**
   * Number of ClearState Program pages
   */
  get numClearStateProgramPages(): uint64
}
/**
 * Verify the proof B of message A against pubkey C. Returns vrf output and verification flag.
 * `VrfAlgorand` is the VRF used in Algorand. It is ECVRF-ED25519-SHA512-Elligator2, specified in the IETF internet draft [draft-irtf-cfrg-vrf-03](https://datatracker.ietf.org/doc/draft-irtf-cfrg-vrf/03/).
 * @see Native TEAL opcode: [`vrf_verify`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#vrf_verify)
 */
export type VrfVerifyType = (s: VrfVerify, a: bytes, b: bytes, c: bytes) => readonly [bytes, boolean]
export type OpsNamespace = {
  AcctParams: AcctParamsType
  addw: AddwType
  AppGlobal: AppGlobalType
  AppLocal: AppLocalType
  appOptedIn: AppOptedInType
  AppParams: AppParamsType
  arg: ArgType
  AssetHolding: AssetHoldingType
  AssetParams: AssetParamsType
  balance: BalanceType
  base64Decode: Base64DecodeType
  bitLength: BitLengthType
  Block: BlockType
  Box: BoxType
  bsqrt: BsqrtType
  btoi: BtoiType
  bzero: BzeroType
  concat: ConcatType
  divmodw: DivmodwType
  divw: DivwType
  EllipticCurve: EllipticCurveType
  ecdsaPkDecompress: EcdsaPkDecompressType
  ecdsaPkRecover: EcdsaPkRecoverType
  ecdsaVerify: EcdsaVerifyType
  ed25519verify: Ed25519verifyType
  ed25519verifyBare: Ed25519verifyBareType
  exp: ExpType
  expw: ExpwType
  extract: ExtractType
  extractUint16: ExtractUint16Type
  extractUint32: ExtractUint32Type
  extractUint64: ExtractUint64Type
  gaid: GaidType
  getBit: GetBitType
  getBytes: GetBytesType
  GITxn: GITxnType
  gloadBytes: GloadBytesType
  gloadUint64: GloadUint64Type
  Global: GlobalType
  GTxn: GTxnType
  itob: ItobType
  ITxn: ITxnType
  ITxnCreate: ITxnCreateType
  JsonRef: JsonRefType
  keccak256: Keccak256Type
  len: LenType
  minBalance: MinBalanceType
  mulw: MulwType
  replace: ReplaceType
  selectBytes: SelectBytesType
  selectUint64: SelectUint64Type
  setBitBytes: SetBitBytesType
  setBitUint64: SetBitUint64Type
  setBytes: SetBytesType
  sha256: Sha256Type
  sha3_256: Sha3_256Type
  sha512_256: Sha512_256Type
  shl: ShlType
  shr: ShrType
  sqrt: SqrtType
  substring: SubstringType
  Txn: TxnType
  vrfVerify: VrfVerifyType
}
