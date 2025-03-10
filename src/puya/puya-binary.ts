import * as crypto from 'crypto'
import * as fs from 'fs'
import * as path from 'path'
import * as tar from 'tar'
import { Constants } from '../constants'
import { InternalError } from '../errors'
import { logger } from '../logger'
import { generateTempDir } from '../util/generate-temp-file'
import type { SemVer } from './semver'

/**
 * Gets the platform-specific binary name
 * @returns The appropriate binary name for the current platform
 */
export function getBinaryName(): string {
  return process.platform === 'win32' ? 'puya.exe' : 'puya'
}

/**
 * Finds the path to the node_modules directory
 * @returns The absolute path to the node_modules directory
 */
export function findNodeModulesDir(): string {
  // Start with the current working directory
  let currentDir = process.cwd()

  // Keep going up directories until we find node_modules or hit the root
  while (currentDir !== path.parse(currentDir).root) {
    const potentialNodeModulesDir = path.join(currentDir, 'node_modules')
    if (fs.existsSync(potentialNodeModulesDir)) {
      return potentialNodeModulesDir
    }
    currentDir = path.dirname(currentDir)
  }

  // If we couldn't find it, default to the current directory
  return process.cwd()
}

function getPuyaStorageDir(version: SemVer): string {
  const nodeModulesDir = findNodeModulesDir()
  return path.join(nodeModulesDir, '.puya-ts', version.formatted)
}

/**
 * Finds the path to a cached Puya binary if it exists
 * @returns The path to the cached binary or undefined if not found
 */
export function findCachedPuyaBinary(version: SemVer): string | undefined {
  const puyaStorageDir = getPuyaStorageDir(version)
  const binaryFileName = getBinaryName()
  const binaryPath = path.join(puyaStorageDir, binaryFileName)

  return fs.existsSync(binaryPath) ? binaryPath : undefined
}

/**
 * Gets the platform-specific details for downloads
 * @returns Object containing OS and architecture information
 */
function getPlatformDetails(): { os: string; arch: string } {
  // Map Node.js platform to OS name used in filenames
  let os: string
  switch (process.platform) {
    case 'win32':
      os = 'windows'
      break
    case 'darwin':
      os = 'macos'
      break
    case 'linux':
      os = 'linux'
      break
    default:
      throw new InternalError(`Unsupported platform: ${process.platform}`)
  }

  // Map Node.js architecture to architecture name used in filenames
  let arch: string
  switch (process.arch) {
    case 'x64':
      arch = 'x64'
      break
    case 'arm64':
      arch = 'arm64'
      break
    default:
      throw new InternalError(`Unsupported architecture: ${process.arch}`)
  }

  return { os, arch }
}

/**
 * Downloads the Puya binary for a specific release version
 * @param version The release version to download (e.g., "1.0.0")
 * @returns Promise that resolves to the path of the extracted binary
 */
export async function downloadPuyaBinary(version: SemVer): Promise<string> {
  // Get platform-specific details
  const { os, arch } = getPlatformDetails()

  // Build platform-specific filenames
  const platformId = `${os}_${arch}`
  const archiveFileName = `puya-${platformId}.tar.gz`
  const checksumFileName = `puya-${platformId}.sha256.txt`
  const binaryFileName = getBinaryName()

  const puyaStorageDir = getPuyaStorageDir(version)
  // Ensure our storage directories exist
  if (!fs.existsSync(puyaStorageDir)) {
    fs.mkdirSync(puyaStorageDir, { recursive: true })
  }

  using tempDir = generateTempDir()

  const tarFilePath = path.join(tempDir.dirPath, archiveFileName)
  const checksumFilePath = path.join(tempDir.dirPath, checksumFileName)
  const extractedBinaryPath = path.join(puyaStorageDir, binaryFileName)

  logger.debug(undefined, `Downloading Puya binary for version ${version} and platform ${platformId}`)
  const archiveUrl = `https://github.com/${Constants.puyaGithubRepo}/releases/download/${version.formatted}/${archiveFileName}`
  const checksumUrl = `https://github.com/${Constants.puyaGithubRepo}/releases/download/${version.formatted}/${checksumFileName}`

  await downloadFile(archiveUrl, tarFilePath)
  await downloadFile(checksumUrl, checksumFilePath)

  await verifyChecksum(tarFilePath, checksumFilePath)

  await tar.extract({
    file: tarFilePath,
    cwd: puyaStorageDir,
  })

  // Check if extraction was successful and binary exists
  if (!fs.existsSync(extractedBinaryPath)) {
    throw new InternalError(`Binary file ${binaryFileName} not found in the extracted archive`)
  }

  // Make binary executable on non-Windows platforms
  if (os !== 'windows') {
    fs.chmodSync(extractedBinaryPath, 0o755)
  }

  logger.debug(undefined, `Successfully downloaded and extracted Puya binary to ${extractedBinaryPath}`)
  return extractedBinaryPath
}

/**
 * Downloads a file from a URL to a specified path
 * @param url The URL to download from
 * @param destination The local path to save the file to
 * @returns Promise that resolves when the download is complete
 */
async function downloadFile(url: string, destination: string): Promise<void> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to download file. Status Code: ${response.status}`)
    }
    const buffer = await response.arrayBuffer()
    return await new Promise<void>((resolve, reject) => {
      const fileStream = fs.createWriteStream(destination)
      const nodeBuffer = Buffer.from(buffer)

      fileStream.write(nodeBuffer)
      fileStream.end()

      fileStream.on('finish', () => {
        resolve()
      })

      fileStream.on('error', (err) => {
        fs.unlinkSync(destination)
        reject(err)
      })
    })
  } catch (error) {
    // Clean up if file was partially created
    if (fs.existsSync(destination)) {
      fs.rmSync(destination)
    }
    throw error
  }
}

/**
 * Verifies the checksum of a downloaded file
 * @param filePath Path to the file to verify
 * @param checksumFilePath Path to the checksum file
 * @returns Promise that resolves to true if the checksum matches, false otherwise
 */
async function verifyChecksum(filePath: string, checksumFilePath: string): Promise<void> {
  return new Promise((resolve) => {
    // Read the checksum file
    const expectedChecksum = fs.readFileSync(checksumFilePath, 'utf8').trim().toLowerCase()

    // Calculate the SHA256 checksum of the downloaded file
    const hash = crypto.createHash('sha256')
    const stream = fs.createReadStream(filePath)

    stream.on('data', (data) => {
      hash.update(data)
    })

    stream.on('end', () => {
      const calculatedChecksum = hash.digest('hex').toLowerCase()

      if (calculatedChecksum !== expectedChecksum) {
        // Remove the downloaded files if checksum verification fails
        fs.rmSync(filePath)
        fs.rmSync(checksumFilePath)

        throw new Error(`Checksum verification failed. Expected checksum: ${expectedChecksum} but got: ${calculatedChecksum}`)
      }
      resolve()
    })
  })
}
