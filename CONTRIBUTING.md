# Contributing to Puya-ts

Contributions are welcome. For new features, please open an issue to discuss first.

## Workflow

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary). User-facing changes should include at least one `fix:` or `feat:` commit for release notes. Other conventions like `docs:` or `test:` are optional but helpful. If the build fails due to a conventional commit issue, you will need to do an interactive rebase of your branch to tweak the commit messages and then force push your branch.

## Local Development

To set up the project locally:

1. **Install Node.js**: Download from [nodejs.org](https://nodejs.org/).

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

## Adding New Op Codes for New AVM Versions

1. Copy the latest [langspec.puya.json](./langspec.puya.json) from [puya](https://github.com/algorandfoundation/puya/blob/main/langspec.puya.json). Refer to the [contributing guide](https://github.com/algorandfoundation/puya/blob/main/CONTRIBUTING.md#updating-langspec-for-new-avm-versions) on the Puya repo for more information on how the file itself is updated for a new AVM version.

2. Run the following script to update relevant files:

   ```sh
   npm run script:code-gen
   ```

3. If a new `enum` type is required, add it to [ENUMS_TO_EXPOSE](./scripts/build-op-module.ts#L12). Re-run the scripts and update [index.ts](./packages/algo-ts/src/index.ts#L17).

4. Add an approval test to ensure the new op codes compile correctly; e.g., [AVM 11 approval test](./tests/approvals/avm11.algo.ts).

## Releasing changes

Puya-ts and the stubs library (@algorandfoundation/algo-ts) are published via github actions. Opening a PR from your working branch to `main` will trigger a PR build and once merged, this will trigger a release workflow to publish the latest npm packages. The github actions workflows perform a number of checks to confirm we are publishing a working revision of the code. Before opening your PR, there are a few checks you can do to avoid broken builds.

### algo-ts

If you have made changes to the algo-ts package, you will need to manually bump the package version number. The package uses semantic versioning so you should assess the impact of your changes and bump the version number accordingly.

After bumping the version, you should run `npm run algo-ts` in the puya-ts dir to install the latest version there.

You should also regenerate the api docs in case they are affected by your changes `npm run script:documentation`.

### puya-ts

After making changes to the compiler or the stubs package, you should run all tests locally (`npm run test`). If your changes resulted in different compiler output - there will be 1 test failure, and you should see a bunch of unstaged changes under `tests/approvals/out/**`. After confirming these are intentional, these changes should be commited with your code changes. Re-run the tests and you should see no changes, and the tests should all pass.
