import { spawn } from 'cross-spawn'
import fs from 'fs'
import type { ChildProcess } from 'node:child_process'
import pathe from 'pathe'
import { afterAll, describe, expect, it } from 'vitest'
import { StreamMessageReader, StreamMessageWriter } from 'vscode-jsonrpc/node'
import * as ls from 'vscode-languageserver'
import { URI } from 'vscode-uri'

function encodePathToUri(path: string) {
  return URI.file(path).toString()
}

const codeFixesPath = pathe.resolve('tests/code-fix')
/* eslint-disable no-console */
const log = console.error

describe('Language Server', () => {
  const processes: ChildProcess[] = []
  function getLanguageServer() {
    const process = spawn('npx', ['tsx', 'src/cli-ls.ts', '--stdio'], {
      stdio: ['pipe', 'pipe', 'inherit'],
    })

    const connection = ls.createProtocolConnection(new StreamMessageReader(process.stdout), new StreamMessageWriter(process.stdin))
    connection.listen()
    expect(process.pid, 'language server pid').toBeTruthy()
    expect(process.exitCode, 'language server exit code').toBeNull()
    processes.push(process)
    return {
      process,
      connection,
    }
  }
  // ensure all processes are killed after tests complete
  afterAll(() => {
    for (const process of processes) {
      if (process.exitCode === null) {
        process.kill()
      }
    }
  })

  it('initializes and shuts down cleanly', async () => {
    const { process, connection } = getLanguageServer()

    const initResponse = await initialize(connection)
    expect(initResponse, 'init response').toMatchObject({
      capabilities: {
        textDocumentSync: ls.TextDocumentSyncKind.Incremental,
      },
    })

    const exit = new Promise<void>((resolve) => {
      process.once('exit', () => {
        resolve()
      })
    })
    await connection.sendRequest(ls.ShutdownRequest.type)
    connection.end()
    await exit
    expect(process.exitCode, 'language server exit code').toBe(0)
  })
  it('publishes diagnostics', { timeout: 60000 }, async () => {
    const { connection, process } = getLanguageServer()
    await initialize(connection)

    const path = pathe.join(codeFixesPath, 'unsupported-tokens.algo.ts')
    const uri = encodePathToUri(path)
    const open: ls.DidOpenTextDocumentParams = {
      textDocument: {
        uri,
        version: 1,
        languageId: 'typescript',
        text: fs.readFileSync(path, 'utf8'),
      },
    }
    const nextDiagnostic = new Promise<ls.PublishDiagnosticsParams>((resolve, reject) => {
      const notification = connection.onNotification(ls.PublishDiagnosticsNotification.type, (n) => {
        if (n.uri === uri) {
          // two sets of diagnostics are published, one on initial change and one after the workspace has been analysed
          // this test is only interested in the second diagnostic, however, they may be received in either order
          // so only resolve if there are the expected diagnostics
          if (n.diagnostics.length) {
            notification.dispose()
            resolve(n)
          }
        }
      })
    })
    await connection.sendNotification(ls.DidOpenTextDocumentNotification.type, open)
    expect(process.exitCode, 'language server process should still be running').toBeNull()
    const diagnostic = await nextDiagnostic
    expect(diagnostic, 'diagnostic').toMatchObject({
      uri: uri,
      diagnostics: [
        {
          message: "Loose equality operator '==' is not supported. Please use strict equality operator '==='",
        },
        {
          message: "Loose inequality operator '!=' is not supported. Please use strict inequality operator '!=='",
        },
      ],
    })
    await connection.sendRequest(ls.ShutdownRequest.type)
    await connection.sendNotification(ls.ExitNotification.type)
    connection.end()
  })
})

async function initialize(connection: ls.ProtocolConnection) {
  const codeFixUri = encodePathToUri(codeFixesPath)
  const init: ls.InitializeParams = {
    rootUri: codeFixUri,
    processId: 1,
    capabilities: {},
    workspaceFolders: [
      {
        name: 'code-fix',
        uri: codeFixUri,
      },
    ],
  }
  return await connection.sendRequest(ls.InitializeRequest.type, init)
}
