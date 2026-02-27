import type { bytes } from '@algorandfoundation/algorand-typescript'
import { Uint, Uint8, Uint16, Uint32, Uint64, Uint128, Uint256 } from '@algorandfoundation/algorand-typescript/arc4'

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
