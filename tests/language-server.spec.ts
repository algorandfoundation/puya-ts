import { spawn } from 'cross-spawn'
import type { ChildProcess } from 'node:child_process'
import { afterAll, describe, expect, it } from 'vitest'
import { StreamMessageReader, StreamMessageWriter } from 'vscode-jsonrpc/node'
import * as ls from 'vscode-languageserver'
import { URI } from 'vscode-uri'
import { AbsolutePath } from '../src'
import { invariant } from '../src/util'

function encodePathToUri(path: string) {
  return URI.file(path).toString()
}

const codeFixesPath = AbsolutePath.resolve({ path: 'tests/code-fix' })
/* eslint-disable no-console */
const log = console.debug

describe('Language Server', () => {
  const processes: ChildProcess[] = []
  function getLanguageServer() {
    const childProcess = spawn('npx', ['tsx', 'src/cli-ls.ts', '--stdio'], {
      stdio: ['pipe', 'pipe', process.stderr],
    })

    const connection = ls.createProtocolConnection(
      new StreamMessageReader(childProcess.stdout),
      new StreamMessageWriter(childProcess.stdin),
    )
    connection.onUnhandledNotification((n) => {
      log(`SERVER: UNHANDLED: ${n.method}`)
    })
    connection.onNotification(ls.LogMessageNotification.type, (msg) => {
      log(`SERVER: ${msg.type}: ${msg.message}`)
    })
    connection.onError((error) => {
      log(`SERVER: CONNECTION ERROR ${error}`)
    })
    connection.listen()

    expect(childProcess.pid, 'language server pid').toBeTruthy()
    log(`started language server process: ${childProcess.pid}`)
    expect(childProcess.exitCode, 'language server exit code').toBeNull()
    processes.push(childProcess)
    const processId = childProcess.pid
    invariant(processId, 'process must have id')
    return {
      processId,
      process: childProcess,
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
    const { process, connection, processId } = getLanguageServer()
    const initResponse = await initialize(connection, processId)
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
  it('publishes diagnostics', { timeout: 1000_000 }, async () => {
    const { connection, process, processId } = getLanguageServer()

    const exit = new Promise<void>((resolve) => {
      process.once('error', (err) => {
        log(`error: ${err}`)
        resolve()
      })
      process.once('exit', (code) => {
        log(`exit: ${code}`)
        resolve()
      })
      process.once('close', (code) => {
        log(`process closed: ${code}`)
        resolve()
      })
    })

    const path = codeFixesPath.join('unsupported-tokens.algo.ts')
    const uri = encodePathToUri(path.toString())
    const nextDiagnostic = new Promise<ls.PublishDiagnosticsParams>((resolve, reject) => {
      connection.onNotification(ls.PublishDiagnosticsNotification.type, (n) => {
        if (n.uri === uri) {
          // two sets of diagnostics are published, one on initial change and one after the workspace has been analysed
          // this test is only interested in the second diagnostic, however, they may be received in either order
          // so only resolve if there are the expected diagnostics
          if (n.diagnostics.length) {
            resolve(n)
          }
        }
      })
    })
    await initialize(connection, processId)
    log('initialized')

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

    expect(process.exitCode, 'language server process should still be running').toBeNull()
    await connection.sendRequest(ls.ShutdownRequest.type)
    await connection.sendNotification(ls.ExitNotification.type)
    connection.end()
    await exit
  })
})

async function initialize(connection: ls.ProtocolConnection, processId: number) {
  const codeFixUri = encodePathToUri(codeFixesPath.toString())
  const init: ls.InitializeParams = {
    rootUri: codeFixUri,
    processId,
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
