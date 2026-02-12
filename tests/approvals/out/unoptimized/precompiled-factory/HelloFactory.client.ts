// This file is auto-generated, do not modify
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class HelloFactory extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test_compile_contract(): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test_compile_contract_with_template(): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test_compile_contract_with_template_and_custom_prefix(): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test_compile_contract_large(): void {
    err('stub only')
  }
}
