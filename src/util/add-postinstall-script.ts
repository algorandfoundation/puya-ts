/* eslint-disable no-console */
import fs from 'fs'
import path from 'path'

// Get input folder from command line arguments
const inputFolder = process.argv[2]

if (!inputFolder) {
  console.error('Please provide an input folder as argument')
  process.exit(1)
}

try {
  // Construct path to package.json
  const packageJsonPath = path.join(inputFolder, 'package.json')

  // Read and parse package.json
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8')
  const packageJson = JSON.parse(packageJsonContent)

  // Add or update scripts section
  packageJson.scripts = {
    ...(packageJson.scripts || {}),
    postinstall: 'node bin/download-puya-binary.mjs',
  }

  // Write back to file with proper formatting
  fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`)

  console.log('Successfully added postinstall script to package.json')
} catch (error) {
  console.error('Error processing package.json:', error)
  process.exit(1)
}
