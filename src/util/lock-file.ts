import { existsSync, mkdirSync, rmdirSync, statSync } from 'fs'
import { onExit } from 'signal-exit'
import { logger } from '../logger'
import { sleep } from './sleep'

const lockPaths = new Set<string>()

function acquireLock(path: string, options?: { staleMs?: number }) {
  const { staleMs = 60 * 1000 } = options ?? {}
  lockPaths.add(path)

  if (existsSync(path)) {
    const now = Date.now()
    const fileStat = statSync(path)

    if (now - fileStat.mtime.getTime() > staleMs) {
      // Remove the lock file if it has expired
      rmdirSync(path)
    } else {
      throw new Error('Lock file already exists')
    }
  }

  mkdirSync(path, { recursive: true })
}

export async function createLockFile(
  path: string,
  options?: { staleMs?: number; maxRetries?: number; delayMs?: number },
): Promise<AsyncDisposable> {
  const { maxRetries = 3, delayMs = 1000 } = options ?? {}

  for (let i = 0; i < maxRetries; i++) {
    try {
      acquireLock(path, options)

      return {
        async [Symbol.asyncDispose]() {
          await unlockFile(path)
        },
      }
    } catch (err) {
      logger.debug(undefined, `Failed to acquire lock file ${path}: ${err}`)
      await sleep(delayMs)
    }
  }

  throw new Error('Failed to lock file')
}

async function unlockFile(path: string): Promise<void> {
  try {
    rmdirSync(path)
    lockPaths.delete(path)
  } catch (err) {
    logger.warn(undefined, `Failed to unlock file ${path}: ${err}`)
  }
}

onExit(() => {
  for (const path of lockPaths) {
    unlockFile(path)
  }
})
