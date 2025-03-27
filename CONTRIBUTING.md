# Contributing to Puya-ts

Contributions are welcome. For new features, please open an issue to discuss first.

## Workflow

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary). User-facing changes should include at least one `fix:` or `feat:` commit for release notes. Other conventions like `docs:` or `test:` are optional but helpful.

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
