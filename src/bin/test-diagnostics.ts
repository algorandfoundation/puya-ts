/* eslint-disable no-console */
import path from 'path'
import upath from 'upath'
import type { Diagnostic } from 'vscode-languageserver'
import { URI } from 'vscode-uri'
import { processInputPaths } from '../input-paths/process-input-paths'
import { compileAndExtractLogs, mapToDiagnostic } from '../language-server/diagnostics'

async function main() {
  const workspaceFolder = 'c:/algorand/vscode-puya-py/packages/typescript/examples/algorand-typescript'

  const files = processInputPaths({
    paths: [workspaceFolder],
  })

  // console.log('files')
  // console.log(JSON.stringify(files, null, 2))

  const logEvents = await compileAndExtractLogs(files)

  // console.log('logEvents')
  // console.log(JSON.stringify(logEvents, null, 2))

  const diagnostics = files.reduce((acc, file) => {
    const diagnostics = logEvents.filter((e) => e.sourceLocation.file === file.sourceFile).map(mapToDiagnostic)
    acc.set(
      URI.file(path.isAbsolute(file.sourceFile) ? file.sourceFile : upath.join(workspaceFolder, file.sourceFile)).toString(),
      diagnostics,
    )
    return acc
  }, new Map<string, Diagnostic[]>())

  diagnostics.forEach((diagnostics, uri) => {
    console.log(`\ndiagnostics for ${uri}:`)
    console.log(JSON.stringify(diagnostics, null, 2))
  })
}

main()
