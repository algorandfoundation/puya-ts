import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Constants } from '../src/constants'
import { checkPuyaVersion } from '../src/puya/check-puya-version'
import { downloadPuyaBinary, findCachedPuyaBinary, findNodeModulesDir } from '../src/puya/puya-binary'
import { resolvePuyaCommand } from '../src/puya/resolve-puya-command'

vi.mock('../src/logger', () => ({
  logger: {
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
  },
}))

vi.mock('../src/puya/check-puya-version')
vi.mock('../src/puya/puya-binary')

describe('resolvePuyaCommand', () => {
  const originalEnv = { ...process.env }
  let tempDir: string
  let tempScriptPath: string
  let nodeModulesDir: string
  let cachedBinaryPath: string

  beforeEach(() => {
    vi.resetAllMocks()
    process.env = { ...originalEnv } // Reset env before each test

    // Clear environment variables
    delete process.env.PUYA_SCRIPT_PATH

    // Create temp directories for tests
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'puya-tests-'))
    nodeModulesDir = path.join(tempDir, 'node_modules')
    const puyaStorageDir = path.join(nodeModulesDir, '.puya-ts')
    fs.mkdirSync(puyaStorageDir, { recursive: true })
    cachedBinaryPath = path.join(puyaStorageDir, 'puya')

    vi.mocked(findCachedPuyaBinary).mockReturnValue(cachedBinaryPath)
    vi.mocked(findNodeModulesDir).mockResolvedValue(nodeModulesDir)
  })

  afterEach(() => {
    // Restore environment variables
    process.env = { ...originalEnv }

    // Clean up temp directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true })
    }

    vi.restoreAllMocks()
  })

  it('should use script path from environment variable', async () => {
    // This is only a mock, a sh file is sufficient for this test
    tempScriptPath = path.join(tempDir, 'puya-script.sh')
    fs.writeFileSync(tempScriptPath, `#!/bin/sh\npuya "$@"`, { mode: 0o755 })

    // Set environment variable
    process.env.PUYA_SCRIPT_PATH = tempScriptPath

    // Mock checkPuyaVersion to return successful check
    vi.mocked(checkPuyaVersion).mockResolvedValue(true)

    // Execute the function
    const result = await resolvePuyaCommand()

    // Verify results
    expect(result.command).toBe(tempScriptPath)
    expect(result.useShell).toBe(true)
    expect(checkPuyaVersion).toHaveBeenCalledWith(tempScriptPath, true)
  })

  it('should download and use binary when nothing is set in env and no cached binary exists', async () => {
    // Clear environment variables
    delete process.env.PUYA_SCRIPT_PATH

    // Mock downloadPuyaBinary to return a path
    const downloadedPath = path.join(tempDir, 'downloaded-puya')
    vi.mocked(downloadPuyaBinary).mockResolvedValue(downloadedPath)

    // Execute the function
    const result = await resolvePuyaCommand()

    // Verify results
    expect(result.command).toBe(downloadedPath)
    expect(result.useShell).toBe(false)
    expect(downloadPuyaBinary).toHaveBeenCalledWith(Constants.targetedPuyaVersion)
  })

  it('should update cached binary if version mismatch', async () => {
    // Create a fake cached binary
    fs.writeFileSync(cachedBinaryPath, 'dummy binary content', { mode: 0o755 })

    // Mock checkPuyaVersion to indicate version mismatch
    vi.mocked(checkPuyaVersion).mockResolvedValue(false)

    // Mock downloadPuyaBinary to return a path
    const downloadedPath = path.join(tempDir, 'downloaded-puya')
    vi.mocked(downloadPuyaBinary).mockResolvedValue(downloadedPath)

    // Execute the function
    const result = await resolvePuyaCommand()

    // Verify results
    expect(result.command).toBe(downloadedPath)
    expect(result.useShell).toBe(false)
    expect(checkPuyaVersion).toHaveBeenCalledWith(cachedBinaryPath, false, true)
    expect(downloadPuyaBinary).toHaveBeenCalledWith(Constants.targetedPuyaVersion)
  })

  it('should use cached binary if version matches', async () => {
    // Create a fake cached binary
    fs.writeFileSync(cachedBinaryPath, 'dummy binary content', { mode: 0o755 })

    // Mock checkPuyaVersion to indicate version match
    vi.mocked(checkPuyaVersion).mockResolvedValue(true)

    // Execute the function
    const result = await resolvePuyaCommand()

    // Verify results
    expect(result.command).toBe(cachedBinaryPath)
    expect(result.useShell).toBe(false)
    expect(checkPuyaVersion).toHaveBeenCalledWith(cachedBinaryPath, false, true)
    expect(downloadPuyaBinary).not.toHaveBeenCalled()
  })

  it('should skip version check when skipVersionCheck=true', async () => {
    // Create a fake cached binary
    fs.writeFileSync(cachedBinaryPath, 'dummy binary content', { mode: 0o755 })

    // Execute the function with skipVersionCheck=true
    const result = await resolvePuyaCommand({ skipVersionCheck: true })

    // Verify results
    expect(result.command).toBe(cachedBinaryPath)
    expect(result.useShell).toBe(false)
    expect(checkPuyaVersion).not.toHaveBeenCalled()
    expect(downloadPuyaBinary).not.toHaveBeenCalled()
  })
})
