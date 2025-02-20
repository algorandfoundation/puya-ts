# Puya TS Cli

The puya-ts cli is a tool for compiling Algorand TypeScript code into artifacts which can be used to deploy smart contracts and logic signatures on the Algorand Virtual Machine (AVM). At a high level these include:

| Output                      | Description                                                                                                                                                                                                                                                             |
|-----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Teal code (`*.teal`)        | Teal is a low level, human readable stack based language which 'runs' on the AVM                                                                                                                                                                                        |
| Bytecode (`*.bin`)          | Bytecode, in this context, is a binary representation of teal code - and is what the AVM actually interprets                                                                                                                                                            |
| ARC32 Spec (`*.arc32.json`) | A specification file which describes an ARC4 contract and how to interact with it. It also includes an encoded copy of the a teal approval and clear state programs of the contract. See [ARC32](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0032.md) |
| ARC56 Spec (`*.arc56.json`) | A more recently defined specification file which describes an ARC4 contract and how to interact with it. See [ARC56](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0056.md)                                                                             |

## Installation

### Puya-TS

Puya-TS can be installed from npm using the command

```shell
npm i @algorandfoundation/puya-ts [-g]
```

If installed globally (`-g`) it should be available on your PATH anywhere, otherwise you may need to use `npx puya-ts` to run it, or create an npm script.

```json
{
  "scripts": {
    "build": "puya-ts ..."
  }
}
```

IDEs such as Webstorm automatically add the local `node_modules/.bin` directory to the PATH of the built-in terminal window, meaning `puya-ts ...` should work without `npx` in that window.

You can very a successful installation by running the command with no args

```shell
> puya-ts
usage: puya-ts [-h] [--version] {build} ...

positional arguments:
  ...
```

### Puya

Puya-ts is only the front end component of the compiler. After parsing and converting TypeScript into a common AST known as AWST, the remainder of the compilation is passed onto the Puya backend compiler. The Puya compiler is written in Python and can be installed using `pipx`. You will require Python 3.12+ and to have pipx available on your path for the following to work.

```shell
pipx install puyapy
```

The latest puya-ts will generally target the latest puya version, but if you have issues and require a specific older version installed the command would look like:

```shell
pipx install puyapy==4.2.1 --force
```

`--force` may or may not be required depending on if you already have a version installed.


You can verify a successful installation by running the `puya` command with no args.

```shell
> puya
usage: puya [-h] [--version] [--log-level {notset,debug,info,warning,error,critical}] [--log-format {default,json}] --options OPTIONS --awst AWST [--source-annotations SOURCE_ANNOTATIONS]
puya: error: the following arguments are required: --options, --awst
```


## Commands

### Version

Shows the currently installed version of puya-ts, its targeted puya version, and supported AVM versions

```shell
puya-ts --version
```


### Build

Builds a smart contract or logic signature. This command takes one or more files or directories and will attempt to compile any matching `*.algo.ts` files, outputting artifacts for any smart contracts and logic signatures found within.

```shell
puya-ts build smart_contracts

puya-ts build smart_contracts/your-contract.algo.ts

puya-ts build smart_contracts/*
```

#### Arguments

Flag arguments are true when used in the base form `--my-flag` but can be negated by using the format `--no-my-flag`. The latter is necessary to disable options which are on by default.

| Arg                            | Type                                                       | Required                     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|--------------------------------|------------------------------------------------------------|------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `PATHS`                        | String[]                                                   | Yes                          | The paths to be compiled. Can be exact path to a `*.algo.ts` contract file, a directory, or a path including wildcards. All subfolders in a directory will be searched for `*.algo.ts` files.                                                                                                                                                                                                                                                        |
| `--log-level`                  | Enum (error,info,warning,debug,critical)                   | No (default: info)           | The minimum log level to output to the console.                                                                                                                                                                                                                                                                                                                                                                                                      |
| `--out-dir`                    | String                                                     | No (default: 'out')          | The directory in which to write build artifacts. If absolute, artifacts will be written under sub-directories relative to the input PATH they were discovered by. If relative, this directory will be created relative to the input PATH. Artifacts will be written under sub-directories relative to the input PATH they were discovered by. Out directory can contain the placeholder `[name]` which will be replaced with the contract file name. |
| `--optimization-level`         | Enum (0,1,2)                                               | No (default: 1)              | Determines which optimizations are made to the compiled code, 0 None, 1 Normal, 2 Intensive                                                                                                                                                                                                                                                                                                                                                          |
| `--debug-level`                | Enum (0,1,2)                                               | No (default 1)               | Determines what debug information is included in the compiled code. 0 None, 1 Source code annotations, 2 Reserved for future use                                                                                                                                                                                                                                                                                                                     |
| `--dry-run`                    | Flag                                                       | No (default false)           | Skip `puya` compilation, and only perform the TypeScript parsing and compilation to AWST                                                                                                                                                                                                                                                                                                                                                             |
| `--skip-version-check`         | Flag                                                       | No (default false)           | Don't verify the installed version of `puya` matches the one targeted by `puya-ts` before invoking compilation.                                                                                                                                                                                                                                                                                                                                      |
| `--target-avm-version`         | Integer                                                    | No (default current version) | Which AVM version to target for compilation output of contracts which do not explicitly identify their target version. Will default to current version in `mainnet` (with a small lag). Number must be a supported version of the compiler.                                                                                                                                                                                                          |
| `--cli-template-definition`    | KeyValuePair[]                                             | No                           | A list of template variable definitions which will be used to replace place holders in the compiled output. Values should be in the format MY_VAR_NAME=123 where the variable name does not include the template variable prefix                                                                                                                                                                                                                     |
| `--template-vars-prefix`       | String                                                     | No (default 'TML_')          | The prefix used by template variables in the compilation targets.                                                                                                                                                                                                                                                                                                                                                                                    |
| `--locals-coalescing-strategy` | Enum (root_operand,root_operand_excluding_args,aggressive) | No (default root_operand)    | Determines the out-of-ssa variable name coalescing strategy used by the compiler. root_operand coalesces based on the original variable name, root_operand_excluding_args is the same but won't coalesce subroutine arguments whilst aggressive will attempt minimise the number of local variables used regardless of name or type - based only on variable lifetimes. The strategy used can affect output code legibility and size.                |
| `--output-awst`                | Flag                                                       | No (default false)           | Output a human readable representation of the AWST generated by compilation.                                                                                                                                                                                                                                                                                                                                                                         |
| `--output-awst-json`           | Flag                                                       | No (default false)           | Output a json encoded representation of the AWST generated by compilation                                                                                                                                                                                                                                                                                                                                                                            |
| `--output-teal`                | Flag                                                       | No (default true)            | Output `*.approval.teal` and `*.clear.teal` files for smart contracts and `*.teal` files for logic signatures                                                                                                                                                                                                                                                                                                                                        |
| `--output-source-map`          | Flag                                                       | No (default true)            | Output debug source maps                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `--output-arc32`               | Flag                                                       | No (default true)            | Output an ARC32 compliant spec file for ARC4 smart contracts.                                                                                                                                                                                                                                                                                                                                                                                        |
| `--output-arc56`               | Flag                                                       | No (default true)            | Output an ARC56 compliant spec file for ARC4 smart contracts.                                                                                                                                                                                                                                                                                                                                                                                        |
| `--output-bytecode`            | Flag                                                       | No (default false)           | Output `*.approval.bin` and `*.clear.bin` files for smart contracts and `*.bin` files for logic signatures. This will require any template variables to have a value                                                                                                                                                                                                                                                                                 |
| `--match-algod-bytecode`       | Flag                                                       | No (default false)           | Have bytecode output match the output of algod when compiling the same teal. If false, additional optimizations may be made.                                                                                                                                                                                                                                                                                                                         |
| `--output-ssa-ir`              | Flag                                                       | No (default false)           | Output a representation of the SSA IR nodes for advanced debugging purposes                                                                                                                                                                                                                                                                                                                                                                          |
| `--output-destructured-ir`     | Flag                                                       | No (default false)           | Output a representation of the destructured (out of ssa) IR nodes for advanced debugging purposes                                                                                                                                                                                                                                                                                                                                                    |
| `--output-optimization-ir`     | Flag                                                       | No (default false)           | Output a representation of the IR nodes after each optimization round for advanced debugging purposes                                                                                                                                                                                                                                                                                                                                                |
| `--output-memory-ir`           | Flag                                                       | No (default false)           | Output a representation of the Memory IR nodes for advanced debugging purposes                                                                                                                                                                                                                                                                                                                                                                       |
