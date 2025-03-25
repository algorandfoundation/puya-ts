import type { SourceLocation } from '../../../../awst/source-location'
import { AVMType } from '../../../../awst/wtypes'
import { logger } from '../../../../logger'
import type { PType } from '../../../ptypes'
import { accountPType } from '../../../ptypes'
import { ARC4EncodedType } from '../../../ptypes/arc4-types'

export function checkBoxType(contentType: PType, sourceLocation: SourceLocation) {
  if (contentType instanceof ARC4EncodedType) {
    return
  } else if (contentType.wtype && contentType.wtype.scalarType !== null) {
    return
  } else {
    logger.error(sourceLocation, `Objects of type ${contentType} cannot be stored in a box`)
  }
}

export function getMinBoxSize(contentType: PType): bigint {
  if (contentType instanceof ARC4EncodedType) {
    return contentType.minByteSize
  } else if (contentType.wtype?.scalarType === AVMType.uint64) {
    return 8n
  } else if (contentType.equalsOneOf(accountPType)) {
    return 32n
  } else if (contentType.wtype?.scalarType === AVMType.bytes) {
    return 0n
  } else {
    return 0n
  }
}
