// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightTypeDoc, { typeDocSidebarGroup } from 'starlight-typedoc';
import remarkGithubAlerts from 'remark-github-alerts';

// https://astro.build/config
export default defineConfig({
  site: 'https://algorandfoundation.github.io',
  base: '/algorand-typescript/',
  markdown: {
    remarkPlugins: [remarkGithubAlerts],
  },
  integrations: [
    starlight({
      title: 'Algorand TypeScript',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/algorandfoundation/puya-ts' },
        { icon: 'discord', label: 'Discord', href: 'https://discord.gg/algorand' },
      ],
      plugins: [
        starlightTypeDoc({
          entryPoints: [
            '../packages/algo-ts/src/index.ts',
            '../packages/algo-ts/src/op.ts',
            '../packages/algo-ts/src/itxn.ts',
            '../packages/algo-ts/src/gtxn.ts',
            '../packages/algo-ts/src/arc4/index.ts',
          ],
          tsconfig: '../packages/algo-ts/tsconfig.json',
          output: 'api',
          sidebar: {
            label: 'API Reference',
            collapsed: true,
          },
          typeDoc: {
            excludeReferences: true,
            gitRevision: 'main',
          },
        }),
      ],
      sidebar: [
        { label: 'Home', link: '/' },
        {
          label: 'Language Guide',
          items: [
            { slug: 'language-guide' },
            { slug: 'language-guide/program-structure' },
            { slug: 'language-guide/types' },
            { slug: 'language-guide/storage' },
            { slug: 'language-guide/ops' },
            { slug: 'language-guide/itxns' },
          ],
        },
        { label: 'CLI Guide', slug: 'cli' },
        {
          label: 'Reference',
          items: [
            { slug: 'reference' },
            { slug: 'reference/abi-routing' },
            { slug: 'reference/guiding-principles' },
          ],
        },
        { label: 'Migration Guides', slug: 'migration-guides' },
        {
          label: 'Architecture Decisions',
          collapsed: true,
          autogenerate: { directory: 'reference/architecture-decisions' },
        },
        typeDocSidebarGroup,
      ],
    }),
  ],
});