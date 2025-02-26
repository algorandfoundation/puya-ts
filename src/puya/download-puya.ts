import * as crypto from 'crypto'
import * as fs from 'fs'
import * as path from 'path'
import * as tar from 'tar'

/**
 * Gets the platform-specific binary name
 * @returns The appropriate binary name for the current platform
 */
function getBinaryName(): string {
  return process.platform === 'win32' ? 'puya.exe' : 'puya'
}

/**
 * Finds the path to the node_modules directory
 * @returns The absolute path to the node_modules directory
 */
function findNodeModulesDir(): string {
  // Start with the current module's directory
  let currentDir = __dirname

  // Keep going up directories until we find node_modules or hit the root
  while (currentDir !== path.parse(currentDir).root) {
    const potentialNodeModulesDir = path.join(currentDir, 'node_modules')
    if (fs.existsSync(potentialNodeModulesDir)) {
      return potentialNodeModulesDir
    }
    currentDir = path.dirname(currentDir)
  }

  // If we couldn't find it, default to the current directory's node_modules
  return path.join(process.cwd(), 'node_modules')
}

/**
 * Downloads the Puya binary for a specific release version
 * @param version The release version to download (e.g., "v1.0.0")
 * @returns Promise that resolves to the path of the extracted binary
 */
export async function downloadPuyaBinary(version: string): Promise<string> {
  const repo = 'PatrickDinh/puya'
  const archiveFileName = 'puya.tar.gz'
  const binaryFileName = getBinaryName()
  const checksumFileName = 'puya-checksum.txt'

  // Find node_modules directory and set up storage paths
  const nodeModulesDir = findNodeModulesDir()
  const puyaStorageDir = path.join(nodeModulesDir, '.puya-ts')
  const tempDir = path.join(puyaStorageDir, 'temp')
  const extractDir = path.join(puyaStorageDir, version)

  // Ensure our storage directories exist
  for (const dir of [puyaStorageDir, tempDir, extractDir]) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  }

  const tarFilePath = path.join(tempDir, archiveFileName)
  const checksumFilePath = path.join(tempDir, checksumFileName)
  const extractedBinaryPath = path.join(extractDir, binaryFileName)

  // Check if binary already exists in the extraction directory
  if (fs.existsSync(extractedBinaryPath)) {
    return extractedBinaryPath
  }

  // URLs for downloading files
  const archiveUrl = `https://github.com/${repo}/releases/download/${version}/${archiveFileName}`
  const checksumUrl = `https://github.com/${repo}/releases/download/${version}/${checksumFileName}`

  // Download both files
  await downloadFile(archiveUrl, tarFilePath)
  await downloadFile(checksumUrl, checksumFilePath)

  // Verify the checksum
  await verifyChecksum(tarFilePath, checksumFilePath)

  // Extract the tar file
  try {
    await extractTar(tarFilePath, extractDir)

    // Delete the tar file after successful extraction
    fs.unlinkSync(tarFilePath)
    fs.unlinkSync(checksumFilePath)

    // Check if extraction was successful and binary exists
    if (!fs.existsSync(extractedBinaryPath)) {
      throw new Error(`Binary file ${binaryFileName} not found in the extracted archive`)
    }

    // Make binary executable on non-Windows platforms
    if (process.platform !== 'win32') {
      fs.chmodSync(extractedBinaryPath, 0o755)
    }

    return extractedBinaryPath
  } catch (error: unknown) {
    // Clean up on extraction error
    if (fs.existsSync(tarFilePath)) {
      fs.unlinkSync(tarFilePath)
    }
    if (fs.existsSync(checksumFilePath)) {
      fs.unlinkSync(checksumFilePath)
    }
    throw new Error(`Failed to extract archive: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Extracts a tar file to the specified directory
 * @param tarFilePath Path to the tar file
 * @param extractDir Directory to extract to
 * @returns Promise that resolves when extraction is complete
 */
async function extractTar(tarFilePath: string, extractDir: string): Promise<void> {
  return tar.extract({
    file: tarFilePath,
    cwd: extractDir,
  })
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
      fs.unlinkSync(destination)
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
        fs.unlinkSync(filePath)
        fs.unlinkSync(checksumFilePath)

        throw new Error(`Checksum verification failed. Expected checksum: ${expectedChecksum} but got: ${calculatedChecksum}`)
      }
    })
  })
}
