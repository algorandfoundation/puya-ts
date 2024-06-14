import { uint64 } from './primitives'

export abstract class BaseContract {
  public abstract approvalProgram(): boolean | uint64
  public clearState(): boolean | uint64 {
    return true
  }
}
