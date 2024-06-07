import { logger } from './logger'
import { createTsProgram } from './parser'
import { CompileOptions } from './compile-options'
import { buildAwst } from './awst_build'

export function compile(options: CompileOptions): void {
  // logger.info(undefined, `Compiling source file: ${src}`)

  const program = createTsProgram(options)

  const awst = buildAwst(program, options)
}
