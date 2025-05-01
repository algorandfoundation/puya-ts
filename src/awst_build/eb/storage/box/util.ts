import type { SourceLocation } from '../../../../awst/source-location'
import { wtypes } from '../../../../awst/wtypes'
import { logger } from '../../../../logger'
import type { PType } from '../../../ptypes'
import { accountPType } from '../../../ptypes'
import { ARC4EncodedType } from '../../../ptypes/arc4-types'
import { isPersistableStackType } from '../../../ptypes/util'

/**
 * Verifies contentType is able to be stored in a box.
 * @param contentType The content type of the box
 * @param sourceLocation The source location of the box proxy declaration
 */
export function checkBoxType(contentType: PType, sourceLocation: SourceLocation) {
  if (isPersistableStackType(contentType)) {
    return
  } else {
    logger.error(sourceLocation, `${contentType} is not a valid type for storage`)
  }
}

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
