import type { ChildProcessWithoutNullStreams } from 'child_process'
import { spawn } from 'child_process'
import { logger } from '../logger'

let puyaProcess: ChildProcessWithoutNullStreams | null = null

export function startPuya({ command, cwd, shell }: { command: string; cwd?: string; shell?: boolean }) {
  return new Promise<void>((resolve, reject) => {
    puyaProcess = spawn(command, [], {
      stdio: 'pipe',
      shell,
    })

    console.log('puyaProcess', puyaProcess.pid)

    puyaProcess.stdout.on('data', (data) => {
      const text = data.toString('utf-8')
      if (text === 'ready') {
        logger.info(undefined, 'Puya is ready')
        resolve()
      } else {
        reject(new Error(`Unexpected output from Puya: ${data}`))
      }
    })

    puyaProcess.stderr.on('data', (data) => {
      reject(new Error(`Unexpected output from Puya: ${data}`))
    })

    puyaProcess.on('error', (error) => {
      reject(new Error(`Process error: ${error.message}`))
    })

    puyaProcess.on('exit', (code) => {
      if (code !== null && code !== 0) {
        reject(new Error(`Process exited with code ${code}`))
      }
    })
  })
}

export function stopPuya() {
  if (puyaProcess) {
    puyaProcess.kill()
    puyaProcess = null
  }
}

export async function runPuya({
  command,
  args,
  cwd,
  onOutput,
  shell = false,
}: {
  command: string
  args: string[]
  cwd?: string
  onOutput: (line: string) => void
  shell?: boolean
}) {
  return new Promise<void>((resolve, reject) => {
    const lineAggregator = new LineAggregator(onOutput)

    // Create or reuse existing process
    if (!puyaProcess) {
      throw new Error('Puya process not started')
    }

    // Handle process output
    puyaProcess.stdout.on('data', (data) => {
      if (data.toString('utf-8') !== 'done') {
        lineAggregator.aggregate(data)
      } else {
        lineAggregator.flush()
        resolve()
      }
    })

    puyaProcess.stderr.on('data', (data) => {
      logger.critical(undefined, data.toString())
      reject()
    })

    puyaProcess.on('error', (error) => {
      logger.critical(undefined, `Process error: ${error.message}`)
      reject()
    })

    console.log('calling puyaProcess.stdin!.write', `${args.join(' ')}\n`)

    // Write arguments to stdin
    puyaProcess.stdin.write(`${args.join(' ')}\n`)
  })
}

class LineAggregator {
  #line = ''
  #lines: string[] = []
  constructor(private readonly onLine?: (line: string) => void) {}

  aggregate(chunk: Buffer<ArrayBufferLike> | null | undefined) {
    if (chunk === undefined || chunk === null) return
    const text = chunk.toString('utf-8')
    for (const c of text) {
      switch (c) {
        case '\n':
          this.flushLine()
          break
        case '\r':
          continue
        default:
          this.#line += c
          break
      }
    }
  }

  flush() {
    if (this.#line) this.flushLine()
  }

  private flushLine() {
    this.#lines.push(this.#line)
    this.onLine?.(this.#line)
    this.#line = ''
  }

  get lines() {
    return this.#lines
  }
}
