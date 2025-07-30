# Contributing to Puya-ts

Contributions are welcome. For new features, please open an issue to discuss first.

## Workflow

### Commits

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary). User-facing changes should include at least one `fix:` or `feat:` commit for release notes. Other conventions like `docs:` or `test:` are optional but helpful.

### Branches

| Name      | Description                                                               |
| --------- | ------------------------------------------------------------------------- |
| `alpha`   | Commits to this branch will generate an alpha release of the npm packages |
| `main`    | Commits to this branch will generate a beta release of the npm packages   |
| `release` | Commits to this branch will generate a new release of the npm packages    |

In general, most changes should begin as a branch based on `alpha`. Once you are happy with the changes, open a PR to merge your branch into `alpha` and it will trigger a PR build to compile and test the code. When the build passes and you have relevant approvals - your code will be merged into `alpha` branch and after the release workflow has completed, you can install the published alpha packages from npm to check they are still working as expected.

Depending on the velocity of new changes, there will be a periodic merge of `alpha` branch into `main` in order to create a `beta` release. On a slower cycle again, changes will be promoted from `main` into `release`.

## Local Development

To set up the project locally:

1. **Install Node.js**: Download from [nodejs.org](https://nodejs.org/). See src/constants.ts `minNodeVersion` for minimum version.

1. **Install AlgoKit CLI**: Follow the guide from [Algokit](https://github.com/algorandfoundation/algokit-cli?tab=readme-ov-file#install).

1. **Start localnet**:

   ```sh
   algokit localnet start
   # or `algokit localnet reset --update` to update localnet docker images
   ```

1. **Install npm dependencies**:

   ```sh
   npm install
   ```

1. **Run tests**:
   ```sh
   npm test
   ```
> [!TIP]
> Windows users: The initial test run may fail due to CRLF/LF line ending differences. If so, run `git add .` which will force git to recognise and cache the new line endings and allow the tests to complete.

## Adding New Op Codes for New AVM Versions

1. Copy the latest [langspec.puya.json](./langspec.puya.json) from [puya](https://github.com/algorandfoundation/puya/blob/main/langspec.puya.json). Refer to the [contributing guide](https://github.com/algorandfoundation/puya/blob/main/CONTRIBUTING.md#updating-langspec-for-new-avm-versions) on the Puya repo for more information on how the file itself is updated for a new AVM version.

2. Run the following script to update relevant files:

   ```sh
   npm run script:code-gen
   ```

3. If a new `enum` type is required, add it to [ENUMS_TO_EXPOSE](./scripts/build-op-module.ts#L12). Re-run the scripts and update [index.ts](./packages/algo-ts/src/index.ts#L17).

4. Add an approval test to ensure the new op codes compile correctly; e.g., [AVM 11 approval test](./tests/approvals/avm11.algo.ts).
