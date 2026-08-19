import type { uint64 } from '@algorandfoundation/algorand-typescript'
import {
  assert,
  Bytes,
  Contract,
  contract,
  Global,
  logicsig,
  LogicSig,
  op,
  Poseidon2Configurations,
} from '@algorandfoundation/algorand-typescript'

@logicsig({ name: 'AVM13SIG', avmVersion: 13 })
export class Avm13Sig extends LogicSig {
  program(): uint64 {
    assert(op.sha512(Bytes()) !== op.sha512(Bytes('a')))
    const scalar = op.bzero(32)
    const bn = op.poseidon2(Poseidon2Configurations.BN254t2, scalar)
    const bls = op.poseidon2(Poseidon2Configurations.BLS12_381t2, scalar)
    assert(bn !== bls)
    return bn.length
  }
}

@contract({ name: 'AVM13Contract', avmVersion: 13 })
export class Avm13Contract extends Contract {
  testNewOps() {
    assert(op.sha512(Bytes()) !== op.sha512(Bytes('a')))
  }

  testPoseidon2() {
    const scalar = op.bzero(32)
    const bn = op.poseidon2(Poseidon2Configurations.BN254t2, scalar)
    const bls = op.poseidon2(Poseidon2Configurations.BLS12_381t2, scalar)
    assert(bn.length === 32)
    assert(bls.length === 32)
    assert(bn !== bls)
  }

  testAppParams() {
    const app = Global.currentApplicationId

    const [sponsor, sponsorExists] = op.AppParams.appSizeSponsor(app)
    assert(sponsorExists)
    assert(sponsor === Global.zeroAddress)

    const [foreignBoxReads, foreignBoxReadsExists] = op.AppParams.appForeignBoxReads(app)
    assert(foreignBoxReadsExists)
    assert(!foreignBoxReads)

    const [familyBoxAccess, familyBoxAccessExists] = op.AppParams.appFamilyBoxAccess(app)
    assert(familyBoxAccessExists)
    assert(!familyBoxAccess)

    op.AppParamsSet.appForeignBoxReads(true)
    op.AppParamsSet.appFamilyBoxAccess(true)

    const [foreignBoxReadsAfter, foreignBoxReadsAfterExists] = op.AppParams.appForeignBoxReads(app)
    assert(foreignBoxReadsAfterExists)
    assert(foreignBoxReadsAfter)

    const [familyBoxAccessAfter, familyBoxAccessAfterExists] = op.AppParams.appFamilyBoxAccess(app)
    assert(familyBoxAccessAfterExists)
    assert(familyBoxAccessAfter)
  }

  testAppBoxOps() {
    const app = Global.currentApplicationId
    const name = Bytes('bx')

    assert(op.AppBox.create(app, name, 8))
    op.AppBox.put(app, name, op.bzero(8))

    const [value, exists] = op.AppBox.get(app, name)
    assert(exists)
    assert(value === op.bzero(8))

    op.AppBox.replace(app, name, 0, Bytes.fromHex('ff'))
    assert(op.AppBox.extract(app, name, 0, 1) === Bytes.fromHex('ff'))

    op.AppBox.splice(app, name, 1, 3, Bytes('abc'))
    op.AppBox.resize(app, name, 4)

    const [length, lengthExists] = op.AppBox.length(app, name)
    assert(lengthExists)
    assert(length === 4)

    assert(op.AppBox.delete(app, name))
  }

  testBlock() {
    const branch512 = op.Block.blkBranch512(0)
    const sha512_256Commitment = op.Block.blkSha512_256TxnCommitment(0)
    const sha256Commitment = op.Block.blkSha256TxnCommitment(0)
    const sha512Commitment = op.Block.blkSha512TxnCommitment(0)
    assert(branch512 !== sha512Commitment)
    assert(sha512_256Commitment !== sha256Commitment)
  }
}
