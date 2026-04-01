# Algorand TypeScript Documentation

Documentation site for [Algorand TypeScript](https://github.com/algorandfoundation/puya-ts), built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build).

Published at: https://algorandfoundation.github.io/algorand-typescript/

## Prerequisites

- Node.js 22.x
- Root workspace dependencies installed (`npm ci` from the repo root)

## Development

From the repo root:

```sh
npm run docs:dev      # Start dev server at localhost:4321
npm run docs:build    # Production build to docs/dist/
npm run docs:preview  # Preview the production build locally
```

Or from the `docs/` directory:

```sh
npm install
npm run dev
npm run build
npm run preview
```

By default the build targets deployment on `https://algorandfoundation.github.io/puya-ts/`.
If a build for a different site is needed the environment variables `ASTRO_SITE` and `ASTRO_BASE` can be set accordingly.

> [!NOTE]
> Root workspace dependencies must be installed first because the `starlight-typedoc` plugin references TypeScript source files in `../packages/algo-ts/src/`.

## Content Structure

Hand-authored documentation lives in `src/content/docs/`:

```
src/content/docs/
├── index.mdx                          # Homepage
├── cli.md                             # Compiler CLI guide
├── migration-guides.md                # Beta→1.0 and TEALScript migration guides
├── language-guide/                    # Language guide (types, storage, ops, etc.)
├── reference/                         # ABI routing, guiding principles
│   └── architecture-decision-records/ # Architecture Decision Records (ADRs)
└── api/                               # Auto-generated (not committed)
```

The sidebar is configured in `astro.config.mjs`.

## API Reference (Auto-Generated)

The `src/content/docs/api/` directory is generated at build time by the [starlight-typedoc](https://github.com/HiDeoo/starlight-typedoc) plugin from these entry points:

- `../packages/algo-ts/src/index.ts`
- `../packages/algo-ts/src/op.ts`
- `../packages/algo-ts/src/itxn.ts`
- `../packages/algo-ts/src/gtxn.ts`
- `../packages/algo-ts/src/arc4/index.ts`

This directory is listed in `.gitignore` and should never be committed. It is regenerated on every build.

## Publishing

Docs are deployed to **GitHub Pages** via the `gh-pages.yml` workflow and are **only published from the `release` branch**.

| Branch    | Docs behavior                              |
|-----------|--------------------------------------------|
| PR        | Build verified (not deployed)              |
| `alpha`   | Build verified (not deployed)              |
| `main`    | Build verified (not deployed)              |
| `release` | Built and deployed to GitHub Pages         |

Site URL: `https://algorandfoundation.github.io/puya-ts/`
