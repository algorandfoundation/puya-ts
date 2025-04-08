/* eslint-disable no-console */
import chalk from 'chalk'
import { sync } from 'cross-spawn'
import fs from 'fs'
import upath from 'upath'
import type { OpModule } from './build-op-module'
import { buildOpModule } from './build-op-module'
import { emitOpFuncTypes } from './generate-op-funcs'
import { emitOpMetaData } from './generate-op-metadata'
import { emitOpPTypes } from './generate-op-ptypes'
import { emitGTxnTypes, emitITxnTypes } from './generate-txn-types'

/**
 * Generate several files from the langspec.puya.json. This file is created by a script in the puya project
 * which tweaks the base langspec.json which is generated by go-algorand.
 * @param puyaTsRootDir The root directory of the puya-ts project
 */
function runCodeGen(puyaTsRootDir: string) {
  console.log(chalk.cyan(`Generating code for project ${puyaTsRootDir}`))

  const opModule = buildOpModule()

  const files: Record<
    string,
    {
      emitFn: (module: OpModule) => Generator<string, void>
      projectRoot: string
      outPath: string
      disabled?: boolean
      skipLint?: boolean
    }
  > = {
    'op-module': {
      emitFn: function* (opModule) {
        yield JSON.stringify(opModule, undefined, 2)
      },
      projectRoot: '',
      outPath: 'scripts/temp/ops.json',
      disabled: true,
      skipLint: true,
    },
    'op function types': {
      emitFn: emitOpFuncTypes,
      projectRoot: 'packages/algo-ts',
      outPath: 'src/op.ts',
    },
    'op builder metadata': {
      emitFn: emitOpMetaData,
      projectRoot: '',
      outPath: 'src/awst_build/op-metadata.ts',
    },
    'op ptypes': {
      emitFn: emitOpPTypes,
      projectRoot: '',
      outPath: 'src/awst_build/ptypes/op-ptypes.ts',
    },
    gtxn: {
      emitFn: emitGTxnTypes,
      projectRoot: 'packages/algo-ts',
      outPath: 'src/gtxn.ts',
    },
    itxn: {
      emitFn: emitITxnTypes,
      projectRoot: 'packages/algo-ts',
      outPath: 'src/itxn.ts',
    },
  }

  for (const [desc, { emitFn, projectRoot, outPath, skipLint, disabled }] of Object.entries(files)) {
    if (disabled) {
      console.log(chalk.gray(`Skipping disabled ${desc}`))
      continue
    }
    console.log(chalk.blueBright(`Generating ${desc}`))

    const fullPath = upath.join(puyaTsRootDir, projectRoot, outPath)
    console.log(chalk.blue(`Writing text to ${fullPath}`))
    fs.writeFileSync(fullPath, Array.from(emitFn(opModule)).join(''), 'utf8')
    if (skipLint) {
      console.log(chalk.gray(`Skipping linting ${fullPath}`))
      continue
    }
    console.log(chalk.blue(`Linting ${fullPath}`))
    lintFile(upath.join(puyaTsRootDir, projectRoot), outPath)
  }
  console.log(chalk.green('Done!'))
}

function lintFile(cwd: string, path: string) {
  sync('npx', ['-c', `eslint ${path} --fix`], {
    stdio: 'inherit',
    cwd,
  })
}

/**
 * Resolve the project root form the current working directory.
 * Assumes the script is either run from the project root, or from the scripts directory (which would happen if you
 * were to right-click this file and select 'run code-gen.ts' in a supporting IDE)
 */
function resolveProjectRoot() {
  const cwd = process.cwd()
  if (cwd.endsWith('scripts')) {
    return upath.join(cwd, '../')
  }
  return cwd
}

runCodeGen(resolveProjectRoot())
