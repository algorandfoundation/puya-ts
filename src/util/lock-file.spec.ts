import { existsSync, mkdirSync, rmdirSync } from 'fs'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createLockFile } from './lock-file'
import { sleep } from './sleep'

describe('lock-file', () => {
  const lockPath = `test-lock-file.lock`

  beforeEach(() => {
    // Clean up any existing lock files before each test
    if (existsSync(lockPath)) {
      rmdirSync(lockPath)
    }
  })

  afterEach(() => {
    // Clean up after each test
    if (existsSync(lockPath)) {
      rmdirSync(lockPath)
    }
  })

  it('should create and remove lock file', async () => {
    {
      await using _ = await createLockFile(lockPath)
      expect(existsSync(lockPath)).toBe(true)
    }

    expect(existsSync(lockPath)).toBe(false)
  })

  it('should throw error when lock already exists', async () => {
    await createLockFile(lockPath)

    // Set maxRetries to 0 to fail immediately without retrying
    await expect(createLockFile(lockPath, { maxRetries: 0 })).rejects.toThrow('Failed to lock file')
  })

  it('should handle stale locks', async () => {
    // Create a lock file
    mkdirSync(lockPath)

    // Wait for the lock to become stale
    await sleep(1100)

    // Should succeed because the lock is stale
    await expect(createLockFile(lockPath, { staleMs: 1000 })).resolves.not.toThrow()
  })

  it('should retry specified number of times', async () => {
    // Create a lock that won't expire
    mkdirSync(lockPath)

    const startTime = Date.now()

    // Try to acquire lock with 2 retries and 100ms delay
    await expect(createLockFile(lockPath, { maxRetries: 2, delayMs: 100, staleMs: 5000 })).rejects.toThrow('Failed to lock file')

    const duration = Date.now() - startTime

    // Should have waited approximately 200ms (2 retries * 100ms)
    expect(duration).toBeGreaterThanOrEqual(200)
    expect(duration).toBeLessThan(300) // Add some buffer for timing variations

    rmdirSync(lockPath)
  })

  it('should succeed if lock becomes available during retry', async () => {
    // Create initial lock
    mkdirSync(lockPath)

    // Remove lock after 150ms
    setTimeout(() => {
      rmdirSync(lockPath)
    }, 150)

    // Should succeed on second retry
    await expect(createLockFile(lockPath, { maxRetries: 3, delayMs: 100 })).resolves.not.toThrow()
  })
})
