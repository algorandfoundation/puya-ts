[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [op](../README.md) / base64Decode

# Function: base64Decode()

> **base64Decode**(`e`, `a`): [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/op.ts:547](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L547)

decode A which was base64-encoded using _encoding_ E. Fail if A is not base64 encoded with encoding E
*Warning*: Usage should be restricted to very rare use cases. In almost all cases, smart contracts should directly handle non-encoded byte-strings.	This opcode should only be used in cases where base64 is the only available option, e.g. interoperability with a third-party that only signs base64 strings.
 Decodes A using the base64 encoding E. Specify the encoding with an immediate arg either as URL and Filename Safe (`URLEncoding`) or Standard (`StdEncoding`). See [RFC 4648 sections 4 and 5](https://rfc-editor.org/rfc/rfc4648.html#section-4). It is assumed that the encoding ends with the exact number of `=` padding characters as required by the RFC. When padding occurs, any unused pad bits in the encoding must be set to zero or the decoding will fail. The special cases of `\n` and `\r` are allowed but completely ignored. An error will result when attempting to decode a string with a character that is not in the encoding alphabet or not one of `=`, `\r`, or `\n`.

## Parameters

### e

[`Base64`](../enumerations/Base64.md)

### a

[`bytes`](../../../type-aliases/bytes.md)

## Returns

[`bytes`](../../../type-aliases/bytes.md)

## See

Native TEAL opcode: [`base64_decode`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#base64_decode)
Min AVM version: 7
