import type { bytes } from '@algorandfoundation/algorand-typescript'
import { Bytes } from '@algorandfoundation/algorand-typescript'
import { Uint, Uint128, Uint16, Uint256, Uint32, Uint64, Uint8 } from '@algorandfoundation/algorand-typescript/arc4'
import { bzero } from '@algorandfoundation/algorand-typescript/op'

function testDynamicBytes(b: bytes) {
  // @expect-error Constructing Uint<8> from dynamic length bytes is currently not supported
  const u8 = new Uint8(b)
  // @expect-error Constructing Uint<16> from dynamic length bytes is currently not supported
  const u16 = new Uint16(b)
  // @expect-error Constructing Uint<32> from dynamic length bytes is currently not supported
  const u32 = new Uint32(b)
  // @expect-error Constructing Uint<64> from dynamic length bytes is currently not supported
  const u64 = new Uint64(b)
  // @expect-error Constructing Uint<128> from dynamic length bytes is currently not supported
  const u128 = new Uint128(b)
  // @expect-error Constructing Uint<256> from dynamic length bytes is currently not supported
  const u256 = new Uint256(b)
  // @expect-error Constructing Uint<512> from dynamic length bytes is currently not supported
  const u512 = new Uint<512>(b)
}

function testIncompatibleConstantBytesLength() {
  // @expect-error 0,17 cannot be converted to Uint<8>
  const u8 = new Uint8(Bytes.fromHex('0011'))
  // @expect-error 0,0,0,17 cannot be converted to Uint<16>
  const u16 = new Uint16(Bytes.fromHex('00000011'))
  // @expect-error 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,17 cannot be converted to Uint<64>
  const u64 = new Uint64(Bytes.fromHex('00000000000000000000000000000011'))
}

function testIncompatibleFixedBytesLength() {
  // @expect-error bytes<2> cannot be converted to Uint<8>
  const u8 = new Uint8(bzero(2))
  // @expect-error bytes<4> cannot be converted to Uint<16>
  const u16 = new Uint16(bzero(4))
  // @expect-error bytes<16> cannot be converted to Uint<64>
  const u64 = new Uint64(bzero(16))
}
