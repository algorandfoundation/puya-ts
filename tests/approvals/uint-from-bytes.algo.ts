import { assert, BaseContract, Bytes } from '@algorandfoundation/algorand-typescript'
import { Uint, Uint128, Uint16, Uint256, Uint32, Uint64, Uint8 } from '@algorandfoundation/algorand-typescript/arc4'
import { bzero } from '@algorandfoundation/algorand-typescript/op'

export class UintFromBytes extends BaseContract {
  approvalProgram(): boolean {
    // Uint8 (1 byte)
    const u8 = new Uint8(bzero(1))
    assert(u8.asUint64() === 0)
    const u8FromHex = new Uint8(Bytes.fromHex('11'))
    assert(u8FromHex.asUint64() === 17)

    // Uint16 (2 bytes)
    const u16 = new Uint16(bzero(2))
    assert(u16.asUint64() === 0)
    const u16FromHex = new Uint16(Bytes.fromHex('0011'))
    assert(u16FromHex.asUint64() === 17)

    // Uint32 (4 bytes)
    const u32 = new Uint32(bzero(4))
    assert(u32.asUint64() === 0)
    const u32FromHex = new Uint32(Bytes.fromHex('00000011'))
    assert(u32FromHex.asUint64() === 17)

    // Uint64 (8 bytes)
    const u64 = new Uint64(bzero(8))
    assert(u64.asUint64() === 0)
    const u64FromHex = new Uint64(Bytes.fromHex('0000000000000011'))
    assert(u64FromHex.asUint64() === 17)

    // Uint128 (16 bytes)
    const u128 = new Uint128(bzero(16))
    assert(u128.asBigUint() === 0n)
    const u128FromHex = new Uint128(Bytes.fromHex('00000000000000000000000000000011'))
    assert(u128FromHex.asBigUint() === 17n)

    // Uint256 (32 bytes)
    const u256 = new Uint256(bzero(32))
    assert(u256.asBigUint() === 0n)
    const u256FromHex = new Uint256(Bytes.fromHex('0000000000000000000000000000000000000000000000000000000000000011'))
    assert(u256FromHex.asBigUint() === 17n)

    // Uint<512> (64 bytes)
    const u512 = new Uint<512>(bzero(64))
    assert(u512.asBigUint() === 0n)
    const u512FromHex = new Uint<512>(
      Bytes.fromHex(
        '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011',
      ),
    )
    assert(u512FromHex.asBigUint() === 17n)

    return true
  }
}
