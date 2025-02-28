import { spawn } from 'cross-spawn'

type InvokeCliOptions = {
  command: string
  args: string[]
  cwd?: string
  onReceiveLine?(line: string): void
  dontThrowOnNonzeroCode?: boolean
  shell?: boolean | string
}

type InvokeCliResponse = {
  lines: string[]
  code: number
}

class InvokeCliError extends Error {
  constructor(public exit: { code?: number | null; signal?: NodeJS.Signals | null }) {
    if (exit.code) {
      super(`Exited with code ${exit.code}`)
    } else if (exit.signal) {
      super(`Exited with signal ${exit.signal}`)
    } else {
      super('Exited with unknown cause')
    }
  }
}

export function invokeCli(options: InvokeCliOptions): Promise<InvokeCliResponse> {
  return new Promise<InvokeCliResponse>((resolve, reject) => {
    const lineAggregator = new LineAggregator(options.onReceiveLine)
    const process = spawn(options.command, options.args, {
      stdio: 'pipe',
      shell: options.shell,
    })

    process.stdout.on('data', (data) => lineAggregator.aggregate(data))
    process.once('close', (code) => {
      if (code !== 0 && !options.dontThrowOnNonzeroCode) {
        reject(new InvokeCliError({ code }))
      }
      lineAggregator.flush()
      resolve({
        code: code ?? 0,
        lines: lineAggregator.lines,
      })
    })
    process.once('exit', (code, signal) => {
      if (signal !== null) {
        reject(new InvokeCliError({ signal }))
      }
      if (code !== 0 && !options.dontThrowOnNonzeroCode) {
        reject(new InvokeCliError({ code }))
      }
      lineAggregator.flush()
      resolve({
        code: code ?? 0,
        lines: lineAggregator.lines,
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
