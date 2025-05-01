import { wtypes } from '../../../../awst/wtypes'
import type { PType } from '../../../ptypes'
import { accountPType } from '../../../ptypes'
import { ARC4EncodedType } from '../../../ptypes/arc4-types'

/**
 * Returns the fixed size requirement for a box of a given ptype or null if the contentType is dynamically sized.
 * @param contentType The content type of the box
 */
export function getBoxSize(contentType: PType): bigint | null {
  if (contentType instanceof ARC4EncodedType) {
    return contentType.fixedByteSize
  } else if (contentType.wtype?.equals(wtypes.uint64WType) || contentType.wtype?.equals(wtypes.boolWType)) {
    return 8n
  } else if (contentType.equals(accountPType)) {
    return 32n
  } else {
    return null
  }
}
