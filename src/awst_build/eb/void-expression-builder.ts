import { ValueExpressionBuilder } from './index'
import { voidWType, WType } from '../../awst/wtypes'

export class VoidExpressionBuilder extends ValueExpressionBuilder {
  get wtype(): WType {
    return voidWType
  }
}
