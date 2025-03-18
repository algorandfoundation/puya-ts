import { existsSync, mkdirSync, rmdirSync } from 'fs'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { lockFile, unlockFile } from './lock-file'

describe('lock-file', () => {
  const testPath = 'test-lock-file'
  const lockPath = `${testPath}.lock`

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
    await lockFile(testPath)
    expect(existsSync(lockPath)).toBe(true)

    await unlockFile(testPath)
    expect(existsSync(lockPath)).toBe(false)
  })

  it('should throw error when lock already exists', async () => {
    await lockFile(testPath)

    // Set maxRetries to 0 to fail immediately without retrying
    await expect(lockFile(testPath, { maxRetries: 0 })).rejects.toThrow('Failed to lock file')

    await unlockFile(testPath)
  })

  it('should handle stale locks', async () => {
    // Create a lock file
    mkdirSync(lockPath)

    // Wait for the lock to become stale
    await new Promise((resolve) => setTimeout(resolve, 1100))

    // Should succeed because the lock is stale
    await expect(lockFile(testPath, { staleMs: 1000 })).resolves.not.toThrow()

    await unlockFile(testPath)
  })

  it('should retry specified number of times', async () => {
    // Create a lock that won't expire
    mkdirSync(lockPath)

    const startTime = Date.now()

    // Try to acquire lock with 2 retries and 100ms delay
    await expect(lockFile(testPath, { maxRetries: 2, delayMs: 100, staleMs: 5000 })).rejects.toThrow('Failed to lock file')

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
    await expect(lockFile(testPath, { maxRetries: 3, delayMs: 100 })).resolves.not.toThrow()

    await unlockFile(testPath)
  })
})
