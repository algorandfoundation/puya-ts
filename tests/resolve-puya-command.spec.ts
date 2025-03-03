import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Constants } from '../src/constants'
import { checkPuyaVersion } from '../src/puya/check-puya-version'
import { downloadPuyaBinary } from '../src/puya/puya-binary'
import { getPuyaEnv } from '../src/puya/puya-env'
import { resolvePuyaCommand } from '../src/puya/resolve-puya-command'

// Mock dependencies
vi.mock('../src/logger', () => ({
  logger: {
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
  },
}))

vi.mock('../src/puya/check-puya-version')
vi.mock('../src/puya/download-puya')
vi.mock('../src/puya/puya-env')

describe('resolvePuyaCommand', () => {
  const originalEnv = { ...process.env }
  let tempDir: string
  let tempScriptPath: string
  let nodeModulesDir: string
  let puyaStorageDir: string
  let cachedBinaryPath: string

  beforeEach(() => {
    vi.resetAllMocks()

    // Create temp directory for tests
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'puya-tests-'))

    // Setup paths for cached binary scenario
    nodeModulesDir = path.join(tempDir, 'node_modules')
    puyaStorageDir = path.join(nodeModulesDir, '.puya-ts')
    fs.mkdirSync(puyaStorageDir, { recursive: true })

    // Determine binary name based on platform
    const binaryName = process.platform === 'win32' ? 'puya.exe' : 'puya'
    cachedBinaryPath = path.join(puyaStorageDir, binaryName)

    // Mock process.cwd to return our temp directory
    vi.spyOn(process, 'cwd').mockReturnValue(tempDir)
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
    // This is only a mock, a sh file is sufficient for this testq
    tempScriptPath = path.join(tempDir, 'puya-script.sh')
    fs.writeFileSync(tempScriptPath, `#!/bin/sh\npuya "$@"`, { mode: 0o755 })

    // Mock getPuyaEnv to return our script path
    vi.mocked(getPuyaEnv).mockReturnValue({
      scriptPath: tempScriptPath,
      command: undefined,
    })

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
    // Mock getPuyaEnv to return empty values
    vi.mocked(getPuyaEnv).mockReturnValue({
      scriptPath: undefined,
      command: undefined,
    })

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

    // Mock getPuyaEnv to return empty values
    vi.mocked(getPuyaEnv).mockReturnValue({
      scriptPath: undefined,
      command: undefined,
    })

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

    // Original cached binary should be deleted but we can't easily test this
    // since we're mocking filesystem interactions implicitly
  })

  it('should use cached binary if version matches', async () => {
    // Create a fake cached binary
    fs.writeFileSync(cachedBinaryPath, 'dummy binary content', { mode: 0o755 })

    // Mock getPuyaEnv to return empty values
    vi.mocked(getPuyaEnv).mockReturnValue({
      scriptPath: undefined,
      command: undefined,
    })

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

    // Mock getPuyaEnv to return empty values
    vi.mocked(getPuyaEnv).mockReturnValue({
      scriptPath: undefined,
      command: undefined,
    })

    // Execute the function with skipVersionCheck=true
    const result = await resolvePuyaCommand(true)

    // Verify results
    expect(result.command).toBe(cachedBinaryPath)
    expect(result.useShell).toBe(false)
    expect(checkPuyaVersion).not.toHaveBeenCalled()
    expect(downloadPuyaBinary).not.toHaveBeenCalled()
  })

  it('should use command path from environment variable', async () => {
    // Setup path for puya command
    const commandPath = 'puya'

    // Mock getPuyaEnv to return our command path
    vi.mocked(getPuyaEnv).mockReturnValue({
      scriptPath: undefined,
      command: 'puya',
    })

    // Mock checkPuyaVersion to return successful check
    vi.mocked(checkPuyaVersion).mockResolvedValue(true)

    // Execute the function
    const result = await resolvePuyaCommand()

    // Verify results
    expect(result.command).toBe(commandPath)
    expect(result.useShell).toBe(false)
    expect(checkPuyaVersion).toHaveBeenCalledWith(commandPath, false)
    expect(downloadPuyaBinary).not.toHaveBeenCalled()
  })
})
