import { spawn } from 'cross-spawn'

type InvokeCliOptions = {
  command: string
  args: string[]
  cwd?: string
  onReceiveLine?(line: string): void
  dontThrowOnNonZeroCode?: boolean
}

type InvokeCliResponse = {
  outputLines: string[]
  code: number
}

class InvokeCliError extends Error {
  constructor(public exit: { code?: number | null; signal?: NodeJS.Signals | null }) {
    let message: string
    if (exit.code) {
      message = `Exited with code ${exit.code}`
    } else if (exit.signal) {
      message = `Exited with signal ${exit.signal}`
    } else {
      message = 'Exited with unknown cause'
    }
    super(message)
  }
}

export function invokeCli(options: InvokeCliOptions): Promise<InvokeCliResponse> {
  return new Promise<InvokeCliResponse>((resolve, reject) => {
    const lineAggregator = new LineAggregator(options.onReceiveLine)
    const process = spawn(options.command, options.args, {
      stdio: 'pipe',
    })

    process.stdout.on('data', (data) => lineAggregator.aggregate(data))
    process.stderr.on('data', (data) => lineAggregator.aggregate(data))
    process.once('close', (code) => {
      if (code !== 0 && !options.dontThrowOnNonZeroCode) {
        reject(new InvokeCliError({ code }))
      }
      lineAggregator.flush()
      resolve({
        code: code ?? 0,
        outputLines: lineAggregator.lines,
      })
    })
    process.once('exit', (code, signal) => {
      if (signal !== null) {
        reject(new InvokeCliError({ signal }))
      }
      if (code !== 0 && !options.dontThrowOnNonZeroCode) {
        reject(new InvokeCliError({ code }))
      }
      lineAggregator.flush()
      resolve({
        code: code ?? 0,
        outputLines: lineAggregator.lines,
      })
    })
    process.once('error', reject)
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
