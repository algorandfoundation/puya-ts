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

describe.sequential('Language Server', () => {
  const processes: ChildProcess[] = []
  function getLanguageServer() {
    const process = spawn('npx', ['tsx', 'src/cli-ls.ts', '--stdio'], {
      stdio: ['pipe', 'pipe', 'ignore'],
    })

    const connection = ls.createProtocolConnection(new StreamMessageReader(process.stdout), new StreamMessageWriter(process.stdin))
    connection.listen()
    expect(process.pid, 'language server pid').toBeTruthy()
    log(`started language server process: ${process.pid}`)
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
        log(`process ${process.pid} still alive, killing`)
        process.kill()
      } else {
        log(`process ${process.pid} already ended with exit code: ${process.exitCode}`)
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
  it('publishes diagnostics', { timeout: 120000 }, async () => {
    const { connection, process } = getLanguageServer()
    const onConnectionError = connection.onError((err) => {
      log(`connection error: ${err}`)
    })
    const exit = new Promise<void>((resolve) => {
      process.once('error', (err) => {
        log(`error: ${err}`)
        resolve()
      })
      process.once('exit', (code) => {
        log(`exit: ${code}`)
        resolve()
      })
    })
    process.once('close', (code) => {
      log(`process closed: ${code}`)
    })
    await initialize(connection)
    log('initialized')
    const logHandler = connection.onNotification(ls.LogMessageNotification.type, (msg) => {
      log(`SERVER: ${msg.type}: ${msg.message}`)
    })

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
        log(`received ${n.diagnostics.length} diagnostics for ${n.uri}, looking for ${uri}`)
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
    log(`sending open notification for ${uri}`)
    await connection.sendNotification(ls.DidOpenTextDocumentNotification.type, open)
    const diagnostic = await nextDiagnostic
    log(`received diagnostic uri=${diagnostic.uri}, version=${diagnostic.version}`)
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
    log(`sending shutdown`)
    await connection.sendRequest(ls.ShutdownRequest.type)
    logHandler.dispose()
    onConnectionError.dispose()
    log(`sending exit`)
    await connection.sendNotification(ls.ExitNotification.type)
    log(`connection.end`)
    connection.end()
    await exit
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
  const result = await connection.sendRequest(ls.InitializeRequest.type, init)
  await connection.sendNotification(ls.InitializedNotification.type, {})
  return result
}
