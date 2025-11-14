import { afterAll } from 'vitest'
import { PuyaService } from '../../../src/puya/puya-service'
import { resolvePuyaPath } from '../../../src/puya/resolve-puya-path'
import { invariant } from '../../../src/util'

/**
 * Maintains one instance of the PuyaService class (and in turn cli instance) per static context.
 *
 * Vitest by default runs each test file in isolation meaning we will end up with an instance per spec file
 * but that instance will be shared whenever there are multiple test fixtures in the one file.
 */
export const puyaService = (() => {
  let service: PuyaService | undefined = undefined
  let shutdown = false
  return {
    async instance() {
      invariant(!shutdown, 'Instance has already been disposed')
      if (!service) {
        const puyaPath = await resolvePuyaPath({})
        service = new PuyaService({ puyaPath })
      }
      return service
    },
    async shutdown() {
      if (shutdown) return
      shutdown = true
      await service?.shutdown()
    },
  }
})()

afterAll(() => puyaService.shutdown())
