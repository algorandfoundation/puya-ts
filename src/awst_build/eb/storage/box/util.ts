import type { SourceLocation } from '../../../../awst/source-location'
import { AVMType } from '../../../../awst/wtypes'
import { logger } from '../../../../logger'
import type { PType } from '../../../ptypes'
import { accountPType } from '../../../ptypes'
import { ARC4EncodedType } from '../../../ptypes/arc4-types'

/**
 * Verifies contentType is able to be stored in a box.
 * @param contentType The content type of the box
 * @param sourceLocation The source location of the box proxy declaration
 */
export function checkBoxType(contentType: PType, sourceLocation: SourceLocation) {
  if (contentType instanceof ARC4EncodedType) {
    return
  } else if (contentType.wtype && contentType.wtype.valueType && !contentType.wtype.ephemeral) {
    return
  } else {
    logger.error(sourceLocation, `Objects of type ${contentType} cannot be stored in a box`)
  }
}

/**
 * Returns the fixed size requirement for a box of a given ptype or null if the contentType is dynamically sized.
 * @param contentType The content type of the box
 */
export function getBoxSize(contentType: PType): bigint | null {
  if (contentType instanceof ARC4EncodedType) {
    return contentType.fixedByteSize
  } else if (contentType.wtype?.scalarType === AVMType.uint64) {
    return 8n
  } else if (contentType.equals(accountPType)) {
    return 32n
  } else {
    return null
  }
}
