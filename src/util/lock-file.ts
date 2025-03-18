import { existsSync, mkdirSync, rmdirSync, statSync } from 'fs'
import { onExit } from 'signal-exit'
import { logger } from '../logger'

const lockPaths = new Set<string>()

function acquireLock(path: string, options?: { staleMs?: number }) {
  const { staleMs = 60 * 1000 } = options ?? {}
  const lockPath = `${path}.lock`
  lockPaths.add(path)

  if (existsSync(lockPath)) {
    const now = Date.now()
    const fileStat = statSync(lockPath)

    if (now - fileStat.mtime.getTime() > staleMs) {
      // Remove the lock file if it has expired
      rmdirSync(lockPath)
    } else {
      throw new Error('Lock file already exists')
    }
  }

  mkdirSync(lockPath, { recursive: true })
}

export async function lockFile(path: string, options?: { staleMs?: number; maxRetries?: number; delayMs?: number }): Promise<void> {
  const { maxRetries = 3, delayMs = 1000 } = options ?? {}

  for (let i = 0; i < maxRetries; i++) {
    try {
      acquireLock(path, options)
      return
    } catch (err) {
      logger.debug(undefined, `Failed to acquire lock file ${path}: ${err}`)
      await sleep(delayMs)
    }
  }

  throw new Error('Failed to lock file')
}

export async function unlockFile(path: string): Promise<void> {
  const lockPath = `${path}.lock`
  try {
    rmdirSync(lockPath)
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

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
